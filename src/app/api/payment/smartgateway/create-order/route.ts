import { NextResponse } from "next/server";
import {
  createSmartGatewaySession,
  isValidOrderId,
  sanitizeCustomerId,
} from "@/lib/smartgateway";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { products as catalogProducts } from "@/lib/products";

interface OrderLineItem {
  productId: string;
  name?: string;
  price?: number;
  quantity: number;
}

/**
 * Request Tampering protection (bank audit point #2):
 * The amount is computed server-side from product prices stored in the
 * database instead of trusting the amount sent by the client.
 */
async function computeOrderTotal(items: OrderLineItem[]): Promise<number | null> {
  if (!Array.isArray(items) || items.length === 0) return null;

  const productIds = items.map((i) => i.productId);
  const priceMap = new Map<string, number>();

  // 1) Prefer database prices
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (!error && data) {
      for (const p of data) {
        priceMap.set(p.id, Number(p.price));
      }
    }
  } catch {
    // fall through to catalog
  }

  // 2) Fall back to bundled catalog prices for any missing product
  for (const item of items) {
    if (!priceMap.has(item.productId)) {
      const catalogPrice = catalogProducts.find((p) => p.id === item.productId)?.price;
      if (catalogPrice !== undefined) priceMap.set(item.productId, catalogPrice);
    }
  }

  let total = 0;
  for (const item of items) {
    const unitPrice = priceMap.get(item.productId);
    if (unitPrice === undefined) return null; // unknown product -> cannot validate
    total += unitPrice * Number(item.quantity || 1);
  }

  return Math.round(total * 100) / 100;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, customerId, customerEmail, customerPhone, items, address } = body;

    if (!orderId || !amount || !customerId) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, amount, and customerId are required." },
        { status: 400 }
      );
    }

    // Bank rule: order ID must be <21 chars, alphanumeric only, non-sequential.
    if (!isValidOrderId(orderId)) {
      return NextResponse.json(
        {
          error:
            "Invalid order ID format. Order ID must be alphanumeric, contain no special characters, and be less than 21 characters.",
        },
        { status: 400 }
      );
    }

    // Request Tampering protection: recompute amount server-side from the database.
    let validatedAmount = Number(amount);
    const computedTotal = await computeOrderTotal(items);
    if (computedTotal !== null) {
      validatedAmount = computedTotal;
    } else if (!Number.isFinite(validatedAmount) || validatedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const safeCustomerId = sanitizeCustomerId(customerId);

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/payment/response`;

    // Generate SmartGateway session & SDK payload
    const session = createSmartGatewaySession({
      orderId,
      amount: validatedAmount,
      customerId: safeCustomerId,
      customerEmail: customerEmail || "guest@lazybiryani.com",
      customerPhone: customerPhone || "9999999999",
      returnUrl,
      description: `Lazy Biryani Order ${orderId}`,
    });

    // Record or update order in Supabase if items are provided
    if (items && address) {
      const isUuid = typeof customerId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerId);
      const { error: dbError } = await supabaseAdmin.from("orders").upsert({
        id: orderId,
        user_id: isUuid ? customerId : null,
        user_name: customerEmail?.split("@")[0] || "Customer",
        items,
        total: validatedAmount,
        status: "pending",
        address,
        payment_method: "smartgateway",
        payment_status: "pending",
        gateway_order_id: `GW_${orderId}`,
      });

      if (dbError) {
        console.error("Failed to upsert order in create-order:", dbError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "SmartGateway payment session created successfully",
      data: {
        ...session,
        orderId,
        amount: validatedAmount,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

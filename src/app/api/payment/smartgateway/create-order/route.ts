import { NextResponse } from "next/server";
import { createSmartGatewaySession } from "@/lib/smartgateway";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/api/payment/smartgateway/verify-payment`;

    // Generate SmartGateway session & SDK payload
    const session = createSmartGatewaySession({
      orderId,
      amount: Number(amount),
      customerId,
      customerEmail: customerEmail || "guest@lazybiryani.com",
      customerPhone: customerPhone || "9999999999",
      returnUrl,
      description: `Lazy Biryani Order ${orderId}`,
    });

    // Optionally record or update order in Supabase if items are provided
    if (items && address) {
      await supabaseAdmin.from("orders").upsert({
        id: orderId,
        user_id: customerId,
        user_name: customerEmail?.split("@")[0] || "Customer",
        items,
        total: Number(amount),
        status: "pending",
        address,
        payment_method: "smartgateway",
        payment_status: "pending",
        gateway_order_id: `GW_${orderId}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "SmartGateway payment session created successfully",
      data: session,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

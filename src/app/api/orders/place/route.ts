import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, user_id, user_name, items, total, status, address, payment_method, payment_status, payment_id, gateway_order_id } = body;

    if (!id || !items || !total) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    const isUuid = typeof user_id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id);

    const { data, error } = await supabaseAdmin
      .from("orders")
      .upsert({
        id,
        user_id: isUuid ? user_id : null,
        user_name: user_name || "Customer",
        items,
        total: Number(total),
        status: status || "pending",
        address: address || "",
        payment_method: payment_method || "cod",
        payment_status: payment_status || "pending",
        payment_id: payment_id || null,
        gateway_order_id: gateway_order_id || null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to place order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

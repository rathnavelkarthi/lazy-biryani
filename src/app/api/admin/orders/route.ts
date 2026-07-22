import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch admin orders";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId, status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update order status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

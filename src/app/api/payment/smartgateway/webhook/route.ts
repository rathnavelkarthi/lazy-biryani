import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateHMACSignature } from "@/lib/smartgateway";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status, payment_id, signature } = body;

    const apiKey = process.env.SMARTGATEWAY_API_KEY || "test_api_key_smartgateway_lazybiryani_2026";
    const isTestMode = process.env.NEXT_PUBLIC_SMARTGATEWAY_TEST_MODE !== "false";

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    if (!isTestMode && signature) {
      const payloadParams = {
        order_id,
        status,
        payment_id: payment_id || "",
      };
      const expectedSignature = generateHMACSignature(payloadParams, apiKey);

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const isCharged = status === "CHARGED" || status === "SUCCESS";
    const paymentStatus = isCharged ? "paid" : "failed";
    const orderStatus = isCharged ? "preparing" : "pending";

    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_id: payment_id || `WEBHOOK_${Date.now()}`,
        status: orderStatus,
      })
      .eq("id", order_id);

    return NextResponse.json({ received: true, status: paymentStatus });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Webhook processing error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

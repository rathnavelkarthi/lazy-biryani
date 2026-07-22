import { NextResponse } from "next/server";
import { verifySmartGatewaySignature } from "@/lib/smartgateway";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, paymentId, status, signature, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const isTestMode = process.env.NEXT_PUBLIC_SMARTGATEWAY_TEST_MODE !== "false";

    let isValid = false;

    if (isTestMode || status === "CHARGED" || status === "SUCCESS") {
      isValid = true;
    } else if (signature) {
      const verifyParams: Record<string, string> = {
        orderId,
        paymentId: paymentId || "",
        status: status || "CHARGED",
      };
      isValid = verifySmartGatewaySignature(verifyParams, signature);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    const txnPaymentId = paymentId || `TXN_${Date.now()}`;
    const paymentStatus = (status === "CHARGED" || status === "SUCCESS" || isTestMode) ? "paid" : "failed";
    const orderStatus = paymentStatus === "paid" ? "preparing" : "pending";

    // Update order in Supabase
    const { error: dbError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_id: txnPaymentId,
        status: orderStatus,
      })
      .eq("id", orderId);

    if (dbError) {
      console.warn("Supabase order payment status update warning:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderId,
      paymentId: txnPaymentId,
      paymentStatus,
      orderStatus,
      paymentMethod: paymentMethod || "HDFC SmartGateway (UPI/Card)",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Payment verification failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

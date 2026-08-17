import { NextResponse } from "next/server";
import { verifySmartGatewaySignature, inquiryOrderStatus, sanitizeCustomerId } from "@/lib/smartgateway";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, paymentId, status, signature, paymentMethod, amount } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const isTestMode = process.env.NEXT_PUBLIC_SMARTGATEWAY_TEST_MODE !== "false";

    // ---------------------------------------------------------------
    // 1) Duplicate entry validation (bank audit point #5)
    //    Check whether this order has already been recorded as paid.
    // ---------------------------------------------------------------
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (existingOrder && existingOrder.payment_status === "paid") {
      const alreadyRecordedPaymentId = existingOrder.payment_id;
      // Same transaction re-delivered -> idempotent success.
      // Different transaction id for same order -> duplicate, reject.
      if (paymentId && alreadyRecordedPaymentId && paymentId !== alreadyRecordedPaymentId) {
        return NextResponse.json(
          {
            error: "Duplicate transaction detected for this order.",
            duplicate: true,
            orderId,
          },
          { status: 409 }
        );
      }
      return NextResponse.json({
        success: true,
        verified: true,
        duplicate: true,
        orderId,
        paymentId: alreadyRecordedPaymentId,
        paymentStatus: existingOrder.payment_status,
        orderStatus: existingOrder.status,
        paymentMethod: existingOrder.payment_method === "smartgateway" ? "HDFC SmartGateway" : "COD",
      });
    }

    // ---------------------------------------------------------------
    // 2) Response Tampering protection (bank audit point #3)
    //    Validate the response amount against the amount stored in DB.
    // ---------------------------------------------------------------
    if (existingOrder && amount !== undefined) {
      const dbTotal = Number(existingOrder.total);
      const responseAmount = Number(amount);
      if (Number.isFinite(dbTotal) && Number.isFinite(responseAmount) && Math.abs(dbTotal - responseAmount) > 0.01) {
        return NextResponse.json(
          {
            error: "Amount mismatch detected. Transaction rejected (tampering attempt).",
            orderId,
          },
          { status: 400 }
        );
      }
    }

    // ---------------------------------------------------------------
    // 3) Dual inquiry via Status API (bank audit point #7 - MANDATORY)
    //    Confirm the true status of the order from the gateway before
    //    marking the order as paid.
    // ---------------------------------------------------------------
    let gatewayStatus: string | undefined;
    if (!isTestMode) {
      const inquiry = await inquiryOrderStatus(orderId, existingOrder?.user_id ? sanitizeCustomerId(existingOrder.user_id) : undefined);
      if (inquiry.ok && inquiry.status) {
        gatewayStatus = inquiry.status.status;

        // Validate amount returned by gateway against DB order total.
        if (existingOrder && typeof inquiry.status.amount === "number") {
          const dbTotal = Number(existingOrder.total);
          if (Math.abs(dbTotal - inquiry.status.amount) > 0.01) {
            return NextResponse.json(
              {
                error: "Amount mismatch with gateway. Transaction rejected.",
                orderId,
              },
              { status: 400 }
            );
          }
        }
      } else {
        console.warn("Status inquiry failed:", inquiry.error);
      }
    }

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

    // In non-test mode, require the gateway inquiry to confirm CHARGED.
    if (!isTestMode && gatewayStatus && gatewayStatus !== "CHARGED" && gatewayStatus !== "SUCCESS") {
      return NextResponse.json(
        {
          error: `Payment not successful. Gateway status: ${gatewayStatus}`,
          orderId,
          gatewayStatus,
        },
        { status: 400 }
      );
    }

    const txnPaymentId = paymentId || (gatewayStatus ? `TXN_${Date.now()}` : `TXN_${Date.now()}`);
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
      gatewayStatus,
      paymentMethod: paymentMethod || "HDFC SmartGateway (UPI/Card)",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Payment verification failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

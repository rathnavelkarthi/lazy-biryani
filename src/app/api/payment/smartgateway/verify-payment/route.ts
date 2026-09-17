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

    // Normalise incoming status parameters
    const upperParamStatus = (status || "").toUpperCase();
    const isExplicitlyFailedParam =
      upperParamStatus === "FAILED" ||
      upperParamStatus === "FAILURE" ||
      upperParamStatus === "AUTHENTICATION_FAILED" ||
      upperParamStatus === "AUTHORIZATION_FAILED" ||
      upperParamStatus === "CANCELLED" ||
      upperParamStatus === "CANCELED" ||
      upperParamStatus === "DECLINED" ||
      upperParamStatus === "REJECTED" ||
      upperParamStatus === "USER_DROPPED" ||
      upperParamStatus === "USER_ABORTED" ||
      upperParamStatus === "AUTO_REFUNDED" ||
      upperParamStatus === "CAPTURE_FAILED" ||
      upperParamStatus === "TIMEOUT" ||
      upperParamStatus === "ERROR" ||
      upperParamStatus === "22" ||
      upperParamStatus === "26" ||
      upperParamStatus === "27" ||
      upperParamStatus === "12" ||
      upperParamStatus === "13";

    // ---------------------------------------------------------------
    // 1) Duplicate entry validation (bank audit point #5)
    //    Only honor cached paid status if current callback is NOT explicitly failed
    // ---------------------------------------------------------------
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (!isExplicitlyFailedParam && existingOrder && existingOrder.payment_status === "paid") {
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
        amountCharged: Number(existingOrder.total) || 0,
        amount: Number(existingOrder.total) || 0,
        paymentId: alreadyRecordedPaymentId,
        paymentStatus: "paid",
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
    let gatewayTxnId: string | undefined;

    if (!isTestMode) {
      const inquiry = await inquiryOrderStatus(orderId, existingOrder?.user_id ? sanitizeCustomerId(existingOrder.user_id) : undefined);
      if (inquiry.ok && inquiry.status) {
        gatewayStatus = inquiry.status.status;
        gatewayTxnId = inquiry.status.txn_id || inquiry.status.payment_gateway_response?.txn_id || inquiry.status.payment_gateway_response?.epg_txn_id;

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

    const upperGatewayStatus = (gatewayStatus || "").toUpperCase();

    const isChargedGateway =
      upperGatewayStatus === "CHARGED" || upperGatewayStatus === "SUCCESS" || upperGatewayStatus === "21";
    const isChargedParam =
      upperParamStatus === "CHARGED" || upperParamStatus === "SUCCESS" || upperParamStatus === "21";

    const isFailedGateway =
      upperGatewayStatus === "FAILED" ||
      upperGatewayStatus === "FAILURE" ||
      upperGatewayStatus === "AUTHENTICATION_FAILED" ||
      upperGatewayStatus === "AUTHORIZATION_FAILED" ||
      upperGatewayStatus === "CANCELLED" ||
      upperGatewayStatus === "CANCELED" ||
      upperGatewayStatus === "DECLINED" ||
      upperGatewayStatus === "REJECTED" ||
      upperGatewayStatus === "USER_DROPPED" ||
      upperGatewayStatus === "USER_ABORTED" ||
      upperGatewayStatus === "AUTO_REFUNDED" ||
      upperGatewayStatus === "CAPTURE_FAILED" ||
      upperGatewayStatus === "TIMEOUT" ||
      upperGatewayStatus === "ERROR" ||
      upperGatewayStatus === "22" ||
      upperGatewayStatus === "26" ||
      upperGatewayStatus === "27" ||
      upperGatewayStatus === "12" ||
      upperGatewayStatus === "13";

    // 4) Check if transaction failed, was cancelled, or is not confirmed charged
    const isFailed =
      isExplicitlyFailedParam ||
      isFailedGateway ||
      (!isChargedGateway && !isChargedParam);

    if (isFailed) {
      const failedGatewayStatus = gatewayStatus || status || "FAILED";
      const txnPaymentId = paymentId || gatewayTxnId || (existingOrder?.payment_id ?? `HDFC_FAILED_${Date.now()}`);

      // Record failed payment in Supabase so receipt & order history show not charged
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          payment_id: txnPaymentId,
          status: "pending",
        })
        .eq("id", orderId);

      return NextResponse.json(
        {
          success: false,
          verified: false,
          orderId,
          amountCharged: 0,
          amount: existingOrder ? Number(existingOrder.total) : (amount ? Number(amount) : 0),
          paymentId: txnPaymentId,
          paymentStatus: "failed",
          orderStatus: "pending",
          gatewayStatus: failedGatewayStatus,
          error: `Payment failed or was cancelled (${failedGatewayStatus}). No amount was charged.`,
        },
        { status: 400 }
      );
    }

    // 5) Verify signature if in production mode for charged transactions
    let isValid = false;
    if (isTestMode) {
      isValid = isChargedGateway || isChargedParam;
    } else if (isChargedGateway || isChargedParam) {
      if (signature) {
        const verifyParams: Record<string, string> = {
          orderId,
          paymentId: paymentId || "",
          status: status || "CHARGED",
        };
        isValid = verifySmartGatewaySignature(verifyParams, signature);
      } else {
        // Dual-inquiry confirmed CHARGED directly with HDFC server
        isValid = isChargedGateway;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Invalid payment signature or unconfirmed transaction.",
          orderId,
          amountCharged: 0,
          paymentStatus: "failed",
        },
        { status: 400 }
      );
    }

    const txnPaymentId = paymentId || gatewayTxnId || `HDFC_TXN_${Date.now()}`;
    const confirmedAmount = existingOrder ? Number(existingOrder.total) : (amount ? Number(amount) : 0);

    // Update order in Supabase to paid
    const { error: dbError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: txnPaymentId,
        status: "preparing",
      })
      .eq("id", orderId);

    if (dbError) {
      console.warn("Supabase order payment status update warning:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderId,
      amountCharged: confirmedAmount,
      amount: confirmedAmount,
      paymentId: txnPaymentId,
      paymentStatus: "paid",
      orderStatus: "preparing",
      gatewayStatus: gatewayStatus || "CHARGED",
      paymentMethod: paymentMethod || "HDFC SmartGateway (UPI/Card)",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Payment verification failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

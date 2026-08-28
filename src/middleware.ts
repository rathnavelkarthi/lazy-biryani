import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle external gateway POST callbacks to /payment/response or /payment/response/
  if (request.method === "POST" && (pathname === "/payment/response" || pathname === "/payment/response/")) {
    try {
      const contentType = request.headers.get("content-type") || "";
      const redirectUrl = new URL("/payment/response/", request.url);

      if (contentType.includes("application/json")) {
        const body = await request.json();
        const orderId = body.order_id || body.orderId || body.orderID;
        const status = body.status || body.status_id;
        const paymentId = body.payment_id || body.paymentId || body.txn_id || body.epg_txn_id;
        const signature = body.signature;
        const amount = body.amount;

        if (orderId) redirectUrl.searchParams.set("orderId", String(orderId));
        if (status) redirectUrl.searchParams.set("status", String(status));
        if (paymentId) redirectUrl.searchParams.set("paymentId", String(paymentId));
        if (signature) redirectUrl.searchParams.set("signature", String(signature));
        if (amount) redirectUrl.searchParams.set("amount", String(amount));
      } else {
        const formData = await request.formData();
        const orderId = formData.get("order_id") || formData.get("orderId") || formData.get("orderID");
        const status = formData.get("status") || formData.get("status_id");
        const paymentId = formData.get("payment_id") || formData.get("paymentId") || formData.get("txn_id") || formData.get("epg_txn_id");
        const signature = formData.get("signature");
        const amount = formData.get("amount");

        if (orderId) redirectUrl.searchParams.set("orderId", String(orderId));
        if (status) redirectUrl.searchParams.set("status", String(status));
        if (paymentId) redirectUrl.searchParams.set("paymentId", String(paymentId));
        if (signature) redirectUrl.searchParams.set("signature", String(signature));
        if (amount) redirectUrl.searchParams.set("amount", String(amount));
      }

      return NextResponse.redirect(redirectUrl, 303);
    } catch {
      return NextResponse.redirect(new URL("/payment/response/", request.url), 303);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/payment/response", "/payment/response/"],
};

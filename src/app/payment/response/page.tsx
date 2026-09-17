"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { useCart } from "@/lib/CartContext";

type ResponseState =
  | { phase: "loading" }
  | { phase: "success"; orderId: string; amount: number; paymentId: string; gatewayStatus?: string }
  | {
      phase: "failed";
      orderId: string;
      amount: number;
      paymentId?: string;
      gatewayStatus?: string;
      message: string;
    }
  | { phase: "empty" }
  | { phase: "error"; message: string };

function PaymentResponseContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ResponseState>({ phase: "loading" });
  const { clearCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      const paramOrderId =
        searchParams.get("orderId") ||
        searchParams.get("order_id") ||
        searchParams.get("orderID") ||
        searchParams.get("order_no");

      let cachedOrderId: string | null = null;
      if (typeof window !== "undefined") {
        try {
          cachedOrderId = localStorage.getItem("lazy-biryani-last-order-id");
        } catch {
          // ignore
        }
      }

      const orderId = paramOrderId || cachedOrderId;
      const status = searchParams.get("status") || searchParams.get("status_id") || "";
      const paymentId =
        searchParams.get("paymentId") ||
        searchParams.get("payment_id") ||
        searchParams.get("txn_id") ||
        searchParams.get("epg_txn_id") ||
        "";
      const amount = searchParams.get("amount");
      const signature = searchParams.get("signature") || "";

      if (!orderId) {
        setState({ phase: "empty" });
        return;
      }

      try {
        const res = await fetch("/api/payment/smartgateway/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentId,
            status,
            signature,
            amount: amount ? Number(amount) : undefined,
          }),
        });
        const data = await res.json();

        if (cancelled) return;

        // Fetch true order total from database / status inquiry
        let orderAmount = amount ? Number(amount) : (data?.amount || 0);
        let orderStatusStr = "";
        try {
          const orderRes = await fetch(`/api/payment/smartgateway/order-status?orderId=${encodeURIComponent(orderId)}`);
          if (orderRes.ok) {
            const orderData = await orderRes.json();
            if (typeof orderData?.amount === "number") {
              orderAmount = orderData.amount;
            }
            if (orderData?.status) {
              orderStatusStr = orderData.status;
            }
          }
        } catch {
          // ignore
        }

        if (cancelled) return;

        // Only transition to success if backend verified AND confirmed payment status is strictly paid
        const isVerifiedPaid =
          res.ok &&
          data.verified === true &&
          data.paymentStatus === "paid" &&
          orderStatusStr !== "FAILED" &&
          orderStatusStr !== "CANCELLED";

        if (isVerifiedPaid) {
          clearCart();

          setState({
            phase: "success",
            orderId,
            amount: orderAmount,
            paymentId: data.paymentId || paymentId || "",
            gatewayStatus: data.gatewayStatus || orderStatusStr || "CHARGED",
          });
        } else {
          // Failed transaction flow: preserve cart and display failed receipt (NOT CHARGED)
          setState({
            phase: "failed",
            orderId,
            amount: orderAmount,
            paymentId: data?.paymentId || paymentId || "",
            gatewayStatus: data?.gatewayStatus || orderStatusStr || status || "FAILED",
            message:
              data?.error ||
              (status ? `Payment was ${status.toLowerCase()}` : "Payment was declined or cancelled at the gateway."),
          });
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Payment verification error";
        setState({ phase: "error", message: msg });
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  const amountLabel = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

  const formattedTimestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <div className="max-w-lg mx-auto">
      {state.phase === "loading" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
          <span className="inline-block animate-spin text-3xl mb-3">⏳</span>
          <p className="font-bold text-on-surface">Verifying payment with HDFC SmartGateway...</p>
        </div>
      )}

      {state.phase === "empty" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">receipt_long</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-2">
            Payment Status
          </h1>
          <p className="text-sm text-on-surface-variant mb-6">
            No active payment was found for this session. Check your orders or browse our menu.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/orders">
              <BrutalistButton variant="primary" size="md" className="w-full">
                View My Orders
              </BrutalistButton>
            </Link>
            <Link href="/menu">
              <BrutalistButton variant="secondary" size="md" className="w-full">
                Browse Menu
              </BrutalistButton>
            </Link>
          </div>
        </div>
      )}

      {state.phase === "success" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8 text-center">
          <div className="bg-tertiary-container w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
            <span className="material-symbols-outlined text-tertiary text-4xl">check_circle</span>
          </div>
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-1">
            Payment Successful
          </h1>
          <p className="text-sm text-on-surface-variant mb-6">
            Your biryani is being prepared. Thank you!
          </p>

          <div className="border-2 border-[#333333] bg-surface-container p-4 mb-6 text-left space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#004B8D] border-b pb-1 border-outline-variant/50">
              Transaction Receipt (Approved)
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Order Number
              </span>
              <span className="font-mono font-black text-on-surface">{state.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Amount Charged
              </span>
              <span className="font-black text-primary text-xl">{amountLabel(state.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Status
              </span>
              <span className="font-black text-tertiary">SUCCESS (CHARGED)</span>
            </div>
            {state.paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  Txn Ref
                </span>
                <span className="font-mono text-xs text-blue-800 break-all text-right">
                  {state.paymentId}
                </span>
              </div>
            )}
            {state.gatewayStatus && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  Gateway Status
                </span>
                <span className="font-mono text-xs font-bold text-on-surface">{state.gatewayStatus}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Date & Time
              </span>
              <span className="text-xs text-on-surface-variant">{formattedTimestamp}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/orders">
              <BrutalistButton variant="danger" size="md" className="w-full">
                Track My Orders
              </BrutalistButton>
            </Link>
            <Link href="/menu">
              <BrutalistButton variant="primary" size="md" className="w-full">
                Order More
              </BrutalistButton>
            </Link>
          </div>
        </div>
      )}

      {state.phase === "failed" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8 text-center">
          <div className="bg-error-container w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
            <span className="material-symbols-outlined text-error text-4xl">cancel</span>
          </div>
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-1">
            Payment Failed
          </h1>
          <div className="inline-block bg-red-100 text-red-800 text-xs font-black px-3 py-1 border border-red-300 rounded mb-4 uppercase tracking-wider">
            No Amount Charged &bull; &#8377;0.00
          </div>
          <p className="text-sm font-semibold text-on-surface-variant mb-6">
            The transaction was not completed. Zero amount has been debited from your account.
          </p>

          <div className="border-2 border-[#333333] bg-surface-container p-4 mb-6 text-left space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-error border-b pb-1 border-outline-variant/50">
              Transaction Receipt (Failed / Not Charged)
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Order Number
              </span>
              <span className="font-mono font-black text-on-surface">{state.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Amount Charged
              </span>
              <div className="text-right flex items-center gap-2">
                <span className="font-black text-error text-xl">&#8377;0.00</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded">
                  Not Charged
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Transaction Amount
              </span>
              <span className="font-mono font-bold text-on-surface-variant text-sm">
                &#8377;0.00
              </span>
            </div>
            {state.amount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  Attempted Order Value
                </span>
                <span className="font-bold text-on-surface-variant line-through text-sm">
                  {amountLabel(state.amount)} (Unpaid)
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Status
              </span>
              <span className="font-black text-error">FAILED (NOT CHARGED)</span>
            </div>
            {state.gatewayStatus && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  Gateway Status
                </span>
                <span className="font-mono text-xs font-bold text-error">{state.gatewayStatus}</span>
              </div>
            )}
            {state.paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  Txn Ref
                </span>
                <span className="font-mono text-xs text-on-surface-variant break-all text-right">
                  {state.paymentId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Date & Time
              </span>
              <span className="text-xs text-on-surface-variant">{formattedTimestamp}</span>
            </div>
            {state.message && (
              <div className="pt-2 border-t border-outline-variant/60 text-xs text-on-surface-variant">
                <span className="font-bold text-on-surface">Reason: </span>
                {state.message}
              </div>
            )}
          </div>

          <p className="text-xs text-on-surface-variant mb-6 bg-surface-container-low p-3 border border-outline-variant rounded text-left">
            &#9432; <strong>Bank Note:</strong> Lazy Biryani has not accepted or captured any payment for this transaction. If any provisional debit alert was sent by your bank, the funds will be automatically released within 5&ndash;7 business days per banking guidelines.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/cart">
              <BrutalistButton variant="primary" size="md" className="w-full">
                Try Again with Cart
              </BrutalistButton>
            </Link>
            <Link href="/orders">
              <BrutalistButton variant="secondary" size="md" className="w-full">
                View My Orders
              </BrutalistButton>
            </Link>
          </div>
        </div>
      )}

      {state.phase === "error" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-3 block">error</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-xl font-black text-on-surface mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-on-surface-variant mb-6">{state.message}</p>
          <Link href="/">
            <BrutalistButton variant="primary" size="md" className="w-full">
              Back to Home
            </BrutalistButton>
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * HDFC SmartGateway Response Page (return URL).
 *
 * Bank requirement: the response page must display, in real time:
 *  - Order Number
 *  - Amount
 *  - Success message
 * and the order number + amount must match what was shown on the HDFC
 * payment page (values are fetched from the database, never from the URL).
 */
export default function PaymentResponsePage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="max-w-md mx-auto bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
              <span className="inline-block animate-spin text-3xl mb-3">⏳</span>
              <p className="font-bold text-on-surface">Loading response...</p>
            </div>
          }
        >
          <PaymentResponseContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}


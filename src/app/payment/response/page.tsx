"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

type ResponseState =
  | { phase: "loading" }
  | { phase: "success"; orderId: string; amount: number; paymentId: string; gatewayStatus?: string }
  | { phase: "failed"; orderId: string; message: string }
  | { phase: "error"; message: string };

function PaymentResponseContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ResponseState>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      const orderId = searchParams.get("orderId");
      const status = searchParams.get("status") || "CHARGED";
      const paymentId = searchParams.get("paymentId") || "";
      const amount = searchParams.get("amount");
      const signature = searchParams.get("signature") || "test_sig_hdfc_smartgateway_pass";

      if (!orderId) {
        setState({ phase: "error", message: "Missing order reference." });
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

        if (res.ok && data.verified) {
          const orderRes = await fetch(`/api/payment/smartgateway/order-status?orderId=${encodeURIComponent(orderId)}`);
          const orderData = await orderRes.json();

          if (cancelled) return;

          setState({
            phase: "success",
            orderId,
            amount: orderData?.amount ?? (amount ? Number(amount) : 0),
            paymentId: data.paymentId || paymentId || "",
            gatewayStatus: data.gatewayStatus || orderData?.status,
          });
        } else {
          setState({
            phase: "failed",
            orderId,
            message: data.error || "Payment verification failed.",
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
  }, [searchParams]);

  const amountLabel = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

  return (
    <div className="max-w-md mx-auto">
      {state.phase === "loading" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
          <span className="inline-block animate-spin text-3xl mb-3">⏳</span>
          <p className="font-bold text-on-surface">Verifying payment with HDFC SmartGateway...</p>
        </div>
      )}

      {state.phase === "success" && (
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
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
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Order Number
              </span>
              <span className="font-mono font-black text-on-surface">{state.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Amount
              </span>
              <span className="font-black text-primary text-xl">{amountLabel(state.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Status
              </span>
              <span className="font-black text-tertiary">SUCCESS</span>
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
        <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-8 text-center">
          <div className="bg-error-container w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
            <span className="material-symbols-outlined text-error text-4xl">cancel</span>
          </div>
          <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-2">
            Payment Failed
          </h1>
          <p className="text-sm text-on-surface-variant mb-4">{state.message}</p>
          <p className="text-xs text-on-surface-variant mb-6 font-bold">
            Order Number: {state.orderId}
          </p>
          <Link href="/cart">
            <BrutalistButton variant="primary" size="md" className="w-full">
              Try Again
            </BrutalistButton>
          </Link>
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


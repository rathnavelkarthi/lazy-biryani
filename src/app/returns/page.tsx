"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b-4 border-[#333333] pb-6">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 border border-black inline-block mb-3">
              Customer Support &amp; Guarantees
            </span>
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Returns &amp; Refund Policy
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium">
              Operated by Lazy Biryani (KMK Enterprises)
            </p>
          </div>

          {/* Policy Card */}
          <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-10 space-y-8 text-on-surface">
            
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                1. Perishable Food Product Policy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Due to hygiene and food safety regulations governing ready-to-cook meal kits and spice blends, <strong className="text-on-surface">we cannot accept returns on opened, unsealed, or partially used packages</strong>.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Returns or replacements are strictly limited to instances where:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li>The item arrived in a damaged or compromised outer seal.</li>
                <li>An incorrect product was delivered compared to your invoice order.</li>
                <li>The item has passed its printed expiration date upon arrival.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                2. Order Cancellations
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Orders can be cancelled free of charge <strong className="text-on-surface">only before dispatch</strong>. Once your order status is updated to <em>"Out for Delivery"</em> or <em>"Preparing"</em>, the order cannot be cancelled as kitchen preparation has already commenced.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                To request a cancellation prior to dispatch, contact support immediately at <strong className="text-on-surface">support@lazybiryani.com</strong> with your Order ID.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                3. Refund Process &amp; Timelines
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                If your refund request is approved following verification of damaged or incorrect items:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li><strong className="text-on-surface">Online Payments (UPI / Card / Net Banking):</strong> Refunds will be credited to the original payment source via HDFC SmartGateway within <strong className="text-on-surface">5 to 7 business days</strong>.</li>
                <li><strong className="text-on-surface">Cash on Delivery (COD):</strong> Refunds for approved COD returns will be processed via UPI transfer or bank payout link to your verified account.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                4. Reporting Damage or Discrepancies
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                To report damaged or defective items, please notify us within <strong className="text-on-surface">24 hours of delivery</strong>. Please email <strong className="text-on-surface">support@lazybiryani.com</strong> with:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li>Your Order ID (e.g., ORD-XXXX).</li>
                <li>Clear photo or unboxing video showing the damaged product and outer label.</li>
                <li>Brief description of the issue.</li>
              </ol>
            </section>

            <div className="pt-4 border-t-2 border-outline-variant text-xs text-on-surface-variant flex justify-between items-center">
              <span>Back to <Link href="/terms" className="text-primary font-bold underline">Terms &amp; Conditions</Link></span>
              <span className="font-mono">KMK Enterprises</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

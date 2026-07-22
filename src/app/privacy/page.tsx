"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b-4 border-[#333333] pb-6">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 border border-black inline-block mb-3">
              Data Protection &amp; Security
            </span>
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Privacy Policy
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium">
              Operated by Lazy Biryani (KMK Enterprises)
            </p>
          </div>

          {/* Policy Card */}
          <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-10 space-y-8 text-on-surface">
            
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                1. Information We Collect
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                When you create an account, place an order, or browse Lazy Biryani, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li><strong className="text-on-surface">Personal Information:</strong> Name, email address, phone number, and delivery address.</li>
                <li><strong className="text-on-surface">Order History:</strong> Cart items, total bill, payment status, and order timestamps.</li>
                <li><strong className="text-on-surface">Device &amp; Usage Data:</strong> IP address, browser type, and interaction logs for performance monitoring.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li>To process, fulfill, and deliver your food orders.</li>
                <li>To send order confirmations, delivery tracking updates, and customer support communications.</li>
                <li>To prevent fraudulent activity and protect payment integrity.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                3. Payment Security &amp; Financial Credentials
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                All online transactions are processed through encrypted, PCI-DSS compliant payment gateways (<strong className="text-on-surface">HDFC SmartGateway / Juspay Hypercheckout</strong>). <strong className="text-on-surface">Lazy Biryani and KMK Enterprises do not store or capture raw credit card details, CVVs, or Net Banking credentials on our servers.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                4. Data Sharing &amp; Disclosure
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                We do not sell or rent your personal data to third parties. We share data only with authorized service partners essential for business operations (such as delivery logistics executives and payment processors).
              </p>
            </section>

            <div className="pt-4 border-t-2 border-outline-variant text-xs text-on-surface-variant flex justify-between items-center">
              <span>Read our <Link href="/terms" className="text-primary font-bold underline">Terms &amp; Conditions</Link></span>
              <span className="font-mono">KMK Enterprises</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

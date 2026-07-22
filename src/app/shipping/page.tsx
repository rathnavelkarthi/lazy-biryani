"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b-4 border-[#333333] pb-6">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 border border-black inline-block mb-3">
              Delivery Logistics
            </span>
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium">
              Operated by Lazy Biryani (KMK Enterprises)
            </p>
          </div>

          {/* Policy Card */}
          <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-10 space-y-8 text-on-surface">
            
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                1. Delivery Coverage &amp; Service Zones
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Lazy Biryani delivers ready-to-cook biryani kits across <strong className="text-on-surface">Chennai, Vellore, Trichy, Pilani, and Bangalore campus zones</strong>. We specialize in hostel, PG, and residential apartment deliveries.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Delivery availability is checked based on pincodes entered at checkout. If your address falls outside our active delivery radius, our checkout system will notify you before order placement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                2. Delivery Timelines
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li><strong className="text-on-surface">Express Campus Delivery:</strong> Orders placed within active student zones (e.g. VIT Vellore, SRM Chennai, Anna Univ) are delivered within <strong className="text-on-surface">30 to 60 minutes</strong>.</li>
                <li><strong className="text-on-surface">Standard City Delivery:</strong> Orders within city limits are delivered within <strong className="text-on-surface">2 to 4 hours</strong>.</li>
                <li><strong className="text-on-surface">Note:</strong> Delivery estimates provided during checkout are non-binding operational targets. Unforeseen weather, traffic, or security gate delays may affect delivery times.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                3. Order Tracking &amp; Delivery Handover
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Once dispatched, you will receive an SMS / WhatsApp notification with delivery agent contact details. For campus and hostel deliveries, please ensure your phone is reachable so the executive can hand over the package at the designated main gate or hostel reception.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                4. Transit Damage &amp; Proof Requirements
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                Please inspect package seals upon handover. If the packaging appears tampered with or damaged:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-on-surface-variant">
                <li>Notify the delivery executive immediately.</li>
                <li>Capture clear photos/videos of the package damage.</li>
                <li>Report the issue within <strong className="text-on-surface">24 hours</strong> to <strong className="text-on-surface">support@lazybiryani.com</strong> for a free replacement or full refund.</li>
              </ul>
            </section>

            <div className="pt-4 border-t-2 border-outline-variant text-xs text-on-surface-variant flex justify-between items-center">
              <span>Read our <Link href="/returns" className="text-primary font-bold underline">Returns &amp; Refund Policy</Link></span>
              <span className="font-mono">KMK Enterprises</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

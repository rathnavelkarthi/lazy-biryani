"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b-4 border-[#333333] pb-6">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 border border-black inline-block mb-3">
              KMK Enterprises
            </span>
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Terms &amp; Conditions
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium">
              Effective Date: July 2026 | Operating Brand: Lazy Biryani (by KMK Enterprises)
            </p>
          </div>

          {/* Terms Content Card */}
          <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-10 space-y-8 text-on-surface">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                1. Introduction
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Operator:</strong> This website is operated by <strong className="text-on-surface">Lazy Biryani</strong>, a brand owned and managed by <strong className="text-on-surface">KMK Enterprises</strong>.
                </li>
                <li>
                  <strong className="text-on-surface">Acceptance:</strong> Accessing or using this website signifies your explicit acceptance of these Terms and Conditions.
                </li>
                <li>
                  <strong className="text-on-surface">Agreement:</strong> If you disagree with any part of these terms, please do not use or place orders on this website.
                </li>
                <li>
                  <strong className="text-on-surface">Updates:</strong> We reserve the right to update, modify, or replace any part of these Terms and Conditions at any time without prior notice.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                2. Product Information and Food Safety
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Ready-to-Cook Nature:</strong> Our biryani kits contain packaged spice mixes, pastes, and dehydrated marinades. They require further cooking and additional ingredients (such as water, rice, paneer, or fresh meat) prior to consumption.
                </li>
                <li>
                  <strong className="text-on-surface">Allergen Warning:</strong> Our products are manufactured and processed in facilities that handle nuts, dairy, mustard, soy, and gluten. Please inspect all ingredient labels carefully before preparation if you have known dietary sensitivities.
                </li>
                <li>
                  <strong className="text-on-surface">Shelf Life &amp; Storage:</strong> Specific storage instructions and expiry dates are printed on each package. We are not liable for spoilage or quality degradation caused by improper storage after delivery.
                </li>
                <li>
                  <strong className="text-on-surface">Visuals &amp; Packaging:</strong> Product imagery on the website is for illustration purposes. Actual product packaging, color, and garnishing visuals may vary slightly.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                3. Orders and Pricing
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Order Acceptance:</strong> Receipt of an order confirmation does not signify our final acceptance. We reserve the right to refuse or cancel any order for reasons including stock unavailability, location restrictions, or pricing errors.
                </li>
                <li>
                  <strong className="text-on-surface">Pricing:</strong> All prices are displayed in Indian Rupees (INR ₹) and are inclusive of applicable taxes unless stated otherwise.
                </li>
                <li>
                  <strong className="text-on-surface">Price &amp; Menu Changes:</strong> Product availability and pricing are subject to change without prior notice.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                4. Payment Terms
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Payment Methods:</strong> We accept UPI (GPay, PhonePe, Paytm, VPA), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking via HDFC SmartGateway, and Cash on Delivery (COD).
                </li>
                <li>
                  <strong className="text-on-surface">Security &amp; Privacy:</strong> Electronic payments are processed securely via third-party PCI-DSS compliant payment gateways (HDFC SmartGateway / Juspay Hypercheckout). We do not store credit card or bank credentials on our servers.
                </li>
                <li>
                  <strong className="text-on-surface">Payment Confirmation:</strong> Online orders will not be processed for dispatch until full payment verification is received.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                5. Shipping and Delivery
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Delivery Timelines:</strong> Estimated delivery dates are displayed at checkout. These represent estimates and are not guaranteed timelines.
                </li>
                <li>
                  <strong className="text-on-surface">Service Areas:</strong> Deliveries are limited to designated pin codes and campus zones specified in our <Link href="/shipping" className="text-primary font-bold underline">Shipping Policy</Link>.
                </li>
                <li>
                  <strong className="text-on-surface">Damages &amp; Discrepancies:</strong> Please inspect package contents upon arrival. Any transit damage or missing items must be reported within 24 hours of delivery with clear photo/video proof to our support team.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                6. Returns, Refunds, and Cancellations
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Perishable Food Policy:</strong> Due to the food-grade nature of ready-to-cook mixes and packaged consumables, we do not accept returns on opened or unsealed items. Returns are accepted only for sealed, damaged, or incorrect packages delivered by error.
                </li>
                <li>
                  <strong className="text-on-surface">Cancellations:</strong> Orders can only be cancelled before they are dispatched for delivery. Once an order status transitions to "Out for Delivery" or "Preparing", cancellations are not permitted.
                </li>
                <li>
                  <strong className="text-on-surface">Refund Processing:</strong> Approved refunds will be credited back to your original payment method within 5–7 business days.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-primary border-b-2 border-outline-variant pb-2">
                7. Limitation of Liability
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed text-on-surface-variant">
                <li>
                  <strong className="text-on-surface">Consumer Misuse:</strong> KMK Enterprises and Lazy Biryani shall not be liable for adverse reactions, illness, or loss resulting from consumer cooking errors, improper storage, or unrecognized individual food allergies.
                </li>
                <li>
                  <strong className="text-on-surface">Maximum Liability:</strong> Our total aggregate liability for any claim arising out of your purchase shall not exceed the exact purchase price paid for the product in question.
                </li>
              </ul>
            </section>

            {/* Section 8 - Contact Information */}
            <div className="bg-surface-container p-4 border-2 border-[#333333] text-xs font-mono">
              <p className="font-bold text-on-surface">KMK Enterprises — Operating Brand: Lazy Biryani</p>
              <p className="text-on-surface-variant">Contact Support: support@lazybiryani.com | Legal &amp; Compliance Queries</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

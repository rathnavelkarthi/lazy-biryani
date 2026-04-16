"use client";

import { motion } from "framer-motion";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export function CTASection() {
  return (
    <section id="cta" className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-primary opacity-[0.07] -z-10" />
      <div className="absolute inset-0 diagonal-stripes -z-10" />

      {/* Decorative corner brackets */}
      <div className="hidden md:block absolute top-12 left-12 w-16 h-16 border-t-4 border-l-4 border-primary/20" />
      <div className="hidden md:block absolute bottom-12 right-12 w-16 h-16 border-b-4 border-r-4 border-primary/20" />

      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-7xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
          Stop scrolling.
          <br />
          <span className="text-secondary">Start cooking.</span>
        </h2>

        <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Dropping first in Chennai colleges — Anna University, SRM, Sathyabama,
          VIT Chennai &amp; Loyola. Limited first batch at &#8377;89 before prices jump.
        </p>

        {/* Email signup */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-surface-container-lowest border-4 border-[#333333] px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold brutalist-shadow focus:outline-none focus:border-primary transition-colors min-w-0"
          />
          <BrutalistButton variant="danger" size="lg" className="text-base sm:text-2xl px-6 sm:px-10 py-3 sm:py-5 whitespace-nowrap shrink-0">
            Join Waitlist
          </BrutalistButton>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 opacity-70 font-bold">
          <span className="material-symbols-outlined text-tertiary text-lg sm:text-xl">
            verified_user
          </span>
          <span className="text-xs sm:text-sm text-on-surface-variant">
            Encrypted &amp; Secure. We hate spam too.
          </span>
        </div>

        {/* Social proof nudge */}
        <motion.div
          className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-surface-container border-2 border-[#333333] px-4 py-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-container border-2 border-[#333333] flex items-center justify-center text-xs font-black"
              >
                {["R", "S", "A"][i]}
              </div>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-bold text-on-surface-variant">
            <strong className="text-on-surface">127 Chennai students</strong> joined today
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

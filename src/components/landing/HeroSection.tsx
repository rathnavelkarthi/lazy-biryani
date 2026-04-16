"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { SafeImage } from "@/components/ui/SafeImage";

export function HeroSection() {
  return (
    <header
      id="home"
      className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden md:overflow-visible"
    >
      {/* Decorative diagonal stripes in background */}
      <div className="absolute inset-0 diagonal-stripes opacity-50 -z-10" />

      {/* Scattered decorative dots */}
      <div className="hidden md:block absolute top-20 right-10 w-24 h-24 border-4 border-primary-container/30 -z-10 rotate-12" />
      <div className="hidden md:block absolute bottom-10 left-5 w-16 h-16 bg-secondary/5 border-4 border-secondary/20 -z-10 -rotate-6" />

      {/* Left: Copy */}
      <motion.div
        className="flex-1 text-left z-10 w-full"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative inline-block mb-3 sm:mb-4">
          <Badge variant="secondary">Launching first in Chennai colleges</Badge>
        </div>

        <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter text-on-surface mb-4 sm:mb-6">
          Zero Skills.
          <br />
          <span className="text-primary">Full</span>{" "}
          <span className="text-secondary">Biryani.</span>
          <br />
          <span className="font-[family-name:var(--font-caveat)] text-3xl sm:text-4xl md:text-5xl text-tertiary">
            Just Lazy It.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-on-surface-variant max-w-md mb-6 sm:mb-8 leading-relaxed">
          Chennai&apos;s first &#8377;89 single-serve biryani kit. 15 minutes in a
          rice cooker. Cheaper than Cookd, faster than Swiggy. No chopping, no
          shopping, no crying.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-4 sm:mb-6">
          <a href="#cta">
            <BrutalistButton variant="primary" size="lg" className="text-lg sm:text-2xl px-6 sm:px-10 py-4 sm:py-5">
              Pre-order for &#8377;89
            </BrutalistButton>
          </a>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-secondary">
              Launching in Chennai colleges first.
            </span>
            <span className="text-xs sm:text-sm font-bold text-on-surface-variant">
              4,204 students across Anna Univ, SRM &amp; VIT waiting.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right: Hero Image Polaroid */}
      <motion.div
        className="flex-1 relative w-full max-w-sm md:max-w-none"
        initial={{ opacity: 0, rotate: 6 }}
        animate={{ opacity: 1, rotate: 3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative transform rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
          <div className="bg-surface-container-lowest border-4 border-[#333333] polaroid-frame brutalist-shadow tape-strip">
            <SafeImage
              imageKey="hero"
              alt="Lazy Biryani Kit - steaming biryani"
              width={600}
              height={450}
              className="w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 sm:-bottom-8 right-2 sm:right-0 font-[family-name:var(--font-caveat)] text-primary text-lg sm:text-xl max-w-[130px] sm:max-w-[150px] leading-tight animate-wiggle">
            The ultimate life hack
          </div>
        </div>

        {/* Floating price tag — desktop only */}
        <motion.div
          className="hidden md:flex absolute -top-4 -left-6 bg-secondary text-white font-black text-lg px-4 py-2 border-3 border-[#333333] brutalist-shadow-sm rotate-[-8deg] z-30 items-center gap-1"
          animate={{ rotate: [-8, -6, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs line-through opacity-70">&#8377;249</span>
          <span>&#8377;89!</span>
        </motion.div>
      </motion.div>
    </header>
  );
}

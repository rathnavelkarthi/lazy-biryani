"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import type { ImageKey } from "@/lib/gemini-images";

const TESTIMONIAL_KEYS: ImageKey[] = ["testimonial-1", "testimonial-2", "testimonial-3"];

const testimonials = [
  {
    handle: "@priya_annauniv",
    likes: "1.8k",
    text: "Better than any biryani spot on Mount Road. Made it in my hostel room at Anna University. Life = changed.",
    rotation: -2,
  },
  {
    handle: "@karthik_srm",
    likes: "2.1k",
    text: "SRM mess could never. ₹89 for real dum biryani? I ordered 10 kits for my entire floor.",
    rotation: 3,
  },
  {
    handle: "@divya_sathyabama",
    likes: "3.4k",
    text: "Exam week saviour! Tastes exactly like the biryani from Thalappakatti but I made it in 15 mins. Chennai students, trust me on this.",
    rotation: -1,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: 0 },
  visible: (rotation: number) => ({
    opacity: 1,
    scale: 1,
    rotate: rotation,
    transition: { duration: 0.5 },
  }),
};

export function SocialProof() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  return (
    <section id="proof" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16 gap-2 sm:gap-4">
          <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
            Chennai Students Love It
          </h2>
          <span className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl text-primary">
            Real reviews from real hostel rooms @LazyBiryani
          </span>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.handle}
              custom={isMobile ? 0 : t.rotation}
              variants={cardVariants}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-surface-container-lowest border-4 border-[#333333] polaroid-frame brutalist-shadow transition-all duration-300">
                <SafeImage
                  imageKey={TESTIMONIAL_KEYS[i]}
                  alt={`${t.handle} biryani photo`}
                  width={400}
                  height={300}
                  className="w-full h-44 sm:h-56 object-cover"
                />
                <div className="mt-3 sm:mt-4 flex items-center justify-between">
                  <span className="font-black text-primary text-xs sm:text-sm">
                    {t.handle}
                  </span>
                  <span className="flex items-center gap-1 text-secondary font-bold text-xs sm:text-sm">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      favorite
                    </span>
                    {t.likes}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl text-on-surface mt-1 sm:mt-2 leading-tight">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

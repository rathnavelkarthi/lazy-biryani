"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const TESTIMONIAL_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAX8BKWb5lJPLk3iESFQDh-YADIEoGKthKwqmrpCoKGHsAXOJVC1eICXCTkzvaKx2zGbMngeu4gVjuGBxaPXZuAErxuySVhTrdQPx91jxh45xUHHoZsA61O3o53aOETmO0kWfAg6fyL79IQQDmJHgzhFhMx8jrXQP5IFT4qX_0Hyc4p6tJCFjj5f2oiUA4bb0LRDTrjG7VEQrAiobN2opx-wpWba7rKQwJ_vaC7EbwLdYKZ66NaqigdToOmhu_GG29lP0E3MeP1Vhk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDc7WlXOloYPkL3PYPBicH2fti79TrQZmA9NCFJM-qbqmSx1xhLXKgQ1jLvn81TxwNm0p1xqwlIsYHMoCWN9hbU6NHi1tJo4WVrkcD7mTQIy_Fc7KECxs_R8CSLk9eJ7Tzpsef7pzR7JxqQesyUp2TES0vNbCWKTRUY7847gdw0lhwWjNDCQPkUa1XsxVM97EYS8zZ-Y_LS2Gl69UP6B1dHPviHOHpS0yI7Zl9dac-v4Z2orguWH8ue-_2A8DpXWr5j797-y111JiE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBXnksxnJCPuF1qPuoXenkWbpMFhFO8uVN5ZtkuaXA1U0OTWTHRNEMVma9Le-sujaIjX0g6cLncR2xQiKUNgykDIAdAsuvrcFW52EGyztxo9AV80sxN8c5YPkUgLshzrWqEpQ7PxZ2RyZ85o3pugRPr36_7Q9mq6i6QZ__C8FQ7R7sb3UMXuKJWGH4XcjhdWPWcflRVsmgqH3M9CsJNwUt4x8wFQyMR2RTuWnBLNEqThozYqJzUCVvtJmL3aDF8INPA-Bp6kfKNXvQ",
];

const testimonials = [
  {
    handle: "@rahul_bits",
    likes: "1.2k",
    text: "Mess food is officially cancelled. Lazy Biryani for the win!",
    rotation: -2,
  },
  {
    handle: "@sneha_vit",
    likes: "842",
    text: "Stocking up before the exam week. Only survival kit needed.",
    rotation: 3,
  },
  {
    handle: "@foodie_backbench",
    likes: "2.5k",
    text: "Can you believe this came out of a rice cooker?",
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
  return (
    <section id="proof" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16 gap-2 sm:gap-4">
          <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
            Approved by Legends
          </h2>
          <span className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl text-primary">
            Follow the hype @LazyBiryani
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
              custom={typeof window !== "undefined" && window.innerWidth < 640 ? 0 : t.rotation}
              variants={cardVariants}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-surface-container-lowest border-4 border-[#333333] polaroid-frame brutalist-shadow transition-all duration-300">
                <Image
                  src={TESTIMONIAL_IMAGES[i]}
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

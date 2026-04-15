"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrutalistCard } from "@/components/ui/BrutalistCard";

const STEP_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBobBkhxTy7hfGG7Z3RQSmmhKSemxntkwq8AaNprRJqGZWGAfKqwJMAxVLRW24aoremSHKe5B_gIUC31UrjUxZobqv8yjaXIp6Et1XY-5aQ1GhynncWQ8B_Iyd1FGXYIX9dFIAPym-BNl13Z-lTqvDkmCaXb0ma1OwjDUx1WSdSSFeZ-TbBeBdUNGrFpO2UcuwRdeMmDwe6ca3T9aUZyizCzR1rje4TuZteZRRsDq59M2zeCNdydZO7zZWZNqUwqkEqcQAF_cPUqsE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXGJQsoomu0Kp1jV6VACHEsy5v72GlKJDv1X48RphYWzJ4Vc08ew6r0ELWNC1eVOz-Qs6kTLYExrd9WiVDBKZX9KerXxHjsYU789gNiZc6Spp-ICw5qC7qh-56j6zlIXaN1DFjlKXm6_5GMjcWy4QJ1CXhZfEQZEAN5tiliHtzRvS_vdRl80MNNyhKgbTxYqQnFnDyPnaGdhE9s6Ecq-QLUXfDgViCuMnzfkgcTe--5xyOv3EnWvSMx2pxH0rdI0RCleB2mXPrhOY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7NaQ54CRkRmmaIIV2W2BmRUKA95yUCnxqPKjMD4PyPBNeXMnNMzo6jLGa7BEKT3yn4obFygnCKo4OqoTssX5StbecdZSv2d-Z5EntH03c3uZ3_g9MRoEtpH3gypiv44COta6fWEAz18zuXw3OHVyWwSL-gnGb6msS229Ab3PZqCQgm73EDCdWIuQZmXRFJKghXBbM8pFbsJ04uoHg3DyS-Q5JJENeGphkD-Fov1MGiDYDxPOD9JchJnHxzzSQ0A2c1aqsZiqJC6M",
];

const steps = [
  {
    num: 1,
    title: "Open the box",
    desc: "Tear it open. Try not to eat the raw masala. It smells too good, we know.",
    icon: "inventory_2",
  },
  {
    num: 2,
    title: "Add water & heat",
    desc: "Throw it in a rice cooker, kettle, or whatever electric heating device you smuggled in.",
    icon: "local_fire_department",
  },
  {
    num: 3,
    title: "Eat like a King",
    desc: "15 mins later, authentic dum biryani on your bed. No sharing allowed.",
    icon: "restaurant",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-low relative">
      {/* Section connector line */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#333333]/5 -translate-y-1/2 z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16 gap-2">
          <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
            Idiot-Proof Cooking
          </h2>
          <span className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl text-primary">
            3 steps to glory
          </span>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step, i) => (
            <motion.div key={step.num} variants={cardVariants}>
              <BrutalistCard hover className="h-full overflow-hidden">
                <div className="relative">
                  <Image
                    src={STEP_IMAGES[i]}
                    alt={step.title}
                    width={400}
                    height={300}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  {/* Step number overlay */}
                  <div className="absolute top-3 left-3 bg-[#333333] text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-black text-lg sm:text-xl border-2 border-primary-container">
                    {step.num}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                      {step.icon}
                    </span>
                    <h3 className="font-[family-name:var(--font-plus-jakarta-sans)] text-xl sm:text-2xl font-black text-on-surface">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-on-surface-variant font-medium text-sm sm:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </BrutalistCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting arrows between cards — desktop only */}
        <div className="hidden md:flex justify-around mt-8 px-16">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="material-symbols-outlined text-primary-container text-4xl"
            >
              arrow_forward
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const rows = [
  {
    option: "Swiggy/Zomato",
    cost: "\u20B9250+",
    costEmoji: "\uD83D\uDCB8",
    time: "45 mins",
    experience: "Cold by delivery",
    experienceEmoji: "\uD83D\uDC4E",
    highlight: false,
  },
  {
    option: "Cookd Kit (3-serve)",
    cost: "\u20B9189-299",
    costEmoji: "\uD83D\uDCB8",
    time: "30+ mins",
    experience: "Need gas stove",
    experienceEmoji: "\uD83E\uDD2E",
    highlight: false,
  },
  {
    option: "College Mess",
    cost: "\u20B90 pain",
    costEmoji: "",
    time: "Infinite line",
    experience: "Cardboard taste",
    experienceEmoji: "\uD83E\uDD2E",
    highlight: false,
  },
  {
    option: "Lazy Biryani",
    cost: "\u20B989",
    costEmoji: "\uD83E\uDD11",
    time: "15 mins",
    experience: "Fresh Dum Biryani",
    experienceEmoji: "\uD83D\uDC51",
    highlight: true,
  },
];

export function RealityCheck() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-6xl font-black text-on-surface mb-10 sm:mb-16 tracking-tighter">
          The Reality Check
        </h2>

        {/* Desktop table */}
        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full border-4 border-[#333333] brutalist-shadow">
            <thead>
              <tr className="bg-[#333333] text-white">
                {["Option", "Cost", "Time", "Experience"].map((h) => (
                  <th
                    key={h}
                    className="px-4 sm:px-6 py-3 sm:py-4 text-left font-black uppercase tracking-widest text-xs sm:text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.option}
                  className={
                    row.highlight
                      ? "bg-primary-container/30 border-t-4 border-[#333333]"
                      : "bg-surface border-t-4 border-[#333333]"
                  }
                >
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-black text-base sm:text-lg text-on-surface">
                    {row.highlight && (
                      <span className="material-symbols-outlined text-primary mr-2 align-middle text-lg">
                        star
                      </span>
                    )}
                    {row.option}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-on-surface-variant">
                    {row.cost} {row.costEmoji}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-on-surface-variant">
                    {row.time}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-on-surface-variant">
                    {row.experience} {row.experienceEmoji}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile card layout */}
        <motion.div
          className="sm:hidden flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {rows.map((row) => (
            <div
              key={row.option}
              className={`border-4 border-[#333333] p-4 ${
                row.highlight
                  ? "bg-primary-container/30 brutalist-shadow"
                  : "bg-surface"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {row.highlight && (
                  <span className="material-symbols-outlined text-primary text-lg">
                    star
                  </span>
                )}
                <h3 className="font-black text-lg text-on-surface">
                  {row.option}
                </h3>
                {row.highlight && (
                  <span className="ml-auto bg-secondary text-white text-xs font-black px-2 py-1 uppercase tracking-wider">
                    Winner
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                    Cost
                  </div>
                  <div className="font-bold text-on-surface">
                    {row.cost} {row.costEmoji}
                  </div>
                </div>
                <div>
                  <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                    Time
                  </div>
                  <div className="font-bold text-on-surface">{row.time}</div>
                </div>
                <div>
                  <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                    Vibe
                  </div>
                  <div className="font-bold text-on-surface">
                    {row.experienceEmoji} {row.experience}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

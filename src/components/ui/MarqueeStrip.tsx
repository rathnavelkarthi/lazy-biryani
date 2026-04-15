"use client";

interface MarqueeItem {
  text: string;
  icon?: string;
  color?: string;
}

interface MarqueeStripProps {
  items: MarqueeItem[];
  speed?: number;
}

export function MarqueeStrip({ items, speed = 20 }: MarqueeStripProps) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-[#333333] py-3 sm:py-5 overflow-hidden border-y-4 border-[#333333] relative">
      {/* Subtle gradient edges for depth */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#333333] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#333333] to-transparent z-10" />

      <div
        className="marquee flex gap-8 sm:gap-16 md:gap-20"
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedItems.map((item, i) => (
          <span
            key={i}
            className={`text-lg sm:text-2xl md:text-3xl font-black uppercase flex items-center gap-2 sm:gap-4 shrink-0 ${
              item.color || "text-white"
            }`}
          >
            {item.text}
            {item.icon && (
              <span className="material-symbols-outlined text-primary-container text-base sm:text-xl md:text-2xl">
                {item.icon}
              </span>
            )}
            <span className="text-primary-container/40 mx-2 sm:mx-4">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

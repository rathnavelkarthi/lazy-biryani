"use client";

import Image from "next/image";

interface PolaroidFrameProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function PolaroidFrame({
  src,
  alt,
  caption,
  rotation = 0,
  width = 400,
  height = 300,
  className = "",
}: PolaroidFrameProps) {
  return (
    <div
      className={`bg-surface-container-lowest border-4 border-[#333333] polaroid-frame brutalist-shadow transition-all duration-300 hover:rotate-0 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full object-cover"
      />
      {caption && (
        <p className="font-[family-name:var(--font-caveat)] text-2xl mt-4 text-center text-on-surface">
          {caption}
        </p>
      )}
    </div>
  );
}

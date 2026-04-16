"use client";

import Image from "next/image";
import { useState } from "react";
import { type ImageKey, getImageUrl, getPlaceholder } from "@/lib/gemini-images";

interface SafeImageProps {
  imageKey: ImageKey;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * Image component that uses generated images with SVG placeholder fallback.
 * Ensures every image on the site is unique — no repeats.
 */
export function SafeImage({ imageKey, alt, width, height, className, priority }: SafeImageProps) {
  const [errored, setErrored] = useState(false);
  const src = errored ? getPlaceholder(imageKey) : getImageUrl(imageKey);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setErrored(true)}
      unoptimized={errored}
    />
  );
}

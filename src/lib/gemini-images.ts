/**
 * Image URL helper — uses generated images when available, falls back to unique placeholder SVGs.
 * This eliminates all repeating images across the site.
 */

// Each image gets a unique path — no repeats
const IMAGE_MAP = {
  // Testimonials
  "testimonial-1": "/images/generated/testimonial-1.png",
  "testimonial-2": "/images/generated/testimonial-2.png",
  "testimonial-3": "/images/generated/testimonial-3.png",
  // Hero
  hero: "/images/generated/hero.png",
  // How-it-works steps
  "step-1": "/images/generated/step-1-open.png",
  "step-2": "/images/generated/step-2-cook.png",
  "step-3": "/images/generated/step-3-eat.png",
  // Products
  "product-chicken": "/images/generated/product-chicken.png",
  "product-mutton": "/images/generated/product-mutton.png",
  "product-veg": "/images/generated/product-veg.png",
  "product-egg": "/images/generated/product-egg.png",
} as const;

export type ImageKey = keyof typeof IMAGE_MAP;

// Unique warm color palette so each placeholder is visually distinct
const PLACEHOLDER_COLORS: Record<ImageKey, { bg: string; fg: string; label: string }> = {
  "testimonial-1": { bg: "#FFE0B2", fg: "#E65100", label: "Anna Univ Student" },
  "testimonial-2": { bg: "#FFCCBC", fg: "#BF360C", label: "SRM Squad" },
  "testimonial-3": { bg: "#F8BBD0", fg: "#880E4F", label: "Sathyabama Vibes" },
  hero: { bg: "#FFF3E0", fg: "#E65100", label: "Lazy Biryani" },
  "step-1": { bg: "#FFF9C4", fg: "#F57F17", label: "Step 1: Open" },
  "step-2": { bg: "#FFE0B2", fg: "#EF6C00", label: "Step 2: Cook" },
  "step-3": { bg: "#FFCCBC", fg: "#D84315", label: "Step 3: Eat" },
  "product-chicken": { bg: "#FFF3E0", fg: "#E65100", label: "Chicken Dum" },
  "product-mutton": { bg: "#EFEBE9", fg: "#4E342E", label: "Mutton" },
  "product-veg": { bg: "#E8F5E9", fg: "#2E7D32", label: "Veg" },
  "product-egg": { bg: "#FFFDE7", fg: "#F9A825", label: "Egg" },
};

/**
 * Generate a unique SVG data URI placeholder for a given image key
 */
function placeholderSvg(key: ImageKey): string {
  const c = PLACEHOLDER_COLORS[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${c.bg}"/>
    <rect x="250" y="180" width="300" height="200" rx="20" fill="${c.fg}" opacity="0.15"/>
    <text x="400" y="280" text-anchor="middle" font-family="system-ui,sans-serif" font-size="48" font-weight="900" fill="${c.fg}">${c.label}</text>
    <text x="400" y="340" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="${c.fg}" opacity="0.6">Image generating...</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get the image URL for a given key.
 * Returns the generated image path if the file exists, or a unique SVG placeholder.
 * For client-side, we always return the path and let Next.js handle the fallback.
 */
export function getImageUrl(key: ImageKey): string {
  return IMAGE_MAP[key];
}

/**
 * Get the placeholder for a key (used as fallback in onError handlers)
 */
export function getPlaceholder(key: ImageKey): string {
  return placeholderSvg(key);
}

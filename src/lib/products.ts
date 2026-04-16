export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  description: string;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  image: string;
  tag?: string;
  available: boolean;
}

export const products: Product[] = [
  {
    id: "chicken-dum-kit",
    name: "Chicken Dum Biryani Kit",
    slug: "chicken-dum-kit",
    price: 89,
    originalPrice: 249,
    description:
      "The OG kit. Pre-marinated chicken, basmati rice pouch, saffron packet, and 18-spice masala blend. Just add water, dump in a rice cooker, and wait 15 mins.",
    spiceLevel: 3,
    image: "/images/generated/product-chicken.png",
    tag: "Bestseller",
    available: true,
  },
  {
    id: "mutton-biryani-kit",
    name: "Mutton Biryani Kit",
    slug: "mutton-biryani-kit",
    price: 129,
    originalPrice: 349,
    description:
      "Premium kit for the bold. Includes slow-braised mutton chunks, long-grain rice, smoky masala, and fried onion topping. Zero skill needed — just heat and eat.",
    spiceLevel: 4,
    image: "/images/generated/product-mutton.png",
    tag: "Premium",
    available: true,
  },
  {
    id: "veg-biryani-kit",
    name: "Veg Biryani Kit",
    slug: "veg-biryani-kit",
    price: 69,
    originalPrice: 199,
    description:
      "Plant-powered kit that slaps. Comes with paneer cubes, mixed veggie pack, basmati rice, and the same killer masala. Even non-veg friends will steal one.",
    spiceLevel: 2,
    image: "/images/generated/product-veg.png",
    tag: "Value Pick",
    available: true,
  },
  {
    id: "egg-biryani-kit",
    name: "Egg Biryani Kit",
    slug: "egg-biryani-kit",
    price: 79,
    originalPrice: 219,
    description:
      "The underdog kit. Includes pre-boiled egg pack, spiced rice mix, caramelized onion topping, and masala sachet. Easiest biryani you'll ever make.",
    spiceLevel: 3,
    image: "/images/generated/product-egg.png",
    available: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

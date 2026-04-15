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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHRY_VepRJ521NBEaYQSpOa2yJ50yDRkUER3z4dxLQhDQDQjXL6R-9e4kv5MIVDO25chpB5ohD22S9AkRt0uTX3yHkPvmHzBpaalobORht6aDq6bOG_u7vhQCpypmXIDyWvVDn0tdik4pOnsfYAJSIlP3s-EBc2GHBrJHHM0187X2Krb2c2mWKgiXhPxpHvsPuFX6LY_oTytyO6EeODt0WBF-PX_tDVyALpcFeZQj9bdDTzclPYXJ1y9TwQ8fxUAE-1gC-WzEXqw8",
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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBobBkhxTy7hfGG7Z3RQSmmhKSemxntkwq8AaNprRJqGZWGAfKqwJMAxVLRW24aoremSHKe5B_gIUC31UrjUxZobqv8yjaXIp6Et1XY-5aQ1GhynncWQ8B_Iyd1FGXYIX9dFIAPym-BNl13Z-lTqvDkmCaXb0ma1OwjDUx1WSdSSFeZ-TbBeBdUNGrFpO2UcuwRdeMmDwe6ca3T9aUZyizCzR1rje4TuZteZRRsDq59M2zeCNdydZO7zZWZNqUwqkEqcQAF_cPUqsE",
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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXGJQsoomu0Kp1jV6VACHEsy5v72GlKJDv1X48RphYWzJ4Vc08ew6r0ELWNC1eVOz-Qs6kTLYExrd9WiVDBKZX9KerXxHjsYU789gNiZc6Spp-ICw5qC7qh-56j6zlIXaN1DFjlKXm6_5GMjcWy4QJ1CXhZfEQZEAN5tiliHtzRvS_vdRl80MNNyhKgbTxYqQnFnDyPnaGdhE9s6Ecq-QLUXfDgViCuMnzfkgcTe--5xyOv3EnWvSMx2pxH0rdI0RCleB2mXPrhOY",
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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7NaQ54CRkRmmaIIV2W2BmRUKA95yUCnxqPKjMD4PyPBNeXMnNMzo6jLGa7BEKT3yn4obFygnCKo4OqoTssX5StbecdZSv2d-Z5EntH03c3uZ3_g9MRoEtpH3gypiv44COta6fWEAz18zuXw3OHVyWwSL-gnGb6msS229Ab3PZqCQgm73EDCdWIuQZmXRFJKghXBbM8pFbsJ04uoHg3DyS-Q5JJENeGphkD-Fov1MGiDYDxPOD9JchJnHxzzSQ0A2c1aqsZiqJC6M",
    available: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

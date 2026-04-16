"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useProducts } from "@/lib/ProductContext";
import { useCart } from "@/lib/CartContext";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";

function SpiceLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-base ${
            i < level ? "text-secondary" : "text-outline-variant"
          }`}
          style={{ fontVariationSettings: i < level ? '"FILL" 1' : '"FILL" 0' }}
        >
          local_fire_department
        </span>
      ))}
    </div>
  );
}

function AddedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed bottom-6 right-6 bg-tertiary text-white px-6 py-3 font-black text-sm uppercase tracking-wider border-2 border-[#333333] brutalist-shadow z-50 flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-lg">check_circle</span>
      Added to cart!
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MenuPage() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const [toast, setToast] = useState(false);

  const handleAdd = (product: (typeof products)[0]) => {
    addItem(product);
    setToast(true);
    setTimeout(() => setToast(false), 1500);
  };

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-14">
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3">
              The Menu
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-lg">
              Pick your weapon. Every kit serves one hungry human in 15 minutes flat.
            </p>
          </div>

          {/* Product grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.filter((p) => p.available).map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow h-full flex flex-col overflow-hidden group">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.tag && (
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant={
                            product.tag === "Bestseller"
                              ? "secondary"
                              : product.tag === "Premium"
                              ? "primary"
                              : product.tag === "Value Pick"
                              ? "tertiary"
                              : "primary"
                          }
                        >
                          {product.tag}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-[family-name:var(--font-plus-jakarta-sans)] text-lg sm:text-xl font-black text-on-surface mb-1">
                      {product.name}
                    </h3>

                    <SpiceLevel level={product.spiceLevel} />

                    <p className="text-on-surface-variant text-sm mt-2 mb-4 flex-1 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price + CTA */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <span className="text-xs text-on-surface-variant line-through">
                          &#8377;{product.originalPrice}
                        </span>
                        <div className="text-2xl font-black text-primary">
                          &#8377;{product.price}
                        </div>
                      </div>
                      <BrutalistButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleAdd(product)}
                      >
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">
                            add_shopping_cart
                          </span>
                          Add
                        </span>
                      </BrutalistButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <AddedToast show={toast} />
      </main>
      <Footer />
    </>
  );
}

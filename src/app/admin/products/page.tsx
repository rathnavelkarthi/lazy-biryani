"use client";

import { useAuth } from "@/lib/AuthContext";
import { useProducts } from "@/lib/ProductContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/products";

function ProductModal({
  product,
  onSave,
  onClose,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const isNew = !product;
  const [form, setForm] = useState<Product>(
    product || {
      id: `product-${Date.now()}`,
      name: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      description: "",
      spiceLevel: 3,
      image: "/images/generated/product-chicken.png",
      tag: "",
      available: true,
    }
  );

  const update = (field: keyof Product, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name"
        ? { slug: String(value).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }
        : {}),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-xl font-black text-on-surface mb-4">
          {isNew ? "Add New Product" : "Edit Product"}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              placeholder="Chicken Dum Biryani Kit"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => update("originalPrice", Number(e.target.value))}
                className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Spice Level (1-5)
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={form.spiceLevel}
                onChange={(e) => update("spiceLevel", Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Mild</span>
                <span className="font-black text-secondary">{form.spiceLevel}/5</span>
                <span>Fire</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                Tag
              </label>
              <select
                value={form.tag || ""}
                onChange={(e) => update("tag", e.target.value)}
                className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="">No Tag</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Premium">Premium</option>
                <option value="Value Pick">Value Pick</option>
                <option value="New">New</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              placeholder="/images/generated/product-chicken.png"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => update("available", e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm font-bold text-on-surface">Available for sale</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <BrutalistButton type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </BrutalistButton>
          <BrutalistButton
            type="button"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => {
              if (form.name && form.price > 0) onSave(form);
            }}
          >
            {isNew ? "Add Product" : "Save Changes"}
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } = useProducts();
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-on-surface-variant font-bold">Loading...</span>
      </div>
    );
  }

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link
                  href="/admin"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                </Link>
                <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl font-black text-on-surface tracking-tighter">
                  Product Manager
                </h1>
              </div>
              <p className="text-on-surface-variant text-sm">
                Add, edit, or remove products from the shop.
              </p>
            </div>
            <BrutalistButton
              variant="primary"
              size="md"
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Product
              </span>
            </BrutalistButton>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow overflow-hidden ${
                  !product.available ? "opacity-60" : ""
                }`}
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml," +
                        encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#FFF3E0" width="400" height="300"/><text x="200" y="150" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#E65100">${product.name}</text></svg>`
                        );
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.tag && (
                      <Badge variant="primary">{product.tag}</Badge>
                    )}
                    {!product.available && (
                      <Badge variant="pending">Hidden</Badge>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-plus-jakarta-sans)] font-black text-on-surface text-sm mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-black text-primary text-lg">₹{product.price}</span>
                    <span className="text-xs text-on-surface-variant line-through">₹{product.originalPrice}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-surface-container border-2 border-[#333333] py-2 text-xs font-bold hover:bg-primary-container/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-surface-container border-2 border-[#333333] py-2 text-xs font-bold hover:bg-tertiary-container/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {product.available ? "visibility_off" : "visibility"}
                      </span>
                      {product.available ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="flex items-center justify-center bg-surface-container border-2 border-[#333333] px-3 py-2 text-xs font-bold text-secondary hover:bg-secondary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === product.id && (
                  <div className="border-t-2 border-[#333333] p-3 bg-secondary/5">
                    <p className="text-xs font-bold text-secondary mb-2">Delete this product?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-secondary text-white py-1.5 text-xs font-black border-2 border-[#333333]"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-surface-container py-1.5 text-xs font-bold border-2 border-[#333333]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}

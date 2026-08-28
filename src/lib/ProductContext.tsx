"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { products as defaultProducts, type Product } from "./products";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  toggleAvailability: async () => {},
  refetch: async () => {},
});

function dbToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: row.price as number,
    originalPrice: row.original_price as number,
    description: row.description as string,
    spiceLevel: row.spice_level as 1 | 2 | 3 | 4 | 5,
    image: row.image as string,
    tag: (row.tag as string) || undefined,
    available: row.available as boolean,
  };
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const json = await res.json();
        if (json.products && json.products.length > 0) {
          setProducts(json.products.map(dbToProduct));
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback to direct client query below
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        setProducts(data.map(dbToProduct));
        setLoading(false);
        return;
      }
    } catch {
      // Fall back to default products below
    }

    setProducts(defaultProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Product) => {
    // Optimistic UI update
    setProducts((prev) => [...prev, product]);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        // Fallback to direct client insert if API fails
        await supabase.from("products").insert({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          original_price: product.originalPrice,
          description: product.description,
          spice_level: product.spiceLevel,
          image: product.image,
          tag: product.tag || null,
          available: product.available,
        });
      }
    } catch (err) {
      console.warn("Product add API error:", err);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    // Optimistically update UI immediately
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        console.warn("Product update API returned error:", json);
      }
    } catch (err) {
      console.warn("Product update API error:", err);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    // Optimistic UI update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        await supabase.from("products").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Product delete API error:", err);
    }
  }, []);

  const toggleAvailability = useCallback(async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newAvailable = !product.available;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: newAvailable } : p))
    );

    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, available: newAvailable }),
      });
    } catch (err) {
      console.warn("Toggle availability error:", err);
    }
  }, [products]);

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleAvailability, refetch: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}

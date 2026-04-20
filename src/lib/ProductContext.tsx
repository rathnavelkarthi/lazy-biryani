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
import type { Product } from "./products";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setProducts(data.map(dbToProduct));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Product) => {
    const { error } = await supabase.from("products").insert({
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
    if (!error) {
      setProducts((prev) => [...prev, product]);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.spiceLevel !== undefined) dbUpdates.spice_level = updates.spiceLevel;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag || null;
    if (updates.available !== undefined) dbUpdates.available = updates.available;

    const { error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const toggleAvailability = useCallback(async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newAvailable = !product.available;
    const { error } = await supabase
      .from("products")
      .update({ available: newAvailable })
      .eq("id", id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, available: newAvailable } : p))
      );
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

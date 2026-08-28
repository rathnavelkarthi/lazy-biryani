import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, price, originalPrice, description, spiceLevel, image, tag, available } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Product name and price are required" },
        { status: 400 }
      );
    }

    const productId = id || `product-${Date.now()}`;
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const newRow = {
      id: productId,
      name,
      slug: productSlug,
      price: Number(price),
      original_price: Number(originalPrice || price),
      description: description || "",
      spice_level: Number(spiceLevel || 3),
      image: image || "/images/generated/product-chicken.png",
      tag: tag || null,
      available: available !== undefined ? Boolean(available) : true,
    };

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(newRow)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) dbUpdates.original_price = Number(updates.originalPrice);
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.spiceLevel !== undefined) dbUpdates.spice_level = Number(updates.spiceLevel);
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag || null;
    if (updates.available !== undefined) dbUpdates.available = Boolean(updates.available);

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // query param fallback
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

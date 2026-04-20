-- ========================================
-- Lazy Biryani - Database Setup
-- ========================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  description TEXT NOT NULL,
  spice_level INTEGER NOT NULL CHECK (spice_level BETWEEN 1 AND 5),
  image TEXT NOT NULL,
  tag TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT 'ORD-' || substr(md5(random()::text), 1, 8),
  user_id UUID REFERENCES profiles(id),
  user_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- Row Level Security
-- ========================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- Products: service role handles inserts/updates (admin via API routes)
CREATE POLICY "products_service_write" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Profiles: users can read/update their own
CREATE POLICY "profiles_read_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Orders: users can read/create their own
CREATE POLICY "orders_read_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders: service role can manage all (for admin)
CREATE POLICY "orders_service_all" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- Seed products
-- ========================================

INSERT INTO products (id, name, slug, price, original_price, description, spice_level, image, tag, available)
VALUES
  ('chicken-dum-kit', 'Chicken Dum Biryani Kit', 'chicken-dum-kit', 89, 249,
   'The OG kit. Pre-marinated chicken, basmati rice pouch, saffron packet, and 18-spice masala blend. Just add water, dump in a rice cooker, and wait 15 mins.',
   3, '/images/generated/product-chicken.png', 'Bestseller', true),
  ('mutton-biryani-kit', 'Mutton Biryani Kit', 'mutton-biryani-kit', 129, 349,
   'Premium kit for the bold. Includes slow-braised mutton chunks, long-grain rice, smoky masala, and fried onion topping. Zero skill needed — just heat and eat.',
   4, '/images/generated/product-mutton.png', 'Premium', true),
  ('veg-biryani-kit', 'Veg Biryani Kit', 'veg-biryani-kit', 69, 199,
   'Plant-powered kit that slaps. Comes with paneer cubes, mixed veggie pack, basmati rice, and the same killer masala. Even non-veg friends will steal one.',
   2, '/images/generated/product-veg.png', 'Value Pick', true),
  ('egg-biryani-kit', 'Egg Biryani Kit', 'egg-biryani-kit', 79, 219,
   'The underdog kit. Includes pre-boiled egg pack, spiced rice mix, caramelized onion topping, and masala sachet. Easiest biryani you will ever make.',
   3, '/images/generated/product-egg.png', NULL, true)
ON CONFLICT (id) DO NOTHING;

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

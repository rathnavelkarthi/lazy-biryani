/**
 * Generate unique biryani images via Gemini API (Imagen)
 * Usage: node scripts/generate-images.mjs
 *
 * Generates images for: testimonials (3), hero (1), how-it-works steps (3), products (4)
 * Saves to public/images/generated/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "generated");

// Read API key from .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const IMAGE_PROMPTS = [
  // Testimonials (3)
  { name: "testimonial-1", prompt: "A happy Indian college student girl in a hostel room showing off a plate of freshly made chicken biryani, warm lighting, phone photo style, casual and authentic, Anna University Chennai hostel setting" },
  { name: "testimonial-2", prompt: "A group of excited Indian college boys in a hostel common room eating biryani from a single-serve container, candid phone photo style, SRM University campus vibes, warm and fun" },
  { name: "testimonial-3", prompt: "An Indian female college student studying late at night with a fresh plate of biryani on her desk, cozy hostel room with fairy lights, Sathyabama University Chennai, phone camera selfie style" },
  // Hero
  { name: "hero", prompt: "A beautifully plated single-serve chicken dum biryani with saffron rice, garnished with fried onions and mint, on a rustic wooden surface, dramatic food photography, steam rising, warm golden lighting, top-down angle" },
  // How it works steps (3)
  { name: "step-1-open", prompt: "Hands opening a colorful biryani kit box revealing spice packets and rice pouch inside, bright product photography, clean white background, overhead angle" },
  { name: "step-2-cook", prompt: "A small rice cooker on a hostel desk with biryani being cooked inside, steam coming out, Indian college hostel room background, warm cozy lighting" },
  { name: "step-3-eat", prompt: "A delicious plate of steaming hot dum biryani served on a bed with a laptop nearby, Indian hostel room setting, food photography, vibrant colors, appetizing" },
  // Products (4)
  { name: "product-chicken", prompt: "Chicken dum biryani in a white bowl, saffron basmati rice with tender chicken pieces, topped with fried onions and mint leaves, professional food photography, white background, dramatic lighting" },
  { name: "product-mutton", prompt: "Mutton biryani in a copper handi pot, rich dark gravy with succulent mutton chunks mixed in fragrant long-grain rice, professional food photography, dark moody background" },
  { name: "product-veg", prompt: "Vegetable biryani with paneer cubes, colorful mixed vegetables, and fragrant basmati rice in a white ceramic bowl, fresh and vibrant, professional food photography, light background" },
  { name: "product-egg", prompt: "Egg biryani with halved boiled eggs on a bed of spiced golden rice, caramelized onions on top, professional food photography, warm lighting, rustic plate" },
];

async function generateImage(entry) {
  const outPath = path.join(OUT_DIR, `${entry.name}.png`);

  // Skip if already generated
  if (fs.existsSync(outPath)) {
    console.log(`  SKIP ${entry.name} (already exists)`);
    return true;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an image: ${entry.prompt}. Make it high quality, photorealistic, 16:9 aspect ratio.`
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  FAIL ${entry.name}: HTTP ${res.status} - ${errText.slice(0, 200)}`);
      return false;
    }

    const data = await res.json();

    // Find image part in response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart?.inlineData?.data) {
      const buffer = Buffer.from(imagePart.inlineData.data, "base64");
      fs.writeFileSync(outPath, buffer);
      console.log(`  OK   ${entry.name} (${(buffer.length / 1024).toFixed(0)}KB)`);
      return true;
    } else {
      console.error(`  FAIL ${entry.name}: No image in response`);
      // Log what we got for debugging
      const textParts = parts.filter(p => p.text).map(p => p.text.slice(0, 100));
      if (textParts.length) console.error(`        Response text: ${textParts.join(" | ")}`);
      return false;
    }
  } catch (err) {
    console.error(`  FAIL ${entry.name}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`Generating ${IMAGE_PROMPTS.length} images via Gemini API...\n`);

  let success = 0;
  let fail = 0;

  // Generate sequentially to avoid rate limits
  for (const entry of IMAGE_PROMPTS) {
    const ok = await generateImage(entry);
    if (ok) success++;
    else fail++;
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\nDone: ${success} generated, ${fail} failed`);
  console.log(`Images saved to: public/images/generated/`);

  if (fail > 0) {
    console.log("\nFor failed images, placeholder SVGs will be used in the app.");
  }
}

main();

import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RealityCheck } from "@/components/landing/RealityCheck";
import { SocialProof } from "@/components/landing/SocialProof";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const marqueeItems = [
  { text: "Anna University hostel approved", icon: "verified" },
  { text: "SRM students love it", icon: "favorite" },
  { text: "Cheaper than Cookd & Swiggy", icon: "speed" },
  { text: "Chennai's tastiest biryani kit", icon: "local_fire_department" },
  { text: "Sathyabama canteen who?", icon: "skull" },
  { text: "VIT Chennai fav", icon: "upgrade" },
  { text: "Loyola boys certified", icon: "workspace_premium" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <HeroSection />
        <MarqueeStrip items={marqueeItems} speed={25} />
        <HowItWorks />
        <RealityCheck />
        <SocialProof />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}

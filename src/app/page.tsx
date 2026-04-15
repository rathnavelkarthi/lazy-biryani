import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RealityCheck } from "@/components/landing/RealityCheck";
import { SocialProof } from "@/components/landing/SocialProof";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const marqueeItems = [
  { text: "Bro, this actually tastes good", icon: "verified" },
  { text: "Saved me at 2 AM", icon: "nightlight" },
  { text: "Better than Swiggy", icon: "speed" },
  { text: "Mess food is officially dead", icon: "skull" },
  { text: "Hostel life upgraded", icon: "upgrade" },
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

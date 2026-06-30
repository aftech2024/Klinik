import HeroSection from "@/components/sections/HeroSection";
import QuickSection from "@/components/sections/QuickSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import BranchesSection from "@/components/sections/BranchesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTABannerSection from "@/components/sections/CTABannerSection";

// Render per-request so doctor photos always follow admin uploads (no build cache)
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickSection />
      <ServicesSection />
      <AboutSection />
      <DoctorsSection />
      <BranchesSection />
      <TestimonialsSection />
      <CTABannerSection />
    </>
  );
}

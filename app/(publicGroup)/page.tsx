import HeroSection from "./_components/HeroSection";
import PropertySection from "./_components/PropertySection";
import FeaturesSection from "./_components/FeaturesSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PropertySection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

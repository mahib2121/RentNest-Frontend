import HeroSection from "./_components/HeroSection";
import PropertySection from "./_components/PropertySection";
import FeaturesSection from "./_components/FeaturesSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <PropertySection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

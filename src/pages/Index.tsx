import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import RoundsOverview from "@/components/RoundsOverview";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <RoundsOverview />
      <Footer />
    </div>
  );
};

export default Index;

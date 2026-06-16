import { NavBar } from '@/components/marketing/NavBar';
import {
  Hero, StatsBar, PainPoints, ProductTour, HowItWorks, IntegrationsMarquee, WaitlistCTA, Footer,
} from '@/components/marketing/Sections';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen text-[#F1F5F9]" style={{ background: '#0A0A0F' }}>
      <NavBar />
      <Hero />
      <StatsBar />
      <PainPoints />
      <ProductTour />
      <HowItWorks />
      <IntegrationsMarquee />
      <WaitlistCTA />
      <Footer />
    </div>
  );
}

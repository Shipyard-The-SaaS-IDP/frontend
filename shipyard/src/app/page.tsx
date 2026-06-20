import { NavBar } from '@/components/marketing/NavBar';
import {
  Hero, InfraLayerSection, ProblemSection, AutoDiscoveryShowcase, CapabilitiesShowcase,
  IntegrationsMarquee, HowItWorks, ImpactSection, PricingSection, FinalCTA, Footer,
} from '@/components/marketing/Sections';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen" style={{ background: '#fff', color: '#6B6B6B' }}>
      <span id="top" />
      <NavBar />
      <Hero />
      <InfraLayerSection />
      <ProblemSection />
      <AutoDiscoveryShowcase />
      <CapabilitiesShowcase />
      <IntegrationsMarquee />
      <HowItWorks />
      <ImpactSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

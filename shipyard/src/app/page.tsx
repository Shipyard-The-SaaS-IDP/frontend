'use client';
import { useRef } from 'react';
import { NavBar } from '@/components/marketing/NavBar';
import {
  Hero, StatsBar, PainPoints, ProductTour, HowItWorks, IntegrationsMarquee, WaitlistCTA, Footer,
} from '@/components/marketing/Sections';

export default function LandingPage() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full min-h-screen text-[#F1F5F9]" style={{ background: '#0A0A0F' }}>
      <NavBar onJoinClick={scrollToWaitlist} />
      <Hero onJoinClick={scrollToWaitlist} />
      <StatsBar />
      <PainPoints />
      <ProductTour />
      <HowItWorks />
      <IntegrationsMarquee />
      <div ref={waitlistRef}>
        <WaitlistCTA />
      </div>
      <Footer />
    </div>
  );
}

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/public/HeroSection';
import { StatsSection } from '../components/public/StatsSection';
import { HowItWorksSection } from '../components/public/HowItWorksSection';
import { FreelancerDirectory } from '../components/public/FreelancerDirectory';
import { EventsSection } from '../components/public/EventsSection';
import { GallerySection } from '../components/public/GallerySection';
import { AboutSection } from '../components/public/AboutSection';
import { ContactSection } from '../components/public/ContactSection';
import { Footer } from '../components/public/Footer';

export const PublicView: React.FC = () => {
  const { publicSection } = useApp();

  useEffect(() => {
    if (publicSection && publicSection !== 'home') {
      const el = document.getElementById(`${publicSection}-section`) || document.getElementById(publicSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [publicSection]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FreelancerDirectory />
        <EventsSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

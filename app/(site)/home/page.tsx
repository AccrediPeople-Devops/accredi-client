"use client";

import HeroSection from "@/app/components/site/HeroSection";
import CertificationsSection from "@/app/components/site/CertificationsSection";
import OurApproachSection from "@/app/components/site/OurApproachSection";
import ModesOfTrainingSection from "@/app/components/site/ModesOfTrainingSection";
import ProfessionalTrainingSection from "@/app/components/site/ProfessionalTrainingSection";
import TestimonialsSection from "@/app/components/site/TestimonialsSection";
import ClientLogosSection from "@/app/components/site/ClientLogosSection";
import ContactCTASection from "@/app/components/site/ContactCTASection";

import GlobalLoader from "@/app/components/GlobalLoader";
import { useSimpleEnhancedLoader } from "@/app/hooks/useEnhancedGlobalLoader";
import React from "react";

export default function HomePage() {
  // Global loader state - synchronized with layout
  const { isLoading: globalLoading, setDataLoaded } = useSimpleEnhancedLoader(true, 1500);

  // Mark data as loaded when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoaded();
    }, 800);

    return () => clearTimeout(timer);
  }, [setDataLoaded]);

  if (globalLoading) {
    return <GlobalLoader isLoading={globalLoading} />;
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Mobile certifications section */}
      <div className="block md:hidden w-full py-8 px-5">
        <CertificationsSection />
      </div>

      {/* Our Approach Section */}
      <div id="our-approach">
        <OurApproachSection />
      </div>

      {/* Modes of Training */}
      <ModesOfTrainingSection />

      {/* Professional Training Section */}
      <ProfessionalTrainingSection />

      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Contact CTA */}
      <ContactCTASection />
    </div>
  );
} 


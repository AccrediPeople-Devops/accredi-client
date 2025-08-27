"use client";

import HeroSection from "@/app/components/site/HeroSection";
import CertificationsSection from "@/app/components/site/CertificationsSection";
import OurApproachSection from "@/app/components/site/OurApproachSection";
import ModesOfTrainingSection from "@/app/components/site/ModesOfTrainingSection";
import ProfessionalTrainingSection from "@/app/components/site/ProfessionalTrainingSection";
import TestimonialsSection from "@/app/components/site/TestimonialsSection";
import ClientLogosSection from "@/app/components/site/ClientLogosSection";
import ContactCTASection from "@/app/components/site/ContactCTASection";
import { 
  ScrollAnimationWrapper, 
  FadeIn, 
  SlideUp, 
  AnimatedHero 
} from "@/app/components/animations/ScrollAnimationWrapper";
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
    <div className="will-animate">
      {/* Hero Section with enhanced animation */}
      <AnimatedHero className="gpu-accelerated">
      <HeroSection />
      </AnimatedHero>

      {/* Mobile certifications section with fade-in */}
      <FadeIn className="block md:hidden w-full py-8 px-5" delay={200}>
        <CertificationsSection />
      </FadeIn>

      {/* Our Approach Section with slide-up animation */}
      <SlideUp delay={300}>
      <div id="our-approach">
        <OurApproachSection />
      </div>
      </SlideUp>

      {/* Modes of Training with staggered animation */}
      <ScrollAnimationWrapper 
        animationType="slideUp" 
        delay={400}
        duration={700}
        className="gpu-accelerated"
      >
      <ModesOfTrainingSection />
      </ScrollAnimationWrapper>

      {/* Professional Training Section */}
      <ScrollAnimationWrapper 
        animationType="fadeIn" 
        delay={500}
        duration={800}
      >
      <ProfessionalTrainingSection />
      </ScrollAnimationWrapper>

      {/* Testimonials with slide-up animation */}
      <SlideUp delay={600}>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      </SlideUp>

      {/* Contact CTA with scale-in animation */}
      <ScrollAnimationWrapper 
        animationType="scaleIn" 
        delay={700}
        duration={600}
        className="gpu-accelerated"
      >
      <ContactCTASection />
      </ScrollAnimationWrapper>
    </div>
  );
} 


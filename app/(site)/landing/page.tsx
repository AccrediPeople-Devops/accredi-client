import HeroSection from "@/app/components/site/HeroSection";
import CertificationsSection from "@/app/components/site/CertificationsSection";
import OurApproachSection from "@/app/components/site/OurApproachSection";
import ModesOfTrainingSection from "@/app/components/site/ModesOfTrainingSection";
import ProfessionalTrainingSection from "@/app/components/site/ProfessionalTrainingSection";
import TestimonialsSection from "@/app/components/site/TestimonialsSection";
import ClientLogosSection from "@/app/components/site/ClientLogosSection";
import ContactCTASection from "@/app/components/site/ContactCTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      {/* Mobile certifications section - shown only on mobile */}
      <div className="block md:hidden w-full py-8 px-5">
        <CertificationsSection />
      </div>
      <div id="our-approach">
        <OurApproachSection />
      </div>
      <ModesOfTrainingSection />
      <ProfessionalTrainingSection />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <ContactCTASection />
    </>
  );
} 


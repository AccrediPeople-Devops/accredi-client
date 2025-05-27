"use client";
import React, { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaQuoteRight, FaLinkedin } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  review: string;
  fullReview: string;
  profileImage: string;
  linkedinUrl: string;
}

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Miad Khezri",
      position: "Product Owner",
      company: "The Dufresne Group",
      review: "The more you know, the further you can go!Proud to share a happy milestone in my life. I am...",
      fullReview: "The more you know, the further you can go! Proud to share a happy milestone in my life. I am now officially a Certified Scrum Product Owner. This certification has enhanced my understanding of agile methodologies and product management principles.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    },
    {
      id: 2,
      name: "Rutu Shah",
      position: "Senior QA Analyst/QA Lead",
      company: "Tech Mahindra",
      review: "Proud to share that I am now officially a Certified ScrumMaster® (CSM®) #csm #certifiedscrummaster .Thank you Manjit Singh...",
      fullReview: "Proud to share that I am now officially a Certified ScrumMaster® (CSM®). Thank you Manjit Singh and the entire Simpliaxis team for the excellent training and support throughout my certification journey.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    },
    {
      id: 3,
      name: "Robin James",
      position: "Systems Analyst",
      company: "Department of Health",
      review: "Happy to share my Certified Scrum Product Owner® certification from SCRUM ALLIANCE®.Big thanks to Aakash Srinivasan for the Informative...",
      fullReview: "Happy to share my Certified Scrum Product Owner® certification from SCRUM ALLIANCE®. Big thanks to Aakash Srinivasan for the informative sessions and practical insights that made the learning experience exceptional.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    },
    {
      id: 4,
      name: "Francis P J",
      position: "Project Engineer",
      company: "Kinly",
      review: "I wanted to take a moment to express my sincerest gratitude for your invaluable assistance throughout my journey to complete...",
      fullReview: "I wanted to take a moment to express my sincerest gratitude for your invaluable assistance throughout my journey to complete my Scrum Master certification. The training was comprehensive and the support was outstanding.",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    },
    {
      id: 5,
      name: "Klaus Chen",
      position: "Technology Manager",
      company: "NOBAL Technologies Inc",
      review: "I am thrilled to get certified as a Scrum Product Owner. This training and certification were great to sharpen my...",
      fullReview: "I am thrilled to get certified as a Scrum Product Owner. This training and certification were great to sharpen my product management skills and understand agile frameworks better.",
      profileImage: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    },
    {
      id: 6,
      name: "Adegbemi Onakoya",
      position: "Project Manager",
      company: "KPMG Nigeria",
      review: "I am excited to share that I am now a Certified Scrum Master. I'd like to say a big thank...",
      fullReview: "I am excited to share that I am now a Certified Scrum Master. I'd like to say a big thank you to the Simpliaxis team for their excellent training program and continuous support.",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      linkedinUrl: "https://www.linkedin.com/company/simpliaxis-inc"
    }
  ];

  const itemsPerPage = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * itemsPerPage;
    return testimonials.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-4">
            OUR SUPPORT SYSTEM FOR ONLINE TRAINING
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our Learners Love Us
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}


          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentTestimonials().map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6 relative">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4">
                    <FaQuoteRight className="w-6 h-6 text-gray-300" />
                  </div>

                  {/* Review Text */}
                  <div className="mb-6 pt-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {testimonial.review}
                    </p>
                    <button className="text-[#4F46E5] text-sm font-semibold underline hover:text-[#4338CA] transition-colors">
                      Read More
                    </button>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-200 mb-4" />

                  {/* Profile Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.profileImage}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-600 text-xs truncate">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <a
                        href={testimonial.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-col items-center gap-1 text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                      >
                        <span className="text-xs underline">Read on</span>
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? 'bg-[#4F46E5]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8 pt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-300"
              disabled={currentSlide === 0}
            >
              <MdChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-300"
              disabled={currentSlide === totalSlides - 1}
            >
              <MdChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 
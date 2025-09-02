"use client";

import React from "react";

interface StructuredDataProps {
  type: "Organization" | "Course" | "WebSite" | "BreadcrumbList";
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseUrl = "https://accredipeoplecertifications.com";
    
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AccrediPeople Certifications",
          "url": baseUrl,
          "logo": `${baseUrl}/Logo/full_coverphoto_black_white.png`,
          "description": "We're committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today's competitive landscape.",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": `${baseUrl}/contact`
          },
          "sameAs": [
            "https://www.linkedin.com/company/accredi-people/"
          ]
        };

      case "Course":
        return {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": data.title || "Professional Certification Training",
          "description": data.description || "Professional certification training programs",
          "provider": {
            "@type": "Organization",
            "name": "AccrediPeople Certifications",
            "url": baseUrl
          },
          "url": `${baseUrl}/courses/${data.slug || 'pmp-certification-training'}`,
          "image": data.image ? `${baseUrl}${data.image}` : `${baseUrl}/Website Images/CoursePage/PMP Training/AdobeStock_274794823.jpeg`,
          "courseMode": ["online", "onsite", "blended"],
          "educationalLevel": "Professional",
          "inLanguage": "en-US"
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AccrediPeople Certifications",
          "url": baseUrl,
          "description": "Professional certification training provider offering PMP, Agile, and other industry-recognized certifications.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/courses?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "About Us",
                "url": `${baseUrl}/about`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "PMP® Certification Training Course",
                "url": `${baseUrl}/courses/pmp-certification-training`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Customized Corporate Training Solutions",
                "url": `${baseUrl}/business/corporate-training`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Training Discount Programs for Unemployed Professionals",
                "url": `${baseUrl}/unemployed-discount`
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": "Contact Us",
                "url": `${baseUrl}/contact`
              }
            ]
          }
        };

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
};

export default StructuredData;

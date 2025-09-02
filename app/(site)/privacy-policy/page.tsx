"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen site-bg-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl "></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#B39DDB]/10 rounded-full blur-2xl  "></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-2xl  "></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6 hover:bg-white/20 transition-all duration-300">
            <div className="w-2 h-2 bg-[#4F46E5] rounded-full "></div>
            <span className="site-text-primary text-sm font-bold uppercase tracking-wider">Legal Information</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black site-text-primary mb-4 leading-tight">
            PRIVACY POLICY
          </h1>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
            
            {/* Privacy Policy Content */}
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold site-text-primary mb-4">Privacy Policy of AccrediPeople Certifications</h2>
                <p className="site-text-secondary leading-relaxed mb-4">
                  AccrediPeople Certifications operates the www.accredipeoplecertifications.com website, which provides the SERVICE.
                </p>
                <p className="site-text-secondary leading-relaxed mb-4">
                  This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the www.accredipeoplecertifications.website.
                </p>
                <p className="site-text-secondary leading-relaxed mb-4">
                  If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
                <p className="site-text-secondary leading-relaxed mb-4">
                  The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at www.accredipeoplecertifications, unless otherwise defined in this Privacy Policy.
                </p>
                <p className="site-text-secondary leading-relaxed">
                  We take your privacy seriously and are committed to protect your right to privacy as a user of our website. We have made every effort to ensure your information is secure. This privacy policy information covers what information is collected, what we do with it, and what you can do about it. You can use this information to make your decisions about your privacy.
                </p>
              </div>

              {/* Information Collection and Use */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                  Information Collection and Use
                </h3>
                <p className="site-text-secondary leading-relaxed mb-4">
                  For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.
                </p>
                <div className="space-y-2">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    You have total control on the privacy of your information
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    Your information will never be sold, exchanged or disclosed to any third party for marketing purposes
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    You can decide whether you want to opt-in to receive offers from us
                  </p>
                </div>
              </div>

              {/* Log Data */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                  Log Data
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                  Cookies
                </h3>
                <p className="site-text-secondary leading-relaxed mb-4">
                  Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive.
                </p>
                <p className="site-text-secondary leading-relaxed">
                  Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.
                </p>
              </div>

              {/* Service Providers */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  Service Providers
                </h3>
                <p className="site-text-secondary leading-relaxed mb-4">
                  We may employ third-party companies and individuals due to the following reasons:
                </p>
                <div className="space-y-2 mb-4">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    To facilitate our Service;
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    To provide the Service on our behalf;
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    To perform Service-related services; or
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1">•</span>
                    To assist us in analysing how our Service is used.
                  </p>
                </div>
                <p className="site-text-secondary leading-relaxed">
                  We want to inform our Service users that these third parties will not have access to your Personal Information.
                </p>
              </div>

              {/* Security */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  Security
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. To provide superior online shopping experience, our shopping cart may use cookies to temporarily store name and email address. Cookies will never store credit card information as they're processed using Secure SSL using payment gateways.
                </p>
              </div>

              {/* Links to Other Sites */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                  Links to Other Sites
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </div>

              {/* Changes to This Privacy Policy */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#06B6D4] rounded-full"></div>
                  Changes to This Privacy Policy
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
                </p>
              </div>

              {/* Contact Us */}
              <div className="p-6 bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-2xl border border-[#4F46E5]/20">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                  Contact Us
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/"
            className="group/cta relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25 inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5 group-hover/cta:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
} 
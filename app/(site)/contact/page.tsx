"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const breadcrumbItems = [
    { label: "Contact" }
  ];

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-br from-[#4F46E5] to-[#3730A3] py-20 lg:py-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 left-1/4 w-40 h-40 bg-[#B39DDB]/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-[#B39DDB]/30 rounded-full blur-lg"></div>
        </div>

        <div className="relative lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={breadcrumbItems} variant="dark" />

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              We're here to help you achieve your certification goals. Get in touch with our expert training advisors.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information - Left Side */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="text-sm font-bold text-gray-600 mb-4 tracking-wider">CONTACT US</div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    Get In{" "}
                    <span className="relative inline-block text-[#4F46E5]">
                      Touch
                      <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#4F46E5]/20 -skew-x-12 -z-10"></div>
                    </span>
                  </h2>
                </div>

                {/* Contact List */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Email-Us :</h3>
                      <a href="mailto:edugenmail@email.com" className="text-[#4F46E5] hover:underline">
                        accredi@email.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us :</h3>
                      <a href="tel:+1234568900" className="text-[#4F46E5] hover:underline">
                        +123 456 8900
                      </a>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B39DDB] to-[#9C88C4] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Office :</h3>
                      <span className="text-gray-600">Mountain Green Road 2389, NY, USA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-8">
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Name*"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 placeholder-gray-500"
                        placeholder="Email*"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 placeholder-gray-500"
                      placeholder="Website Address"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 placeholder-gray-500 resize-none"
                      placeholder="Your Message*"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#4F46E5] to-[#3730A3] hover:from-[#3730A3] hover:to-[#312E81] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-96 lg:h-[500px] relative bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1635959652972!5d0"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        ></iframe>
        
        {/* Map Overlay with Contact Info */}
        <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-gray-900 mb-2">Our Location</h3>
          <p className="text-sm text-gray-600 mb-1">Mountain Green Road 2389</p>
          <p className="text-sm text-gray-600 mb-1">NY, USA</p>
          <p className="text-sm text-[#4F46E5] font-medium">+123 456 8900</p>
        </div>
      </div>
    </div>
  );
} 
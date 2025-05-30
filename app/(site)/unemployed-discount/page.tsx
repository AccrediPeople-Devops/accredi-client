"use client";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function UnemployedDiscountPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Unemployed discount form submitted:', formData);
    // Handle form submission here
  };

  const breadcrumbItems = [
    { label: "Unemployed Discount" }
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Section */}
      <div className="bg-white py-4">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-gray-200">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content - Left Side */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-6">
                Unemployed Discount
              </span>

              {/* Heading */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Unemployed Professionals - Training <br />
                <span className="text-[#4F46E5]">Discount Programs</span>.
              </h1>

              {/* Text Content */}
              <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                <p>
                  We are here to help you through your difficult times. Today, upskilling is more of a "must have" than a "nice to have."
                </p>
                
                <p>
                  A greater number of people have been furloughed during and after the pandemic. Accredi was quick to decide on its approach to supporting laid-off, furloughed, and unemployed workers through career transitions by helping professionals obtain the most current professional training.
                </p>
                
                <p>
                  We can help you in upgrading your skills. Please contact us by completing the form if you want to upskill.
                </p>
              </div>
            </div>

            {/* Form - Right Side */}
            <div className="order-1 lg:order-2">
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                      placeholder="name@address.com"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                      placeholder="Mobile"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Your Message.."
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4F46E5] to-[#3730A3] hover:from-[#3730A3] hover:to-[#312E81] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
} 
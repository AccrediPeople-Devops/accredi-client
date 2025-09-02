"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import siteCourseService from "@/app/components/site/siteCourse.service";
import Head from "next/head";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    company: "",
    course: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await siteCourseService.getPublicCourses();

        let coursesData = [];
        if (response && response.courses && Array.isArray(response.courses)) {
          coursesData = response.courses;
        } else if (Array.isArray(response)) {
          coursesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          coursesData = response.data;
        }

        // Extract course titles for the dropdown
        const courseTitles = coursesData
          .map((course: any) => course.title)
          .sort();
        setCourses([...courseTitles, "Other"]); // Add 'Other' as the last option
      } catch (error) {
        // Fallback to static courses if API fails
        setCourses([
          "Project Management (PMP)",
          "Agile & Scrum",
          "Data Science & Analytics",
          "Cloud Computing (AWS/Azure)",
          "Cybersecurity",
          "Digital Marketing",
          "IT Service Management",
          "Business Analysis",
          "Quality Management",
          "Other",
        ]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Split full name into first and last name
      const nameParts = formData.firstName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        firstName,
        lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || "+1-000-000-0000", // Default if not provided
        country: formData.country || "United States", // Default if not provided
        city: formData.city || "Unknown", // Default if not provided
        resume: {
          _id: "64f9a1b2c3d4e5f678901234",
          path: "/uploads/contact-form-submission.png",
          key: "contact-form-submission.png",
        },
        message: `Course of Interest: ${
          formData.course || "Not specified"
        }\nCompany: ${formData.company || "Not specified"}\n\nMessage: ${
          formData.message
        }`,
      };

      const response = await fetch(
        "https://api.accredipeoplecertifications.com/api/form/become-instructor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setSubmitted(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          country: "",
          city: "",
          company: "",
          course: "",
          message: "",
        });
      }, 5000);
    } catch (error) {
      setError(
        "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [{ label: "Contact" }];

  return (
    <>
      <Head>
        <title>Contact Us - AccrediPeople Certifications</title>
        <meta name="description" content="Get in touch with AccrediPeople Certifications. Contact our team for course inquiries, corporate training solutions, and professional certification guidance." />
        <meta name="keywords" content="contact us, course inquiry, corporate training, certification guidance, customer support, AccrediPeople contact" />
        <meta property="og:title" content="Contact Us - AccrediPeople Certifications" />
        <meta property="og:description" content="Get in touch with AccrediPeople Certifications. Contact our team for course inquiries, corporate training solutions, and professional certification guidance." />
        <meta property="og:url" content="https://accredipeoplecertifications.com/contact" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl "></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl  "></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl  "></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
              <div className="w-3 h-3 bg-[#10B981] rounded-full "></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">
                Get In Touch
              </span>
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full  "></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Need Help? </span>
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Just Ask.
              </span>
            </h1>

            <p className="text-xl site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              We're here to listen and support. Drop us a line, and we'll get
              back to you as soon as we can.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 h-full">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="text-emerald-400 site-light:text-emerald-600 text-sm font-bold">
                      📞 CONTACT INFO
                    </span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-6 leading-tight site-text-primary">
                    Let's Start Your
                    <span className="block bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                      Success Journey
                    </span>
                  </h3>
                  <p className="site-text-secondary text-lg leading-relaxed mb-8">
                    Our expert advisors are ready to help you choose the right
                    certification path and answer all your questions about our
                    training programs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold site-text-primary mb-1">
                        Email Support
                      </h4>
                      <a
                        href="mailto:Support@accredipeoplecertifications.com"
                        className="text-indigo-400 site-light:text-indigo-600 hover:underline text-lg break-all"
                      >
                        Support@accredipeoplecertifications.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">
                        Phone Support
                      </h4>
                      <a
                        href="tel:+12534008265"
                        className="text-emerald-400 site-light:text-emerald-600 hover:underline text-lg"
                      >
                        +1 253-400-8265
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0077B5] to-[#005885] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">
                        Follow Us
                      </h4>
                      <a
                        href="https://www.linkedin.com/company/accredi-people/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 site-light:text-blue-600 hover:underline text-lg"
                      >
                        LinkedIn Company Page
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">
                        Office Address
                      </h4>
                      <p className="site-text-secondary">
                        1309 Coffeen Avenue STE 1200
                      </p>
                      <p className="site-text-secondary">
                        Sheridan, Wyoming 82801
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t site-border">
                  <div className="text-center">
                    <h5 className="font-bold site-text-primary mb-2">
                      Business Hours
                    </h5>
                    <p className="site-text-secondary text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                    </p>
                    <p className="site-text-secondary text-sm">
                      Saturday: Closed | Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="text-indigo-400 site-light:text-indigo-600 text-sm font-bold">
                      📝 GET STARTED
                    </span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-tight site-text-primary">
                    Send Us a Message
                  </h3>
                  <p className="site-text-secondary text-lg">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 site-light:text-red-600 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold site-text-primary mb-4">
                      Message Sent Successfully!
                    </h4>
                    <p className="site-text-secondary">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Phone number (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Company name (optional)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Your country (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Your city (optional)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">
                        Course of Interest
                      </label>
                      <div className="relative">
                        <select
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary appearance-none bg-transparent"
                          disabled={isLoadingCourses}
                        >
                          {isLoadingCourses ? (
                            <option value="">Loading courses...</option>
                          ) : (
                            <>
                              <option value="">Select a course</option>
                              {courses.map((course, index) => (
                                <option
                                  key={index}
                                  value={course}
                                  className="bg-slate-800 site-light:bg-white"
                                >
                                  {course}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg
                            className="w-5 h-5 site-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60 resize-none"
                        placeholder="Tell us about your certification goals and any specific questions you have..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span>Send Message</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 lg:h-[500px] relative overflow-hidden">
        <iframe
          title="Office Location Map - Accredi People Certifications"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2947.7344528834895!2d-106.95516948454814!3d44.79767847909863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5335fae5c8cd8637%3A0x7d2a5d50f8bc8e5c!2s1309%20Coffeen%20Ave%20%23%201200%2C%20Sheridan%2C%20WY%2082801%2C%20USA!5e0!3m2!1sen!2s!4v1672742123456!5d0"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 site-light:grayscale-0 grayscale"
        ></iframe>
      </section>
      </div>
    </>
  );
}

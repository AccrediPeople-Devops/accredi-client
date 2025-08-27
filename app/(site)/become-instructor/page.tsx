"use client";
import React, { useState } from "react";
import { becomeInstructorService, BecomeInstructorFormData } from "@/app/components/service/becomeInstructor.service";

export default function BecomeInstructorPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    country: "",
    cv: null as File | null,
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Allow only numbers, +, and limit to 15 characters
      const numericValue = value.replace(/[^0-9+]/g, "").slice(0, 15);
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
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    
    // Clear status messages when user modifies form
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Define allowed file types
      const allowedTypes = [
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-excel', // XLS
        'image/jpeg', // JPEG
        'image/jpg', // JPG
        'image/png', // PNG
        'image/gif', // GIF
        'image/webp' // WebP
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(["Please upload a valid file type: PDF, DOC, DOCX, Excel, or image files (JPEG, PNG, GIF, WebP)."]);
        e.target.value = "";
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors(["File size must be less than 10MB."]);
        e.target.value = "";
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
    
    // Clear validation errors when valid file is selected
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    
    // Clear status messages
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Validate form data first
      const validation = becomeInstructorService.validateFormData(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          country: formData.country,
          city: formData.city,
          message: formData.message
        },
        formData.cv || undefined
      );

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setSubmitStatus({
          type: "error",
          message: "Please correct the errors below and try again."
        });
        return;
      }

      // Upload resume first
      let resumeData = null;
      if (formData.cv) {
        setIsUploadingResume(true);
        console.log('BecomeInstructorPage: Starting resume upload for file:', formData.cv.name);
        console.log('BecomeInstructorPage: File details:', {
          name: formData.cv.name,
          size: formData.cv.size,
          type: formData.cv.type
        });
        
        try {
          const uploadResponse = await becomeInstructorService.uploadResume(formData.cv);
          console.log('BecomeInstructorPage: Upload response:', uploadResponse);
          
          if (!uploadResponse.success) {
            console.error('BecomeInstructorPage: Upload failed:', uploadResponse.message);
            setSubmitStatus({
              type: "error",
              message: uploadResponse.message
            });
            return;
          }
          
          resumeData = {
            _id: uploadResponse.data._id || "",
            path: uploadResponse.data.path,
            key: uploadResponse.data.key
          };
          
          console.log('BecomeInstructorPage: Formatted resume data:', resumeData);
        } catch (uploadError) {
          console.error('BecomeInstructorPage: Upload error caught:', uploadError);
          setSubmitStatus({
            type: "error",
            message: "Upload failed unexpectedly. Please try again."
          });
          return;
        } finally {
          setIsUploadingResume(false);
        }
      } else {
        // If no file is uploaded, show error
        setSubmitStatus({
          type: "error",
          message: "Please upload a resume file."
        });
        return;
      }

      // Prepare data for API submission
      const apiFormData: BecomeInstructorFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        resume: resumeData,
        message: formData.message.trim()
      };

      console.log('BecomeInstructorPage: Submitting form data:', apiFormData);

      // Submit form data
      const response = await becomeInstructorService.submitBecomeInstructorForm(apiFormData);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: response.message
        });
        
        // Reset form on successful submission
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          city: "",
          country: "",
          cv: null,
          message: ""
        });
        
        // Reset file input
        const fileInput = document.getElementById("cv") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        // Scroll to success message
        setTimeout(() => {
          const element = document.getElementById("form-status");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      } else {
        setSubmitStatus({
          type: "error",
          message: response.message
        });
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingResume(false);
    }
  };

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-22 overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Join Our Team</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
              <span className="site-text-primary">Become An </span>
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                Instructor
              </span>
            </h1>
            <p className="text-xl site-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
              <span className="font-bold">Ready to Share Your Expertise? Join Our Team!</span><br/>
              <span>Fill out the form below to get started.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#EF4444]/5 site-light:bg-[#EF4444]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            
            {/* Status Messages */}
            <div id="form-status">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mb-6 p-6 bg-gradient-to-r from-[#EF4444]/20 to-[#DC2626]/20 border border-[#EF4444]/30 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#EF4444] text-lg mb-2">Please correct the following errors:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-sm site-text-secondary">{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {submitStatus.type === 'success' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#10B981] text-lg">Application Submitted Successfully!</h3>
                      <p className="site-text-secondary">{submitStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus.type === 'error' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-[#EF4444]/20 to-[#DC2626]/20 border border-[#EF4444]/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EF4444] text-lg">Submission Failed</h3>
                      <p className="site-text-secondary">{submitStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold site-text-primary">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold site-text-primary mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold site-text-primary mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold site-text-primary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold site-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-bold site-text-primary mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-bold site-text-primary mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold site-text-primary">Professional Information</h3>
                </div>

                <div>
                  <label htmlFor="cv" className="block text-sm font-bold site-text-primary mb-2">
                    Resume/CV *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4F46E5] file:text-white hover:file:bg-[#7C3AED] file:transition-colors"
                      required
                    />
                  </div>
                  <p className="text-xs site-text-muted mt-2">
                    Accepted formats: PDF, DOC, DOCX, Excel, or image files (JPEG, PNG, GIF, WebP). Maximum file size: 10MB
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold site-text-primary">Tell Us About Yourself</h3>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold site-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                    placeholder="Tell us about your experience, expertise, and why you want to become an instructor with us..."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingResume}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                >
                  {isUploadingResume ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading Resume...
                    </span>
                  ) : isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Application...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Application
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Info Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold site-text-primary mb-2">Quick Response</h4>
                  <p className="text-sm site-text-secondary">We'll review your application within 48 hours</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold site-text-primary mb-2">Global Community</h4>
                  <p className="text-sm site-text-secondary">Join 500+ expert instructors worldwide</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold site-text-primary mb-2">Impact Lives</h4>
                  <p className="text-sm site-text-secondary">Help professionals advance their careers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
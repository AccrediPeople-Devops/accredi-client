"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import siteCourseService from "@/app/components/site/siteCourse.service";
import config from "@/app/components/config/config";
import { Course } from "@/app/types/course";
import paymentService from "@/app/components/service/payment.service";
import couponCodeService from "@/app/components/service/couponCode.service";
import { useLocation } from "@/app/context/LocationContext";

import GlobalLoader from "@/app/components/GlobalLoader";
import { useSimpleEnhancedLoader } from "@/app/hooks/useEnhancedGlobalLoader";

// Simple function to format ISO date string to DD/MM/YYYY
const formatDateString = (isoDateString: string): string => {
  try {
    // Extract just the date part (YYYY-MM-DD) from ISO string
    const datePart = isoDateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    return isoDateString; // Return original if formatting fails
  }
};

// Function to check if a date is in the future
const isDateInFuture = (isoDateString: string): boolean => {
  try {
    const scheduleDate = new Date(isoDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    scheduleDate.setHours(0, 0, 0, 0); // Set to beginning of schedule date
    return scheduleDate >= today;
  } catch (error) {
    return false; // If date parsing fails, consider it invalid
  }
};

function CourseEnrollmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get course slug and schedule ID from URL parameters
  const courseSlug = searchParams.get('course');
  const scheduleId = searchParams.get('schedule');
  const mode = searchParams.get('mode') || 'live-online';

  // Course data state
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Global loader state - synchronized with layout
  const { isLoading: globalLoading, setDataLoaded } = useSimpleEnhancedLoader(true, 800);

  // Location context for currency handling
  const {
    currentCountry,
    formatPrice,
    getCurrentCurrencyCode,
  } = useLocation();

  // Schedule-related state
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [scheduleQuantities, setScheduleQuantities] = useState<{ [key: string]: number }>({});
  
  // Enrollment form state
  const [enrollFormData, setEnrollFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    country: "United States",
    city: "",
    couponCode: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Error dialog state
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  // Validation state - only show validation after first attempt
  const [showValidation, setShowValidation] = useState(false);

  // Fetch course data and find the selected schedule
  useEffect(() => {
    const fetchCourseAndSchedule = async () => {
      if (!courseSlug) {
        setError("Course not specified");
        setIsLoading(false);
        setDataLoaded();
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await siteCourseService.getPublicCourseBySlug(courseSlug);

        if (response.status && response.course) {
          setCourse(response.course);
          
          // Find the selected schedule
          if (scheduleId && response.course.schedules) {
            const schedule = response.course.schedules.find((s: any) => s.id === scheduleId || s._id === scheduleId);
            if (schedule) {
              // Check if the schedule is in the future (except for self-paced courses)
              if (schedule.scheduleType !== "self-paced" && schedule.startDate && !isDateInFuture(schedule.startDate)) {
                setError("The selected schedule has already passed. Please select a future schedule.");
                setIsLoading(false);
                setDataLoaded();
                return;
              }
              // Process schedule data to add earlyBirdPrice like in the original modal
              const processedSchedule = {
                ...schedule,
                standardPrice: schedule.standardPrice || 0,
                offerPrice: schedule.offerPrice || 0,
                earlyBirdPrice: schedule.offerPrice || schedule.standardPrice || 0,
                mode: schedule.scheduleType === "classroom"
                  ? "Classroom Training"
                  : schedule.scheduleType === "self-paced"
                  ? "Self-Paced Learning"
                  : "Live Online Training",
                dates: schedule.startDate && schedule.endDate 
                  ? [formatDateString(schedule.startDate), formatDateString(schedule.endDate)]
                  : [],
                accessDays: schedule.accessDays || 365
              };
              
              setSelectedSchedule(processedSchedule);
              // Initialize quantity for this schedule
              setScheduleQuantities(prev => ({
                ...prev,
                [schedule.id || schedule._id]: 1
              }));
            } else {
              setError("Selected schedule not found");
            }
          } else {
            setError("Schedule not specified");
          }
          
          // Add a small delay to prevent flash
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mark data as loaded
          setDataLoaded();
          
        } else {
          setError("Course not found");
          setDataLoaded();
        }
      } catch (err: any) {
        setError("Failed to load course data");
        setDataLoaded();
      } finally {
        setIsLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourseAndSchedule();
    }
  }, [courseSlug, scheduleId, setDataLoaded]);

  // Helper function to get course image URL
  const getCourseImageUrl = (course: Course) => {
    if (course.upload?.courseImage?.[0]) {
      // First check if we have a complete URL (like Pinterest URLs)
      if (course.upload.courseImage[0].path?.startsWith("http")) {
        return course.upload.courseImage[0].path;
      }
      // First check if we have a complete URL
      if (course.upload.courseImage[0].url) {
        return course.upload.courseImage[0].url;
      }
      // Then check if we have a path that needs the imageUrl prefixed
      if (course.upload.courseImage[0].path) {
        return `${config.imageUrl}${course.upload.courseImage[0].path}`;
      }
      // Then try the key property with imageUrl base
      if (course.upload.courseImage[0].key) {
        return `${config.imageUrl}${course.upload.courseImage[0].key}`;
      }
    }
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  };

  // Helper function to get category name
  const getCategoryName = (course: Course) => {
    if (
      course.categoryId &&
      typeof course.categoryId === "object" &&
      "name" in course.categoryId
    ) {
      return (course.categoryId as any).name;
    }
    return "Professional Certification";
  };

  // Enrollment form handlers
  const handleEnrollInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setEnrollFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setEnrollFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validation function for enrollment form (excluding coupon)
  const isEnrollFormValid = () => {
    const { fullName, email, contactNumber, country, city } = enrollFormData;

    // Check if all required fields are filled (coupon is optional)
    const requiredFieldsFilled =
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      contactNumber.trim() !== "" &&
      country.trim() !== "" &&
      city.trim() !== "";

    // Check email format
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Check phone number length
    const isPhoneValid = contactNumber.length >= 10;

    return requiredFieldsFilled && isEmailValid && isPhoneValid;
  };

  const handleApplyCoupon = async () => {
    // Check if schedule is selected
    if (!selectedSchedule?._id && !selectedSchedule?.id) {
      setCouponError("No schedule selected");
      return;
    }

    // Check if coupon code is entered
    if (!enrollFormData.couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const couponResponse = await couponCodeService.verifyCoupon(
        enrollFormData.couponCode,
        selectedSchedule._id || selectedSchedule.id
      );

      if (couponResponse.status && couponResponse.discountPrice) {
        setAppliedCoupon({
          code: enrollFormData.couponCode,
          discountPrice: couponResponse.discountPrice,
          type: "fixed",
        });
        setCouponError("");

      } else {
        setCouponError(couponResponse.message || "Invalid coupon code");
      }
    } catch (error: any) {
      setCouponError(
        error.response?.data?.message || "Failed to apply coupon code"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePayment = async (paymentType: "stripe" | "paypal" = "stripe") => {
    try {
      // Check if form is valid first
      if (!isEnrollFormValid()) {
        // Show validation if form is invalid
        setShowValidation(true);
        return;
      }

      const paymentCurrency = getCurrentCurrencyCode().toLowerCase();
      const totalAmount = calculateTotal();

      const paymentData = {
        type: paymentType,
        shedule_id: selectedSchedule.id || selectedSchedule._id,
        couponCode: enrollFormData.couponCode || "",
        currency: paymentCurrency,
        amount: totalAmount,
        userId: "680fc19e638ed8389d944000", // You may want to get this dynamically
        // Additional form data
        fullName: enrollFormData.fullName,
        email: enrollFormData.email,
        contactNumber: enrollFormData.contactNumber,
        country: enrollFormData.country,
        city: enrollFormData.city,
        // Location data for analytics
        userCountry: currentCountry?.name || "Unknown",
        userCity: "Unknown", // This would need to be handled separately if needed
        selectedCurrency: getCurrentCurrencyCode(),
      };

      const response = await paymentService.getStripeCheckoutSession(paymentData);

      if (response.status) {
        // Handle successful payment
        window.location.href = response?.data?.sessionUrl;
      } else {
        // Handle specific error cases
        const errorMessage = response.data.message || "Payment failed";

        // Check if user already purchased the course
        if (
          errorMessage.toLowerCase().includes("already purchased") ||
          errorMessage.toLowerCase().includes("already enrolled") ||
          response.status === "error"
        ) {
          setErrorDialogMessage(errorMessage);
          setShowErrorDialog(true);
        } else {
          // Show dialog for any other error
          setErrorDialogMessage(errorMessage);
          setShowErrorDialog(true);
        }
      }
    } catch (error: any) {
      // Check if it's an "already purchased" error
      if (error.response?.data?.message?.toLowerCase().includes("already purchased")) {
        setErrorDialogMessage(error.response.data.message);
      } else {
        setErrorDialogMessage(
          error.response?.data?.message || "Payment processing failed"
        );
      }
      setShowErrorDialog(true);
    }
  };

  // Calculate total for payment (same amount regardless of currency)
  // This should always use the base price - the backend will handle coupon validation
  // The Apply button is only for UI display, not for payment calculation
  const calculateTotal = () => {
    if (!selectedSchedule) return 0;

    const quantity = scheduleQuantities[selectedSchedule.id || selectedSchedule._id] || 1;
    const basePrice = selectedSchedule.earlyBirdPrice * quantity;

    // Payment calculation - always using base price
    // Coupon code will be handled by backend

    // Always return base price - backend handles coupon validation
    return basePrice;
  };

  // For UI Display - show discounted price
  const calculateDisplayTotal = () => {
    if (!selectedSchedule) return 0;

    const quantity = scheduleQuantities[selectedSchedule.id || selectedSchedule._id] || 1;
    const basePrice = selectedSchedule.earlyBirdPrice * quantity;

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        return basePrice - (basePrice * appliedCoupon.discount) / 100;
      } else {
        // Use discountPrice for fixed amount coupons
        return basePrice - (appliedCoupon.discountPrice || appliedCoupon.discount || 0);
      }
    }

    return basePrice;
  };

  // Get original price for display
  const getOriginalPrice = () => {
    if (!selectedSchedule) return 0;
    const quantity = scheduleQuantities[selectedSchedule.id || selectedSchedule._id] || 1;
    return selectedSchedule.earlyBirdPrice * quantity;
  };

  // Get discount amount for display
  const getDiscountAmount = () => {
    if (!appliedCoupon || !selectedSchedule) return 0;

    const quantity = scheduleQuantities[selectedSchedule.id || selectedSchedule._id] || 1;
    const basePrice = selectedSchedule.earlyBirdPrice * quantity;

    if (appliedCoupon.type === "percentage") {
      return (basePrice * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discountPrice || appliedCoupon.discount || 0;
    }
  };

  // Show loading state
  if (globalLoading || isLoading) {
    return <GlobalLoader isLoading={globalLoading || isLoading} />;
  }

  // Show error state
  if (error || !course || !selectedSchedule) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center p-4">
        <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border site-border p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#EF4444]/25">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold site-text-primary mb-4">
            Enrollment Error
          </h3>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
            <p className="text-red-500 text-sm font-medium">
              {error || "Course or schedule not found"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/courses"
              className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 text-center"
            >
              Browse Courses
            </Link>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/20 transition-all duration-300 font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen site-section-bg">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/20 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Course
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4F46E5]/25">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold site-text-primary mb-2">
              Course Enrollment
            </h1>
            <p className="text-lg site-text-secondary">
              Complete your enrollment for {course.title}
            </p>
          </div>

          {/* Main Content */}
          <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-6xl mx-auto shadow-2xl border site-border">
            {/* Content */}
            <div className="p-4 sm:p-8 space-y-8">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Course Summary */}
                <div className="space-y-6">
                  {/* Course Summary */}
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
                    <h4 className="text-xl font-semibold site-text-primary mb-6">
                      Course Summary
                    </h4>
                    
                    {/* Course Image */}
                    <div className="mb-6">
                      <Image
                        src={getCourseImageUrl(course)}
                        alt={course.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="site-text-secondary text-sm">
                          Course:
                        </span>
                        <span className="site-text-primary font-medium text-sm text-right flex-1 ml-2">
                          {course.title}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="site-text-secondary text-sm">
                          Category:
                        </span>
                        <span className="site-text-primary font-medium text-sm">
                          {getCategoryName(course)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="site-text-secondary text-sm">
                          Mode:
                        </span>
                        <span className="site-text-primary font-medium text-sm">
                          {selectedSchedule.mode}
                        </span>
                      </div>
                      
                      {mode === "live-online" || mode === "classroom" ? (
                        <>
                          <div className="flex justify-between items-start">
                            <span className="site-text-secondary text-sm">
                              Dates:
                            </span>
                            <span className="site-text-primary font-medium text-sm text-right flex-1 ml-2">
                              {selectedSchedule.dates?.join(" - ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="site-text-secondary text-sm">
                              Participants:
                            </span>
                            <span className="site-text-primary font-medium text-sm">
                              {scheduleQuantities[selectedSchedule.id || selectedSchedule._id] || 1}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="site-text-secondary text-sm">
                            Access:
                          </span>
                          <span className="site-text-primary font-medium text-sm">
                            {selectedSchedule.accessDays} Days
                          </span>
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="border-t site-border pt-4 mt-6 space-y-3">
                        <div className="flex justify-between">
                          <span className="site-text-secondary text-sm">
                            Original Price:
                          </span>
                          <span className="site-text-primary font-medium text-sm">
                            {formatPrice(getOriginalPrice())}
                          </span>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between">
                            <span className="site-text-secondary text-sm">
                              Discount ({appliedCoupon.code}):
                            </span>
                            <span className="text-green-500 font-medium text-sm">
                              -{formatPrice(getDiscountAmount())}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between font-bold text-xl border-t site-border pt-3">
                          <span className="site-text-primary">Total:</span>
                          <span
                            className={`${
                              appliedCoupon
                                ? "text-green-500"
                                : "bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent"
                            }`}
                          >
                            {formatPrice(calculateDisplayTotal())}
                          </span>
                        </div>

                        {appliedCoupon && (
                          <div className="text-sm site-text-muted text-center">
                            You save {formatPrice(getDiscountAmount())}!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Enrollment Form */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#4F46E5]/25">
                        1
                      </div>
                      <h4 className="text-xl font-semibold site-text-primary">
                        Personal Information
                      </h4>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium site-text-primary mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={enrollFormData.fullName}
                          onChange={handleEnrollInputChange}
                          className={`w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                            showValidation &&
                            enrollFormData.fullName.trim() === ""
                              ? "border-red-300 focus:ring-red-500"
                              : "site-border focus:ring-[#4F46E5]"
                          }`}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium site-text-primary mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={enrollFormData.email}
                          onChange={handleEnrollInputChange}
                          className={`w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                            showValidation &&
                            (enrollFormData.email.trim() === "" ||
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                enrollFormData.email
                              ))
                              ? "border-red-300 focus:ring-red-500"
                              : "site-border focus:ring-[#4F46E5]"
                          }`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium site-text-primary mb-2">
                            Contact Number *
                          </label>
                          <input
                            type="tel"
                            name="contactNumber"
                            value={enrollFormData.contactNumber}
                            onChange={handleEnrollInputChange}
                            className={`w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                              showValidation &&
                              (enrollFormData.contactNumber.trim() === "" ||
                                enrollFormData.contactNumber.length < 10)
                                ? "border-red-300 focus:ring-red-500"
                                : "site-border focus:ring-[#4F46E5]"
                            }`}
                            placeholder="Enter your contact number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium site-text-primary mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={enrollFormData.country}
                            onChange={handleEnrollInputChange}
                            className={`w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                              showValidation &&
                              enrollFormData.country.trim() === ""
                                ? "border-red-300 focus:ring-red-500"
                                : "site-border focus:ring-[#4F46E5]"
                            }`}
                            placeholder="Country"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium site-text-primary mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={enrollFormData.city}
                          onChange={handleEnrollInputChange}
                          className={`w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                            showValidation && enrollFormData.city.trim() === ""
                              ? "border-red-300 focus:ring-red-500"
                              : "site-border focus:ring-[#4F46E5]"
                          }`}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#10B981]/25">
                        2
                      </div>
                      <h4 className="text-xl font-semibold site-text-primary">
                        Coupon Code
                      </h4>
                      <span className="text-sm text-blue-400 font-medium">
                        (Optional)
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="couponCode"
                        value={enrollFormData.couponCode}
                        onChange={handleEnrollInputChange}
                        disabled={couponLoading}
                        className={`flex-1 px-4 py-3 site-glass backdrop-blur-sm rounded-xl border site-text-primary placeholder:site-text-muted focus:ring-2 focus:border-transparent transition-all duration-300 ${
                          couponError
                            ? "border-red-300 focus:ring-red-500"
                            : "site-border focus:ring-[#10B981]"
                        } ${
                          couponLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter coupon code"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={
                          couponLoading || !enrollFormData.couponCode.trim()
                        }
                        className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                          couponLoading || !enrollFormData.couponCode.trim()
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-br from-[#10B981] to-[#059669] text-white hover:shadow-lg hover:shadow-[#10B981]/25"
                        }`}
                      >
                        {couponLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>

                    {/* Error Message */}
                    {couponError && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <span className="text-red-400 font-medium text-sm">
                            {couponError}
                          </span>
                        </div>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
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
                            <span className="text-green-400 font-medium text-sm">
                              Coupon "{appliedCoupon.code}" applied! Discount:{" "}
                              {formatPrice(
                                appliedCoupon.discountPrice ||
                                  appliedCoupon.discount ||
                                  0
                              )}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setAppliedCoupon(null);
                              setCouponError("");
                            }}
                            className="text-green-400 hover:text-green-300 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Buttons - Full Width */}
              <div className="border-t site-border pt-8">
                <div className="space-y-4">
                  {/* Payment Method Header */}
                  <div className="text-center mb-8">
                    <h5 className="text-2xl font-semibold site-text-primary mb-2">
                      Choose Payment Method
                    </h5>
                    <p className="text-lg site-text-secondary">
                      Select your preferred payment option
                    </p>
                  </div>

                  {/* Stripe Payment Button */}
                  <button
                    onClick={() => handlePayment("stripe")}
                    disabled={!isEnrollFormValid()}
                    className={`w-full group px-8 py-6 font-bold rounded-2xl transition-all duration-300 transform ${
                      isEnrollFormValid()
                        ? "bg-gradient-to-r from-[#635BFF] to-[#5A54CC] hover:from-[#5A54CC] hover:to-[#514A99] text-white hover:scale-105 hover:shadow-xl hover:shadow-[#635BFF]/25"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-4">
                      <svg
                        className={`w-8 h-8 transition-transform duration-300 ${
                          isEnrollFormValid() ? "group-hover:scale-110" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                      </svg>
                      <span className="text-xl">
                        {isEnrollFormValid()
                          ? `Pay with Stripe - ${formatPrice(
                              calculateDisplayTotal()
                            )}`
                          : "Complete Required Fields to Continue"}
                      </span>
                    </span>
                  </button>

                  {/* PayPal Payment Button */}
                  <button
                    onClick={() => handlePayment("paypal")}
                    disabled={!isEnrollFormValid()}
                    className={`w-full group px-8 py-6 font-bold rounded-2xl transition-all duration-300 transform ${
                      isEnrollFormValid()
                        ? "bg-gradient-to-r from-[#0070BA] to-[#003087] hover:from-[#003087] hover:to-[#001C64] text-white hover:scale-105 hover:shadow-xl hover:shadow-[#0070BA]/25"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-4">
                      <svg
                        className={`w-8 h-8 transition-transform duration-300 ${
                          isEnrollFormValid() ? "group-hover:scale-110" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.438-.298c-.18-.1-.404-.16-.65-.16h-2.134c-.524 0-.968.382-1.05.9l-.72 4.57c-.08.518.254.9.777.9h1.357c3.005 0 5.32-1.23 5.997-4.787.677-3.558-.677-5.125-2.139-5.125z" />
                      </svg>
                      <span className="text-xl">
                        {isEnrollFormValid()
                          ? `Pay with PayPal - ${formatPrice(
                              calculateDisplayTotal()
                            )}`
                          : "Complete Required Fields to Continue"}
                      </span>
                    </span>
                  </button>

                  {/* Form Validation Message */}
                  {showValidation && !isEnrollFormValid() && (
                    <div className="mt-6 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <div>
                          <p className="text-yellow-500 text-lg font-medium mb-2">
                            Please complete all required fields:
                          </p>
                          <ul className="text-yellow-400 text-sm space-y-1">
                            {enrollFormData.fullName.trim() === "" && (
                              <li>• Full Name is required</li>
                            )}
                            {(enrollFormData.email.trim() === "" ||
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                enrollFormData.email
                              )) && <li>• Valid Email Address is required</li>}
                            {(enrollFormData.contactNumber.trim() === "" ||
                              enrollFormData.contactNumber.length < 10) && (
                              <li>
                                • Contact Number (minimum 10 digits) is required
                              </li>
                            )}
                            {enrollFormData.country.trim() === "" && (
                              <li>• Country is required</li>
                            )}
                            {enrollFormData.city.trim() === "" && (
                              <li>• City is required</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm site-text-muted text-center mt-8">
                  By enrolling, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border site-border">
            {/* Modal Header */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#EF4444]/25">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold site-text-primary mb-4">
                Enrollment Error
              </h3>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                <p className="text-red-500 text-sm font-medium">
                  {errorDialogMessage}
                </p>
              </div>

              {errorDialogMessage
                .toLowerCase()
                .includes("already purchased") && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="font-semibold site-text-primary mb-2">
                    Good News!
                  </h4>
                  <p className="site-text-secondary text-sm">
                    You already have access to this course. Check your dashboard
                    to access your learning materials.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowErrorDialog(false)}
                  className="flex-1 px-6 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/20 transition-all duration-300 font-semibold"
                >
                  Close
                </button>

                {errorDialogMessage
                  .toLowerCase()
                  .includes("already purchased") && (
                  <Link
                    href="/user-dashboard"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 text-center"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseEnrollmentPage() {
  return (
    <Suspense fallback={<GlobalLoader isLoading={true} />}>
      <CourseEnrollmentContent />
    </Suspense>
  );
}

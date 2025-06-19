"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import siteCourseService from "@/app/components/site/siteCourse.service";
import config from "@/app/components/config/config";
import { Course } from "@/app/types/course";
import paymentService from "@/app/components/service/payment.service";
import { useLocation } from "@/app/context/LocationContext";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const unwrappedParams = use(params);
  const courseSlug = unwrappedParams.slug;

  // Course data state
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Location context for currency handling
  const { 
    currentCountry, 
    geolocationLoading, 
    formatPrice, 
    getCurrentCurrencyCode 
  } = useLocation();

  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureFormData, setBrochureFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Schedule-related state
  const [selectedMode, setSelectedMode] = useState("live-online");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollFormData, setEnrollFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    country: "United States",
    city: "",
    couponCode: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Error dialog state
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  // Note: Location data is now handled by LocationContext

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError("");

      try {
        console.log("Fetching course with slug:", courseSlug);
        const response = await siteCourseService.getPublicCourseBySlug(courseSlug);

        if (response.status && response.course) {
          setCourse(response.course);
          console.log("Course data loaded:", response.course);
          console.log("Course schedules:", response.course.schedules);
          console.log("Course FAQ:", response.course.faqId);
        } else {
          setError("Course not found");
        }
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="site-text-primary text-lg">Loading course...</p>
          {geolocationLoading && (
            <p className="site-text-secondary text-sm">
              Loading location data...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold site-text-primary mb-4">
            Course Not Found
          </h2>
          <p className="site-text-secondary mb-6">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Link
            href="/courses"
            className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic course data from API
  const courseData = {
    category: getCategoryName(course).toUpperCase(),
    title: course.title,
    description:
      course.shortDescription ||
      course.description ||
      "Professional certification course",
    image: getCourseImageUrl(course),
    features: course.keyFeatures || [],
    authorizedPartner: "Authorized Training Partner",
  };

  const breadcrumbItems = [
    { label: "Courses", href: "/courses" },
    { label: course.title },
  ];

  const handleBrochureInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setBrochureFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setBrochureFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Brochure download requested:", brochureFormData);
    
    try {
      // Check if course has a brochure file
      if (course && course.broucher && course.broucher.length > 0) {
        const brochureFile = course.broucher[0];
        const brochureUrl = brochureFile.url || `${config.imageUrl}${brochureFile.path}`;
        
        try {
          // Try to fetch with CORS handling first
          const response = await fetch(brochureUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
          });
          
          if (response.ok) {
            const blob = await response.blob();
            
            // Create a blob URL and download link
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${course.title}-Brochure.pdf`;
            link.style.display = 'none';
            
            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
            
            console.log("Brochure downloaded via fetch:", brochureUrl);
          } else {
            throw new Error('Fetch failed');
          }
        } catch (fetchError) {
          console.warn("Fetch failed, using direct download method:", fetchError);
          
          // Fallback: Direct download with download attribute
          const link = document.createElement('a');
          link.href = brochureUrl;
          link.download = `${course.title}-Brochure.pdf`;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';
          
          // Add to DOM, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log("Brochure downloaded via direct link:", brochureUrl);
        }
      } else {
        // Fallback: Generate a dummy PDF or show message
        alert("Brochure is currently being prepared. Please contact support for more information.");
      }
    } catch (error) {
      console.error("Error downloading brochure:", error);
      alert("Failed to download brochure. Please try again.");
    } finally {
      // Close modal and reset form
      setShowBrochureModal(false);
      setBrochureFormData({ name: "", email: "", phone: "" });
    }
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleEnrollInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
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

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (enrollFormData.couponCode === "SAVE20") {
      setAppliedCoupon({
        code: "SAVE20",
        discount: 20,
        type: "percentage",
      });
    } else if (enrollFormData.couponCode === "FLAT100") {
      setAppliedCoupon({
        code: "FLAT100",
        discount: 100,
        type: "fixed",
      });
    } else {
      alert("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    try {
      // Determine the currency to use for payment - now uses same amount, different currency code
      const paymentCurrency = getCurrentCurrencyCode().toLowerCase();
      const totalAmount = calculateTotal(); // Same amount regardless of currency

      const paymentData = {
        type: "stripe",
        shedule_id: selectedSchedule.id,
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

      console.log("Processing payment:", paymentData);

      // const response = await fetch(
      //   "http://api.accredipeoplecertifications.com/api/payment/v1/create-checkout-session",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization:
      //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA3YjI2MGM4MzIyNjc0MTJmYjYzY2MiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc0OTM5NzA5MiwiZXhwIjoxNzQ5Mzk3OTkyfQ.8E6csmxY_QH8iQdZ2Of6998GbwBwnlwiKn3keHP_QLk",
      //     },
      //     body: JSON.stringify(paymentData),
      //   }
      // );

      const response = await paymentService.getStripeCheckoutSession(
        paymentData
      );

      if (response.status) {
        // Handle successful payment
        setShowEnrollModal(false);
        setSelectedSchedule(null);
        setAppliedCoupon(null);
        setEnrollFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          country: "United States",
          city: "",
          couponCode: "",
        });
        window.location.href = response?.data?.sessionUrl;
      } else {
        // Handle specific error cases
        console.log("Payment failed:", response);
        const errorMessage = response.data.message || "Payment failed";

        // Check if user already purchased the course
        if (
          errorMessage.toLowerCase().includes("already purchased") ||
          errorMessage.toLowerCase().includes("already enrolled") ||
          response.status === "error"
        ) {
          setErrorDialogMessage(errorMessage);
          setShowErrorDialog(true);
          // Close enrollment modal
          setShowEnrollModal(false);
          setSelectedSchedule(null);
          setAppliedCoupon(null);
          setEnrollFormData({
            fullName: "",
            email: "",
            contactNumber: "",
            country: "United States",
            city: "",
            couponCode: "",
          });
        } else {
          // Show dialog for any other error
          setErrorDialogMessage(errorMessage);
          setShowErrorDialog(true);
          // Close enrollment modal
          setShowEnrollModal(false);
          setSelectedSchedule(null);
          setAppliedCoupon(null);
          setEnrollFormData({
            fullName: "",
            email: "",
            contactNumber: "",
            country: "United States",
            city: "",
            couponCode: "",
          });
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      // Handle network errors or other exceptions - show dialog instead of alert
      const errorMessage =
        error.message ||
        "An unexpected error occurred while processing payment";
      setErrorDialogMessage(errorMessage);
      setShowErrorDialog(true);
      // Close enrollment modal
      setShowEnrollModal(false);
      setSelectedSchedule(null);
      setAppliedCoupon(null);
      setEnrollFormData({
        fullName: "",
        email: "",
        contactNumber: "",
        country: "United States",
        city: "",
        couponCode: "",
      });
    }
  };

  // Currency formatting is now handled by LocationContext

  const calculateTotal = () => {
    if (!selectedSchedule) return 0;

    const basePrice = selectedSchedule.earlyBirdPrice * quantity;

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        return basePrice - (basePrice * appliedCoupon.discount) / 100;
      } else {
        return basePrice - appliedCoupon.discount;
      }
    }

    return basePrice;
  };

  const getFilteredSchedules = () => {
    if (selectedMode === "classroom") {
      return scheduleData[selectedMode].filter(
        (schedule) =>
          (!selectedState || schedule.state === selectedState) &&
          (!selectedCity || schedule.city === selectedCity)
      );
    }
    return scheduleData[selectedMode as keyof typeof scheduleData] || [];
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById("schedule-section");
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Process schedule data from API
  const processScheduleData = () => {
    console.log("Processing schedule data for course:", course._id);
    console.log("Raw schedules:", course.schedules);

    if (!course.schedules || course.schedules.length === 0) {
      console.log("No schedules found for this course");
      return {
        "live-online": [],
        "self-paced": [],
        classroom: [],
      };
    }

    const processed = {
      "live-online": [] as any[],
      "self-paced": [] as any[],
      classroom: [] as any[],
    };

    course.schedules.forEach((schedule: any) => {
      const processedSchedule = {
        id: schedule._id,
        courseId: schedule.courseId,
        country: schedule.country || "Global",
        state: schedule.state || "",
        city: schedule.city || "",
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        days: schedule.days || [],
        type: schedule.type || "weekday",
        instructor: schedule.instructorName || "TBA",
        accessType: schedule.accessType || "90",
        standardPrice: schedule.standardPrice || 0,
        offerPrice: schedule.offerPrice || 0,
        earlyBirdPrice: schedule.offerPrice || schedule.standardPrice || 0,
        mode:
          schedule.scheduleType === "classroom"
            ? "Classroom Training"
            : schedule.scheduleType === "self-paced"
            ? "Self-Paced Learning"
            : "Live Online Classroom",
      };

      // Categorize by schedule type
      if (schedule.scheduleType === "classroom") {
        processed.classroom.push({
          ...processedSchedule,
          location: `${schedule.city}, ${schedule.state}`,
          dates:
            schedule.startDate && schedule.endDate
              ? [
                  new Date(schedule.startDate).toLocaleDateString(),
                  new Date(schedule.endDate).toLocaleDateString(),
                ]
              : ["TBD"],
          duration:
            schedule.startDate && schedule.endDate
              ? `${Math.ceil(
                  (new Date(schedule.endDate).getTime() -
                    new Date(schedule.startDate).getTime()) /
                    (1000 * 3600 * 24)
                )} Days`
              : "TBD",
          time: "9:00 AM - 5:00 PM",
          seatsLeft: Math.floor(Math.random() * 10) + 1, // Mock seats for now
        });
      } else if (schedule.scheduleType === "self-paced") {
        processed["self-paced"].push({
          ...processedSchedule,
          accessDays: parseInt(schedule.accessType) || 90,
          features: [
            `${schedule.accessType} Days Access`,
            "E-Learning",
            ...(schedule.instructorName ? ["Live Support"] : []),
          ],
        });
      } else {
        // Default to live-online
        processed["live-online"].push({
          ...processedSchedule,
          dates:
            schedule.startDate && schedule.endDate
              ? [
                  new Date(schedule.startDate).toLocaleDateString(),
                  new Date(schedule.endDate).toLocaleDateString(),
                ]
              : ["TBD"],
          duration:
            schedule.startDate && schedule.endDate
              ? `${Math.ceil(
                  (new Date(schedule.endDate).getTime() -
                    new Date(schedule.startDate).getTime()) /
                    (1000 * 3600 * 24)
                )} Days`
              : "TBD",
          time: "9:00 AM - 5:00 PM",
          seatsLeft: Math.floor(Math.random() * 10) + 1, // Mock seats for now
          curriculum: "32-hours curriculum",
        });
      }
    });

    return processed;
  };

  const scheduleData = processScheduleData();

  const states = ["New York", "California", "Texas", "Florida", "Illinois"];
  const cities = {
    "New York": ["New York", "Albany", "Buffalo"],
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    Florida: ["Miami", "Tampa", "Orlando"],
    Illinois: ["Chicago", "Springfield", "Rockford"],
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "India",
  ];

  const paymentMethods = [
    { name: "PayPal", logo: "/payment/paypal.png" },
    { name: "Razorpay", logo: "/payment/razorpay.png" },
    { name: "Stripe", logo: "/payment/stripe.png" },
    { name: "Split", logo: "/payment/split.png" },
    { name: "PayU", logo: "/payment/payu.png" },
    { name: "American Express", logo: "/payment/amex.png" },
    { name: "Mastercard", logo: "/payment/mastercard.png" },
    { name: "PayPal", logo: "/payment/paypal2.png" },
    { name: "Visa", logo: "/payment/visa.png" },
    { name: "Klarna", logo: "/payment/klarna.png" },
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Course Hero Section - Redesigned Structure */}
          <div className="space-y-12">
            
            {/* Section 1: Course Title - Centered */}
            <div className="text-center space-y-6">
              {/* Category Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                  <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">
                    {courseData.category}
                  </span>
                </div>
              </div>

              {/* Course Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
                <span className="site-text-primary">
                  {courseData.title}
                </span>
              </h1>
            </div>

            {/* Section 2: Description and Image - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left: Short Description */}
              <div className="order-2 lg:order-1">
                <div className="site-glass backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
                  <RichTextRenderer 
                    content={courseData.description}
                    className="text-lg leading-relaxed"
                  />
                </div>
              </div>

              {/* Right: Course Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src={courseData.image}
                    alt={courseData.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto max-w-full rounded-lg shadow-lg"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Action Buttons - Centered */}
            <div className="flex justify-center pb-16">
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <button
                  onClick={scrollToSchedule}
                  className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 flex-1 whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Schedules
                </button>

                <button
                  onClick={() => setShowBrochureModal(true)}
                  className="group flex items-center justify-center gap-2 px-6 py-4 site-glass backdrop-blur-sm site-border border hover:bg-white/20 site-light:hover:bg-white/60 site-text-primary font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 flex-1 whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview Section */}
      {course.description && (
        <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
                  </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">
                  About This Course
                </span>
                </div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                  Course Overview
                </span>
              </h2>
              </div>

            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <RichTextRenderer 
                content={course.description}
                className="text-lg leading-relaxed"
              />
          </div>
        </div>
      </section>
      )}

      {/* Course Components Section */}
      {course.components && course.components.length > 0 && (
        <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {course.components.map((component, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={component._id}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    {/* Content - Order changes based on index */}
                    <div
                      className={`space-y-6 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Rich text content from component description */}
                        <div
                          className="prose prose-lg site-text-secondary leading-relaxed max-w-none prose-headings:site-text-primary prose-strong:site-text-primary prose-p:site-text-secondary"
                          dangerouslySetInnerHTML={{
                            __html: component.description,
                          }}
                        />
                      </div>
                    </div>

                    {/* Image - Order changes based on index */}
                    <div
                      className={`relative flex justify-center ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div className="relative w-full max-w-md lg:max-w-lg">
                        <div className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 group">
                          <div className="aspect-[4/3] relative overflow-hidden">
                            <Image
                              src={
                                component.image?.path?.startsWith("http")
                                  ? component.image.path
                                  : `${config.imageUrl}${component.image?.path}`
                              }
                              alt={`Course Component ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                          
                          {/* Component Number Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div
                          className={`absolute -top-4 ${
                            isEven ? "-right-4" : "-left-4"
                          } w-8 h-8 bg-[#4F46E5] rounded-full opacity-60 animate-pulse`}
                        ></div>
                        <div
                          className={`absolute -bottom-4 ${
                            isEven ? "-left-4" : "-right-4"
                          } w-6 h-6 bg-[#10B981] rounded-full opacity-60 animate-pulse delay-1000`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* Curriculum Section */}
      {course.curriculum && course.curriculum.length > 0 && (
        <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-[#06B6D4]/5 site-light:bg-[#06B6D4]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse"></div>
                <span className="text-[#06B6D4] text-sm font-semibold uppercase tracking-wider">
                  Course Curriculum
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                <strong>What You'll Learn</strong>
              </h2>
              <p className="text-lg site-text-secondary max-w-3xl mx-auto leading-relaxed">
                Comprehensive curriculum designed to give you practical skills
                and knowledge you can apply immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.curriculum.map((item, index) => (
                <div
                  key={item._id}
                  className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-3">
                        {item.title}
                      </h3>
                      <RichTextRenderer
                        content={item.description}
                        className="site-text-secondary leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <button
                onClick={scrollToSchedule}
                className="group flex items-center justify-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#0E7490] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#06B6D4]/25"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                View Available Schedules
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      <section
        id="schedule-section"
        className="py-16 md:py-24 site-section-bg relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
              <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">
                Explore Our Schedules
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              <strong>Available Schedules</strong>
            </h2>
            <p className="text-lg site-text-secondary max-w-3xl mx-auto leading-relaxed">
              Choose from flexible learning options designed to fit your
              schedule and learning preferences.
            </p>

            {/* Currency Conversion Banner */}


            {/* <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mt-4">
              <svg
                className="w-4 h-4 text-[#10B981]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium site-text-primary">
                {getFilteredSchedules().length} Results Found
              </span>
            </div> */}
          </div>

          {/* Filters */}
          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Training Mode Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMode("live-online")}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === "live-online"
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-xl shadow-[#4F46E5]/25"
                      : "site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60"
                  }`}
                >
                  🖥️ Live Online Classroom
                </button>
                <button
                  onClick={() => setSelectedMode("self-paced")}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === "self-paced"
                      ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-xl shadow-[#10B981]/25"
                      : "site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60"
                  }`}
                >
                  📚 Self-Paced Learning
                </button>
                <button
                  onClick={() => setSelectedMode("classroom")}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === "classroom"
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-xl shadow-[#F59E0B]/25"
                      : "site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60"
                  }`}
                >
                  🏢 Classroom Training
                </button>
              </div>

              {/* Location Filters for Classroom */}
              {selectedMode === "classroom" && (
                <div className="flex items-center gap-3 ml-4">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                    }}
                    className="px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-300 site-text-primary text-sm font-medium"
                  >
                    <option value="">Any State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-300 site-text-primary text-sm font-medium"
                    disabled={!selectedState}
                  >
                    <option value="">Any Location</option>
                    {selectedState &&
                      cities[selectedState as keyof typeof cities]?.map(
                        (city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        )
                      )}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-6">
            {getFilteredSchedules().length === 0 ? (
              <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold site-text-primary mb-3">
                    No schedules available
                  </h3>
                  <p className="site-text-secondary max-w-md mx-auto leading-relaxed">
                    {selectedMode === "classroom"
                      ? "No sessions are currently available for the selected location. Please try a different location."
                      : "No schedules are currently available for this training mode."}
                  </p>
                </div>
              </div>
            ) : (
              getFilteredSchedules().map((schedule: any) => (
                <div
                  key={schedule.id}
                  className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-[1.01] overflow-hidden"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Schedule Info */}
                      <div className="lg:col-span-6">
                        {selectedMode === "live-online" ||
                        selectedMode === "classroom" ? (
                          <>
                            {/* Live/Classroom Schedule */}
                            <div className="flex items-center gap-4 mb-6">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  selectedMode === "live-online"
                                    ? "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]"
                                    : "bg-gradient-to-br from-[#F59E0B] to-[#EF4444]"
                                }`}
                              >
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  {selectedMode === "live-online" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold site-text-primary">
                                  {schedule.mode}
                                </h3>
                                <p className="text-sm site-text-muted">
                                  {schedule.curriculum}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black site-text-primary">
                                  {schedule.dates.join(", ")} (
                                  {schedule.duration})
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-2 site-text-secondary">
                                  <svg
                                    className="w-4 h-4 text-[#10B981]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {schedule.time}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    schedule.type === "Weekend"
                                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white"
                                      : "bg-gradient-to-r from-[#10B981] to-[#059669] text-white"
                                  }`}
                                >
                                  {schedule.type}
                                </span>
                                {selectedMode === "classroom" && (
                                  <span className="flex items-center gap-2 site-text-secondary">
                                    <svg
                                      className="w-4 h-4 text-[#F59E0B]"
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
                                    {schedule.location}
                                  </span>
                                )}
                              </div>
                              {schedule.seatsLeft && (
                                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white rounded-full text-sm font-bold">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  Only {schedule.seatsLeft} seats left
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Self-Paced Schedule */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold site-text-primary">
                                  {schedule.mode}
                                </h3>
                                <p className="text-sm site-text-muted">
                                  {schedule.accessDays} Days Access
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="text-2xl font-black site-text-primary">
                                {schedule.accessDays} Days Access
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {schedule.features.map(
                                  (feature: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 site-glass backdrop-blur-sm site-text-secondary rounded-full text-sm font-medium"
                                    >
                                      {feature}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Quantity & Pricing */}
                      <div className="lg:col-span-3">
                        {(selectedMode === "live-online" ||
                          selectedMode === "classroom") && (
                          <div className="mb-6">
                            <label className="block text-sm font-bold site-text-primary mb-3">
                              Quantity
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityChange("decrease")}
                                className="w-10 h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50"
                                disabled={quantity <= 1}
                              >
                                <svg
                                  className="w-4 h-4 site-text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="w-10 text-center font-black text-lg site-text-primary">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange("increase")}
                                className="w-10 h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
                              >
                                <svg
                                  className="w-4 h-4 site-text-primary"
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
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-center site-glass backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-sm site-text-muted line-through mb-1">
                            {formatPrice(schedule.standardPrice)}
                          </div>
                          <div className="text-3xl font-black bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent mb-2">
                            {formatPrice(schedule.earlyBirdPrice)}
                          </div>
                          {selectedMode === "self-paced" && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white rounded-full text-xs font-bold mb-3">
                              ⚡ Limited Time Offer
                            </div>
                          )}
                          {geolocationLoading && (
                            <div className="text-xs site-text-muted mt-2">
                              Loading location...
                            </div>
                          )}
                          {currentCountry &&
                            !geolocationLoading &&
                            currentCountry.currencyCode !== "USD" && (
                              <div className="text-xs site-text-muted mt-2">
                                📍 {currentCountry.name}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <div className="lg:col-span-3">
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowEnrollModal(true);
                          }}
                          className="w-full group px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#CC4A1D] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#FF6B35]/25"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
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
                            ENROLL NOW
                          </span>
                        </button>
                        {selectedMode === "live-online" && (
                          <div className="text-center mt-3">
                            <button className="text-sm site-text-secondary hover:text-[#4F46E5] transition-colors font-medium">
                              More than 5 Participants? Enquire Now →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section from API */}
      {course.faqId && course.faqId.faqs && course.faqId.faqs.length > 0 && (
        <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
                <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">
                  Help Center
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                <strong>Frequently Asked Questions</strong>
              </h2>
              <p className="text-lg site-text-secondary max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions about {courseData.title}.
              </p>
            </div>

            <div className="space-y-4">
              {course.faqId.faqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 overflow-hidden"
                >
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="text-lg font-semibold site-text-primary group-open:text-[#8B5CF6] transition-colors duration-300">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-6 pb-6">
                      <div className="border-t site-border pt-4">
                        <p className="site-text-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="text-center mt-12">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold site-text-primary mb-3">
                  Need More Help?
                </h3>
                <p className="site-text-secondary mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here
                  to help.
                </p>
                <button className="group flex items-center justify-center gap-3 mx-auto px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
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
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brochure Download Modal - Redesigned */}
      {showBrochureModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBrochureModal(false);
              setBrochureFormData({ name: "", email: "", phone: "" });
            }
          }}
        >
          <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border site-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b site-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold site-text-primary">
                    Download Brochure
                  </h3>
                  <p className="text-sm site-text-muted">
                    Get detailed course information
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBrochureModal(false);
                  setBrochureFormData({ name: "", email: "", phone: "" });
                }}
                className="w-8 h-8 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center site-text-secondary hover:site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
                aria-label="Close modal"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-2xl"></div>
            </div>

            {/* Modal Content */}
            <div className="relative z-10 p-6">
              <form onSubmit={handleBrochureSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="brochure-name"
                    className="block text-sm font-medium site-text-primary mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="brochure-name"
                    name="name"
                    value={brochureFormData.name}
                    onChange={handleBrochureInputChange}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="brochure-email"
                    className="block text-sm font-medium site-text-primary mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="brochure-email"
                    name="email"
                    value={brochureFormData.email}
                    onChange={handleBrochureInputChange}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="brochure-phone"
                    className="block text-sm font-medium site-text-primary mb-2"
                  >
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="brochure-phone"
                    name="phone"
                    value={brochureFormData.phone}
                    onChange={handleBrochureInputChange}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBrochureModal(false);
                      setBrochureFormData({ name: "", email: "", phone: "" });
                    }}
                    className="flex-1 px-6 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-secondary hover:site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25"
                  >
                    Download
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal - Optimized */}
      {showEnrollModal && selectedSchedule && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEnrollModal(false);
              setSelectedSchedule(null);
              setAppliedCoupon(null);
              setEnrollFormData({
                fullName: "",
                email: "",
                contactNumber: "",
                country: "United States",
                city: "",
                couponCode: "",
              });
            }
          }}
        >
          <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-4xl my-4 shadow-2xl border site-border min-h-fit">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b site-border sticky top-0 bg-inherit rounded-t-3xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-white"
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
                <h3 className="text-lg sm:text-2xl font-bold site-text-primary">
                  Enrollment Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedSchedule(null);
                  setAppliedCoupon(null);
                  setEnrollFormData({
                    fullName: "",
                    email: "",
                    contactNumber: "",
                    country: "United States",
                    city: "",
                    couponCode: "",
                  });
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center site-text-secondary hover:site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
              </button>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
            </div>

            {/* Modal Content */}
            <div className="relative z-10 p-4 sm:p-6 space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column - Course Summary */}
                <div className="space-y-6">
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-xl border site-border">
                    <h4 className="text-lg font-semibold site-text-primary mb-4">
                      Course Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="site-text-secondary text-sm">Course:</span>
                        <span className="site-text-primary font-medium text-sm text-right flex-1 ml-2">
                          {courseData.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="site-text-secondary text-sm">Mode:</span>
                        <span className="site-text-primary font-medium text-sm">
                          {selectedSchedule.mode}
                        </span>
                      </div>
                      {selectedMode === "live-online" ||
                      selectedMode === "classroom" ? (
                        <>
                          <div className="flex justify-between items-start">
                            <span className="site-text-secondary text-sm">Dates:</span>
                            <span className="site-text-primary font-medium text-sm text-right flex-1 ml-2">
                              {selectedSchedule.dates?.join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="site-text-secondary text-sm">Duration:</span>
                            <span className="site-text-primary font-medium text-sm">
                              {selectedSchedule.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="site-text-secondary text-sm">
                              Participants:
                            </span>
                            <span className="site-text-primary font-medium text-sm">
                              {quantity}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="site-text-secondary text-sm">Access:</span>
                          <span className="site-text-primary font-medium text-sm">
                            {selectedSchedule.accessDays} Days
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t site-border pt-3 mt-4">
                        <span className="site-text-primary">Total:</span>
                        <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Enrollment Form */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-xl border site-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#4F46E5]/25">
                        1
                      </div>
                      <h4 className="text-lg font-semibold site-text-primary">
                        Personal Information
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium site-text-primary mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={enrollFormData.fullName}
                          onChange={handleEnrollInputChange}
                          className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
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
                          className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
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
                            className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                            placeholder="Enter your contact number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium site-text-primary mb-2">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={enrollFormData.country}
                            onChange={handleEnrollInputChange}
                            className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                            required
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
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
                          className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-xl border site-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#10B981]/25">
                        2
                      </div>
                      <h4 className="text-lg font-semibold site-text-primary">
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
                        className="flex-1 px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all duration-300"
                        placeholder="Enter coupon code"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-6 py-3 bg-gradient-to-br from-[#10B981] to-[#059669] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#10B981]/25 transition-all duration-300 whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>

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
                              Coupon "{appliedCoupon.code}" applied!
                            </span>
                          </div>
                          <button
                            onClick={() => setAppliedCoupon(null)}
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

              {/* Enroll Button - Full Width */}
              <div className="border-t site-border pt-6">
                <button
                  onClick={handlePayment}
                  className="w-full group px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#CC4A1D] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#FF6B35]/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    ENROLL NOW - {formatPrice(calculateTotal())}
                  </span>
                </button>

                <p className="text-xs site-text-muted text-center mt-4">
                  By enrolling, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    href="/dashboard"
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

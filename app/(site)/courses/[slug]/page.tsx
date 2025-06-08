"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import courseService from "@/app/components/service/course.service";
import config from "@/app/components/config/config";
import { Course } from "@/app/types/course";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.slug;
  
  // Course data state
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureFormData, setBrochureFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Schedule-related state
  const [selectedMode, setSelectedMode] = useState('live-online');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollFormData, setEnrollFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    couponCode: ''
  });
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        console.log("Fetching course with ID:", courseId);
        const response = await courseService.getCourseById(courseId);
        
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

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Helper function to get course image URL
  const getCourseImageUrl = (course: Course) => {
    if (course.upload?.courseImage?.[0]) {
      // First check if we have a complete URL (like Pinterest URLs)
      if (course.upload.courseImage[0].path?.startsWith('http')) {
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
    if (course.categoryId && typeof course.categoryId === 'object' && 'name' in course.categoryId) {
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
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold site-text-primary mb-4">Course Not Found</h2>
          <p className="site-text-secondary mb-6">{error || "The course you're looking for doesn't exist."}</p>
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
    description: course.shortDescription || course.description || "Professional certification course",
    image: getCourseImageUrl(course),
    features: course.keyFeatures || [],
    authorizedPartner: "Authorized Training Partner"
  };

  const breadcrumbItems = [
    { label: "Courses", href: "/courses" },
    { label: course.title }
  ];

  const handleBrochureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setBrochureFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setBrochureFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBrochureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Brochure download requested:', brochureFormData);
    // Handle brochure download logic here
    setShowBrochureModal(false);
    setBrochureFormData({ name: '', email: '', phone: '' });
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleEnrollInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setEnrollFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setEnrollFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (enrollFormData.couponCode === 'SAVE20') {
      setAppliedCoupon({
        code: 'SAVE20',
        discount: 20,
        type: 'percentage'
      });
    } else if (enrollFormData.couponCode === 'FLAT100') {
      setAppliedCoupon({
        code: 'FLAT100',
        discount: 100,
        type: 'fixed'
      });
    } else {
      alert('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        type: "stripe",
        amount: calculateTotal(),
        currency: "usd",
        email: enrollFormData.email,
        description: `${courseData.title} - ${selectedSchedule.mode}`
      };

      console.log("Processing payment:", paymentData);
      
      const response = await fetch(`${config.apiUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (response.ok) {
        // Handle successful payment
        alert('Payment successful! You will receive an email confirmation shortly.');
        setShowEnrollModal(false);
        setSelectedSchedule(null);
        setAppliedCoupon(null);
        setEnrollFormData({
          name: '',
          email: '',
          phone: '',
          country: 'United States',
          couponCode: ''
        });
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  const calculateTotal = () => {
    if (!selectedSchedule) return 0;
    
    const basePrice = selectedSchedule.earlyBirdPrice * quantity;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        return basePrice - (basePrice * appliedCoupon.discount / 100);
      } else {
        return basePrice - appliedCoupon.discount;
      }
    }
    
    return basePrice;
  };

  const getFilteredSchedules = () => {
    if (selectedMode === 'classroom') {
      return scheduleData[selectedMode].filter(schedule => 
        (!selectedState || schedule.state === selectedState) &&
        (!selectedCity || schedule.city === selectedCity)
      );
    }
    return scheduleData[selectedMode as keyof typeof scheduleData] || [];
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule-section');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Process schedule data from API
  const processScheduleData = () => {
    console.log("Processing schedule data for course:", course._id);
    console.log("Raw schedules:", course.schedules);
    
    if (!course.schedules || course.schedules.length === 0) {
      console.log("No schedules found for this course");
      return {
        'live-online': [],
        'self-paced': [],
        'classroom': []
      };
    }

    const processed = {
      'live-online': [] as any[],
      'self-paced': [] as any[],
      'classroom': [] as any[]
    };

    course.schedules.forEach((schedule: any) => {
      const processedSchedule = {
        id: schedule._id,
        courseId: schedule.courseId,
        country: schedule.country || 'Global',
        state: schedule.state || '',
        city: schedule.city || '',
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        days: schedule.days || [],
        type: schedule.type || 'weekday',
        instructor: schedule.instructorName || 'TBA',
        accessType: schedule.accessType || '90',
        standardPrice: schedule.standardPrice || 0,
        offerPrice: schedule.offerPrice || 0,
        earlyBirdPrice: schedule.offerPrice || schedule.standardPrice || 0,
        mode: schedule.scheduleType === 'classroom' ? 'Classroom Training' : 
               schedule.scheduleType === 'self-paced' ? 'Self-Paced Learning' : 'Live Online Classroom'
      };

      // Categorize by schedule type
      if (schedule.scheduleType === 'classroom') {
        processed.classroom.push({
          ...processedSchedule,
          location: `${schedule.city}, ${schedule.state}`,
          dates: schedule.startDate && schedule.endDate ? 
            [new Date(schedule.startDate).toLocaleDateString(), new Date(schedule.endDate).toLocaleDateString()] : 
            ['TBD'],
          duration: schedule.startDate && schedule.endDate ? 
            `${Math.ceil((new Date(schedule.endDate).getTime() - new Date(schedule.startDate).getTime()) / (1000 * 3600 * 24))} Days` : 
            'TBD',
          time: '9:00 AM - 5:00 PM',
          seatsLeft: Math.floor(Math.random() * 10) + 1 // Mock seats for now
        });
      } else if (schedule.scheduleType === 'self-paced') {
        processed['self-paced'].push({
          ...processedSchedule,
          accessDays: parseInt(schedule.accessType) || 90,
          features: [
            `${schedule.accessType} Days Access`,
            'E-Learning',
            ...(schedule.instructorName ? ['Live Support'] : [])
          ]
        });
      } else {
        // Default to live-online
        processed['live-online'].push({
          ...processedSchedule,
          dates: schedule.startDate && schedule.endDate ? 
            [new Date(schedule.startDate).toLocaleDateString(), new Date(schedule.endDate).toLocaleDateString()] : 
            ['TBD'],
          duration: schedule.startDate && schedule.endDate ? 
            `${Math.ceil((new Date(schedule.endDate).getTime() - new Date(schedule.startDate).getTime()) / (1000 * 3600 * 24))} Days` : 
            'TBD',
          time: '9:00 AM - 5:00 PM',
          seatsLeft: Math.floor(Math.random() * 10) + 1, // Mock seats for now
          curriculum: '32-hours curriculum'
        });
      }
    });

    return processed;
  };

  const scheduleData = processScheduleData();

  const states = ['New York', 'California', 'Texas', 'Florida', 'Illinois'];
  const cities = {
    'New York': ['New York', 'Albany', 'Buffalo'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego'],
    'Texas': ['Houston', 'Dallas', 'Austin'],
    'Florida': ['Miami', 'Tampa', 'Orlando'],
    'Illinois': ['Chicago', 'Springfield', 'Rockford']
  };

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India'];

  const paymentMethods = [
    { name: 'PayPal', logo: '/payment/paypal.png' },
    { name: 'Razorpay', logo: '/payment/razorpay.png' },
    { name: 'Stripe', logo: '/payment/stripe.png' },
    { name: 'Split', logo: '/payment/split.png' },
    { name: 'PayU', logo: '/payment/payu.png' },
    { name: 'American Express', logo: '/payment/amex.png' },
    { name: 'Mastercard', logo: '/payment/mastercard.png' },
    { name: 'PayPal', logo: '/payment/paypal2.png' },
    { name: 'Visa', logo: '/payment/visa.png' },
    { name: 'Klarna', logo: '/payment/klarna.png' }
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Content - Left Side */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-6">
                
                {/* Category */}
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                  <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">
                    {courseData.category}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                    <span className="site-text-primary">{courseData.title.split('®')[0]}® </span>
                    <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                      Certification Training
                    </span>
                  </h1>
                  <p className="text-xl site-text-secondary font-medium leading-relaxed">
                    {courseData.description}
                  </p>
                </div>



                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <button
                    onClick={scrollToSchedule}
                    className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 min-w-[200px]"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Schedules
                  </button>
                  
                  <button
                    onClick={() => setShowBrochureModal(true)}
                    className="group flex items-center justify-center gap-3 px-8 py-4 site-glass backdrop-blur-sm site-border border hover:bg-white/20 site-light:hover:bg-white/60 site-text-primary font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>

            {/* Image and Badge - Right Side */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
              <div className="relative">
                {/* Course Image */}
                <div className="relative w-full max-w-lg site-glass backdrop-blur-xl rounded-3xl overflow-hidden mb-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  
                  <Image
                    src={courseData.image}
                    alt={courseData.title}
                    width={500}
                    height={400}
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-full text-sm font-bold">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      Live Training
                    </div>
                  </div>
                </div>

                {/* Authorization Badge and Share */}
                <div className="flex items-center justify-between gap-4">
                  {/* PMI Badge */}
                  <div className="site-glass backdrop-blur-xl rounded-2xl p-4 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PMI</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold site-text-primary">Authorized Partner</div>
                      <div className="text-xs site-text-muted">Official Training Provider</div>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button className="site-glass backdrop-blur-xl w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 hover:scale-110 shadow-xl">
                    <svg className="w-5 h-5 site-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <div key={component._id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Content - Order changes based on index */}
                    <div className={`space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="space-y-4">
                        {/* Rich text content from component description */}
                        <div 
                          className="prose prose-lg site-text-secondary leading-relaxed max-w-none prose-headings:site-text-primary prose-strong:site-text-primary prose-p:site-text-secondary"
                          dangerouslySetInnerHTML={{ __html: component.description }}
                        />
                      </div>
                    </div>

                    {/* Image - Order changes based on index */}
                    <div className={`relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105">
                        <div className="relative">
                          <Image
                            src={component.image?.path?.startsWith('http') 
                              ? component.image.path 
                              : `${config.imageUrl}${component.image?.path}`
                            }
                            alt={`Course Component ${index + 1}`}
                            width={500}
                            height={400}
                            className="w-full h-auto object-contain"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className={`absolute -top-4 ${isEven ? '-right-4' : '-left-4'} w-8 h-8 bg-[#4F46E5] rounded-full opacity-60 animate-pulse`}></div>
                      <div className={`absolute -bottom-4 ${isEven ? '-left-4' : '-right-4'} w-6 h-6 bg-[#10B981] rounded-full opacity-60 animate-pulse delay-1000`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Key Features & Certificate Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Key Features - Left Side */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
                  <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Features</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                  <strong>Key Features</strong>
                </h2>
                <p className="text-lg site-text-secondary leading-relaxed">
                  Discover what makes our {courseData.title} stand out from the rest. 
                  Our comprehensive approach ensures you get the best learning experience.
                </p>
              </div>

              {/* Single Key Features Card with Bullet Points */}
              {courseData.features && courseData.features.length > 0 ? (
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <ul className="space-y-3">
                    {courseData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                          <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="site-text-secondary leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                // Fallback if no keyFeatures
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                  <div className="text-center">
                    <p className="site-text-secondary">No key features available for this course.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sample Certificate Image - Right Side */}
            <div className="relative">
              {course.upload?.courseSampleCertificate?.[0] ? (
                <div className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105">
                  <div className="relative">
                    <Image
                      src={course.upload.courseSampleCertificate[0].path?.startsWith('http') 
                        ? course.upload.courseSampleCertificate[0].path 
                        : `${config.imageUrl}${course.upload.courseSampleCertificate[0].path}`
                      }
                      alt="Sample Certificate"
                      width={500}
                      height={400}
                      className="w-full h-auto object-contain"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="site-glass backdrop-blur-sm rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-white mb-1">Sample Certificate</h3>
                        <p className="text-sm text-white/80">{courseData.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-96 flex flex-col items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  {/* Fallback when no certificate image */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold site-text-primary mb-2">Sample Certificate</h3>
                      <p className="site-text-secondary mb-3">Certificate Preview</p>
                      <p className="text-sm site-text-muted">Certificate image not available</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Decorative Elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#4F46E5] rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#8B5CF6] rounded-full opacity-60 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-[#10B981] rounded-full opacity-60 animate-pulse delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

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
                <span className="text-[#06B6D4] text-sm font-semibold uppercase tracking-wider">Course Curriculum</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                <strong>What You'll Learn</strong>
              </h2>
              <p className="text-lg site-text-secondary max-w-3xl mx-auto leading-relaxed">
                Comprehensive curriculum designed to give you practical skills and knowledge you can apply immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.curriculum.map((item, index) => (
                <div key={item._id} className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-3">{item.title}</h3>
                      <p className="site-text-secondary leading-relaxed">{item.description}</p>
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
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Available Schedules
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      <section id="schedule-section" className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
              <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">Explore Our Schedules</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              <strong>Available Schedules</strong>
            </h2>
            <p className="text-lg site-text-secondary max-w-3xl mx-auto leading-relaxed">
              Choose from flexible learning options designed to fit your schedule and learning preferences.
            </p>
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mt-4">
              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium site-text-primary">{getFilteredSchedules().length} Results Found</span>
            </div>
          </div>

          {/* Filters */}
          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              
              {/* Training Mode Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMode('live-online')}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === 'live-online'
                      ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-xl shadow-[#4F46E5]/25'
                      : 'site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60'
                  }`}
                >
                  🖥️ Live Online Classroom
                </button>
                <button
                  onClick={() => setSelectedMode('self-paced')}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === 'self-paced'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-xl shadow-[#10B981]/25'
                      : 'site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60'
                  }`}
                >
                  📚 Self-Paced Learning
                </button>
                <button
                  onClick={() => setSelectedMode('classroom')}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMode === 'classroom'
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-xl shadow-[#F59E0B]/25'
                      : 'site-glass backdrop-blur-sm site-text-primary hover:bg-white/20 site-light:hover:bg-white/60'
                  }`}
                >
                  🏢 Classroom Training
                </button>
              </div>

              {/* Location Filters for Classroom */}
              {selectedMode === 'classroom' && (
                <div className="flex items-center gap-3 ml-4">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity('');
                    }}
                    className="px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-300 site-text-primary text-sm font-medium"
                  >
                    <option value="">Any State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-300 site-text-primary text-sm font-medium"
                    disabled={!selectedState}
                  >
                    <option value="">Any Location</option>
                    {selectedState && cities[selectedState as keyof typeof cities]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
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
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold site-text-primary mb-3">No schedules available</h3>
                  <p className="site-text-secondary max-w-md mx-auto leading-relaxed">
                    {selectedMode === 'classroom' 
                      ? 'No sessions are currently available for the selected location. Please try a different location.'
                      : 'No schedules are currently available for this training mode.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              getFilteredSchedules().map((schedule: any) => (
                <div key={schedule.id} className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Schedule Info */}
                      <div className="lg:col-span-6">
                        {selectedMode === 'live-online' || selectedMode === 'classroom' ? (
                          <>
                            {/* Live/Classroom Schedule */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedMode === 'live-online' 
                                  ? 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]' 
                                  : 'bg-gradient-to-br from-[#F59E0B] to-[#EF4444]'
                              }`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  {selectedMode === 'live-online' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold site-text-primary">{schedule.mode}</h3>
                                <p className="text-sm site-text-muted">{schedule.curriculum}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-black site-text-primary">
                                  {schedule.dates.join(', ')} ({schedule.duration})
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-2 site-text-secondary">
                                  <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {schedule.time}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  schedule.type === 'Weekend' 
                                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white' 
                                    : 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white'
                                }`}>
                                  {schedule.type}
                                </span>
                                {selectedMode === 'classroom' && (
                                  <span className="flex items-center gap-2 site-text-secondary">
                                    <svg className="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold site-text-primary">{schedule.mode}</h3>
                                <p className="text-sm site-text-muted">{schedule.accessDays} Days Access</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="text-2xl font-black site-text-primary">
                                {schedule.accessDays} Days Access
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {schedule.features.map((feature: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 site-glass backdrop-blur-sm site-text-secondary rounded-full text-sm font-medium">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Quantity & Pricing */}
                      <div className="lg:col-span-3">
                        {(selectedMode === 'live-online' || selectedMode === 'classroom') && (
                          <div className="mb-6">
                            <label className="block text-sm font-bold site-text-primary mb-3">Quantity</label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityChange('decrease')}
                                className="w-10 h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50"
                                disabled={quantity <= 1}
                              >
                                <svg className="w-4 h-4 site-text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-10 text-center font-black text-lg site-text-primary">{quantity}</span>
                              <button
                                onClick={() => handleQuantityChange('increase')}
                                className="w-10 h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 site-text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center site-glass backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-sm site-text-muted line-through mb-1">
                            USD ${schedule.standardPrice}
                          </div>
                          <div className="text-3xl font-black bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent mb-2">
                            USD ${schedule.earlyBirdPrice}
                          </div>
                          {selectedMode === 'self-paced' && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white rounded-full text-xs font-bold mb-3">
                              ⚡ Limited Time Offer
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
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            ENROLL NOW
                          </span>
                        </button>
                        {selectedMode === 'live-online' && (
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
                <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">Help Center</span>
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
                <div key={faq._id} className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="text-lg font-semibold site-text-primary group-open:text-[#8B5CF6] transition-colors duration-300">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-6 pb-6">
                      <div className="border-t site-border pt-4">
                        <p className="site-text-secondary leading-relaxed">{faq.answer}</p>
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
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold site-text-primary mb-3">Need More Help?</h3>
                <p className="site-text-secondary mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <button className="group flex items-center justify-center gap-3 mx-auto px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brochure Download Modal */}
      {showBrochureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Download Brochure</h3>
              <button
                onClick={() => setShowBrochureModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBrochureSubmit} className="space-y-4">
              <div>
                <label htmlFor="brochure-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="brochure-name"
                  name="name"
                  value={brochureFormData.name}
                  onChange={handleBrochureInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="brochure-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="brochure-email"
                  name="email"
                  value={brochureFormData.email}
                  onChange={handleBrochureInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label htmlFor="brochure-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="brochure-phone"
                  name="phone"
                  value={brochureFormData.phone}
                  onChange={handleBrochureInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your contact number"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBrochureModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-lg hover:bg-[#3730A3] transition-colors"
                >
                  Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="site-glass backdrop-blur-xl rounded-3xl w-full max-w-4xl my-8 shadow-2xl border site-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b site-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold site-text-primary">Enrollment Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedSchedule(null);
                  setAppliedCoupon(null);
                  setEnrollFormData({
                    name: '',
                    email: '',
                    phone: '',
                    country: 'United States',
                    couponCode: ''
                  });
                }}
                className="w-10 h-10 site-glass backdrop-blur-sm rounded-xl flex items-center justify-center site-text-secondary hover:site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              
              {/* Learner Details Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#4F46E5]/25">
                      1
                    </div>
                    <h4 className="text-xl font-semibold site-text-primary">Learner Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium site-text-primary mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={enrollFormData.name}
                        onChange={handleEnrollInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium site-text-primary mb-3">
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
                    
                    <div>
                      <label className="block text-sm font-medium site-text-primary mb-3">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <select className="px-3 py-3 site-glass backdrop-blur-sm site-border border border-r-0 rounded-l-xl site-text-primary text-sm">
                          <option>🇺🇸 +1</option>
                          <option>🇨🇦 +1</option>
                          <option>🇬🇧 +44</option>
                          <option>🇦🇺 +61</option>
                          <option>🇮🇳 +91</option>
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          value={enrollFormData.phone}
                          onChange={handleEnrollInputChange}
                          className="flex-1 px-4 py-3 site-glass backdrop-blur-sm rounded-r-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium site-text-primary mb-3">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={enrollFormData.country}
                        onChange={handleEnrollInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium site-text-primary mb-3">
                        Referral Code (optional)
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                        placeholder="Enter referral code"
                      />
                      <div className="flex items-center mt-3">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-[#4F46E5] bg-transparent border-2 site-border rounded focus:ring-[#4F46E5] focus:ring-2" />
                        <span className="text-xs site-text-muted">
                          By providing your contact details, you agree to our Privacy and Policy
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Coupon Code */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#10B981]/25">
                      2
                    </div>
                    <h4 className="text-xl font-semibold site-text-primary">Coupon Code</h4>
                    <span className="text-sm text-blue-400 font-medium">Apply a Code</span>
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
                      className="px-6 py-3 bg-gradient-to-br from-[#10B981] to-[#059669] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#10B981]/25 transition-all duration-300"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-green-400 font-medium">
                            Coupon "{appliedCoupon.code}" applied successfully!
                          </span>
                        </div>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-green-400 hover:text-green-300 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">{selectedSchedule.mode}</h5>
                    <p className="text-sm text-gray-600">
                      {courseData.title}
                    </p>
                    
                    {selectedMode === 'live-online' || selectedMode === 'classroom' ? (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>🗓️ {selectedSchedule.dates?.join(', ')} ({selectedSchedule.duration})</p>
                        <p>🕒 {selectedSchedule.time}</p>
                        <p>👥 No. of participants: {quantity}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>⏱️ {selectedSchedule.accessDays} Days Access</p>
                        <p>📚 Self-Paced Learning</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>USD {(selectedSchedule.earlyBirdPrice * quantity).toFixed(2)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>
                          -USD {appliedCoupon.type === 'percentage' 
                            ? ((selectedSchedule.earlyBirdPrice * quantity * appliedCoupon.discount) / 100).toFixed(2)
                            : appliedCoupon.discount.toFixed(2)
                          }
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>USD {calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      As low as USD {(calculateTotal() / 12).toFixed(2)}/month
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold py-3 rounded-lg transition-colors">
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h4>
                
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="bg-white p-2 rounded border border-gray-200 flex items-center justify-center">
                      <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {method.name.slice(0, 3)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V5a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Guaranteed Safe Checkout</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Transactions on this site are safe, secure & PCI DSS compliant as indicated by the secure lock in your address bar. Over 500,000+ users like you have enrolled for courses
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
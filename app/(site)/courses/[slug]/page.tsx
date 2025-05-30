"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

interface CoursePageProps {
  params: { slug: string };
}

export default function CoursePage({ params }: CoursePageProps) {
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

  // Mock course data - will be replaced with backend data later
  const courseData = {
    category: "PMP CERTIFICATION - PROJECT MANAGEMENT PROFESSIONAL TRAINING",
    title: "PMP® Certification Training",
    description: "Master Project Management with Industry-Leading PMP® Certification Training",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: [
      "Boost your career with 36 hours of live PMP certification training.",
      "Prepare with a 5-week study plan and 2000+ practice questions.",
      "Experience real exams with PMI replica questions and a free simulator.",
      "Practice with 12 full-length simulation tests of 180 questions each.",
      "Ace the PMP exam with mock tests and hands-on training."
    ],
    authorizedPartner: "PMI Authorized Training Partner"
  };

  const breadcrumbItems = [
    { label: "Project Management", href: "/courses" },
    { label: "PMP Certification Training Course" }
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

  // Mock schedule data - will be replaced with backend data later
  const scheduleData = {
    'live-online': [
      {
        id: 1,
        dates: ['Mar 24', 'Mar 25', 'Mar 26', 'Mar 27'],
        duration: '4 Days',
        time: '9:00 AM - 5:00 PM CST',
        type: 'Weekday',
        seatsLeft: 3,
        standardPrice: 1999,
        earlyBirdPrice: 1599,
        curriculum: '32-hours curriculum',
        mode: 'Live Online Classroom'
      },
      {
        id: 2,
        dates: ['Apr 05', 'Apr 06', 'Apr 12', 'Apr 13'],
        duration: '4 Days',
        time: '10:00 AM - 6:00 PM CST',
        type: 'Weekend',
        seatsLeft: 8,
        standardPrice: 1999,
        earlyBirdPrice: 1599,
        curriculum: '32-hours curriculum',
        mode: 'Live Online Classroom'
      }
    ],
    'self-paced': [
      {
        id: 3,
        accessDays: 90,
        standardPrice: 299,
        earlyBirdPrice: 199,
        features: ['90 Days Access', 'E-Learning'],
        mode: 'Self-Paced Learning'
      },
      {
        id: 4,
        accessDays: 180,
        standardPrice: 399,
        earlyBirdPrice: 299,
        features: ['180 Days Access', 'E-Learning', 'Practice Tests'],
        mode: 'Self-Paced Learning'
      },
      {
        id: 5,
        accessDays: 365,
        standardPrice: 599,
        earlyBirdPrice: 399,
        features: ['365 Days Access', 'E-Learning', 'Practice Tests', 'Live Support'],
        mode: 'Self-Paced Learning'
      }
    ],
    'classroom': [
      {
        id: 6,
        dates: ['Apr 15', 'Apr 16', 'Apr 17', 'Apr 18'],
        duration: '4 Days',
        time: '9:00 AM - 5:00 PM',
        type: 'Weekday',
        location: 'New York, NY',
        state: 'New York',
        city: 'New York',
        seatsLeft: 5,
        standardPrice: 2299,
        earlyBirdPrice: 1899,
        mode: 'Classroom Training'
      }
    ]
  };

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
    <div className="min-h-screen">
      {/* Breadcrumb Section */}
      <div className="bg-white py-4">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Content - Left Side */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-6">
                
                {/* Category */}
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {courseData.category}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {courseData.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-800 font-medium">
                    {courseData.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {courseData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <button
                    onClick={scrollToSchedule}
                    className="flex items-center justify-center px-6 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 min-w-[180px]"
                  >
                    View Schedules
                  </button>
                  
                  <button
                    onClick={() => setShowBrochureModal(true)}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-[#4F46E5] transition-all duration-300 min-w-[180px]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                <div className="relative w-full max-w-lg h-80 lg:h-96 rounded-2xl overflow-hidden mb-6">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  
                  <Image
                    src={courseData.image}
                    alt="PMP Certification Training"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Authorization Badge and Share */}
                <div className="flex items-center justify-between gap-4">
                  {/* PMI Badge */}
                  <div className="flex items-center bg-[#B39DDB]/20 rounded-full pl-12 pr-4 py-3 relative">
                    <div className="absolute -left-2 w-12 h-12 bg-[#4F46E5] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PMI</span>
                    </div>
                    <span className="text-[#4F46E5] font-semibold text-sm">
                      {courseData.authorizedPartner}
                    </span>
                  </div>

                  {/* Share Button */}
                  <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Course Overview
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our comprehensive {courseData.title} is designed to equip professionals 
                  with the essential skills and knowledge needed to excel in project management. 
                  This intensive training program combines theoretical foundations with practical 
                  applications to ensure you're ready for real-world challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Duration</h3>
                  </div>
                  <p className="text-2xl font-bold text-[#4F46E5]">36 Hours</p>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive Training</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-gray-600 mt-1">First Attempt Pass Rate</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">15,000+</p>
                  <p className="text-sm text-gray-600 mt-1">Successfully Trained</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#B39DDB]/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#B39DDB]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
                  </div>
                  <p className="text-2xl font-bold text-[#B39DDB]">4.8/5</p>
                  <p className="text-sm text-gray-600 mt-1">Student Reviews</p>
                </div>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#B39DDB]/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                {/* Placeholder for course overview image */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-[#4F46E5]/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Course Overview Image</p>
                  <p className="text-sm text-gray-400">Image will be added here</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#4F46E5] rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#B39DDB] rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Certificate Section */}
      <section className="py-16 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Key Features - Left Side */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Key Features
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover what makes our {courseData.title} stand out from the rest. 
                  Our comprehensive approach ensures you get the best learning experience.
                </p>
              </div>

              <div className="space-y-6">
                {/* Feature Items */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert-Led Training</h3>
                    <p className="text-gray-600">Learn from certified PMP professionals with 15+ years of real-world project management experience.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Curriculum</h3>
                    <p className="text-gray-600">Complete PMBOK Guide coverage with interactive exercises, case studies, and real project scenarios.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Exam Guarantee</h3>
                    <p className="text-gray-600">98% first-attempt pass rate with our proven methodology and unlimited practice tests.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#B39DDB] to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Learning</h3>
                    <p className="text-gray-600">Live virtual sessions, recorded classes, and 24/7 learning management system access.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime Support</h3>
                    <p className="text-gray-600">Post-certification career guidance, job assistance, and access to our professional network.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Preview - Right Side */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                {/* Certificate Placeholder */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#B39DDB] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sample Certificate</h3>
                    <p className="text-gray-600 mb-3">Certificate GIF Preview</p>
                    <p className="text-sm text-gray-500">Interactive certificate animation will be displayed here</p>
                  </div>
                  
                  {/* Mock Certificate Elements */}
                  <div className="w-full max-w-xs mx-auto mt-6">
                    <div className="bg-white border-2 border-[#4F46E5] rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">PMI</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-800 mb-1">Certificate of Completion</div>
                        <div className="text-xs text-gray-600">PMP® Certification Training</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#4F46E5] rounded-full opacity-60"></div>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#B39DDB] rounded-full opacity-60"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-green-500 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule-section" className="py-16 bg-gray-50">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              EXPLORE OUR SCHEDULES
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Schedules</h2>
            <p className="text-lg text-gray-600">
              {getFilteredSchedules().length} Results
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              
              {/* Training Mode Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMode('live-online')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMode === 'live-online'
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Live Online Classroom
                </button>
                <button
                  onClick={() => setSelectedMode('self-paced')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMode === 'self-paced'
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Self-Paced Learning
                </button>
                <button
                  onClick={() => setSelectedMode('classroom')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMode === 'classroom'
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Classroom Training
                </button>
              </div>

              {/* Location Filters for Classroom */}
              {selectedMode === 'classroom' && (
                <>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity('');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={!selectedState}
                    >
                      <option value="">Any Location</option>
                      {selectedState && cities[selectedState as keyof typeof cities]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-6">
            {getFilteredSchedules().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedules available</h3>
                <p className="text-gray-600">
                  {selectedMode === 'classroom' 
                    ? 'No sessions are currently available for the selected location. Please try a different location.'
                    : 'No schedules are currently available for this training mode.'
                  }
                </p>
              </div>
            ) : (
              getFilteredSchedules().map((schedule: any) => (
                <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Schedule Info */}
                      <div className="lg:col-span-6">
                        {selectedMode === 'live-online' || selectedMode === 'classroom' ? (
                          <>
                            {/* Live/Classroom Schedule */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  {selectedMode === 'live-online' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{schedule.mode}</h3>
                                <p className="text-sm text-gray-600">{schedule.curriculum}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  {schedule.dates.join(', ')} ({schedule.duration})
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {schedule.time}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  schedule.type === 'Weekend' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {schedule.type}
                                </span>
                                {selectedMode === 'classroom' && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {schedule.location}
                                  </span>
                                )}
                              </div>
                              {schedule.seatsLeft && (
                                <p className="text-sm text-orange-600 font-medium">
                                  Only {schedule.seatsLeft} seats left
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Self-Paced Schedule */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-[#B39DDB]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#B39DDB]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{schedule.mode}</h3>
                                <p className="text-sm text-gray-600">{schedule.accessDays} Days Access</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="text-2xl font-bold text-gray-900">
                                {schedule.accessDays} Days Access
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {schedule.features.map((feature: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
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
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityChange('decrease')}
                                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                disabled={quantity <= 1}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <button
                                onClick={() => handleQuantityChange('increase')}
                                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500 line-through mb-1">
                            USD {schedule.standardPrice}
                          </div>
                          <div className="text-2xl font-bold text-[#4F46E5] mb-2">
                            USD {schedule.earlyBirdPrice}
                          </div>
                          {selectedMode === 'self-paced' && (
                            <div className="text-xs text-gray-500 mb-3">
                              Limited Period Offer
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
                          className="w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-lg transition-colors"
                        >
                          ENROLL NOW
                        </button>
                        {selectedMode === 'live-online' && (
                          <div className="text-center mt-2">
                            <button className="text-sm text-[#4F46E5] hover:underline">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Enrollment Details</h3>
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              
              {/* Learner Details Form */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Learner Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={enrollFormData.name}
                        onChange={handleEnrollInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={enrollFormData.email}
                        onChange={handleEnrollInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <select className="px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm">
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={enrollFormData.country}
                        onChange={handleEnrollInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Code (optional)
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                        placeholder="Enter referral code"
                      />
                      <div className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-xs text-gray-600">
                          By providing your contact details, you agree to our Privacy and Policy
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Coupon Code</h4>
                    <span className="text-sm text-blue-600 font-medium">Apply a Code</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="couponCode"
                      value={enrollFormData.couponCode}
                      onChange={handleEnrollInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Apply Coupon
                    </button>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-800 font-medium">
                          Coupon "{appliedCoupon.code}" applied successfully!
                        </span>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-green-600 hover:text-green-800"
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
"use client";
import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const unwrappedParams = use(params);
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
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
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

                {/* Features List */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <h3 className="text-lg font-bold site-text-primary mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    What You'll Get
                  </h3>
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
                <div className="relative w-full max-w-lg h-80 lg:h-96 site-glass backdrop-blur-xl rounded-3xl overflow-hidden mb-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  
                  <Image
                    src={courseData.image}
                    alt="PMP Certification Training"
                    fill
                    className="object-cover"
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

      {/* Course Overview Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Overview</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                  <strong>Course Overview</strong>
                </h2>
                <p className="text-lg site-text-secondary leading-relaxed">
                  Our comprehensive {courseData.title} is designed to equip professionals 
                  with the essential skills and knowledge needed to excel in project management. 
                  This intensive training program combines theoretical foundations with practical 
                  applications to ensure you're ready for real-world challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Cards */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold site-text-primary">Duration</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">36 Hours</p>
                  <p className="text-sm site-text-muted mt-1">Comprehensive Training</p>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold site-text-primary">Success Rate</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">98%</p>
                  <p className="text-sm site-text-muted mt-1">First Attempt Pass Rate</p>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold site-text-primary">Students</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">15,000+</p>
                  <p className="text-sm site-text-muted mt-1">Successfully Trained</p>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold site-text-primary">Rating</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">4.8/5</p>
                  <p className="text-sm site-text-muted mt-1">Student Reviews</p>
                </div>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-96 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                {/* Placeholder for course overview image */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="site-text-secondary font-medium">Course Overview Image</p>
                  <p className="text-sm site-text-muted">Interactive content preview</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#4F46E5] rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#10B981] rounded-full opacity-60 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

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

              <div className="space-y-6">
                {/* Feature Items */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-2">Expert-Led Training</h3>
                      <p className="site-text-secondary">Learn from certified PMP professionals with 15+ years of real-world project management experience.</p>
                    </div>
                  </div>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-2">Comprehensive Curriculum</h3>
                      <p className="site-text-secondary">Complete PMBOK Guide coverage with interactive exercises, case studies, and real project scenarios.</p>
                    </div>
                  </div>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-2">Exam Guarantee</h3>
                      <p className="site-text-secondary">98% first-attempt pass rate with our proven methodology and unlimited practice tests.</p>
                    </div>
                  </div>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-2">Flexible Learning</h3>
                      <p className="site-text-secondary">Live virtual sessions, recorded classes, and 24/7 learning management system access.</p>
                    </div>
                  </div>
                </div>

                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold site-text-primary mb-2">Lifetime Support</h3>
                      <p className="site-text-secondary">Post-certification career guidance, job assistance, and access to our professional network.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Preview - Right Side */}
            <div className="relative">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-96 flex flex-col items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                {/* Certificate Placeholder */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold site-text-primary mb-2">Sample Certificate</h3>
                    <p className="site-text-secondary mb-3">Certificate Preview</p>
                    <p className="text-sm site-text-muted">Interactive certificate animation will be displayed here</p>
                  </div>
                  
                  {/* Mock Certificate Elements */}
                  <div className="w-full max-w-xs mx-auto mt-6">
                    <div className="site-glass backdrop-blur-sm border-2 border-[#4F46E5] rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">PMI</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold site-text-primary mb-1">Certificate of Completion</div>
                        <div className="text-xs site-text-secondary">PMP® Certification Training</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#4F46E5] rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#8B5CF6] rounded-full opacity-60 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-[#10B981] rounded-full opacity-60 animate-pulse delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

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
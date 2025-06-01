"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineRefresh, HiOutlineDesktopComputer, HiOutlineCloud, HiOutlineCog, HiOutlineChartBar, HiOutlineCode, HiOutlineLockClosed, HiOutlineMenu } from "react-icons/hi";
import { BiData, BiBarChartAlt2 } from "react-icons/bi";
import SiteThemeToggle from "./SiteThemeToggle";

const DOMAIN_ICONS: Record<string, React.ReactElement> = {
  "Project Management": <HiOutlineDesktopComputer className="w-4 h-4 mr-2" />,
  "Quality Management": <HiOutlineChartBar className="w-4 h-4 mr-2" />,
  "Agile and Scrum": <HiOutlineRefresh className="w-4 h-4 mr-2" />,
  "Soft Skills Courses": <HiOutlineCog className="w-4 h-4 mr-2" />,
  "Cloud Computing": <HiOutlineCloud className="w-4 h-4 mr-2" />,
  "E-Learning": <HiOutlineCode className="w-4 h-4 mr-2" />,
};

const ACCREDI_DOMAINS = [
  "Project Management",
  "Quality Management", 
  "Agile and Scrum",
  "Soft Skills Courses",
  "Cloud Computing",
  "E-Learning"
];

const DOMAIN_COURSES: Record<string, any> = {
  "Project Management": {
    description: "Master project management methodologies with industry-leading certifications and training programs.",
    courses: [
      {
        title: "PMP® Certification Training – Leading Instructor-led Online PMP® Course in the USA & Canada",
        slug: "pmp-certification-training",
        provider: "PMI",
        hours: "36 Hours",
        badge: "Best Seller",
        badgeColor: "bg-orange-500",
        icon: "🏆"
      },
      {
        title: "Project Management Fundamentals Training",
        slug: "project-management-fundamentals",
        provider: "Accredi",
        hours: "24 Hours",
        icon: "📊"
      },
      {
        title: "PMI Risk Management Professional (PMI-RMP)®",
        slug: "pmi-rmp-certification",
        provider: "PMI",
        hours: "32 Hours",
        badge: "Popular",
        badgeColor: "bg-[#4F46E5]",
        icon: "⚠️"
      },
      {
        title: "Program Management Professional (PgMP)®",
        slug: "pgmp-certification",
        provider: "PMI",
        hours: "40 Hours",
        badge: "Advanced",
        badgeColor: "bg-green-500",
        icon: "🎯"
      }
    ]
  },
  "Quality Management": {
    description: "Enhance quality management skills with Six Sigma and Lean methodologies certification training.",
    courses: [
      {
        title: "Lean Six Sigma Green Belt Certification Training",
        slug: "lean-six-sigma-green-belt",
        provider: "IASSC",
        hours: "32 Hours",
        badge: "Popular",
        badgeColor: "bg-[#4F46E5]",
        icon: "🟢"
      },
      {
        title: "Lean Six Sigma Black Belt Certification Training",
        slug: "lean-six-sigma-black-belt",
        provider: "IASSC",
        hours: "40 Hours",
        badge: "Advanced",
        badgeColor: "bg-green-500",
        icon: "⚫"
      }
    ]
  },
  "Agile and Scrum": {
    description: "Master Agile methodologies and Scrum framework for efficient project delivery and team collaboration.",
    courses: [
      {
        title: "Agile Certified Practitioner (PMI-ACP)® Training",
        slug: "pmi-acp-certification",
        provider: "PMI",
        hours: "24 Hours",
        badge: "Trending",
        badgeColor: "bg-[#B39DDB]",
        icon: "🚀"
      }
    ]
  },
  "Soft Skills Courses": {
    description: "Develop essential soft skills for effective leadership, communication, and project management.",
    courses: [
      {
        title: "Conflict Management Training",
        slug: "conflict-management-training",
        provider: "Accredi",
        hours: "16 Hours",
        icon: "🤝"
      },
      {
        title: "Project Management Techniques Training",
        slug: "project-management-techniques",
        provider: "Accredi",
        hours: "20 Hours",
        icon: "🛠️"
      }
    ]
  },
  "Cloud Computing": {
    description: "Build cloud expertise with AWS certification training and cloud architecture best practices.",
    courses: [
      {
        title: "AWS® Certified Cloud Practitioner Training",
        slug: "aws-cloud-practitioner",
        provider: "AWS",
        hours: "24 Hours",
        badge: "Popular",
        badgeColor: "bg-[#4F46E5]",
        icon: "☁️"
      },
      {
        title: "AWS® Certified Solutions Architect - Associate Training",
        slug: "aws-solutions-architect-associate",
        provider: "AWS",
        hours: "32 Hours",
        badge: "Best Seller",
        badgeColor: "bg-orange-500",
        icon: "🏗️"
      }
    ]
  },
  "E-Learning": {
    description: "Flexible online learning options for professional development and certification preparation.",
    courses: [
      {
        title: "PMP® Certification Training – Leading Online PMP® Course in USA & Canada",
        slug: "pmp-online-certification",
        provider: "PMI",
        hours: "36 Hours",
        badge: "Online",
        badgeColor: "bg-[#B39DDB]",
        icon: "💻"
      }
    ]
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuAnimating, setIsMobileMenuAnimating] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [selectedMobileDomain, setSelectedMobileDomain] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState(ACCREDI_DOMAINS[0]);
  const menuRef = useRef<HTMLDivElement>(null);
  const allCoursesBtnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Timeout refs for hover delays
  const menuCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuOpenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Open menu on All Courses button or menu hover with slight delay
  const handleMenuOpen = () => {
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
    if (!isMenuOpen) {
      menuOpenTimeoutRef.current = setTimeout(() => {
        setIsMenuOpen(true);
      }, 100);
    }
  };

  // Close menu with delay to allow smooth transition
  const handleMenuClose = () => {
    if (menuOpenTimeoutRef.current) {
      clearTimeout(menuOpenTimeoutRef.current);
      menuOpenTimeoutRef.current = null;
    }
    menuCloseTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  // Immediate close for other nav items
  const handleImmediateMenuClose = () => {
    if (menuOpenTimeoutRef.current) {
      clearTimeout(menuOpenTimeoutRef.current);
      menuOpenTimeoutRef.current = null;
    }
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
    setIsMenuOpen(false);
  };

  // Toggle menu for click functionality
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (menuCloseTimeoutRef.current) {
        clearTimeout(menuCloseTimeoutRef.current);
      }
      if (menuOpenTimeoutRef.current) {
        clearTimeout(menuOpenTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to close mega menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node) &&
          allCoursesBtnRef.current &&
          !allCoursesBtnRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Mobile menu animation handlers
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setTimeout(() => setIsMobileMenuAnimating(true), 10);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuAnimating(false);
    setTimeout(() => setIsMobileMenuOpen(false), 300);
  };

  const menuItems = [
    {
      title: "Company",
      items: [
        { label: "About Us", href: "/about" },
        { label: "Our Approach", href: "/about#our-approach" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Quick Links",
      items: [
        { label: "Blogs", href: "/blog" },
        { label: "Refer & Earn", href: "/refer-earn" },
        { label: "Mil/Vet Discount", href: "/mil-vet-discount" },
        { label: "Unemployed Discount", href: "/unemployed-discount" },
      ],
    },
    {
      title: "For Business",
      items: [
        { label: "Enterprise", href: "/enterprise" },
        { label: "Become Instructor", href: "/become-instructor" },
      ],
    },
  ];

  return (
    <React.Fragment>
      {/* Navbar always visible */}
      <div ref={navRef} className="py-4 sm:py-6 xl:px-20 sm:px-28 px-0 flex relative justify-center items-center h-[72px] !py-0 site-navbar z-[100]">
        <div className="px-5 md:px-0 w-full 2xl:max-w-7xl mx-auto">
          <nav className="flex h-11 justify-between">
            {/* Logo and All Courses */}
            <div className="flex gap-5 items-center">
              <div className="h-11 w-[138px] relative overflow-hidden">
                <Link href="/">
                <Image
                  src="/Logo/Only_Transperent/full_trimmed_transparent_base.png"
                  alt="Accredi Logo"
                  width={138}
                  height={44}
                  priority
                  unoptimized
                  className="object-contain w-full h-full site-logo"
                />
                </Link>
              </div>
              {/* All Courses Mega Menu - Hidden on mobile */}
              <div className="ml-8 relative hidden md:block">
                <button
                  ref={allCoursesBtnRef}
                  className="all-courses-button flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium text-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 site-light:bg-white/80 site-light:border-slate-300 site-light:text-slate-800 site-light:hover:bg-white site-light:hover:text-slate-900"
                  type="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  onMouseEnter={handleMenuOpen}
                  onMouseLeave={handleMenuClose}
                  onClick={handleMenuToggle}
                >
                  <HiOutlineMenu className="w-5 h-5 mr-1" />
                  All Courses
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Navigation Items - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              {menuItems.map((menu, index) => (
                <div key={index} className="group relative"
                  onMouseEnter={handleImmediateMenuClose}
                >
                  <div className="relative pr-4 pl-4 py-2 hover:bg-white/10 rounded-xl flex items-center gap-0.5 text-white font-normal cursor-pointer duration-300 transition-all hover:scale-105 site-light:text-slate-700 site-light:hover:text-slate-900 site-light:hover:bg-slate-100">
                    <span>{menu.title}</span>
                    <i className="icon-chevron-right rotate-90 text-base leading-4 text-gray-300 site-light:text-slate-500"></i>
                  </div>
                  {/* Hover bridge - invisible area to prevent dropdown closing */}
                  <div className="absolute top-full left-0 right-0 h-2 z-40 hidden group-hover:block"></div>
                  <div className="absolute z-50 flex-col hidden bg-white/10 backdrop-blur-xl border border-white/20 py-2 min-w-[220px] rounded-2xl shadow-2xl group-hover:flex duration-300 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 mt-2 site-light:bg-white/90 site-light:border-slate-200">
                    {menu.items.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="pr-4 pl-4 border-b border-white/10 last:border-b-0 hover:bg-white/10 duration-300 block site-light:border-slate-200 site-light:hover:bg-slate-50"
                      >
                        <div className="py-3 text-sm cursor-pointer whitespace-nowrap text-white hover:text-[#4F46E5] transition-colors site-light:text-slate-700 site-light:hover:text-[#4F46E5]">
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {/* Reviews Link */}
              <Link
                href="/reviews"
                className="relative pr-4 pl-4 py-2 hover:bg-white/10 rounded-xl flex items-center gap-0.5 text-white font-normal cursor-pointer duration-300 transition-all hover:scale-105 site-light:text-slate-700 site-light:hover:text-slate-900 site-light:hover:bg-slate-100"
                onMouseEnter={handleImmediateMenuClose}
              >
                Reviews
              </Link>

              {/* Sign In Button */}
              <Link
                href="/login"
                className="relative pr-4 pl-4 py-2 hover:bg-white/10 rounded-xl flex items-center gap-0.5 text-white font-normal cursor-pointer duration-300 transition-all hover:scale-105 site-light:text-slate-700 site-light:hover:text-slate-900 site-light:hover:bg-slate-100"
                onMouseEnter={handleImmediateMenuClose}
              >
                Sign In
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="relative px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 text-sm font-medium hover:scale-105"
                onMouseEnter={handleImmediateMenuClose}
              >
                Sign Up
              </Link>

              {/* Site Theme Toggle - Far Right */}
              <div className="ml-4">
                <SiteThemeToggle />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              {/* Hamburger Menu Button */}
              <button
                onClick={openMobileMenu}
                className="w-10 h-10 flex justify-center items-center text-white hover:bg-white/10 rounded-lg transition-colors site-light:text-slate-700 site-light:hover:text-slate-900 site-light:hover:bg-slate-100"
              >
                <HiOutlineMenu className="w-5 h-5" />
              </button>
              
              {/* All Courses Button */}
              <button
                onClick={() => setIsMobileCoursesOpen(true)}
                className="flex bg-white/10 backdrop-blur-sm whitespace-nowrap rounded-xl py-3 pr-3 pl-4 border border-white/20 items-center gap-2 hover:bg-white/20 transition-all duration-300 site-light:bg-white/60 site-light:border-slate-200 site-light:hover:bg-white/80"
              >
                <span className="text-sm text-white font-semibold site-light:text-slate-700">All Courses</span>
                <svg className="w-4 h-4 rotate-90 text-white site-light:text-slate-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Theme Toggle for Mobile - Far Right */}
              <SiteThemeToggle />
            </div>
          </nav>
        </div>
      </div>
      {/* Overlay and Mega Menu - Hidden on mobile */}
      {isMenuOpen && (
        <React.Fragment>
          {/* Overlay (not covering navbar) */}
          <div className="hidden md:block fixed inset-0 top-[72px] z-40 bg-black/50 backdrop-blur-sm site-light:bg-black/20" />
          {/* Mega Menu */}
          <div
            className="hidden md:flex fixed left-1/2 top-[72px] z-50 -translate-x-1/2 w-[1200px] h-[calc(100vh-72px)] shadow-2xl overflow-hidden bg-gradient-to-br from-[#0F0F23]/95 via-[#1A1A3E]/95 to-[#2D1B69]/95 site-light:bg-gradient-to-br site-light:from-white/98 site-light:via-gray-50/98 site-light:to-slate-100/98 backdrop-blur-xl border border-white/20 site-light:border-slate-200"
            ref={menuRef}
            style={{ borderRadius: "0 0 20px 20px" }}
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
          >
            {/* Sidebar */}
            <div className="w-72 bg-white/5 site-light:bg-slate-100/80 backdrop-blur-sm h-full py-6 px-0 flex flex-col border-r border-white/20 site-light:border-slate-200 overflow-y-auto text-[15px]">
              <div className="font-semibold text-white site-light:text-slate-900 mb-4 pl-8 text-[15px]">Course Domains</div>
              <ul className="flex-1">
                {ACCREDI_DOMAINS.map((domain) => (
                  <li
                    key={domain}
                    className={`flex items-center px-8 py-3 cursor-pointer text-[15px] transition-all duration-300 hover:scale-105
                      ${activeDomain === domain
                        ? "bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/10 site-light:to-[#7C3AED]/10 text-[#4F46E5] font-semibold border-r-2 border-[#4F46E5]"
                        : "text-gray-300 site-light:text-slate-600 hover:bg-white/10 site-light:hover:bg-slate-100 hover:text-white site-light:hover:text-slate-900"
                      }`}
                    onClick={() => setActiveDomain(domain)}
                  >
                    {DOMAIN_ICONS[domain] ?? <HiOutlineDesktopComputer className="w-4 h-4 mr-2" />}
                    {domain}
                    {activeDomain === domain && (
                      <svg className="ml-auto w-4 h-4 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
              <Link
                href="/courses"
                className="block mt-4 text-[14px] font-bold text-[#4F46E5] hover:text-white site-light:hover:text-[#4F46E5] transition-colors pl-8 hover:underline"
              >
                Browse All Courses <span aria-hidden>→</span>
              </Link>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-white/5 site-light:bg-white/50 backdrop-blur-sm h-full p-8 overflow-y-auto text-[15px] flex flex-col justify-start border-l border-white/10 site-light:border-slate-200" style={{ borderRadius: "0 0 20px 0" }}>
              <div className="font-bold text-2xl text-white site-light:text-slate-900 mb-2">{activeDomain}</div>
              <div className="text-sm text-gray-300 site-light:text-slate-600 mb-6">
                {DOMAIN_COURSES[activeDomain]?.description || `Master ${activeDomain.toLowerCase()} methodologies for efficient and timely project delivery.`}
                <Link href={`/courses?domain=${activeDomain.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 text-[#4F46E5] text-sm font-medium hover:underline">View All {activeDomain} Courses</Link>
              </div>
              
              {/* Course List */}
              <div className="space-y-4">
                <div className="font-semibold text-white site-light:text-slate-900 mb-4 text-[16px]">Available Courses</div>
                {DOMAIN_COURSES[activeDomain]?.courses?.map((course: any, idx: number) => (
                  <Link
                    key={idx}
                    href={`/courses/${course.slug}`}
                    className="block p-4 bg-white/5 site-light:bg-white/70 backdrop-blur-sm border border-white/20 site-light:border-slate-200 rounded-2xl hover:bg-white/10 site-light:hover:bg-white/90 hover:shadow-xl transition-all duration-300 group hover:scale-105"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{course.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {course.provider && (
                            <>
                              <span className="text-xs font-medium text-gray-300 site-light:text-slate-500">{course.provider}</span>
                              <span className="w-1 h-1 bg-gray-400 site-light:bg-slate-400 rounded-full"></span>
                            </>
                          )}
                          <span className="text-xs text-gray-400 site-light:text-slate-500">{course.hours}</span>
                          {course.badge && (
                            <span className={`px-2 py-0.5 text-xs text-white rounded-full ${course.badgeColor}`}>
                              {course.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-white site-light:text-slate-800 group-hover:text-[#4F46E5] transition-colors leading-tight">
                          {course.title}
                        </h4>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 site-light:text-slate-500 group-hover:text-[#4F46E5] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )) || (
                  <div className="text-center py-8 text-gray-400 site-light:text-slate-500">
                    Course details coming soon for {activeDomain}
                  </div>
                )}
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="w-72 bg-white/5 site-light:bg-slate-100/60 backdrop-blur-sm h-full py-6 px-6 border-l border-white/20 site-light:border-slate-200 flex flex-col overflow-y-auto text-[14px]">
              <div className="font-semibold text-white site-light:text-slate-900 mb-4">Popular Resources</div>
              <ul>
                <li className="mb-3 text-[#4F46E5] cursor-pointer hover:text-white site-light:hover:text-[#4F46E5] transition-colors">PMP Study Guide <span aria-hidden>→</span></li>
                <li className="mb-3 text-[#4F46E5] cursor-pointer hover:text-white site-light:hover:text-[#4F46E5] transition-colors">Project Management Tips <span aria-hidden>→</span></li>
                <li className="mb-3 text-[#4F46E5] cursor-pointer hover:text-white site-light:hover:text-[#4F46E5] transition-colors">Certification Comparison <span aria-hidden>→</span></li>
                <li className="mb-3 text-[#4F46E5] cursor-pointer hover:text-white site-light:hover:text-[#4F46E5] transition-colors">Free Practice Tests <span aria-hidden>→</span></li>
                <li className="mb-3 text-[#4F46E5] cursor-pointer hover:text-white site-light:hover:text-[#4F46E5] transition-colors">Career Guidance <span aria-hidden>→</span></li>
              </ul>
              
              <hr className="my-4 border-white/20 site-light:border-slate-200" />
              
              <div className="font-semibold text-white site-light:text-slate-900 mb-4">Need Help?</div>
              <div className="space-y-3">
                <Link href="/contact" className="block text-sm text-gray-300 site-light:text-slate-600 hover:text-[#4F46E5] transition-colors">
                  Contact Our Advisors
                </Link>
                <Link href="/blog" className="block text-sm text-gray-300 site-light:text-slate-600 hover:text-[#4F46E5] transition-colors">
                  Read Our Blog
                </Link>
                <Link href="/about" className="block text-sm text-gray-300 site-light:text-slate-600 hover:text-[#4F46E5] transition-colors">
                  About Accredi
                </Link>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      {/* Mobile Main Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isMobileMenuAnimating ? 'bg-opacity-80' : 'bg-opacity-0'
            }`}
            onClick={closeMobileMenu} 
          />
          <div className={`fixed left-0 top-0 h-full w-[300px] site-mobile-menu backdrop-blur-xl rounded-tr-[20px] transform transition-transform duration-300 ease-in-out ${
            isMobileMenuAnimating ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 site-light:border-slate-200">
                <div className="h-8 w-[110px] relative">
                  <Image
                    src="/Logo/Only_Transperent/full_trimmed_transparent_base.png"
                    alt="Accredi Logo"
                    width={110}
                    height={32}
                    priority
                    unoptimized
                    className="object-contain w-full h-full site-logo"
                  />
                </div>
                <button onClick={closeMobileMenu} className="p-2 site-text-primary hover:bg-white/10 site-light:hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Main Menu Items */}
                  {menuItems.map((menu, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between py-3 site-text-primary border-b border-white/20 site-light:border-slate-200">
                        <span className="text-sm font-medium">{menu.title}</span>
                        <svg className="w-4 h-4 rotate-90 site-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      {/* Submenu Items */}
                      <div className="ml-4 mt-2 space-y-2">
                        {menu.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className="block py-2 text-sm site-text-secondary hover:text-[#4F46E5] transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Reviews Link */}
                  <div className="border-b border-white/20 site-light:border-slate-200">
                    <Link
                      href="/reviews"
                      className="flex items-center justify-between py-3 site-text-primary hover:text-[#4F46E5] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Reviews</span>
                    </Link>
                  </div>
                  
                  {/* About Us Link */}
                  <div className="border-b border-white/20 site-light:border-slate-200">
                    <Link
                      href="/about"
                      className="flex items-center justify-between py-3 site-text-primary hover:text-[#4F46E5] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">About Us</span>
                    </Link>
                  </div>
                  
                  {/* Sign In Link */}
                  <div className="border-b border-white/20 site-light:border-slate-200">
                    <Link
                      href="/login"
                      className="flex items-center justify-between py-3 site-text-primary hover:text-[#4F46E5] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Sign In</span>
                    </Link>
                  </div>
                  
                  {/* Sign Up Link */}
                  <div>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Sign Up</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="p-4 border-t border-white/20 site-light:border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="site-text-secondary">Need help choosing?</span>
                  <button className="text-[#4F46E5] font-medium hover:text-white site-light:hover:text-[#4F46E5] transition-colors">Call Us</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Courses Menu Overlay */}
      {isMobileCoursesOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-80" onClick={() => setIsMobileCoursesOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full site-mobile-menu backdrop-blur-xl transform transition-transform duration-500">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 site-light:border-slate-200">
                <h2 className="text-lg font-bold site-text-primary">
                  {selectedMobileDomain || "Course Domains"}
                </h2>
                <button 
                  onClick={() => {
                    setIsMobileCoursesOpen(false);
                    setSelectedMobileDomain(null);
                  }} 
                  className="p-2 site-text-primary hover:bg-white/10 site-light:hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Domains List or Domain Detail */}
              <div className="flex-1 overflow-y-auto">
                {!selectedMobileDomain ? (
                  // Domains List
                  ACCREDI_DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedMobileDomain(domain)}
                      className="w-full flex items-center justify-between px-4 py-4 border-b border-white/20 site-light:border-slate-200 hover:bg-white/10 site-light:hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        {DOMAIN_ICONS[domain] ?? <HiOutlineDesktopComputer className="w-5 h-5 site-text-secondary" />}
                        <span className="text-sm font-medium site-text-primary">{domain}</span>
                      </div>
                      <svg className="w-5 h-5 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))
                ) : (
                  // Domain Detail View
                  <div className="p-4">
                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedMobileDomain(null)}
                      className="flex items-center gap-2 mb-4 px-3 py-2 site-border border rounded-full text-sm site-text-secondary hover:bg-white/10 site-light:hover:bg-slate-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Menu
                    </button>

                    {/* Domain Header */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold site-text-primary mb-2">{selectedMobileDomain}</h2>
                      <p className="text-sm site-text-secondary mb-3">
                        {DOMAIN_COURSES[selectedMobileDomain]?.description || `Master ${selectedMobileDomain.toLowerCase()} methodologies for efficient and timely project delivery.`}
                      </p>
                      <a href="#" className="text-sm text-[#4F46E5] font-medium">
                        View All {selectedMobileDomain} Courses
                      </a>
                    </div>

                    {/* Course Categories */}
                    {DOMAIN_COURSES[selectedMobileDomain] ? (
                      <div className="space-y-6">
                        {/* Courses */}
                        {DOMAIN_COURSES[selectedMobileDomain].courses?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold site-text-primary mb-4">Available Courses</h3>
                            <div className="space-y-4">
                              {DOMAIN_COURSES[selectedMobileDomain].courses.map((course: any, idx: number) => (
                                <Link
                                  key={idx}
                                  href={`/courses/${course.slug}`}
                                  onClick={() => {
                                    setIsMobileCoursesOpen(false);
                                    setSelectedMobileDomain(null);
                                  }}
                                  className="flex gap-3 p-3 site-border border rounded-lg hover:shadow-md transition-shadow site-glass hover:bg-white/15 site-light:hover:bg-white/70"
                                >
                                  <div className="text-2xl">{course.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      {course.provider && (
                                        <>
                                          <span className="text-xs site-text-muted">{course.provider}</span>
                                          <span className="w-1 h-1 bg-gray-400 site-light:bg-slate-400 rounded-full"></span>
                                        </>
                                      )}
                                      <span className="text-xs site-text-muted">{course.hours}</span>
                                      {course.badge && (
                                        <span className={`px-2 py-0.5 text-xs text-white rounded ${course.badgeColor}`}>
                                          {course.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm font-medium site-text-primary leading-tight">{course.title}</p>
                                  </div>
                                  <svg className="w-5 h-5 site-text-muted flex-shrink-0 self-center" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Fallback for domains without detailed course data
                      <div className="text-center py-8">
                        <p className="site-text-muted">Course details coming soon for {selectedMobileDomain}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bottom Section */}
              <div className="p-4 border-t border-white/20 site-light:border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="site-text-secondary">Need help choosing?</span>
                  <Link 
                    href="/contact" 
                    className="text-[#4F46E5] font-medium"
                    onClick={() => {
                      setIsMobileCoursesOpen(false);
                      setSelectedMobileDomain(null);
                    }}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Navbar; 
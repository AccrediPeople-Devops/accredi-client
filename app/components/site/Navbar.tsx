"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineRefresh, HiOutlineDesktopComputer, HiOutlineCloud, HiOutlineCog, HiOutlineChartBar, HiOutlineCode, HiOutlineLockClosed, HiOutlineMenu } from "react-icons/hi";
import { BiData, BiBarChartAlt2 } from "react-icons/bi";

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

  // Open menu on All Courses button or menu hover
  const handleMenuOpen = () => setIsMenuOpen(true);
  // Close menu on other navbar item hover
  const handleMenuClose = () => setIsMenuOpen(false);

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
      <div ref={navRef} className="py-4 sm:py-6 xl:px-20 sm:px-28 px-0 flex relative justify-center items-center h-[72px] !py-0 bg-white z-[100]">
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
                  className="object-contain w-full h-full"
                />
                </Link>
              </div>
              {/* All Courses Mega Menu - Hidden on mobile */}
              <div className="ml-8 relative hidden md:block">
                <button
                  ref={allCoursesBtnRef}
                  className="all-courses-button flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded bg-white text-gray-800 font-medium text-sm hover:shadow transition"
                  type="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  onMouseEnter={handleMenuOpen}
                >
                  <HiOutlineMenu className="w-5 h-5 mr-1" />
                  All Courses
                  <svg
                    className="w-4 h-4 ml-1"
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
                  onMouseEnter={handleMenuClose}
                >
                  <div className="relative pr-2.5 pl-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-gray-800 font-normal cursor-pointer duration-300">
                    <span>{menu.title}</span>
                    <i className="icon-chevron-right rotate-90 text-base leading-4 text-gray-500"></i>
                  </div>
                  <div className="absolute z-50 flex-col hidden border border-gray-200 bg-white py-1 min-w-[220px] rounded-tr-xl rounded-b-xl shadow-lg group-hover:block duration-300">
                    {menu.items.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="pr-2.5 pl-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 duration-300 block"
                      >
                        <div className="py-2 text-sm cursor-pointer whitespace-nowrap text-gray-800">
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
                className="relative pr-2.5 pl-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-gray-800 font-normal cursor-pointer duration-300"
                onMouseEnter={handleMenuClose}
              >
                Reviews
              </Link>

              {/* Sign In Button */}
              <Link
                href="/login"
                className="relative pr-2.5 pl-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-gray-800 font-normal cursor-pointer duration-300"
                onMouseEnter={handleMenuClose}
              >
                Sign In
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="relative px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors text-sm font-medium"
                onMouseEnter={handleMenuClose}
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              {/* Hamburger Menu Button */}
              <button
                onClick={openMobileMenu}
                className="w-10 h-10 flex justify-center items-center"
              >
                <HiOutlineMenu className="w-5 h-5 text-gray-800" />
              </button>
              
              {/* All Courses Button */}
              <button
                onClick={() => setIsMobileCoursesOpen(true)}
                className="flex bg-white whitespace-nowrap rounded-lg py-3 pr-2 pl-3 border border-gray-300 items-center gap-2 shadow-sm"
              >
                <span className="text-sm text-gray-800 font-semibold">All Courses</span>
                <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>
      {/* Overlay and Mega Menu - Hidden on mobile */}
      {isMenuOpen && (
        <React.Fragment>
          {/* Overlay (not covering navbar) */}
          <div className="hidden md:block fixed inset-0 top-[72px] z-40 bg-black/30 backdrop-blur-sm" />
          {/* Mega Menu */}
          <div
            className="hidden md:flex fixed left-1/2 top-[72px] z-50 -translate-x-1/2 w-[1200px] h-[calc(100vh-72px)] shadow-2xl overflow-hidden"
            ref={menuRef}
            style={{ borderRadius: "0 0 20px 20px" }}
            onMouseEnter={handleMenuOpen}
          >
            {/* Sidebar */}
            <div className="w-72 bg-gray-50 h-full py-6 px-0 flex flex-col border-r border-gray-200 overflow-y-auto text-[15px]">
              <div className="font-semibold text-gray-700 mb-3 pl-8 text-[15px]">Domains</div>
              <ul className="flex-1">
                {ACCREDI_DOMAINS.map((domain) => (
                  <li
                    key={domain}
                    className={`flex items-center px-8 py-2 cursor-pointer text-[15px] transition
                      ${activeDomain === domain
                        ? "bg-white text-[#4F46E5] font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
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
                className="block mt-4 text-[14px] font-bold text-gray-900 hover:underline pl-8"
              >
                Browse All Courses <span aria-hidden>→</span>
              </Link>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-white h-full p-8 overflow-y-auto text-[15px] flex flex-col justify-start" style={{ borderRadius: "0 0 20px 0" }}>
              <div className="font-bold text-lg text-gray-800 mb-1">{activeDomain}</div>
              <div className="text-xs text-gray-500 mb-4">
                {DOMAIN_COURSES[activeDomain]?.description || `Master ${activeDomain.toLowerCase()} methodologies for efficient and timely project delivery.`}
                <Link href={`/courses?domain=${activeDomain.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 text-[#4F46E5] text-xs font-medium hover:underline">View All {activeDomain} Courses</Link>
              </div>
              
              {/* Course List */}
              <div className="space-y-4">
                <div className="font-semibold text-gray-800 mb-3 text-[14px]">Available Courses</div>
                {DOMAIN_COURSES[activeDomain]?.courses?.map((course: any, idx: number) => (
                  <Link
                    key={idx}
                    href={`/courses/${course.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{course.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {course.provider && (
                            <>
                              <span className="text-xs font-medium text-gray-700">{course.provider}</span>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            </>
                          )}
                          <span className="text-xs text-gray-500">{course.hours}</span>
                          {course.badge && (
                            <span className={`px-2 py-0.5 text-xs text-white rounded ${course.badgeColor}`}>
                              {course.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#4F46E5] transition-colors leading-tight">
                          {course.title}
                        </h4>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-[#4F46E5] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    Course details coming soon for {activeDomain}
                  </div>
                )}
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="w-72 bg-white h-full py-6 px-6 border-l border-gray-200 flex flex-col overflow-y-auto text-[14px]">
              <div className="font-semibold text-gray-700 mb-3">Popular Resources</div>
              <ul>
                <li className="mb-2 text-[#4F46E5] cursor-pointer hover:underline">PMP Study Guide <span aria-hidden>→</span></li>
                <li className="mb-2 text-[#4F46E5] cursor-pointer hover:underline">Project Management Tips <span aria-hidden>→</span></li>
                <li className="mb-2 text-[#4F46E5] cursor-pointer hover:underline">Certification Comparison <span aria-hidden>→</span></li>
                <li className="mb-2 text-[#4F46E5] cursor-pointer hover:underline">Free Practice Tests <span aria-hidden>→</span></li>
                <li className="mb-2 text-[#4F46E5] cursor-pointer hover:underline">Career Guidance <span aria-hidden>→</span></li>
              </ul>
              
              <hr className="my-4 border-gray-200" />
              
              <div className="font-semibold text-gray-700 mb-3">Need Help?</div>
              <div className="space-y-2">
                <Link href="/contact" className="block text-sm text-gray-600 hover:text-[#4F46E5] transition-colors">
                  Contact Our Advisors
                </Link>
                <Link href="/blog" className="block text-sm text-gray-600 hover:text-[#4F46E5] transition-colors">
                  Read Our Blog
                </Link>
                <Link href="/about" className="block text-sm text-gray-600 hover:text-[#4F46E5] transition-colors">
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
          <div className={`fixed left-0 top-0 h-full w-[300px] bg-white rounded-tr-[20px] transform transition-transform duration-300 ease-in-out ${
            isMobileMenuAnimating ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="h-8 w-[110px] relative">
                  <Image
                    src="/Logo/Only_Transperent/full_trimmed_transparent_base.png"
                    alt="Accredi Logo"
                    width={110}
                    height={32}
                    priority
                    unoptimized
                    className="object-contain w-full h-full"
                  />
                </div>
                <button onClick={closeMobileMenu} className="p-2">
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
                      <div className="flex items-center justify-between py-3 text-gray-800 border-b border-gray-100">
                        <span className="text-sm font-medium">{menu.title}</span>
                        <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      {/* Submenu Items */}
                      <div className="ml-4 mt-2 space-y-2">
                        {menu.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className="block py-2 text-sm text-gray-600 hover:text-gray-800"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Reviews Link */}
                  <div className="border-b border-gray-100">
                    <Link
                      href="/reviews"
                      className="flex items-center justify-between py-3 text-gray-800"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Reviews</span>
                    </Link>
                  </div>
                  
                  {/* About Us Link */}
                  <div className="border-b border-gray-100">
                    <Link
                      href="/about"
                      className="flex items-center justify-between py-3 text-gray-800"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">About Us</span>
                    </Link>
                  </div>
                  
                  {/* Sign In Link */}
                  <div className="border-b border-gray-100">
                    <Link
                      href="/login"
                      className="flex items-center justify-between py-3 text-gray-800"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Sign In</span>
                    </Link>
                  </div>
                  
                  {/* Sign Up Link */}
                  <div>
                    <Link
                      href="/signup"
                      className="flex items-center justify-between py-3 text-gray-800"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-sm font-medium">Sign Up</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Didn't find what you need?</span>
                  <button className="text-[#4F46E5] font-medium">Call Us</button>
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
          <div className="fixed right-0 top-0 h-full w-full bg-white transform transition-transform duration-500">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedMobileDomain || "Domains"}
                </h2>
                <button 
                  onClick={() => {
                    setIsMobileCoursesOpen(false);
                    setSelectedMobileDomain(null);
                  }} 
                  className="p-2"
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
                      className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {DOMAIN_ICONS[domain] ?? <HiOutlineDesktopComputer className="w-5 h-5 text-gray-600" />}
                        <span className="text-sm font-medium text-gray-800">{domain}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                      className="flex items-center gap-2 mb-4 px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Menu
                    </button>

                    {/* Domain Header */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedMobileDomain}</h2>
                      <p className="text-sm text-gray-600 mb-3">
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
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Courses</h3>
                            <div className="space-y-4">
                              {DOMAIN_COURSES[selectedMobileDomain].courses.map((course: any, idx: number) => (
                                <Link
                                  key={idx}
                                  href={`/courses/${course.slug}`}
                                  onClick={() => {
                                    setIsMobileCoursesOpen(false);
                                    setSelectedMobileDomain(null);
                                  }}
                                  className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                  <div className="text-2xl">{course.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      {course.provider && (
                                        <>
                                          <span className="text-xs text-gray-500">{course.provider}</span>
                                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        </>
                                      )}
                                      <span className="text-xs text-gray-500">{course.hours}</span>
                                      {course.badge && (
                                        <span className={`px-2 py-0.5 text-xs text-white rounded ${course.badgeColor}`}>
                                          {course.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 leading-tight">{course.title}</p>
                                  </div>
                                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 self-center" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                        <p className="text-gray-500">Course details coming soon for {selectedMobileDomain}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bottom Section */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Need help choosing?</span>
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
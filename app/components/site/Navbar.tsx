"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineRefresh, HiOutlineDesktopComputer, HiOutlineCloud, HiOutlineCog, HiOutlineChartBar, HiOutlineCode, HiOutlineLockClosed, HiOutlineMenu } from "react-icons/hi";
import { BiData, BiBarChartAlt2 } from "react-icons/bi";
import SiteThemeToggle from "./SiteThemeToggle";
import courseService from "../service/course.service";
import UserService from "../service/user.service";
import AuthService from "../service/auth.service";
import { Course } from "@/app/types/course";
import { CourseCategory } from "@/app/types/courseCategory";
import { User } from "@/app/types/user";
import config from "../config/config";

const DOMAIN_ICONS: Record<string, React.ReactElement> = {
  "Project Management": <HiOutlineDesktopComputer className="w-4 h-4 mr-2" />,
  "Quality Management": <HiOutlineChartBar className="w-4 h-4 mr-2" />,
  "Agile and Scrum": <HiOutlineRefresh className="w-4 h-4 mr-2" />,
  "Soft Skills": <HiOutlineCog className="w-4 h-4 mr-2" />,
  "Cloud Computing": <HiOutlineCloud className="w-4 h-4 mr-2" />,
  "E-Learning": <HiOutlineCode className="w-4 h-4 mr-2" />,
  "Technology": <HiOutlineCode className="w-4 h-4 mr-2" />,
  "Business": <BiBarChartAlt2 className="w-4 h-4 mr-2" />,
  "Data Science": <BiData className="w-4 h-4 mr-2" />,
  "Security": <HiOutlineLockClosed className="w-4 h-4 mr-2" />,
};

interface CategoryWithCourses extends CourseCategory {
  courses: Course[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuAnimating, setIsMobileMenuAnimating] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [selectedMobileDomain, setSelectedMobileDomain] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithCourses[]>([]);
  const [activeDomain, setActiveDomain] = useState<CategoryWithCourses | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  
  // User authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const allCoursesBtnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Timeout refs for hover delays
  const menuCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuOpenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        setIsCheckingAuth(false);
        return;
      }

      // Try to decode token and find user
      try {
        // Basic validation: check if token has 3 parts (JWT format)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.warn("Invalid token format, clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setCurrentUser(null);
          setIsCheckingAuth(false);
          return;
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const res = await UserService.getAllUsers();
        
        if (res?.users) {
          const foundUser = res.users.find((user: User) => 
            user.email === tokenPayload.email || 
            user._id === tokenPayload.userId ||
            user._id === tokenPayload.id
          );
          
          if (foundUser) {
            setCurrentUser(foundUser);
          } else {
            // Token exists but user not found, clear it
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setCurrentUser(null);
          }
        }
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setCurrentUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    // Optionally redirect to home page
    window.location.href = "/";
  };

  const getUserProfileImage = (user: User) => {
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    return null;
  };

  // Fetch courses and categories
  useEffect(() => {
    const fetchCoursesAndCategories = async () => {
      setIsLoadingCourses(true);
      try {
        console.log("Fetching courses for navbar...");
        const coursesResponse = await courseService.getAllCourses();
        console.log("Raw courses response:", coursesResponse);
        
        let coursesData: Course[] = [];
        if (coursesResponse?.status && coursesResponse?.courses) {
          coursesData = coursesResponse.courses.filter((course: Course) => !course.isDeleted);
        } else if (Array.isArray(coursesResponse)) {
          coursesData = coursesResponse.filter((course: Course) => !course.isDeleted);
        }

        console.log("Processed courses for navbar:", coursesData.length);

        if (coursesData.length === 0) {
          console.warn("No courses found - showing fallback categories");
          // Set some fallback categories for better UX
          const fallbackCategories: CategoryWithCourses[] = [
            {
              _id: 'fallback-1',
              name: 'Project Management',
              description: 'Professional project management certifications',
              courseCount: 0,
              image: [],
              isActive: true,
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              courses: []
            },
            {
              _id: 'fallback-2', 
              name: 'Quality Management',
              description: 'Quality and process improvement certifications',
              courseCount: 0,
              image: [],
              isActive: true,
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              courses: []
            },
            {
              _id: 'fallback-3',
              name: 'Agile and Scrum',
              description: 'Agile methodology and Scrum certifications',
              courseCount: 0,
              image: [],
              isActive: true,
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              courses: []
            }
          ];
          setCategories(fallbackCategories);
          if (fallbackCategories.length > 0) {
            setActiveDomain(fallbackCategories[0]);
          }
          setIsLoadingCourses(false);
          return;
        }

        // Extract unique categories from courses and group courses by category
        const categoriesMap = new Map<string, CategoryWithCourses>();
        
        coursesData.forEach(course => {
          console.log("Processing course:", course.title, "Category:", course.categoryId);
          if (course.categoryId && typeof course.categoryId === 'object') {
            const category = course.categoryId as any;
            const categoryId = category._id;
            
            if (!categoriesMap.has(categoryId)) {
              categoriesMap.set(categoryId, {
                ...category,
                courses: []
              });
            }
            categoriesMap.get(categoryId)!.courses.push(course);
          }
        });

        const categoriesWithCourses = Array.from(categoriesMap.values())
          .filter(category => category.courses.length > 0) // Only show categories that have courses
          .sort((a, b) => b.courses.length - a.courses.length); // Sort by number of courses

        console.log("Categories with courses:", categoriesWithCourses.map(cat => `${cat.name}: ${cat.courses.length} courses`));

        setCategories(categoriesWithCourses);
        if (categoriesWithCourses.length > 0) {
          setActiveDomain(categoriesWithCourses[0]);
        }
      } catch (error: any) {
        console.error("Error fetching courses for navbar:", error);
        // Always set fallback categories on error
        console.warn("Setting fallback categories due to error");
        const fallbackCategories: CategoryWithCourses[] = [
          {
            _id: 'fallback-1',
            name: 'Project Management',
            description: 'Professional project management certifications',
            courseCount: 0,
            image: [],
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            courses: []
          },
          {
            _id: 'fallback-2', 
            name: 'Quality Management',
            description: 'Quality and process improvement certifications',
            courseCount: 0,
            image: [],
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            courses: []
          },
          {
            _id: 'fallback-3',
            name: 'Agile and Scrum',
            description: 'Agile methodology and Scrum certifications',
            courseCount: 0,
            image: [],
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            courses: []
          }
        ];
        setCategories(fallbackCategories);
        if (fallbackCategories.length > 0) {
          setActiveDomain(fallbackCategories[0]);
        }
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCoursesAndCategories();
    checkAuthStatus();

    // Add global function for debugging
    if (typeof window !== "undefined") {
      (window as any).clearTokens = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        console.log("Tokens cleared manually");
        window.location.reload();
      };
      
      // Add debug function to manually fetch courses
      (window as any).debugCourses = async () => {
        console.log("=== DEBUG: Manual course fetch ===");
        try {
          const response = await courseService.getAllCourses();
          console.log("Debug courses response:", response);
          return response;
        } catch (error) {
          console.error("Debug courses error:", error);
          return error;
        }
      };
    }
  }, []);

  // Helper function to get course image URL
  const getCourseImageUrl = (course: Course) => {
    if (course.upload?.courseImage?.[0]) {
      const image = course.upload.courseImage[0];
      if (image.path) {
        if (image.path.startsWith('http')) {
          return image.path;
        } else {
          return `${config.imageUrl}${image.path}`;
        }
      } else if (image.url) {
        return image.url;
      } else if (image.key) {
        return `${config.imageUrl}${image.key}`;
      }
    }
    return "/api/placeholder/300/200";
  };

  // Helper function to get category image URL
  const getCategoryImageUrl = (category: CourseCategory) => {
    if (category.image?.[0]) {
      const image = category.image[0];
      if (image.url) {
        return `${config.apiUrl}${image.url}`;
      } else if (image.path) {
        if (image.path.startsWith('http')) {
          return image.path;
        } else {
          return `${config.apiUrl}${image.path}`;
        }
      } else if (image.key) {
        return `${config.imageUrl}${image.key}`;
      }
    }
    return "/api/placeholder/40/40";
  };

  // Helper function to get a default icon based on category name (fallback)
  const getCategoryIcon = (categoryName: string) => {
    // Try to find a matching icon by checking if category name contains keywords
    const name = categoryName.toLowerCase();
    if (name.includes('project') || name.includes('management')) {
      return DOMAIN_ICONS["Project Management"];
    } else if (name.includes('quality') || name.includes('six sigma') || name.includes('lean')) {
      return DOMAIN_ICONS["Quality Management"];
    } else if (name.includes('agile') || name.includes('scrum')) {
      return DOMAIN_ICONS["Agile and Scrum"];
    } else if (name.includes('cloud') || name.includes('aws')) {
      return DOMAIN_ICONS["Cloud Computing"];
    } else if (name.includes('soft') || name.includes('skill')) {
      return DOMAIN_ICONS["Soft Skills"];
    } else if (name.includes('data') || name.includes('analytics')) {
      return DOMAIN_ICONS["Data Science"];
    } else if (name.includes('security') || name.includes('cyber')) {
      return DOMAIN_ICONS["Security"];
    } else if (name.includes('business')) {
      return DOMAIN_ICONS["Business"];
    } else if (name.includes('technology') || name.includes('tech')) {
      return DOMAIN_ICONS["Technology"];
    }
    // Default icon
    return <HiOutlineDesktopComputer className="w-4 h-4 mr-2" />;
  };

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

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          allCoursesBtnRef.current && !allCoursesBtnRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        { label: "Our Approach", href: "/landing#our-approach" },
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
        { label: "Enterprise", href: "/enterprises" },
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

              {/* Authentication Section */}
              {isCheckingAuth ? (
                <div className="w-20 h-10 bg-white/10 rounded-xl animate-pulse"></div>
              ) : currentUser ? (
                /* User Profile Dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 site-light:hover:bg-slate-100"
                    onMouseEnter={handleImmediateMenuClose}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                      {getUserProfileImage(currentUser) ? (
                        <Image
                          src={getUserProfileImage(currentUser)!}
                          alt={currentUser.fullName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-white font-medium text-sm">
                          {currentUser.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-medium text-sm site-light:text-slate-700">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-white site-light:text-slate-700 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth={2} 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 site-glass backdrop-blur-xl rounded-xl shadow-2xl border site-border overflow-hidden z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b site-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                            {getUserProfileImage(currentUser) ? (
                              <Image
                                src={getUserProfileImage(currentUser)!}
                                alt={currentUser.fullName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-white font-medium">
                                {currentUser.fullName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium site-text-primary truncate">
                              {currentUser.fullName}
                            </p>
                            <p className="text-xs site-text-secondary truncate">
                              {currentUser.email}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                currentUser.role === 'superadmin' ? 'bg-red-500/20 text-red-400 site-light:bg-red-100 site-light:text-red-700' :
                                currentUser.role === 'admin' ? 'bg-blue-500/20 text-blue-400 site-light:bg-blue-100 site-light:text-blue-700' :
                                'bg-green-500/20 text-green-400 site-light:bg-green-100 site-light:text-green-700'
                              }`}>
                                {currentUser.role === 'superadmin' ? 'Super Admin' : 
                                 currentUser.role === 'admin' ? 'Admin' : 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-sm site-text-secondary hover:site-text-primary hover:bg-white/10 site-light:hover:bg-slate-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                            </svg>
                            Dashboard
                          </Link>
                        )}
                        <div className="border-t site-border my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Sign In & Sign Up Buttons */
                <>
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
                    className="relative px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 text-sm font-medium hover:scale-105 border border-[#4F46E5]/20 site-light:border-[#4F46E5]/30 site-light:shadow-sm"
                    onMouseEnter={handleImmediateMenuClose}
                  >
                    Sign Up
                  </Link>
                </>
              )}

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
              <div className="font-semibold text-white site-light:text-slate-900 mb-4 pl-8 text-[15px]">Course Categories</div>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <ul className="flex-1">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className={`flex items-center px-8 py-3 cursor-pointer text-[15px] transition-all duration-300 hover:scale-105
                        ${activeDomain?._id === category._id
                          ? "bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/10 site-light:to-[#7C3AED]/10 text-[#4F46E5] font-semibold border-r-2 border-[#4F46E5]"
                          : "text-gray-300 site-light:text-slate-600 hover:bg-white/10 site-light:hover:bg-slate-100 hover:text-white site-light:hover:text-slate-900"
                        }`}
                      onClick={() => setActiveDomain(category)}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-3 bg-white/10 flex items-center justify-center flex-shrink-0">
                        {category.image?.[0] ? (
                          <Image
                            src={getCategoryImageUrl(category)}
                            alt={category.name}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getCategoryIcon(category.name)}
                          </div>
                        )}
                      </div>
                      <span className="flex-1">{category.name}</span>
                      <span className="text-xs text-gray-400 site-light:text-slate-500 ml-2">({category.courses.length})</span>
                      {activeDomain?._id === category._id && (
                        <svg className="ml-2 w-4 h-4 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/courses"
                className="block mt-4 text-[14px] font-bold text-[#4F46E5] hover:text-white site-light:hover:text-[#4F46E5] transition-colors pl-8 hover:underline"
              >
                Browse All Courses <span aria-hidden>→</span>
              </Link>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-white/5 site-light:bg-white/50 backdrop-blur-sm h-full p-8 overflow-y-auto text-[15px] flex flex-col justify-start border-l border-white/10 site-light:border-slate-200" style={{ borderRadius: "0 0 20px 0" }}>
              {activeDomain ? (
                <>
                  <div className="font-bold text-2xl text-white site-light:text-slate-900 mb-2">{activeDomain.name}</div>
                  <div className="text-sm text-gray-300 site-light:text-slate-600 mb-6">
                    {activeDomain.description || `Explore our comprehensive ${activeDomain.name.toLowerCase()} courses designed to advance your career.`}
                    <Link href={`/courses?category=${activeDomain._id}`} className="ml-2 text-[#4F46E5] text-sm font-medium hover:underline">
                      View All {activeDomain.name} Courses
                    </Link>
                  </div>
                  
                  {/* Course List */}
                  <div className="space-y-4">
                    <div className="font-semibold text-white site-light:text-slate-900 mb-4 text-[16px]">
                      Available Courses ({activeDomain.courses.length})
                    </div>
                    {activeDomain.courses.length > 0 ? (
                      activeDomain.courses.slice(0, 6).map((course: Course, idx: number) => (
                        <Link
                          key={course._id}
                          href={`/courses/${course._id}`}
                          className="block p-4 bg-white/5 site-light:bg-white/70 backdrop-blur-sm border border-white/20 site-light:border-slate-200 rounded-2xl hover:bg-white/10 site-light:hover:bg-white/90 hover:shadow-xl transition-all duration-300 group hover:scale-105"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {course.upload?.courseImage?.[0] ? (
                                <Image
                                  src={getCourseImageUrl(course)}
                                  alt={course.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span className="text-white font-bold text-lg">
                                  {course.title.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white site-light:text-slate-800 group-hover:text-[#4F46E5] transition-colors leading-tight mb-1">
                                {course.title}
                              </h4>
                              {course.shortDescription && (
                                <p className="text-xs text-gray-400 site-light:text-slate-500 line-clamp-2">
                                  {course.shortDescription}
                                </p>
                              )}
                            </div>
                            <svg className="w-4 h-4 text-gray-400 site-light:text-slate-500 group-hover:text-[#4F46E5] transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 site-light:text-slate-500">
                        No courses available in this category yet.
                      </div>
                    )}
                    {activeDomain.courses.length > 6 && (
                      <Link
                        href={`/courses?category=${activeDomain._id}`}
                        className="block mt-4 text-center py-3 text-[#4F46E5] hover:text-white site-light:hover:text-[#4F46E5] border border-[#4F46E5]/30 rounded-xl hover:bg-[#4F46E5]/10 transition-all duration-300"
                      >
                        View All {activeDomain.courses.length} Courses
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 site-light:text-slate-500">Loading courses...</p>
                  </div>
                </div>
              )}
            </div>
            {/* Right Sidebar - Removed Popular Resources, kept Help section only */}
            <div className="w-72 bg-white/5 site-light:bg-slate-100/60 backdrop-blur-sm h-full py-6 px-6 border-l border-white/20 site-light:border-slate-200 flex flex-col overflow-y-auto text-[14px]">
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
              
              {/* Course Statistics */}
              {categories.length > 0 && (
                <>
                  <hr className="my-6 border-white/20 site-light:border-slate-200" />
                  <div className="font-semibold text-white site-light:text-slate-900 mb-4">Quick Stats</div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 site-light:text-slate-600">Total Categories:</span>
                      <span className="text-white site-light:text-slate-900 font-medium">{categories.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 site-light:text-slate-600">Total Courses:</span>
                      <span className="text-white site-light:text-slate-900 font-medium">
                        {categories.reduce((total, cat) => total + cat.courses.length, 0)}
                      </span>
                    </div>
                    {activeDomain && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 site-light:text-slate-600">In {activeDomain.name}:</span>
                        <span className="text-[#4F46E5] font-medium">{activeDomain.courses.length}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                  
                  {/* Authentication Section */}
                  {isCheckingAuth ? (
                    <div className="py-3">
                      <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  ) : currentUser ? (
                    /* User Profile Section */
                    <>
                      <div className="border-b site-border py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                            {getUserProfileImage(currentUser) ? (
                              <Image
                                src={getUserProfileImage(currentUser)!}
                                alt={currentUser.fullName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-white font-medium">
                                {currentUser.fullName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium site-text-primary truncate">
                              {currentUser.fullName}
                            </p>
                            <p className="text-xs site-text-secondary truncate">
                              {currentUser.email}
                            </p>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium mt-1 ${
                              currentUser.role === 'superadmin' ? 'bg-red-500/20 text-red-400 site-light:bg-red-100 site-light:text-red-700' :
                              currentUser.role === 'admin' ? 'bg-blue-500/20 text-blue-400 site-light:bg-blue-100 site-light:text-blue-700' :
                              'bg-green-500/20 text-green-400 site-light:bg-green-100 site-light:text-green-700'
                            }`}>
                              {currentUser.role === 'superadmin' ? 'Super Admin' : 
                               currentUser.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* User Menu Items */}
                      {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                        <div className="border-b site-border">
                          <Link
                            href="/dashboard"
                            className="flex items-center justify-between py-3 site-text-primary hover:text-[#4F46E5] transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="text-sm font-medium">Dashboard</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                            </svg>
                          </Link>
                        </div>
                      )}
                      
                      {/* Sign Out Link */}
                      <div>
                        <button
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center justify-between py-3 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <span className="text-sm font-medium">Sign Out</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Sign In & Sign Up Links */
                    <>
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
                    </>
                  )}
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
                  {selectedMobileDomain || "Course Categories"}
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
                  // Categories List
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedMobileDomain(category._id)}
                      className="w-full flex items-center justify-between px-4 py-4 border-b border-white/20 site-light:border-slate-200 hover:bg-white/10 site-light:hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                          {category.image?.[0] ? (
                            <Image
                              src={getCategoryImageUrl(category)}
                              alt={category.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getCategoryIcon(category.name)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium site-text-primary">{category.name}</span>
                        <span className="text-xs text-gray-400 site-light:text-slate-500">({category.courses.length})</span>
                      </div>
                      <svg className="w-5 h-5 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))
                ) : (
                  // Category Detail View
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

                    {/* Category Header */}
                    <div className="mb-6">
                      {(() => {
                        const selectedCategory = categories.find(cat => cat._id === selectedMobileDomain);
                        return selectedCategory ? (
                          <>
                            <h2 className="text-xl font-bold site-text-primary mb-2">{selectedCategory.name}</h2>
                            <p className="text-sm site-text-secondary mb-3">
                              {selectedCategory.description || `Explore our comprehensive ${selectedCategory.name.toLowerCase()} courses designed to advance your career.`}
                            </p>
                            <Link 
                              href={`/courses?category=${selectedCategory._id}`} 
                              className="text-sm text-[#4F46E5] font-medium"
                              onClick={() => {
                                setIsMobileCoursesOpen(false);
                                setSelectedMobileDomain(null);
                              }}
                            >
                              View All {selectedCategory.name} Courses
                            </Link>
                          </>
                        ) : null;
                      })()}
                    </div>

                    {/* Courses */}
                    {(() => {
                      const selectedCategory = categories.find(cat => cat._id === selectedMobileDomain);
                      return selectedCategory && selectedCategory.courses.length > 0 ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-bold site-text-primary mb-4">
                              Available Courses ({selectedCategory.courses.length})
                            </h3>
                            <div className="space-y-4">
                              {selectedCategory.courses.slice(0, 6).map((course: Course) => (
                                <Link
                                  key={course._id}
                                  href={`/courses/${course._id}`}
                                  onClick={() => {
                                    setIsMobileCoursesOpen(false);
                                    setSelectedMobileDomain(null);
                                  }}
                                  className="flex gap-3 p-3 site-border border rounded-lg hover:shadow-md transition-shadow site-glass hover:bg-white/15 site-light:hover:bg-white/70"
                                >
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {course.upload?.courseImage?.[0] ? (
                                      <Image
                                        src={getCourseImageUrl(course)}
                                        alt={course.title}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="text-white font-bold text-sm">
                                        {course.title.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium site-text-primary leading-tight mb-1">{course.title}</p>
                                    {course.shortDescription && (
                                      <p className="text-xs site-text-muted line-clamp-2">
                                        {course.shortDescription}
                                      </p>
                                    )}
                                  </div>
                                  <svg className="w-5 h-5 site-text-muted flex-shrink-0 self-center" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                            {selectedCategory.courses.length > 6 && (
                              <Link
                                href={`/courses?category=${selectedCategory._id}`}
                                onClick={() => {
                                  setIsMobileCoursesOpen(false);
                                  setSelectedMobileDomain(null);
                                }}
                                className="block mt-4 text-center py-3 text-[#4F46E5] border border-[#4F46E5]/30 rounded-xl hover:bg-[#4F46E5]/10 transition-all duration-300"
                              >
                                View All {selectedCategory.courses.length} Courses
                              </Link>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="site-text-muted">No courses available in this category yet.</p>
                        </div>
                      );
                    })()}
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
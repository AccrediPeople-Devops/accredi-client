"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import AuthService from "@/app/components/service/auth.service";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarSection {
  section: string;
  links: SidebarLink[];
}

const sidebarSections: SidebarSection[] = [
  {
    section: "Account",
    links: [
      {
        name: "Profile",
        href: "/user-dashboard/profile",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        name: "General",
        href: "/user-dashboard/general",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        name: "Security",
        href: "/user-dashboard/security",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Sessions",
    links: [
      {
        name: "Session Details",
        href: "/user-dashboard/session-details",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        name: "Practice Tests",
        href: "/user-dashboard/practice-tests",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Downloads",
    links: [
      {
        name: "Resources",
        href: "/user-dashboard/resources",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        name: "Certificates",
        href: "/user-dashboard/certificates",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Billing",
    links: [
      {
        name: "Enrolled Courses",
        href: "/user-dashboard/enrolled-courses",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        badge: "3",
      },
      {
        name: "Purchase History",
        href: "/user-dashboard/purchase-history",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
    ],
  },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Decode token to get user info
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
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 site-light:border-slate-300 border-t-[#4F46E5] rounded-full animate-spin"></div>
          <p className="site-text-primary text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen site-section-bg">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          site-glass backdrop-blur-xl border-r site-border
        `}>
          <div className="flex flex-col h-full">
            {/* User Profile Header */}
            <div className="p-6 border-b site-border">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentUser.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white site-dark:border-[#0F0F23]"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold site-text-primary truncate">
                    {currentUser.fullName || "User"}
                  </h2>
                  <p className="text-sm site-text-secondary truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              {sidebarSections.map((section) => (
                <div key={section.section} className="mb-8">
                  <div className="px-3 mb-3">
                    <h3 className="text-xs font-semibold site-text-secondary uppercase tracking-wider">
                      {section.section}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {section.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className={`
                              flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                              ${isActive
                                ? "bg-gradient-to-r from-[#4F46E5]/10 to-[#10B981]/10 text-[#4F46E5] site-dark:text-[#10B981] shadow-lg"
                                : "site-text-secondary hover:site-text-primary hover:bg-white/10 site-light:hover:bg-slate-100"
                              }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <span className="mr-3">{link.icon}</span>
                            <span className="flex-1">{link.name}</span>
                            {link.badge && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-[#4F46E5] text-white rounded-full">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-6 border-t site-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 font-medium hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/5 site-light:bg-white/90 backdrop-blur-sm border-b site-border p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg site-text-primary hover:bg-white/10 site-light:hover:bg-slate-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold site-text-primary">Dashboard</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
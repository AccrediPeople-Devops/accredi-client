import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { User } from "@/app/types/user";
import AuthService from "../service/auth.service";
import Image from "next/image";
import config from "../config/config";

interface UserSidebarProps {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  currentUser: User;
}

export default function UserSidebar({ isMobileOpen, toggleSidebar, currentUser }: UserSidebarProps) {
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  const getUserProfileImage = (user: User) => {
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    return null;
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/login";
  };

  const menuSections = [
    {
      title: "ACCOUNT",
      items: [
        {
          title: "Dashboard",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard",
        },
        {
          title: "Profile",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard/general",
        },
        {
          title: "Security",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard/security",
        },
      ],
    },
    {
      title: "SESSIONS",
      items: [
        {
          title: "Session Details",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard/sessions",
        },
        {
          title: "Practice Tests",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          path: "/user-dashboard/practice-tests",
        },
        {
          title: "Exam Attempts",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          ),
          path: "/user-dashboard/exam-attempts",
        },
      ],
    },
    {
      title: "DOWNLOADS",
      items: [
        {
          title: "Resources",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
          ),
          path: "/user-dashboard/resources",
        },
        {
          title: "Certificates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2L3 7v11c0 5.55 3.84 7.74 9 9 5.16-1.26 9-3.45 9-9V7l-7-5zM8 11.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard/certificates",
        },
      ],
    },
    {
      title: "BILLING",
      items: [
        {
          title: "Enrolled Courses",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          ),
          path: "/user-dashboard/enrolled-courses",
          badge: "✓",
        },
        {
          title: "Purchase History",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
          ),
          path: "/user-dashboard/purchase-history",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-screen w-64 
          bg-[var(--background)] border-r border-[var(--border)]
          transition-transform duration-300 ease-in-out transform
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo & User Info */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center justify-center mb-4">
              <div className="text-xl font-bold text-[var(--foreground)]">
                <span className="text-[var(--primary)]">Accredi</span>
                People
              </div>
            </div>
            
            {/* User Profile Info */}
            <div className="flex items-center gap-3 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center overflow-hidden">
                {getUserProfileImage(currentUser) ? (
                  <Image
                    src={getUserProfileImage(currentUser)!}
                    alt={currentUser.fullName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden sidebar-menu">
            {menuSections.map((section) => (
              <div key={section.title} className="mb-8 last:mb-0">
                <h3 className="px-4 mb-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                      <li key={item.title}>
                        <Link
                          href={item.path}
                          className={`
                            flex items-center px-4 py-2.5 text-sm font-medium rounded-[var(--radius-md)]
                            ${
                              isActive
                                ? "bg-[var(--primary)] text-[var(--primary-text)] shadow-sm"
                                : "text-[var(--foreground)] hover:bg-[var(--input-bg)] hover:text-[var(--primary)]"
                            }
                            transition-all duration-200 ease-in-out
                            group
                          `}
                        >
                          <span 
                            className={`
                              mr-3 transition-colors duration-200
                              ${isActive ? "text-[var(--primary-text)]" : "text-[var(--primary)] group-hover:text-[var(--primary)]"}
                            `}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={`
                              text-xs font-bold
                              ${isActive ? "text-[var(--primary-text)]" : "text-green-500"}
                            `}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <span className="w-1 h-6 bg-[var(--primary-text)]/20 rounded-full ml-2"></span>
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
          <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
            <button
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white rounded-[var(--radius-md)] bg-gray-600 hover:bg-gray-700 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
} 
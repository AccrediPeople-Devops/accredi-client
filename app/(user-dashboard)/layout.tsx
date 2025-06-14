"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/app/components/user-dashboard/UserSidebar";
import UserService from "@/app/components/service/user.service";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { User } from "@/app/types/user";
import config from "@/app/components/config/config";
import Image from "next/image";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication and user role on mount
  useEffect(() => {
    const checkUserAuth = async () => {
      console.log("🔍 USER DASHBOARD: Starting auth check...");
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ USER DASHBOARD: No token, redirecting to login");
          router.push("/login");
          return;
        }

        // Try to decode token and get user info directly
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log("🔍 USER DASHBOARD: Token payload:", tokenPayload);
          
          // Check if role exists in token
          if (tokenPayload.role) {
            console.log("👤 USER DASHBOARD: Using role from token:", tokenPayload.role);
            
            // Check if user has appropriate role (not admin/superadmin)
            if (tokenPayload.role === 'admin' || tokenPayload.role === 'superadmin') {
              console.log("🔄 USER DASHBOARD: Admin/Superadmin detected, redirecting to admin dashboard");
              router.push('/dashboard');
              return;
            }
            
            // Get stored user email and create user object
            const storedEmail = localStorage.getItem("userEmail") || "";
            const userName = storedEmail ? storedEmail.split('@')[0] : "User"; // Use email prefix as name
            
            const userFromToken: User = {
              _id: tokenPayload.userId,
              fullName: userName,
              email: storedEmail,
              role: tokenPayload.role,
              contactNumber: "",
              country: "",
              city: "",
              isActive: true,
              isDeleted: false,
              createdAt: "",
              updatedAt: ""
            };
            
            console.log("👤 USER DASHBOARD: Created user object with name:", userName, "email:", storedEmail);
            
            console.log("✅ USER DASHBOARD: Regular user confirmed, loading user dashboard");
            setCurrentUser(userFromToken);
          } else {
            console.log("❌ USER DASHBOARD: No role found in token");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/login");
          }
        } catch (tokenError) {
          console.error("❌ USER DASHBOARD: Error decoding token:", tokenError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/login");
        }
      } catch (err) {
        console.error("❌ USER DASHBOARD: Error checking user auth:", err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent race conditions with login redirect
    const timer = setTimeout(() => {
      checkUserAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getUserProfileImage = (user: User) => {
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[var(--font-family)]">
        <UserSidebar 
          isMobileOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />

        {/* Main content */}
        <div className="md:ml-64 transition-all duration-300 ease-in-out">
          {/* Header */}
          <header className="h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-10">
            <button
              className="md:hidden text-[var(--foreground)] p-2 rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex-1 md:ml-4">
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                My Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="h-9 w-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
              
              {/* User Profile Avatar */}
              <div className="flex items-center gap-3">
                <div 
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center overflow-hidden border-2 border-[var(--background)]"
                  title={currentUser.fullName}
                >
                  {getUserProfileImage(currentUser) ? (
                    <Image
                      src={getUserProfileImage(currentUser)!}
                      alt={currentUser.fullName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-[var(--border)]">
            <div className="text-center text-[var(--foreground-muted)] text-sm">
              AccrediPeople Student Portal &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
} 
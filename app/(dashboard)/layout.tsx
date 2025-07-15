"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import AuthService from "@/app/components/service/auth.service";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "@/app/components/GlobalLoader";
import { useSimpleLoader } from "@/app/hooks/useGlobalLoader";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading, setLoading } = useSimpleLoader(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          router.push("/login");
        } else {
          // Authentication successful, stop loading
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, setLoading]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[var(--font-family)]">
        <GlobalLoader isLoading={isLoading} />
        <Sidebar isMobileOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
                Dashboard
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
              <div 
                className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium border-2 border-[var(--background)]"
                title="User Profile"
              >
                AD
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
              AccrediPeople Admin Dashboard &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

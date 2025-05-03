"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import ThemeSelector from "../components/dashboard/ThemeSelector";
import AuthService from "../components/service/authService";
import { ThemeProvider } from "../context/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[var(--font-family)]">
        <Sidebar isMobileOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="md:ml-64 transition-all duration-300 ease-in-out">
          {/* Header */}
          <header className="h-16 bg-[var(--background)] border-b border-[var(--primary)]/20 shadow-[var(--shadow-sm)] flex items-center justify-between px-4">
            <button
              className="md:hidden text-[var(--foreground)] p-2"
              onClick={toggleSidebar}
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
              <ThemeSelector />

              <div className="relative">
                <button className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] shadow-[var(--shadow-sm)]">
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
              <div className="h-9 w-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-semibold shadow-[var(--shadow-sm)]">
                US
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            <div className="bg-[var(--background)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

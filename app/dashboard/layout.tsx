"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import AuthService from "../components/service/authService";

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
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <Sidebar isMobileOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="md:ml-64 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="h-16 bg-[#1C1C1C] border-b border-[#5B2C6F]/20 flex items-center justify-between px-4">
          <button className="md:hidden text-white p-2" onClick={toggleSidebar}>
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
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="h-9 w-9 rounded-full bg-[#5B2C6F] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#D7BDE2] flex items-center justify-center text-[#5B2C6F] font-semibold">
              US
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/site/Navbar";
import Footer from "@/app/components/site/Footer";
import TawkToWidget from "@/app/components/site/TawkToWidget";
import ChristmasModal from "@/app/components/ChristmasModal";
import { SiteThemeProvider } from "./context/SiteThemeContext";
import SiteLayoutWrapper from "@/app/components/SiteLayoutWrapper";
import "../globals.css";
import "./styles/site-themes.css";

const inter = Inter({ subsets: ["latin"] });

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showChristmasModal, setShowChristmasModal] = useState(false);
  const pathname = usePathname();
  
  // Check if it's December for marquee banner
  const isDecember = new Date().getMonth() === 11;

  useEffect(() => {
    // Check if it's Christmas season (December)
    const now = new Date();
    const month = now.getMonth(); // 0-11, where 11 is December
    const isDecember = month === 11;

    if (!isDecember) {
      return;
    }

    // Check if we're on the home page
    const isHomePage = pathname === "/home" || pathname === "/";

    if (!isHomePage) {
      // Hide modal if not on home page
      setShowChristmasModal(false);
      return;
    }

    // Always show modal on home page (remove sessionStorage check)
    // Delay showing the modal by 2 seconds for better UX
    const timer = setTimeout(() => {
      setShowChristmasModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <SiteThemeProvider>
      <SiteLayoutWrapper>
        <div 
          className={`${inter.className} min-h-screen site-bg-primary`} 
          data-site-theme-container
          style={{
            scrollBehavior: 'smooth',
            scrollPaddingTop: '80px',
          }}
        >
          {/* Fixed navbar - positioned outside main content flow */}
        <Navbar />
          
          {/* Main content with top padding to account for fixed navbar and marquee */}
          <main className={isDecember ? "pt-[104px]" : "pt-[72px]"}>
          {children}
          </main>
        <Footer />
        
        {/* Tawk.to Chat Widget */}
        <TawkToWidget />

        {/* Christmas Modal - Always shows on home page */}
        <ChristmasModal 
          isOpen={showChristmasModal} 
          onClose={() => {
            setShowChristmasModal(false);
          }} 
        />
      </div>
      </SiteLayoutWrapper>
    </SiteThemeProvider>
  );
} 
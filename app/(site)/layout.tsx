"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/site/Navbar";
import Footer from "@/app/components/site/Footer";
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
          
          {/* Main content with top padding to account for fixed navbar */}
          <main className="pt-[72px]">
          {children}
          </main>
        <Footer />
      </div>
      </SiteLayoutWrapper>
    </SiteThemeProvider>
  );
} 
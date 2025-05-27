import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/site/Navbar";
import Footer from "@/app/components/site/Footer";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accredi - Professional Certifications",
  description: "Get certified in your field with Accredi's professional certification courses.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      <Navbar />
        {children}
      <Footer />
    </div>
  );
} 
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Allow the global loader to show for a moment before redirecting
    const timer = setTimeout(() => {
      router.push('/home');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Return a minimal page that will show the global loader
  return (
    <div className="min-h-screen">
      {/* This page will show the global loader while redirecting */}
    </div>
  );
} 


"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Extract error information from URL parameters
  const errorType = searchParams.get("error");
  const errorMessage = searchParams.get("message");

  useEffect(() => {
    // Set error message based on URL parameters or default
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    } else if (errorType) {
      switch (errorType) {
        case "payment_failed":
          setError("Your payment could not be processed. Please try again.");
          break;
        case "card_declined":
          setError(
            "Your card was declined. Please try a different payment method."
          );
          break;
        case "insufficient_funds":
          setError("Insufficient funds. Please check your account balance.");
          break;
        case "expired_card":
          setError("Your card has expired. Please use a different card.");
          break;
        default:
          setError("Payment was cancelled or failed. Please try again.");
      }
    } else {
      setError("Payment was cancelled. You can try again at any time.");
    }
  }, [errorType, errorMessage]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Payment", href: "/pricing" },
    { label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#EF4444]/5 site-light:bg-[#EF4444]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6B7280]/5 site-light:bg-[#6B7280]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 max-w-lg w-full">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#EF4444]/25">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-black site-text-primary mb-4">
                Payment Cancelled
              </h1>
              <p className="site-text-secondary text-lg mb-4">
                Your payment was not completed.
              </p>
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* What Happened Section */}
            <div className="mb-8 p-6 site-glass backdrop-blur-sm rounded-2xl site-border border">
              <h3 className="text-lg font-semibold site-text-primary mb-4">
                What Happened?
              </h3>
              <div className="space-y-3 site-text-secondary text-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span>Your payment session was cancelled or interrupted</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span>No charges were made to your payment method</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span>
                    You can try again with the same or different payment method
                  </span>
                </div>
              </div>
            </div>

            {/* Common Issues & Solutions */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#F59E0B]/5 to-[#EF4444]/5 rounded-2xl border border-[#F59E0B]/10">
              <h3 className="text-lg font-semibold site-text-primary mb-3">
                Common Issues & Solutions
              </h3>
              <div className="space-y-3 site-text-secondary text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="site-text-primary">
                      Card Declined:
                    </strong>{" "}
                    Try a different card or contact your bank
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="site-text-primary">
                      Insufficient Funds:
                    </strong>{" "}
                    Check your account balance
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="site-text-primary">Expired Card:</strong>{" "}
                    Use a card with a future expiry date
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="site-text-primary">
                      Network Issues:
                    </strong>{" "}
                    Check your internet connection
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pricing"
                className="flex-1 group px-6 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </span>
              </Link>

              <Link
                href="/"
                className="flex-1 px-6 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/20 transition-all duration-300 font-semibold text-center"
              >
                Back to Home
              </Link>
            </div>

            {/* Support Section */}
            <div className="text-center mt-8">
              <div className="p-4 bg-gradient-to-br from-[#4F46E5]/5 to-[#10B981]/5 rounded-xl border border-[#4F46E5]/10 mb-4">
                <h4 className="font-semibold site-text-primary mb-2">
                  Need Help?
                </h4>
                <p className="text-sm site-text-secondary mb-3">
                  Our support team is here to help you complete your purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/contact"
                    className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
                  >
                    Contact Support
                  </Link>
                  <span className="text-sm site-text-muted hidden sm:inline">
                    •
                  </span>
                  <Link
                    href="/faq"
                    className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
                  >
                    View FAQ
                  </Link>
                </div>
              </div>

              <div className="text-xs site-text-muted">
                <p>Payment powered by Stripe • Secure & PCI Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

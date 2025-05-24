"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Company",
      items: [
        { label: "About Us", href: "/about" },
        { label: "Our Approach", href: "/approach" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Quick Links",
      items: [
        { label: "Blogs", href: "/blog" },
        { label: "Discounts", href: "/discounts" },
        { label: "Refer & Earn", href: "/refer" },
        { label: "Mil/Vet Discount", href: "/military-veteran-discount" },
        { label: "Unemployed Discount", href: "/unemployed-discount" },
      ],
    },
    {
      title: "For Business",
      items: [
        { label: "Enterprise", href: "/enterprise" },
        { label: "Become Instructor", href: "/become-instructor" },
      ],
    },
  ];

  return (
    <div className="py-4 sm:py-6 xl:px-20 sm:px-28 px-0 md:flex relative justify-center items-center hidden h-[72px] !py-0 bg-white">
      <div className="px-5 md:px-0 w-full 2xl:max-w-7xl mx-auto">
        <nav className="hidden md:flex h-11 justify-between">
          {/* Logo */}
          <div className="flex gap-5 items-center">
            <div className="h-11 w-[138px] relative overflow-hidden">
              <Link href="/">
                <Image
                  src="/Logo/Only_Transperent/full_trimmed_transparent_base.png"
                  alt="Accredi Logo"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {menuItems.map((menu, index) => (
              <div key={index} className="group relative">
                <div className="relative pr-2.5 pl-4 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-sm text-gray-800 font-normal cursor-pointer duration-300">
                  <span>{menu.title}</span>
                  <i className="icon-chevron-right rotate-90 text-base leading-4 text-gray-500"></i>
                </div>
                <div className="absolute z-50 flex-col hidden border border-gray-200 bg-white py-1 min-w-[262px] rounded-tr-xl rounded-b-xl shadow-lg group-hover:block duration-300">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="pr-2.5 pl-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 duration-300 block"
                    >
                      <div className="py-2.5 text-sm cursor-pointer whitespace-nowrap text-gray-800">
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Reviews Link */}
            <Link
              href="/reviews"
              className="relative pr-2.5 pl-4 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-sm text-gray-800 font-normal cursor-pointer duration-300"
            >
              Reviews
            </Link>

            {/* Sign In Button */}
            <Link
              href="/login"
              className="relative pr-2.5 pl-4 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-0.5 text-sm text-gray-800 font-normal cursor-pointer duration-300"
            >
              Sign In
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="relative px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar; 
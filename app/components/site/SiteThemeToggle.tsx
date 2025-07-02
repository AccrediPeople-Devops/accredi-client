"use client";
import React from 'react';
// import { useSiteTheme } from '@/app/(site)/context/SiteThemeContext';

const SiteThemeToggle = () => {
  // const { theme, setTheme } = useSiteTheme();

  // const themes = [
  //   {
  //     value: 'light' as const,
  //     label: 'Light',
  //     icon: (
  //       <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
  //         <circle cx="12" cy="12" r="4"/>
  //         <path d="m12 1 0 2m0 18 0 2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M1 12l2 0m18 0 2 0M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
  //       </svg>
  //     )
  //   },
  //   {
  //     value: 'system' as const,
  //     label: 'System',
  //     icon: (
  //       <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
  //         <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
  //         <line x1="8" y1="21" x2="16" y2="21"/>
  //         <line x1="12" y1="17" x2="12" y2="21"/>
  //       </svg>
  //     )
  //   },
  //   {
  //     value: 'dark' as const,
  //     label: 'Dark',
  //     icon: (
  //       <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
  //         <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  //       </svg>
  //     )
  //   }
  // ];

  // const getActiveIndex = () => {
  //   return themes.findIndex(t => t.value === theme);
  // };

  // return (
  //   <div className="relative flex items-center bg-white/15 backdrop-blur-sm rounded-full p-1 border border-white/30 site-light:bg-slate-200/80 site-light:border-slate-300/80 shadow-sm">
  //     {/* Background slider */}
  //     <div 
  //       className="absolute top-1 bottom-1 w-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full transition-transform duration-300 ease-out shadow-lg site-light:from-[#4F46E5] site-light:to-[#7C3AED]"
  //       style={{
  //         transform: `translateX(${getActiveIndex() * 32}px)`
  //       }}
  //     />
      
  //     {/* Toggle buttons */}
  //     <div className="relative flex">
  //       {themes.map((themeOption, index) => (
  //         <button
  //           key={themeOption.value}
  //           onClick={() => setTheme(themeOption.value)}
  //           className={`relative z-10 w-8 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
  //             theme === themeOption.value 
  //               ? 'text-white' 
  //               : 'text-white/70 hover:text-white/90 site-light:text-slate-600 site-light:hover:text-slate-800'
  //           }`}
  //           aria-label={`Switch to ${themeOption.label} theme`}
  //           title={`${themeOption.label} mode`}
  //         >
  //           {themeOption.icon}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );

  // Return null to hide the component
  return null;
};

export default SiteThemeToggle; 
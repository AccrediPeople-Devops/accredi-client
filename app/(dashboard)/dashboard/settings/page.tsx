"use client";

import React from "react";
import ThemeSelector from "@/app/components/dashboard/ThemeSelector";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>

      <div className="bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="p-4 border-b border-[var(--primary)]/10 bg-[var(--primary)]/5">
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Appearance
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-[var(--foreground)]">
                Theme
              </h3>
              <p className="text-sm text-[var(--foreground)]/70">
                Choose your preferred theme for the dashboard
              </p>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </div>

      <div className="bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="p-4 border-b border-[var(--primary)]/10 bg-[var(--primary)]/5">
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Account
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div id="email-notifications-label">
              <h3 className="text-md font-medium text-[var(--foreground)]">
                Email Notifications
              </h3>
              <p className="text-sm text-[var(--foreground)]/70">
                Manage your email notification preferences
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                aria-labelledby="email-notifications-label"
              />
              <div className="w-11 h-6 bg-[var(--input-bg)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--primary)]/10">
            <div id="two-factor-auth-label">
              <h3 className="text-md font-medium text-[var(--foreground)]">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-[var(--foreground)]/70">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                aria-labelledby="two-factor-auth-label"
              />
              <div className="w-11 h-6 bg-[var(--input-bg)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

export default function UserDashboardGeneralPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    courseUpdates: true,
    language: "english",
    timezone: "UTC",
    theme: "auto",
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelect = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold site-text-primary">General Settings</h1>
        <p className="site-text-secondary mt-2">Manage your general account preferences and settings</p>
      </div>

      {/* Notifications */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold site-text-primary mb-6">Notification Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold site-text-primary">Email Notifications</h3>
                <p className="text-sm site-text-secondary">Receive course updates and announcements via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                  settings.emailNotifications ? 'bg-[#4F46E5]' : 'bg-gray-200 site-dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold site-text-primary">Push Notifications</h3>
                <p className="text-sm site-text-secondary">Receive real-time notifications in your browser</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                  settings.pushNotifications ? 'bg-[#4F46E5]' : 'bg-gray-200 site-dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold site-text-primary">Marketing Emails</h3>
                <p className="text-sm site-text-secondary">Receive promotional content and course recommendations</p>
              </div>
              <button
                onClick={() => handleToggle('marketingEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                  settings.marketingEmails ? 'bg-[#4F46E5]' : 'bg-gray-200 site-dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold site-text-primary">Course Updates</h3>
                <p className="text-sm site-text-secondary">Get notified about updates to your enrolled courses</p>
              </div>
              <button
                onClick={() => handleToggle('courseUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                  settings.courseUpdates ? 'bg-[#4F46E5]' : 'bg-gray-200 site-dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.courseUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold site-text-primary mb-6">Language & Region</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold site-text-secondary mb-3">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold site-text-secondary mb-3">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSelect('timezone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
              >
                <option value="UTC">UTC (GMT+0)</option>
                <option value="EST">Eastern Time (GMT-5)</option>
                <option value="PST">Pacific Time (GMT-8)</option>
                <option value="GMT">Greenwich Mean Time (GMT+0)</option>
                <option value="CET">Central European Time (GMT+1)</option>
                <option value="JST">Japan Standard Time (GMT+9)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold site-text-primary mb-6">Appearance</h2>
          
          <div>
            <label className="block text-sm font-semibold site-text-secondary mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'dark', label: 'Dark', icon: '🌙' },
                { value: 'auto', label: 'Auto', icon: '⚡' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleSelect('theme', theme.value)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    settings.theme === theme.value
                      ? 'border-[#4F46E5] bg-[#4F46E5]/10 site-text-primary'
                      : 'site-border hover:border-[#4F46E5]/50 site-text-secondary hover:site-text-primary'
                  }`}
                >
                  <div className="text-2xl mb-2">{theme.icon}</div>
                  <div className="font-medium">{theme.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105">
          Save Changes
        </button>
      </div>
    </div>
  );
} 
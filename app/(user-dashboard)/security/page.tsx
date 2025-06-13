"use client";

import React, { useState } from "react";

export default function UserDashboardSecurityPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "New York, US", lastActive: "2 minutes ago", current: true },
    { id: 2, device: "Safari on iPhone", location: "New York, US", lastActive: "1 hour ago", current: false },
    { id: 3, device: "Firefox on MacOS", location: "San Francisco, US", lastActive: "2 days ago", current: false },
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change
    console.log("Changing password:", passwordForm);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold site-text-primary">Security Settings</h1>
        <p className="site-text-secondary mt-2">Manage your account security and privacy settings</p>
      </div>

      {/* Password Change */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold site-text-primary mb-6">Change Password</h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold site-text-secondary mb-3">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                placeholder="Enter your current password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold site-text-secondary mb-3">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold site-text-secondary mb-3">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold site-text-primary">Two-Factor Authentication</h2>
              <p className="site-text-secondary mt-2">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                twoFactorEnabled ? 'bg-[#4F46E5]' : 'bg-gray-200 site-dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="bg-green-50 site-dark:bg-green-900/20 border border-green-200 site-dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-green-800 site-dark:text-green-300">Two-Factor Authentication Enabled</h3>
              </div>
              <p className="text-green-700 site-dark:text-green-400 text-sm mb-4">
                Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                View Recovery Codes
              </button>
            </div>
          )}

          {!twoFactorEnabled && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 site-dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 site-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold site-text-primary mb-2">Set up Two-Factor Authentication</h3>
              <p className="site-text-secondary text-sm mb-6">Protect your account with an additional security layer</p>
              <button
                onClick={() => setTwoFactorEnabled(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-medium hover:scale-105"
              >
                Enable 2FA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold site-text-primary mb-6">Active Sessions</h2>
          
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border site-border rounded-xl bg-white/30 site-dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold site-text-primary flex items-center gap-2">
                      {session.device}
                      {session.current && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 site-dark:bg-green-900/30 site-dark:text-green-300 rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm site-text-secondary">{session.location}</p>
                    <p className="text-xs site-text-secondary">Last active: {session.lastActive}</p>
                  </div>
                </div>
                
                {!session.current && (
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 site-dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium">
                    End Session
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="px-6 py-3 text-red-600 hover:bg-red-50 site-dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
              End All Other Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
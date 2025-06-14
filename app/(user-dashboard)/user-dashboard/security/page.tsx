"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // TODO: Implement password update API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Security</h1>
        <p className="text-[var(--foreground-muted)]">Manage your account security settings and authentication</p>
      </div>

      {/* Two Factor Authentication Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Two Factor</h2>
          <span className="text-sm font-medium text-yellow-600">Required?</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--input-bg)] rounded-[var(--radius-md)] border border-[var(--border)]">
            <div>
              <h3 className="text-base font-medium text-[var(--foreground)] mb-1">Authenticator App</h3>
              <p className="text-sm text-yellow-600">Email auth or 1Password</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleToggleTwoFactor}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
                  ${twoFactorEnabled 
                    ? 'bg-[var(--primary)]' 
                    : 'bg-gray-300 dark:bg-gray-600'
                  }
                `}
                role="switch"
                aria-checked={twoFactorEnabled}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                    ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Change Password</h2>
          <button className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
            Forgot your password?
          </button>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
              placeholder="Enter your current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
              placeholder="Enter your new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
              placeholder="Confirm your new password"
            />
          </div>

          {/* Update Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
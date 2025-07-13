"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import UserProfileService from "@/app/components/user-dashboard/services/userProfile.service";
import { toast } from "react-hot-toast";

export default function SecurityPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log("🔍 SECURITY PAGE: Loading user profile data...");
      setIsLoading(true);
      try {
        // First try to get profile data from API
        try {
          console.log("📡 SECURITY PAGE: Making API call to get profile...");
          const profileData = await UserProfileService.getCurrentUserProfile();
          console.log("📡 SECURITY PAGE: API Response:", profileData);
          
          if (profileData && profileData._id) {
            console.log("✅ SECURITY PAGE: Profile data loaded from API:", profileData);
            setCurrentUser(profileData);
            setIs2FAEnabled(profileData.twoStepVerification || false);
            return;
          } else {
            console.log("⚠️ SECURITY PAGE: API response invalid:", profileData);
          }
        } catch (apiError) {
          console.error("❌ SECURITY PAGE: API call failed:", apiError);
          console.log("⚠️ SECURITY PAGE: Falling back to token data");
        }

        // Fallback to token data if API fails
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ SECURITY PAGE: No token found");
          return;
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 SECURITY PAGE: Using token payload as fallback:", tokenPayload);
        
        // Get stored user email and create user object
        const storedEmail = localStorage.getItem("userEmail") || "";
        const userName = storedEmail ? storedEmail.split('@')[0] : "User";
        
        // Create user object from token data (fallback)
        const userFromToken: User = {
          _id: tokenPayload.userId,
          fullName: userName,
          email: storedEmail,
          role: tokenPayload.role,
          contactNumber: "",
          country: "",
          city: "",
          isActive: true,
          isDeleted: false,
          createdAt: "",
          updatedAt: ""
        };
        
        console.log("👤 SECURITY PAGE: Created user object from token:", userFromToken);
        setCurrentUser(userFromToken);
        setIs2FAEnabled(false); // Default to false for token fallback
      } catch (error) {
        console.error("❌ SECURITY PAGE: Error loading user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsSaving(true);
    try {
      const response = await UserProfileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        is2FAEnabled: is2FAEnabled,
      });

      console.log("✅ SECURITY PAGE: Password changed successfully:", response);
      toast.success("Password changed successfully!");
      
      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("❌ SECURITY PAGE: Error changing password:", error);
      const errorMessage = error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handle2FAToggle = async () => {
    const newValue = !is2FAEnabled;
    
    setIsUpdating2FA(true);
    try {
      console.log("🔐 SECURITY PAGE: Updating 2FA setting to:", newValue);
      
      // Update 2FA setting in database
      const updatedProfile = await UserProfileService.update2FA(newValue);
      
      if (updatedProfile && updatedProfile._id) {
        setIs2FAEnabled(newValue);
        setCurrentUser(updatedProfile);
        toast.success(newValue ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
        console.log("✅ SECURITY PAGE: 2FA setting updated successfully");
      } else {
        toast.error("Failed to update 2FA setting");
      }
    } catch (error: any) {
      console.error("❌ SECURITY PAGE: Error updating 2FA setting:", error);
      const errorMessage = error.response?.data?.message || "Failed to update 2FA setting";
      toast.error(errorMessage);
    } finally {
      setIsUpdating2FA(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading security settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Security</h1>
        <p className="text-[var(--foreground-muted)]">Manage your account security settings and password</p>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Change Password</h2>
            <p className="text-[var(--foreground-muted)]">Update your password to keep your account secure</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 pr-12 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showCurrentPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 pr-12 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 pr-12 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Two-Factor Authentication</h2>
            <p className="text-[var(--foreground-muted)]">Add an extra layer of security to your account</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">Enable 2FA</h3>
                <p className="text-[var(--foreground-muted)]">
                  Secure your account with two-factor authentication
                </p>
              </div>
                             <div className="flex items-center">
                 <button
                   type="button"
                   onClick={handle2FAToggle}
                   disabled={isUpdating2FA}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                     is2FAEnabled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                   }`}
                 >
                   <span
                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                       is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
                     }`}
                   />
                 </button>
                 {isUpdating2FA && (
                   <div className="ml-3">
                     <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                   </div>
                 )}
               </div>
            </div>
            
            {is2FAEnabled && (
              <div className="mt-4 p-4 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)]">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Two-Factor Authentication Enabled
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Your account is protected with 2FA
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import UserProfileService from "@/app/components/user-dashboard/services/userProfile.service";
import Image from "next/image";
import config from "@/app/components/config/config";
import { toast } from "react-hot-toast";

export default function GeneralPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    address: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log("🔍 GENERAL PAGE: Loading user profile data...");
      setIsLoading(true);
      try {
        // First try to get profile data from API
        try {
          console.log("📡 GENERAL PAGE: Making API call to get profile...");
          const profileData = await UserProfileService.getCurrentUserProfile();
          console.log("📡 GENERAL PAGE: API Response:", profileData);
          
          if (profileData && profileData._id) {
            console.log("✅ GENERAL PAGE: Profile data loaded from API:", profileData);
            setCurrentUser(profileData);
            
            const newFormData = {
              fullName: profileData.fullName || "",
              email: profileData.email || "",
              contactNumber: profileData.contactNumber || "",
              address: "", // This field doesn't exist in User type, but keeping for form
              country: profileData.country || "",
              city: profileData.city || "",
            };
            
            console.log("📝 GENERAL PAGE: Setting form data:", newFormData);
            setFormData(newFormData);
            return;
          } else {
            console.log("⚠️ GENERAL PAGE: API response invalid:", profileData);
          }
        } catch (apiError) {
          console.error("❌ GENERAL PAGE: API call failed:", apiError);
          console.log("⚠️ GENERAL PAGE: Falling back to token data");
        }

        // Fallback to token data if API fails
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ GENERAL PAGE: No token found");
          return;
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 GENERAL PAGE: Using token payload as fallback:", tokenPayload);
        
        // Get stored user email and create user object
        const storedEmail = localStorage.getItem("userEmail") || "";
        const userName = storedEmail ? storedEmail.split('@')[0] : "User"; // Use email prefix as name
        
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
        
        console.log("👤 GENERAL PAGE: Created user object from token:", userFromToken);

        setCurrentUser(userFromToken);
        
        const fallbackFormData = {
          fullName: userFromToken.fullName || "",
          email: userFromToken.email || "",
          contactNumber: userFromToken.contactNumber || "",
          address: "", // This field doesn't exist in User type, but keeping for form
          country: userFromToken.country || "",
          city: userFromToken.city || "",
        };
        
        console.log("📝 GENERAL PAGE: Setting fallback form data:", fallbackFormData);
        setFormData(fallbackFormData);
      } catch (error) {
        console.error("❌ GENERAL PAGE: Error loading user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      // Call the update user profile API
      const updatedProfile = await UserProfileService.updateCurrentUserProfile({
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        country: formData.country,
        city: formData.city,
        // Note: address field is not part of the User type, so not including it in API call
      });

      if (updatedProfile && updatedProfile._id) {
        // Update the current user state with the new data
        setCurrentUser(updatedProfile);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getUserProfileImage = (user: User) => {
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Debug log to see current form data
  console.log("🎨 GENERAL PAGE: Rendering with form data:", formData);
  console.log("👤 GENERAL PAGE: Current user:", currentUser);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">General</h1>
        <p className="text-[var(--foreground-muted)]">Manage your account settings and profile information</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm">
        {/* Profile Picture Section */}
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Profile Picture</h2>
          
          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--input-bg)] border-2 border-[var(--border)]">
                {currentUser && getUserProfileImage(currentUser) ? (
                  <Image
                    src={getUserProfileImage(currentUser)!}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--primary-text)] text-2xl font-bold">
                    {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Upload Button */}
            <div>
              <button className="px-4 py-2 bg-[var(--input-bg)] hover:bg-[var(--border)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] font-medium transition-colors duration-200">
                Change Photo
              </button>
              <p className="text-sm text-[var(--foreground-muted)] mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* Contact Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Country
              </label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                placeholder="Enter your city"
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
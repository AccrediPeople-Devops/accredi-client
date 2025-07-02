"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import uploadService from "@/app/components/service/upload.service";
import config from "@/app/components/config/config";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    country: "",
    city: "",
  });

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Decode token to get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const res = await UserService.getAllUsers();
        
        if (res?.users) {
          const foundUser = res.users.find((user: User) => 
            user.email === tokenPayload.email || 
            user._id === tokenPayload.userId ||
            user._id === tokenPayload.id
          );
          
          if (foundUser) {
            setCurrentUser(foundUser);
            setEditFormData({
              fullName: foundUser.fullName || "",
              email: foundUser.email || "",
              contactNumber: foundUser.contactNumber || "",
              country: foundUser.country || "",
              city: foundUser.city || "",
            });
            
            // Set profile image preview if exists
            if (foundUser.profileImage?.path) {
              setProfileImagePreview(`${config.imageUrl}${foundUser.profileImage.path}`);
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    try {
      let updatedData = { ...editFormData };

      // Upload new profile image if selected
      if (profileImage) {
        const uploadResponse = await uploadService.uploadImage(profileImage);
        if (uploadResponse.status && uploadResponse.upload) {
          updatedData = {
            ...updatedData,
            profileImage: {
              path: uploadResponse.upload.path,
              key: uploadResponse.upload.key,
            },
          } as any;
        }
      }

      // Update user profile
      const response = await UserService.updateUser(currentUser._id, updatedData);
      
      if (response.status) {
        // Update local state
        setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
        setIsEditingProfile(false);
        setProfileImage(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    if (!currentUser) return;
    
    setEditFormData({
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
      contactNumber: currentUser.contactNumber || "",
      country: currentUser.country || "",
      city: currentUser.city || "",
    });
    
    // Reset profile image preview
    if (currentUser.profileImage?.path) {
      setProfileImagePreview(`${config.imageUrl}${currentUser.profileImage.path}`);
    } else {
      setProfileImagePreview(null);
    }
    
    setProfileImage(null);
    setIsEditingProfile(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 site-light:border-slate-300 border-t-[#4F46E5] rounded-full animate-spin"></div>
          <p className="site-text-primary text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen site-section-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
          <p className="text-lg site-text-secondary max-w-2xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#10B981]/10 p-8 border-b site-border">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      alt={currentUser.fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-white font-bold text-4xl">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {isEditingProfile && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4338CA] transition-colors shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold site-text-primary mb-2">
                  {currentUser.fullName}
                </h2>
                <p className="site-text-secondary mb-4">
                  {currentUser.email}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentUser.role === 'admin' ? 'bg-blue-500/20 text-blue-400 site-light:bg-blue-100 site-light:text-blue-700' :
                    'bg-green-500/20 text-green-400 site-light:bg-green-100 site-light:text-green-700'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-3 site-glass backdrop-blur-sm border site-border site-text-secondary rounded-xl hover:bg-white/20 site-light:hover:bg-slate-100 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-xl hover:shadow-[#10B981]/25 transition-all duration-300 font-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium site-text-primary mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium site-text-primary mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium site-text-primary mb-3">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={editFormData.contactNumber}
                    onChange={handleInputChange}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium site-text-primary mb-3">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={editFormData.country}
                    onChange={handleInputChange}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your country"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium site-text-primary mb-3">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleInputChange}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-xl site-border border site-text-primary placeholder:site-text-muted focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border p-8">
          <h3 className="text-2xl font-bold site-text-primary mb-6">
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="site-glass backdrop-blur-sm rounded-xl p-4 border site-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#4F46E5]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold site-text-primary">Account Role</h4>
              </div>
              <p className="site-text-secondary text-sm">
                Your current role: <span className="font-medium site-text-primary">{currentUser.role}</span>
              </p>
            </div>

            <div className="site-glass backdrop-blur-sm rounded-xl p-4 border site-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold site-text-primary">Member Since</h4>
              </div>
              <p className="site-text-secondary text-sm">
                {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
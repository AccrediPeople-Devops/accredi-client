"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";

export default function UserDashboardProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    country: "",
    city: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

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
            setFormData({
              fullName: foundUser.fullName || "",
              email: foundUser.email || "",
              contactNumber: foundUser.contactNumber || "",
              country: foundUser.country || "",
              city: foundUser.city || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-white/20 site-light:border-slate-300 border-t-[#4F46E5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold site-text-primary">Profile</h1>
          <p className="site-text-secondary mt-2">Manage your account information and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden">
        <div className="p-8">
          {/* Profile Image Section */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white site-dark:border-[#0F0F23]"></div>
                {isEditing && (
                  <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                    />
                  ) : (
                    <p className="text-lg font-medium site-text-primary py-3">{currentUser?.fullName || "Not provided"}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">Email</label>
                  <p className="text-lg font-medium site-text-primary py-3">{currentUser?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                    />
                  ) : (
                    <p className="text-lg font-medium site-text-primary py-3">{currentUser?.contactNumber || "Not provided"}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">Role</label>
                  <div className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentUser?.role === "admin" || currentUser?.role === "superadmin"
                        ? "bg-purple-100 text-purple-800 site-dark:bg-purple-900/30 site-dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 site-dark:bg-blue-900/30 site-dark:text-blue-300"
                    }`}>
                      {currentUser?.role === "superadmin" ? "Super Admin" : 
                       currentUser?.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                    />
                  ) : (
                    <p className="text-lg font-medium site-text-primary py-3">{currentUser?.country || "Not provided"}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold site-text-secondary mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border site-border bg-white/50 site-dark:bg-slate-800/50 site-text-primary focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                    />
                  ) : (
                    <p className="text-lg font-medium site-text-primary py-3">{currentUser?.city || "Not provided"}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-medium hover:scale-105"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 site-glass backdrop-blur-sm border site-border rounded-xl site-text-primary hover:bg-white/20 site-light:hover:bg-slate-100 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold site-text-primary">Account Status</h3>
              <p className="text-sm site-text-secondary">
                {currentUser?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 4a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold site-text-primary">Member Since</h3>
              <p className="text-sm site-text-secondary">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold site-text-primary">Courses</h3>
              <p className="text-sm site-text-secondary">3 Enrolled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
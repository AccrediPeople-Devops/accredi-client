"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, UserFormData } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import AuthService from "@/app/components/service/auth.service";
import uploadService from "@/app/components/service/upload.service";

export default function AddUserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
    contactNumber: "",
    country: "",
    city: "",
    role: "user",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    setIsLoadingUser(true);
    try {
      // Get the token to extract user info
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        setIsLoadingUser(false);
        return;
      }

      // Try to decode the token to get user email (if it's a JWT)
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log("Token payload:", tokenPayload);
        
        // Fetch users and find the one matching the token
        const res = await UserService.getAllUsers();
        if (res?.users) {
          const foundUser = res.users.find((user: User) => 
            user.email === tokenPayload.email || 
            user._id === tokenPayload.userId ||
            user._id === tokenPayload.id
          );
          
          if (foundUser) {
            setCurrentUser(foundUser);
            console.log("Found current user:", foundUser);
          } else {
            console.log("User not found in users list");
          }
        }
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
      }
    } catch (err: any) {
      console.error("Error fetching current user:", err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const canCreateRole = (role: string): boolean => {
    console.log("canCreateRole check:", { currentUser: currentUser?.role, targetRole: role });
    
    if (!currentUser) {
      console.log("No current user, returning false");
      return false;
    }
    
    // Only superadmin can create admins (there's only one superadmin created by backend)
    if (role === "admin") {
      const canCreate = currentUser.role === "superadmin";
      console.log(`Can create ${role}:`, canCreate);
      return canCreate;
    }
    
    // Both admin and superadmin can create users
    if (role === "user") {
      const canCreate = currentUser.role === "admin" || currentUser.role === "superadmin";
      console.log(`Can create ${role}:`, canCreate);
      return canCreate;
    }
    
    return false;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.fullName) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (!formData.contactNumber) {
      setError("Contact number is required");
      return false;
    }
    if (!formData.country) {
      setError("Country is required");
      return false;
    }
    if (!formData.city) {
      setError("City is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let updatedFormData = { ...formData };

      // Upload profile image if selected
      if (profileImage) {
        const uploadResponse = await uploadService.uploadImage(profileImage);

        if (uploadResponse.status && uploadResponse.upload) {
          // Set profile image in form data
          updatedFormData = {
            ...updatedFormData,
            profileImage: {
              path: uploadResponse.upload.path,
              key: uploadResponse.upload.key,
            },
          };
        }
      }

      // Create user with updated form data that includes the profile image
      const response = await UserService.createUser(updatedFormData);

      if (response.status) {
        router.push("/dashboard/users");
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching current user data
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading user permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add User
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Create a new user account
          </p>
        </div>
        <Link
          href="/dashboard/users"
          className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--background-secondary)]/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Users
        </Link>
      </div>

      {/* Current user debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-[var(--radius-md)]">
          <p><strong>Debug:</strong> Current user role: {currentUser?.role || "Not loaded"}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--background-secondary)] p-6 rounded-[var(--radius-lg)]">
          <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
            User Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Contact Number *
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                {canCreateRole("user") && <option value="user">User</option>}
                {canCreateRole("admin") && <option value="admin">Admin</option>}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[var(--background-secondary)] p-6 rounded-[var(--radius-lg)]">
          <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
            Profile Image
          </h2>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 relative rounded-full overflow-hidden bg-[var(--background)]">
              {profileImagePreview ? (
                <Image
                  src={profileImagePreview}
                  alt="Profile preview"
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] cursor-pointer hover:bg-[var(--primary-hover)] transition-colors inline-block"
              >
                Choose Image
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleProfileImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <p className="text-sm text-[var(--foreground-muted)]">
              Recommended: Square image, at least 200x200 pixels
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/users"
            className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-[var(--radius-md)] hover:bg-[var(--background-secondary)]/80 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

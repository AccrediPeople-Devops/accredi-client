"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, UserFormData } from "../../../../types/user";
import UserService from "../../../../components/service/user.service";
import uploadService from "../../../../components/service/upload.service";
import axios from "axios";
import config from "../../../../components/config/config";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      // Get all users and find the one with matching ID
      const response = await UserService.getAllUsers();
      if (response.status && response.users && Array.isArray(response.users)) {
        const foundUser = response.users.find((user: User) => user._id === id);

        if (foundUser) {
          setFormData({
            fullName: foundUser.fullName,
            email: foundUser.email,
            password: "", // Don't pre-fill password for security
            contactNumber: foundUser.contactNumber,
            country: foundUser.country,
            city: foundUser.city,
            role: foundUser.role,
            profileImage: foundUser.profileImage,
          });

          // Set profile image preview if exists
          if (foundUser.profileImage?.path) {
            setProfileImagePreview(
              `${config.imageUrl}${foundUser.profileImage.path}`
            );
          }
        } else {
          setError("User not found");
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching user data");
    } finally {
      setIsLoading(false);
    }
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

    setIsSaving(true);
    setError("");

    try {
      // Prepare the update payload
      const updateData: Partial<UserFormData> = {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        country: formData.country,
        city: formData.city,
        role: formData.role,
      };

      // Handle profile image upload
      if (profileImage) {
        try {
          // Create form data
          const imageFormData = new FormData();
          imageFormData.append("file", profileImage);

          // Make direct API call without using the service
          const uploadResponse = await axios.post(
            `${config.apiUrl}/uploads/v1`,
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("Direct upload response:", uploadResponse.data);

          if (uploadResponse.data.status && uploadResponse.data.upload) {
            // Add profile image to update data
            console.log("Upload response:", uploadResponse.data);
            updateData.profileImage = {
              path: uploadResponse.data.upload[0].path,
              key: uploadResponse.data.upload[0].key,
            };
          } else {
            throw new Error("Failed to upload profile image");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Error uploading image. Please try again.");
          setIsSaving(false);
          return;
        }
      } else if (
        formData.profileImage &&
        formData.profileImage.path &&
        formData.profileImage.key
      ) {
        // Keep existing profile image if available
        updateData.profileImage = {
          path: formData.profileImage.path,
          key: formData.profileImage.key,
        };
      }

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Update user
      const response = await UserService.updateUser(id, updateData);

      if (response.status) {
        router.push("/dashboard/users");
      } else {
        setError(response.message || "Failed to update user");
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Error updating user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Edit User
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Update user account information
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

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        /* Form */
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
                  Password{" "}
                  <span className="text-[var(--foreground-muted)]">
                    (Leave blank to keep current password)
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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
                  Choose New Image
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
              disabled={isSaving}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center"
            >
              {isSaving ? (
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

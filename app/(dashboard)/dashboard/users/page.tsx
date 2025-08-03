"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import AuthService from "@/app/components/service/auth.service";
import uploadService from "@/app/components/service/upload.service";
import config from "@/app/components/config/config";
import Modal from "@/app/components/Modal";
import CourseAssignmentModal from "../../../components/CourseAssignmentModal";
import GlobalCourseAssignmentModal from "../../../components/GlobalCourseAssignmentModal";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showCourseAssignmentModal, setShowCourseAssignmentModal] = useState(false);
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState<{ id: string; name: string } | null>(null);
  const [showGlobalCourseAssignmentModal, setShowGlobalCourseAssignmentModal] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      // Since /auth/v1/me doesn't exist, let's find current user from the users list
      console.log("Finding current user from users list...");
      await findCurrentUserFromList();
    } catch (err: any) {
      console.error("Error fetching current user:", err);
    }
  };

  const findCurrentUserFromList = async () => {
    try {
      // Get the token to extract user info or try to find current user another way
      const token = localStorage.getItem("token");
      if (!token) return;

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
            console.log("Found current user from users list:", foundUser);
          } else {
            // Fallback: if we can't find by token, assume the first superadmin is the current user
            // This is just for testing - remove in production
            const superadmin = res.users.find((user: User) => user.role === "superadmin");
            if (superadmin) {
              setCurrentUser(superadmin);
              console.log("Fallback: Using first superadmin as current user:", superadmin);
            }
          }
        }
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
      }
    } catch (err) {
      console.error("Error in findCurrentUserFromList:", err);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await UserService.getAllUsers();
      if (res?.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  // Permission check functions
  const canEditUser = (targetUser: User): boolean => {
    console.log("canEditUser check:", { currentUser, targetUser: targetUser.role });
    if (!currentUser) {
      console.log("No current user, returning false");
      return false;
    }
    
    // Superadmin cannot be edited
    if (targetUser.role === "superadmin") {
      console.log("Target is superadmin, cannot edit");
      return false;
    }
    
    // Only superadmin can edit admins
    if (targetUser.role === "admin") {
      const canEdit = currentUser.role === "superadmin";
      console.log("Target is admin, current user can edit:", canEdit);
      return canEdit;
    }
    
    // Both admin and superadmin can edit users
    if (targetUser.role === "user") {
      const canEdit = currentUser.role === "admin" || currentUser.role === "superadmin";
      console.log("Target is user, current user can edit:", canEdit);
      return canEdit;
    }
    
    return false;
  };

  const canDeleteUser = (targetUser: User): boolean => {
    console.log("canDeleteUser check:", { currentUser, targetUser: targetUser.role });
    if (!currentUser) {
      console.log("No current user, returning false");
      return false;
    }
    
    // Superadmin cannot be deleted
    if (targetUser.role === "superadmin") {
      console.log("Target is superadmin, cannot delete");
      return false;
    }
    
    // Only superadmin can delete admins
    if (targetUser.role === "admin") {
      const canDelete = currentUser.role === "superadmin";
      console.log("Target is admin, current user can delete:", canDelete);
      return canDelete;
    }
    
    // Both admin and superadmin can delete users
    if (targetUser.role === "user") {
      const canDelete = currentUser.role === "admin" || currentUser.role === "superadmin";
      console.log("Target is user, current user can delete:", canDelete);
      return canDelete;
    }
    
    return false;
  };

  const canCreateUser = (): boolean => {
    if (!currentUser) return false;
    return currentUser.role === "admin" || currentUser.role === "superadmin";
  };

  // Filter users based on search, role, and deleted state
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // Filter based on active tab
    const matchesTab =
      (activeTab === "active" && !user.isDeleted) ||
      (activeTab === "deleted" && user.isDeleted);

    return matchesSearch && matchesRole && matchesTab;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(userToDelete);

    try {
      const userToDeleteObj = users.find((user) => user._id === userToDelete);

      // Delete profile image if it exists
      if (userToDeleteObj?.profileImage?.key) {
        try {
          await uploadService.deleteImage(userToDeleteObj.profileImage.key);
        } catch (error) {
          console.error(
            `Error deleting profile image with key ${userToDeleteObj.profileImage.key}:`,
            error
          );
        }
      }

      // Delete the user
      await UserService.deleteUser(userToDelete);

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userToDelete ? { ...user, isDeleted: true } : user
        )
      );
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRestoreUser = async (userId: string) => {
    setIsRestoring(userId);

    try {
      await UserService.undoDelete(userId);

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isDeleted: false } : user
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring user");
    } finally {
      setIsRestoring(null);
    }
  };

  const handleAssignCourse = (user: User) => {
    setSelectedUserForAssignment({
      id: user._id,
      name: user.fullName
    });
    setShowCourseAssignmentModal(true);
  };

  const handleCourseAssignmentSuccess = () => {
    // Optionally refresh user data or show success message
    console.log("Course assigned successfully");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-700";
      case "admin":
        return "bg-[var(--primary)]/20 text-[var(--primary)]";
      case "user":
        return "bg-[var(--secondary)]/20 text-[var(--secondary)]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage users and their permissions
          </p>
          {/* Temporary debug info */}
          {currentUser && (
            <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              Debug: Currently logged in as {currentUser.fullName} ({currentUser.role})
            </div>
          )}
          {!currentUser && (
            <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded">
              Debug: No current user detected
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGlobalCourseAssignmentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Assign Course
          </button>
          {canCreateUser() && (
            <Link
              href="/dashboard/users/add"
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add User
            </Link>
          )}
        </div>
      </div>

      {/* Tabs for Active/Deleted */}
      <div className="border-b border-[var(--border)]">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Users
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--foreground-muted)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-10 bg-[var(--background-secondary)] rounded-[var(--radius-md)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-[var(--foreground-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-[var(--foreground)]">
            No users found
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {searchTerm || roleFilter !== "all"
              ? "Try adjusting your filters"
              : activeTab === "active"
              ? "No active users found. Add a new user."
              : "No deleted users found."}
          </p>
        </div>
      )}

      {/* Users table */}
      {!isLoading && filteredUsers.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--background)] divide-y divide-[var(--border)]">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {user.profileImage?.path ? (
                          <Image
                            src={`${config.imageUrl}${user.profileImage.path}`}
                            alt={user.fullName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-medium uppercase">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-[var(--foreground-muted)]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--foreground)]">
                      {user.contactNumber}
                    </div>
                    <div className="text-sm text-[var(--foreground-muted)]">
                      {user.city}, {user.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground-muted)]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {activeTab === "active" ? (
                      <div className="flex justify-end space-x-2">
                        {canEditUser(user) ? (
                          <Link
                            href={`/dashboard/users/edit/${user._id}`}
                            className="p-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-[var(--radius-sm)] hover:bg-[var(--primary)]/20"
                            title="Edit user"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                        ) : (
                          <div
                            className="p-1.5 bg-gray-100 text-gray-400 rounded-[var(--radius-sm)] cursor-not-allowed"
                            title={user.role === "superadmin" ? "Super Admin cannot be edited" : 
                                   user.role === "admin" ? "Only Super Admin can edit Admins" : 
                                   "Insufficient permissions"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </div>
                        )}
                        {/* View Profile Button */}
                        <Link
                          href={`/dashboard/users/${user._id}`}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-[var(--radius-sm)] hover:bg-blue-200"
                          title="View profile"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        {/* Course Assignment Button - Only for users with role "user" */}
                        {user.role === "user" && (
                          <button
                            onClick={() => handleAssignCourse(user)}
                            className="p-1.5 bg-green-100 text-green-600 rounded-[var(--radius-sm)] hover:bg-green-200"
                            title="Assign course"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        {canDeleteUser(user) ? (
                          <button
                            onClick={() => handleDeleteClick(user._id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-[var(--radius-sm)] hover:bg-red-200"
                            title="Delete user"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        ) : (
                          <div
                            className="p-1.5 bg-gray-100 text-gray-400 rounded-[var(--radius-sm)] cursor-not-allowed"
                            title={user.role === "superadmin" ? "Super Admin cannot be deleted" : 
                                   user.role === "admin" ? "Only Super Admin can delete Admins" : 
                                   "Insufficient permissions"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRestoreUser(user._id)}
                          disabled={isRestoring === user._id}
                          className="p-1.5 bg-green-100 text-green-600 rounded-[var(--radius-sm)] hover:bg-green-200"
                          title="Restore"
                        >
                          {isRestoring === user._id ? (
                            <svg
                              className="animate-spin h-5 w-5"
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
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        isConfirming={isDeleting !== null}
        variant="danger"
      />

      {/* Course Assignment Modal */}
      {selectedUserForAssignment && (
        <CourseAssignmentModal
          isOpen={showCourseAssignmentModal}
          onClose={() => {
            setShowCourseAssignmentModal(false);
            setSelectedUserForAssignment(null);
          }}
          userId={selectedUserForAssignment.id}
          userName={selectedUserForAssignment.name}
          onSuccess={handleCourseAssignmentSuccess}
        />
      )}

      {/* Global Course Assignment Modal */}
      <GlobalCourseAssignmentModal
        isOpen={showGlobalCourseAssignmentModal}
        onClose={() => setShowGlobalCourseAssignmentModal(false)}
        onSuccess={() => {
          console.log("Course assigned successfully");
          setShowGlobalCourseAssignmentModal(false);
        }}
      />
    </div>
  );
}

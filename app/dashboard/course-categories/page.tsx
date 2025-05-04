"use client";

import React, { useState, useEffect } from "react";
import CourseCategoryList from "../../components/course-categories/CourseCategoryList";
import CourseCategoryForm from "../../components/course-categories/CourseCategoryForm";
import { CourseCategory } from "../../types/courseCategory";
import { getCategoryPlaceholderImage } from "../../utils/imageUtils";
import CourseCategoryService from "../../components/service/courseCategory.service";
import uploadService from "../../components/service/upload.service";

export default function CourseCategoriesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");

  // // Dummy data for demonstration
  // const dummyCategories: CourseCategory[] = [
  //   {
  //     _id: "680fd284638ed8389d9440bd",
  //     name: "Web Development",
  //     description: "Learn web development with modern frameworks and tools",
  //     courseCount: 5,
  //     image: [
  //       {
  //         url: getCategoryPlaceholderImage("Web Development", 0),
  //         key: "webdev-image.png",
  //         _id: "680fd471638ed8389d94414a",
  //       },
  //     ],
  //     isActive: true,
  //     isDeleted: false,
  //     createdAt: "2025-04-28T19:09:56.904Z",
  //     updatedAt: "2025-04-28T19:18:09.675Z",
  //   },
  //   {
  //     _id: "680fd47a638ed8389d944159",
  //     name: "Mobile App Development",
  //     description: "Master mobile app development for iOS and Android",
  //     courseCount: 3,
  //     image: [
  //       {
  //         url: getCategoryPlaceholderImage("Mobile Development", 1),
  //         key: "mobile-image.png",
  //         _id: "680fd471638ed8389d94415b",
  //       },
  //     ],
  //     isActive: true,
  //     isDeleted: false,
  //     createdAt: "2025-04-28T19:18:18.265Z",
  //     updatedAt: "2025-04-28T19:18:18.265Z",
  //   },
  //   {
  //     _id: "680fd47a638ed8389d944160",
  //     name: "Data Science",
  //     description:
  //       "Learn data analysis, machine learning and artificial intelligence",
  //     courseCount: 0,
  //     image: [],
  //     isActive: false,
  //     isDeleted: false,
  //     createdAt: "2025-04-28T19:18:18.265Z",
  //     updatedAt: "2025-04-28T19:18:18.265Z",
  //   },
  // ];

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await CourseCategoryService.getAllCourseCategories();
      setCategories(res?.courseCategories);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: CourseCategory) => {
    // Create a payload that matches the validator schema, excluding isActive
    const payload = {
      name: category.name,
      description: category.description,
      image: category.image.map((img) => ({
        path: img.path,
        key: img.key,
        _id: img._id,
      })),
    };

    const res = await CourseCategoryService.createCourseCategory(payload);
    if (res) {
      return res;
    }
  };

  const updateCategory = async (id: string, category: CourseCategory) => {
    // Create a payload that matches the validator schema, excluding isActive
    const payload = {
      name: category.name,
      description: category.description,
      image: category.image.map((img) => ({
        path: img.path,
        key: img.key,
        _id: img._id,
      })),
    };

    const res = await CourseCategoryService.updateCourseCategory(id, payload);
    if (res) {
      return res;
    }
  };

  const deleteCategory = async (id: string) => {
    // Get the category to be deleted
    const categoryToDelete = categories.find((cat) => cat._id === id);

    // Delete any associated images first if they exist
    if (
      categoryToDelete &&
      categoryToDelete.image &&
      categoryToDelete.image.length > 0
    ) {
      for (const img of categoryToDelete.image) {
        if (img.key) {
          try {
            // Use the upload service to delete the image by key
            await uploadService.deleteImage(img.key);
          } catch (error) {
            console.error(`Error deleting image with key ${img.key}:`, error);
            // Continue with category deletion even if image deletion fails
          }
        }
      }
    }

    // Now delete the category
    const res = await CourseCategoryService.deleteCourseCategory(id);
    if (res) {
      return res;
    }
  };

  const restoreCategory = async (id: string) => {
    try {
      const res = await CourseCategoryService.restoreCourseCategory(id);
      if (res) {
        // Update the category in the list
        setCategories(
          categories.map((category) =>
            category._id === id ? { ...category, isDeleted: false } : category
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring category");
    }
  };

  useEffect(() => {
    try {
      fetchCategories();
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddCategory = async (
    newCategory: Omit<
      CourseCategory,
      "_id" | "createdAt" | "updatedAt" | "courseCount" | "isDeleted"
    >
  ) => {
    // Make sure the image data is in the expected format
    const imageData =
      newCategory.image && newCategory.image.length > 0
        ? newCategory.image.map((img) => ({
            path: img.path,
            key: img.key,
            _id: img._id,
          }))
        : [];

    // In a real application, you would make an API call to add the category
    const category: CourseCategory = {
      _id: `temp-id-${Date.now()}`,
      ...newCategory,
      image: imageData,
      courseCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await addCategory(category);
      if (res) {
        // Add the new category to the list
        setCategories([...categories, res.courseCategory || category]);

        // If the user wanted the category to be active, update the status
        if (newCategory.isActive) {
          try {
            // Only call this if res.courseCategory exists and has an _id
            if (res.courseCategory && res.courseCategory._id) {
              await CourseCategoryService.updateCourseCategoryStatus(
                res.courseCategory._id,
                true
              );
            }
          } catch (statusErr) {
            console.error("Error setting initial active status:", statusErr);
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding category");
    } finally {
      setIsFormOpen(false);
    }
  };

  const handleUpdateCategory = async (updatedCategory: CourseCategory) => {
    // Make sure the image data is in the expected format
    const imageData =
      updatedCategory.image && updatedCategory.image.length > 0
        ? updatedCategory.image.map((img) => ({
            path: img.path,
            key: img.key,
            _id: img._id,
          }))
        : [];

    // Create a properly formatted category with the updated image data, excluding isActive
    const formattedCategory = {
      ...updatedCategory,
      image: imageData,
    };

    try {
      // First update the category details
      const res = await updateCategory(
        formattedCategory._id,
        formattedCategory
      );

      // Store the original isActive state to check if it changed
      const originalCategory = categories.find(
        (c) => c._id === updatedCategory._id
      );
      const didActiveStatusChange =
        originalCategory &&
        originalCategory.isActive !== updatedCategory.isActive;

      // If the active status changed, update it separately
      if (didActiveStatusChange) {
        try {
          await CourseCategoryService.updateCourseCategoryStatus(
            updatedCategory._id,
            updatedCategory.isActive
          );
        } catch (statusErr) {
          console.error("Error updating active status:", statusErr);
          // If this fails, we'll still show the updated category info
        }
      }

      if (res) {
        // Update the category in the list
        setCategories(
          categories.map((category) =>
            category._id === updatedCategory._id
              ? {
                  ...res.courseCategory,
                  isActive: didActiveStatusChange
                    ? updatedCategory.isActive
                    : res.courseCategory?.isActive,
                }
              : category
          )
        );
      }

      setEditingCategory(null);
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      // Remove the deleted category from the list
      setCategories(categories.filter((category) => category._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting category");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // Use the dedicated API for toggling active status
      const res = await CourseCategoryService.updateCourseCategoryStatus(
        id,
        isActive
      );
      if (res) {
        // Update the category in the list with the response data
        setCategories(
          categories.map((category) =>
            category._id === id
              ? {
                  ...category,
                  isActive: res.courseCategory?.isActive || isActive,
                }
              : category
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating category status");
      // Revert the UI change if the API call fails
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, isActive: !isActive } : category
        )
      );
    }
  };

  const handleEditCategory = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Filter categories based on the active tab
  const filteredCategories = categories.filter((category) =>
    activeTab === "active" ? !category.isDeleted : category.isDeleted
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Course Categories
        </h1>
        {activeTab === "active" && (
          <button
            className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity"
            onClick={() => {
              setEditingCategory(null);
              setIsFormOpen(true);
            }}
          >
            Add Category
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      <div className="border-b border-[var(--primary)]/10">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "active"
                ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                : "text-[var(--foreground)]/70"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Categories
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                : "text-[var(--foreground)]/70"
            }`}
            onClick={() => setActiveTab("deleted")}
          >
            Deleted Categories
          </button>
        </div>
      </div>

      {isFormOpen && (
        <CourseCategoryForm
          initialData={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      <CourseCategoryList
        categories={filteredCategories}
        isLoading={isLoading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onToggleActive={handleToggleActive}
        onRestore={activeTab === "deleted" ? restoreCategory : undefined}
        showDeletedUI={activeTab === "deleted"}
      />
    </div>
  );
}

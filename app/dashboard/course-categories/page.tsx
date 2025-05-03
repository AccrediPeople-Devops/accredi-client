"use client";

import React, { useState, useEffect } from "react";
import CourseCategoryList from "../../components/course-categories/CourseCategoryList";
import CourseCategoryForm from "../../components/course-categories/CourseCategoryForm";
import { CourseCategory } from "../../types/courseCategory";
import { getCategoryPlaceholderImage } from "../../utils/imageUtils";
import CourseCategoryService from "../../components/service/courseCategory.service";
export default function CourseCategoriesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(
    null
  );

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
    const res = await CourseCategoryService.getAllCourseCategories();
    setCategories(res?.courseCategories);
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

  const handleAddCategory = (
    newCategory: Omit<
      CourseCategory,
      "_id" | "createdAt" | "updatedAt" | "courseCount" | "isDeleted"
    >
  ) => {
    // In a real application, you would make an API call to add the category
    const category: CourseCategory = {
      _id: `temp-id-${Date.now()}`,
      ...newCategory,
      courseCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCategories([...categories, category]);
    setIsFormOpen(false);
  };

  const handleUpdateCategory = (updatedCategory: CourseCategory) => {
    // In a real application, you would make an API call to update the category
    setCategories(
      categories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      )
    );
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    // In a real application, you would make an API call to delete the category
    setCategories(categories.filter((category) => category._id !== id));
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    // In a real application, you would make an API call to update the category's isActive status
    setCategories(
      categories.map((category) =>
        category._id === id ? { ...category, isActive } : category
      )
    );
  };

  const handleEditCategory = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Course Categories
        </h1>
        <button
          className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity"
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

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
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}

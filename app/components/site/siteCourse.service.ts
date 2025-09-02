import axiosInstance from "../config/axiosInstance";
import { Course } from "@/app/types/course";
import { CourseCategory } from "@/app/types/courseCategory";
import { createCourseSlug, isValidObjectId } from "@/app/utils/textUtils";

/**
 * Site Course Service - Handles public course operations for landing pages
 * Uses public endpoints that don't require authentication
 */
class SiteCourseService {
  /**
   * Get all courses for public landing page (No authentication required)
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getPublicCourses() {
    try {
      const response = await axiosInstance.get("/courses");
      return response.data;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get categories for public landing page by extracting from courses data
   * @returns {Promise<{status: boolean, courseCategories: CourseCategory[]}>}
   */
  async getPublicCourseCategories() {
    try {
      // Fetch courses from public endpoint
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { status: false, courseCategories: [] };
      }

      // Extract unique categories from courses
      const categoriesMap = new Map();
      
      coursesResponse.courses.forEach((course: any, index: number) => {
        
        if (course.categoryId && typeof course.categoryId === 'object') {
          const category = course.categoryId;
          // Use category._id as the unique key for deduplication
          if (category._id) {
            categoriesMap.set(category._id, {
              _id: category._id,
              name: category.name,
              description: category.description,
              courseCount: category.courseCount || 0,
              image: category.image || [],
              isActive: category.isActive !== false,
              isDeleted: category.isDeleted || false,
              createdAt: category.createdAt,
              updatedAt: category.updatedAt
            });
          }
        } else if (course.categoryId === null) {
        }
      });


      const categories = Array.from(categoriesMap.values());
      
      return {
        status: true,
        courseCategories: categories
      };
    } catch (error) {
      return { status: false, courseCategories: [] };
    }
  }

  /**
   * Get course by ID from public courses
   * @param {string} id - Course ID
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async getPublicCourseById(id: string) {
    try {
      
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { 
          status: false, 
          message: `No courses available`
        };
      }

      const foundCourse = coursesResponse.courses.find((course: any) => course._id === id);
      if (foundCourse) {
        return { status: true, course: foundCourse };
      }
      
      return { 
        status: false, 
        message: `Course not found with ID: ${id}`
      };
    } catch (error: any) {
      return { 
        status: false, 
        message: error.response?.data?.message || `Error fetching course with ID: ${id}`
      };
    }
  }

  /**
   * Get course by slug or ID from public courses
   * @param {string} slugOrId - Course slug or ID
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async getPublicCourseBySlug(slugOrId: string) {
    try {
      
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { 
          status: false, 
          message: `No courses available`
        };
      }

      let foundCourse = null;

      // First, check if it's a valid ObjectId and try to find by ID
      if (isValidObjectId(slugOrId)) {
        foundCourse = coursesResponse.courses.find((course: any) => course._id === slugOrId);
        if (foundCourse) {
          return { status: true, course: foundCourse };
        }
      }

      // If not found by ID or not a valid ObjectId, try to find by slug
      foundCourse = coursesResponse.courses.find((course: any) => {
        const courseSlug = createCourseSlug(course.title);
        return courseSlug === slugOrId;
      });

      if (foundCourse) {
        return { status: true, course: foundCourse };
      }
      
      return { 
        status: false, 
        message: `Course not found with slug/ID: ${slugOrId}`
      };
    } catch (error: any) {
      return { 
        status: false, 
        message: error.response?.data?.message || `Error fetching course with slug/ID: ${slugOrId}`
      };
    }
  }

  /**
   * Get courses by category ID from public courses
   * @param {string} categoryId - Category ID
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getPublicCoursesByCategory(categoryId: string) {
    try {
      
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { status: false, courses: [] };
      }

      // Filter courses by categoryId
      const filteredCourses = coursesResponse.courses.filter((course: any) => {
        return (
          course.categoryId?._id === categoryId ||
          course.categoryId === categoryId
        );
      });
      
      return { 
        status: true, 
        courses: filteredCourses 
      };
    } catch (error) {
      return { status: false, courses: [] };
    }
  }

  /**
   * Get recent courses from public courses
   * @param {number} limit - Maximum number of courses to return
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getRecentPublicCourses(limit: number = 4) {
    try {
      
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { status: false, courses: [] };
      }

      // Sort by creation date (newest first)
      const sortedCourses = coursesResponse.courses.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      // Return only the requested number of courses
      const recentCourses = sortedCourses.slice(0, limit);
      
      return { 
        status: true, 
        courses: recentCourses 
      };
    } catch (error) {
      return { status: false, courses: [] };
    }
  }

  /**
   * Search courses by title or description
   * @param {string} query - Search query
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async searchPublicCourses(query: string) {
    try {
      
      const coursesResponse = await this.getPublicCourses();
      
      if (!coursesResponse?.status || !coursesResponse?.courses) {
        return { status: false, courses: [] };
      }

      const searchQuery = query.toLowerCase();
      const filteredCourses = coursesResponse.courses.filter((course: any) => {
        return (
          course.title?.toLowerCase().includes(searchQuery) ||
          course.description?.toLowerCase().includes(searchQuery) ||
          course.shortDescription?.toLowerCase().includes(searchQuery) ||
          course.categoryId?.name?.toLowerCase().includes(searchQuery)
        );
      });
      
      return { 
        status: true, 
        courses: filteredCourses 
      };
    } catch (error) {
      return { status: false, courses: [] };
    }
  }

  /**
   * Get course statistics for landing page
   * @returns {Promise<{totalCourses: number, totalCategories: number, activeCourses: number}>}
   */
  async getCourseStats() {
    try {
      const [coursesResponse, categoriesResponse] = await Promise.all([
        this.getPublicCourses(),
        this.getPublicCourseCategories()
      ]);

      const totalCourses = coursesResponse?.courses?.length || 0;
      const totalCategories = categoriesResponse?.courseCategories?.length || 0;
      const activeCourses = coursesResponse?.courses?.filter((course: any) => 
        course.isActive !== false && !course.isDeleted
      ).length || 0;

      return {
        totalCourses,
        totalCategories,
        activeCourses
      };
    } catch (error) {
      return {
        totalCourses: 0,
        totalCategories: 0,
        activeCourses: 0
      };
    }
  }
}

export default new SiteCourseService(); 
import axiosInstance from "../config/axiosInstance";

class CourseCategoryService {
  async getAllCourseCategories() {
    try {
      const response = await axiosInstance.get("/courses");
      
      // Extract unique categories from courses
      if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
        const courses = response.data.courses;
        const categoryMap = new Map();
        
        courses.forEach((course: any) => {
          if (course.categoryId && course.categoryId._id) {
            const category = course.categoryId;
            if (!categoryMap.has(category._id)) {
              categoryMap.set(category._id, {
                _id: category._id,
                name: category.name || 'Unknown Category',
                description: category.description || '',
                courseCount: 1,
                image: category.image || [],
                isActive: category.isActive !== false,
                isDeleted: category.isDeleted === true,
                createdAt: category.createdAt || new Date().toISOString(),
                updatedAt: category.updatedAt || new Date().toISOString()
              });
            } else {
              // Increment course count for existing category
              const existingCategory = categoryMap.get(category._id);
              existingCategory.courseCount += 1;
            }
          }
        });
        
        const categories = Array.from(categoryMap.values());
        console.log("Extracted categories from courses:", categories);
        
        return { 
          status: true, 
          courseCategories: categories 
        };
      }
      
      return { status: true, courseCategories: [] };
    } catch (error: any) {
      console.error("Error fetching courses for categories:", error);
      // If it's an authentication error and we're on a public page, return empty data
      if (error.response?.status === 401 || error.message === "Authentication required") {
        console.warn("Authentication failed for courses, returning empty data for public access");
        return { status: true, courseCategories: [] };
      }
      throw error;
    }
  }
  
  async getCourseCategoryById(id: string) {
    try {
      // First try direct endpoint
      try {
        const response = await axiosInstance.get(`/courses-categories/v1/${id}`);
        return response.data;
      } catch (directError) {
        console.log("Direct endpoint failed, using fallback method");
        
        // Fallback: Fetch all categories and find the matching one
        const allResponse = await this.getAllCourseCategories();
        
        let categories = [];
        if (allResponse && allResponse.courseCategories && Array.isArray(allResponse.courseCategories)) {
          categories = allResponse.courseCategories;
        } else if (Array.isArray(allResponse)) {
          categories = allResponse;
        }
        
        const foundCategory = categories.find((category: any) => category._id === id);
        if (foundCategory) {
          return { status: true, courseCategory: foundCategory };
        }
        
        // Return a not found error
        return { 
          status: false, 
          message: `Category not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }
  
  async createCourseCategory(data: any) {
    try {
      const response = await axiosInstance.post("/courses-categories/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateCourseCategory(id: string, data: any) {
    try {
      const response = await axiosInstance.put(
        `/courses-categories/v1/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteCourseCategory(id: string) {
    try {
      const response = await axiosInstance.delete(
        `/courses-categories/v1/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async restoreCourseCategory(id: string) {
    try {
      const response = await axiosInstance.put(
        `/courses-categories/v1/${id}/undo-delete`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateCourseCategoryStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(
        `/courses-categories/v1/${id}/active`,
        { isActive }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CourseCategoryService();

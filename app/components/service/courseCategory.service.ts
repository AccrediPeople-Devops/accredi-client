import axiosInstance from "../config/axiosInstance";

class CourseCategoryService {
  async getAllCourseCategories() {
    try {
      const response = await axiosInstance.get("/courses-categories/v1");
      return response.data;
    } catch (error) {
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

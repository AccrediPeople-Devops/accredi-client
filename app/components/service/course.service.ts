import axiosInstance from "../config/axiosInstance";

class CourseService {
  async getAllCourses() {
    try {
      const response = await axiosInstance.get("/courses/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(data: any) {
    try {
      const response = await axiosInstance.post("/courses/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(id: string, data: any) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(id: string) {
    try {
      const response = await axiosInstance.delete(`/courses/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async restoreCourse(id: string) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}/undo-delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCourseStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CourseService();

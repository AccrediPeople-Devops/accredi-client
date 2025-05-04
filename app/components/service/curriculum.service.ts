import axiosInstance from "../config/axiosInstance";

class CurriculumService {
  async getAllCurriculums() {
    try {
      const response = await axiosInstance.get("/curriculums/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurriculumByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/curriculums/v1/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCurriculum(data: any) {
    try {
      const response = await axiosInstance.post("/curriculums/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCurriculum(id: string, data: any) {
    try {
      const response = await axiosInstance.put(
        `/curriculums/v1/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCurriculum(id: string) {
    try {
      const response = await axiosInstance.delete(
        `/curriculums/v1/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CurriculumService(); 
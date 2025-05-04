import axiosInstance from "../config/axiosInstance";

class ReviewService {
  async getAllReviews() {
    try {
      const response = await axiosInstance.get("/reviews/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createReview(data: any) {
    try {
      const response = await axiosInstance.post("/reviews/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(id: string, data: any) {
    try {
      const response = await axiosInstance.put(`/reviews/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(id: string) {
    try {
      const response = await axiosInstance.delete(`/reviews/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReviewStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/reviews/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReviewService();

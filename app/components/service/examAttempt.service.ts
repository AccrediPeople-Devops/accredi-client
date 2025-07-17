import axiosInstance from "@/app/components/config/axiosInstance";
import {
  ExamAttempt,
  ExamAttemptResponse,
  ExamAttemptsResponse,
  ExamAttemptWithDetails,
  UpdateExamAttemptRequest,
} from "@/app/types/examAttempt";

class ExamAttemptService {
  // Get all exam attempts (admin)
  async getAllExamAttempts(): Promise<ExamAttemptWithDetails[]> {
    try {
      const response = await axiosInstance.get("/exam-attempts/v1");
      
      // Handle different response formats
      let attempts: ExamAttemptWithDetails[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        attempts = response.data;
      } else if (response.data && response.data.examAttempts && Array.isArray(response.data.examAttempts)) {
        attempts = response.data.examAttempts;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        attempts = response.data.data;
      } else {
        attempts = [];
      }
      
      return attempts;
    } catch (error: any) {
      console.error("Error fetching exam attempts:", error);
      
      // If it's a 404, the endpoint might not exist yet
      if (error.response?.status === 404) {
        return [];
      }
      
      throw new Error(error.response?.data?.message || "Failed to fetch exam attempts");
    }
  }

  // Get exam attempt by ID (admin)
  async getExamAttemptById(attemptId: string): Promise<ExamAttemptWithDetails> {
    try {
      const response = await axiosInstance.get(`/exam-attempts/v1/${attemptId}`);
      return response.data.examAttempt || response.data;
    } catch (error: any) {
      console.error("Error fetching exam attempt:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch exam attempt");
    }
  }

  // Update exam attempt (admin)
  async updateExamAttempt(attemptId: string, updateData: UpdateExamAttemptRequest): Promise<ExamAttemptResponse> {
    try {
      const response = await axiosInstance.put(`/exam-attempts/v1/${attemptId}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error("Error updating exam attempt:", error);
      throw new Error(error.response?.data?.message || "Failed to update exam attempt");
    }
  }

  // Delete exam attempt (admin)
  async deleteExamAttempt(attemptId: string): Promise<{ status: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`/exam-attempts/v1/${attemptId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting exam attempt:", error);
      throw new Error(error.response?.data?.message || "Failed to delete exam attempt");
    }
  }

  // Show results for an exam (admin)
  async showExamResults(examId: string): Promise<{ status: boolean; message: string }> {
    try {
      const response = await axiosInstance.put(`/exam-attempts/v1/exam/${examId}/show-results`);
      return response.data;
    } catch (error: any) {
      console.error("Error showing exam results:", error);
      throw new Error(error.response?.data?.message || "Failed to show exam results");
    }
  }
}

const examAttemptService = new ExamAttemptService();
export default examAttemptService; 
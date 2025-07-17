import axiosInstance from "@/app/components/config/axiosInstance";
import {
  ExamAttempt,
  ExamAttemptResponse,
  StartExamAttemptRequest,
  StartExamAttemptResponse,
  SaveProgressRequest,
  SubmitExamRequest,
} from "@/app/types/examAttempt";

class ExamAttemptService {
  // Start an exam attempt
  async startExamAttempt(examId: string): Promise<StartExamAttemptResponse> {
    try {
      const response = await axiosInstance.get(`/exam-attempts/start/${examId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error starting exam attempt:", error);
      throw new Error(error.response?.data?.message || "Failed to start exam attempt");
    }
  }

  // Save exam progress
  async saveProgress(attemptId: string, answers: any[]): Promise<ExamAttemptResponse> {
    try {
      const response = await axiosInstance.post(`/exam-attempts/save-progress/${attemptId}`, {
        answers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error saving exam progress:", error);
      throw new Error(error.response?.data?.message || "Failed to save exam progress");
    }
  }

  // Submit exam
  async submitExam(attemptId: string, answers: any[], endTime: string, timeSpent: number): Promise<ExamAttemptResponse> {
    try {
      const response = await axiosInstance.post(`/exam-attempts/submit/${attemptId}`, {
        answers,
        endTime,
        timeSpent,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error submitting exam:", error);
      throw new Error(error.response?.data?.message || "Failed to submit exam");
    }
  }

  // Get user's exam attempts
  async getMyAttempts(): Promise<ExamAttempt[]> {
    try {
      const response = await axiosInstance.get("/exam-attempts/my-attempts");
      
      // Handle different response formats
      let attempts: ExamAttempt[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        attempts = response.data;
      } else if (response.data && response.data.examAttempts && Array.isArray(response.data.examAttempts)) {
        attempts = response.data.examAttempts;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        attempts = response.data.data;
      } else if (response.data && response.data.attempts && Array.isArray(response.data.attempts)) {
        attempts = response.data.attempts;
      } else {
        attempts = [];
      }
      
      return attempts;
    } catch (error: any) {
      console.error("Error fetching my attempts:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch exam attempts");
    }
  }

  // Get exam result
  async getExamResult(attemptId: string): Promise<ExamAttemptResponse> {
    try {
      const response = await axiosInstance.get(`/exam-attempts/result/${attemptId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching exam result:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch exam result");
    }
  }


}

const examAttemptService = new ExamAttemptService();
export default examAttemptService; 
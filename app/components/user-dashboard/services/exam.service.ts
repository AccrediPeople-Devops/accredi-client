import axiosInstance from "@/app/components/config/axiosInstance";

export interface Exam {
  _id: string;
  title: string;
  timeLimit: number; // in minutes
  resultMethod: "auto" | "manual";
  isActive: boolean;
  courseId: {
    _id: string;
    title: string;
    shortDescription: string;
  };
  questionPaperSetId: {
    _id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExamsResponse {
  status: boolean;
  exams: Exam[];
}

class ExamService {
  // Get available exams for the user
  async getAvailableExams(): Promise<Exam[]> {
    try {
      const response = await axiosInstance.get("/exams/v1/available-exams");
      console.log("Available exams response:", response.data);
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.exams && Array.isArray(response.data.exams)) {
        return response.data.exams;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn("Unexpected response format for available exams:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("Error fetching available exams:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch available exams");
    }
  }

  // Get exam by ID
  async getExamById(examId: string): Promise<Exam> {
    try {
      console.log("Fetching exam by ID:", examId);
      const response = await axiosInstance.get(`/exams/v1/${examId}`);
      console.log("Exam response:", response.data);
      return response.data.exam || response.data;
    } catch (error: any) {
      console.error("Error fetching exam:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(error.response?.data?.message || "Failed to fetch exam");
    }
  }
}

const examService = new ExamService();
export default examService; 
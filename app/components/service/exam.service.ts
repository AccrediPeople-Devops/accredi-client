import axiosInstance from "../config/axiosInstance";
import { Exam } from "../../types/exam";

/**
 * API response type for exam endpoints
 * @typedef {Object} ExamApiResponse
 * @property {boolean} status - Success status
 * @property {Exam|Exam[]} exams - Single exam or array of exams
 */

class ExamService {
  /**
   * Get all exams
   * @returns {Promise<{status: boolean, exams: Exam[]}>}
   */
  async getAllExams() {
    try {
      console.log("ExamService: Fetching all exams");
      const response = await axiosInstance.get("/exams/v1");
      console.log("ExamService: All exams response:", response.data);
      
      // Format the response based on different possible formats
      if (response.data) {
        // Check if the response is a direct array
        if (Array.isArray(response.data)) {
          console.log("ExamService: Received direct array of exams");
          return { status: true, exams: response.data };
        }
        
        // Check if using standard format with exams array
        if (response.data.exams && Array.isArray(response.data.exams)) {
          console.log("ExamService: Received standard format with exams array");
          return response.data;
        }
        
        // Check if the data is in a nested data property
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log("ExamService: Received exams in nested data property");
          return { status: true, exams: response.data.data };
        }
      }
      
      // If we couldn't find exams in any expected format, return empty array
      console.warn("ExamService: Could not find exams in expected format");
      return { status: true, exams: [] };
    } catch (error: any) {
      console.error("ExamService: Error fetching all exams:", error);
      if (error.response) {
        console.error("ExamService: Response data:", error.response.data);
        return { 
          status: false, 
          message: error.response.data?.message || "Error fetching exams",
          exams: []
        };
      }
      throw error;
    }
  }

  /**
   * Get exam by ID
   * @param {string} id - Exam ID
   * @returns {Promise<{status: boolean, exam: Exam}>}
   */
  async getExamById(id: string) {
    try {
      console.log("ExamService: Fetching exam with ID:", id);
      
      // Skip the direct endpoint call that was causing 404 errors
      // and go straight to fetching all exams and finding the matching one
      console.log("ExamService: Using fallback method - fetch all");
      
      const allResponse = await this.getAllExams();
      
      // Handle different response formats
      let exams = [];
      
      if (allResponse.exams && Array.isArray(allResponse.exams)) {
        exams = allResponse.exams;
      } else if (Array.isArray(allResponse)) {
        exams = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        exams = allResponse.data;
      }
      
      // Find the exam with matching ID
      const foundExam = exams.find((exam: any) => exam._id === id);
      
      if (foundExam) {
        console.log("ExamService: Found exam in list:", foundExam);
        return { status: true, exam: foundExam };
      }
      
      // If we couldn't find it, return a not found error
      console.error("ExamService: Exam not found with ID:", id);
      return { status: false, message: `Exam not found with ID: ${id}` };
    } catch (error: any) {
      console.error("ExamService: Error fetching exam:", error);
      
      if (error.response) {
        console.error("ExamService: Response data:", error.response.data);
        return { 
          status: false, 
          message: error.response.data?.message || `Error fetching exam with ID: ${id}`
        };
      }
      
      throw error;
    }
  }

  /**
   * Get exams by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, exams: Exam[]}>}
   */
  async getExamsByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/exams/v1/course/${courseId}`);
      // Format the response if needed
      if (response.data && Array.isArray(response.data)) {
        return { status: true, exams: response.data };
      }
      return response.data;
    } catch (error: any) {
      console.error("Error fetching exams by course:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        return { status: false, message: error.response.data?.message || "Error fetching exams" };
      }
      throw error;
    }
  }

  /**
   * Create a new exam
   * @param {ExamFormData} data - Exam data
   * @returns {Promise<{status: boolean, exam: Exam}>}
   */
  async createExam(data: any) {
    try {
      console.log("Sending exam data:", JSON.stringify(data));
      const response = await axiosInstance.post("/exams/v1", data);
      console.log("API response:", response.data);
      
      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, exam: response.data };
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Error creating exam:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        // Return the error message from the server if available
        return { 
          status: false, 
          message: error.response.data?.message || "Server error. Please try again."
        };
      }
      throw error;
    }
  }

  /**
   * Update an existing exam
   * @param {string} id - Exam ID
   * @param {Partial<ExamFormData>} data - Updated exam data
   * @returns {Promise<{status: boolean, exam: Exam}>}
   */
  async updateExam(id: string, data: any) {
    try {
      console.log("ExamService: Updating exam with ID:", id);
      console.log("ExamService: Update data:", JSON.stringify(data));
      
      const response = await axiosInstance.put(`/exams/v1/${id}`, data);
      console.log("ExamService: Update response:", response.data);
      
      // Format the response if needed
      if (response.data) {
        // Check if we got a standard response format
        if (response.data.exam && response.data.status === true) {
          return response.data;
        }
        
        // Check if we got a direct object response with the correct ID
        if (response.data._id === id) {
          return { status: true, exam: response.data };
        }
        
        // Check if the response is in a nested data property
        if (response.data.data && response.data.data._id === id) {
          return { status: true, exam: response.data.data };
        }
        
        // If we can't determine a specific pattern but got a response object,
        // return it and let the component handle it
        return { status: true, exam: response.data };
      }
      
      // If the response is empty, try to fetch the updated exam
      console.log("ExamService: Empty response from update, fetching the exam");
      return await this.getExamById(id);
    } catch (error: any) {
      console.error("ExamService: Error updating exam:", error);
      if (error.response) {
        console.error("ExamService: Response data:", error.response.data);
        console.error("ExamService: Response status:", error.response.status);
        console.error("ExamService: Response headers:", error.response.headers);
        
        // Return the error message from the server if available
        return { 
          status: false, 
          message: error.response.data?.message || "Server error. Please try again."
        };
      }
      throw error;
    }
  }

  /**
   * Delete an exam
   * @param {string} id - Exam ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteExam(id: string) {
    try {
      const response = await axiosInstance.delete(`/exams/v1/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting exam:", error);
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error deleting exam"
        };
      }
      throw error;
    }
  }

  /**
   * Toggle exam active status
   * @param {string} id - Exam ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, exam: Exam}>}
   */
  async updateExamStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/exams/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating exam status:", error);
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error updating status"
        };
      }
      throw error;
    }
  }

  /**
   * Restore a deleted exam
   * @param {string} id - Exam ID
   * @returns {Promise<{status: boolean, exam: Exam}>}
   */
  async restoreExam(id: string) {
    try {
      console.log("ExamService: Attempting to restore exam with ID:", id);
      
      // Skip the direct endpoint that fails and go directly to the update approach
      console.log("ExamService: Using direct update approach to restore");
      const allResponse = await this.getAllExams();
      let exams = [];
      
      if (allResponse.exams && Array.isArray(allResponse.exams)) {
        exams = allResponse.exams;
      } else if (Array.isArray(allResponse)) {
        exams = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        exams = allResponse.data;
      }
      
      const foundExam = exams.find((exam: any) => exam._id === id);
      
      if (foundExam) {
        // Update just the isDeleted property
        console.log("ExamService: Found exam to restore:", foundExam);
        const updateResponse = await axiosInstance.put(`/exams/v1/${id}`, {
          ...foundExam,
          isDeleted: false
        });
        console.log("ExamService: Restore response:", updateResponse.data);
        return updateResponse.data;
      } else {
        console.error("ExamService: Could not find exam with ID:", id);
        return { 
          status: false, 
          message: `Exam not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      console.error("Error restoring exam:", error);
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error restoring exam"
        };
      }
      throw error;
    }
  }
}

export default new ExamService(); 
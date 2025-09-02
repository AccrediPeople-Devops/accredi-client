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
      const response = await axiosInstance.get("/exams/v1");
      
      // Format the response based on different possible formats
      if (response.data) {
        // Check if the response is a direct array
        if (Array.isArray(response.data)) {
          return { status: true, exams: response.data };
        }
        
        // Check if using standard format with exams array
        if (response.data.exams && Array.isArray(response.data.exams)) {
          return response.data;
        }
        
        // Check if the data is in a nested data property
        if (response.data.data && Array.isArray(response.data.data)) {
          return { status: true, exams: response.data.data };
        }
      }
      
      // If we couldn't find exams in any expected format, return empty array
      return { status: true, exams: [] };
    } catch (error: any) {
      if (error.response) {
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
      
      // Skip the direct endpoint call that was causing 404 errors
      // and go straight to fetching all exams and finding the matching one
      
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
        return { status: true, exam: foundExam };
      }
      
      // If we couldn't find it, return a not found error
      return { status: false, message: `Exam not found with ID: ${id}` };
    } catch (error: any) {
      
      if (error.response) {
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
      if (error.response) {
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
      const response = await axiosInstance.post("/exams/v1", data);
      
      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, exam: response.data };
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
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
      
      const response = await axiosInstance.put(`/exams/v1/${id}`, data);
      
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
      return await this.getExamById(id);
    } catch (error: any) {
      if (error.response) {
        
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
      
      // Skip the direct endpoint that fails and go directly to the update approach
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
        const updateResponse = await axiosInstance.put(`/exams/v1/${id}`, {
          ...foundExam,
          isDeleted: false
        });
        return updateResponse.data;
      } else {
        return { 
          status: false, 
          message: `Exam not found with ID: ${id}`
        };
      }
    } catch (error: any) {
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
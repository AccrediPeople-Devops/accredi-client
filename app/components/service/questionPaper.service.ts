import axiosInstance from "../config/axiosInstance";
import { QuestionPaper } from "../../types/questionPaper";

/**
 * API response type for question paper endpoints
 * @typedef {Object} QuestionPaperApiResponse
 * @property {boolean} status - Success status
 * @property {QuestionPaper|QuestionPaper[]} questionPapers - Single question paper or array of question papers
 */

class QuestionPaperService {
  /**
   * Get all question papers
   * @returns {Promise<{status: boolean, questionPapers: QuestionPaper[]}>}
   */
  async getAllQuestionPapers() {
    try {
      const response = await axiosInstance.get("/question-papers/v1");
      
      // Format the response based on different possible formats
      if (response.data) {
        // Check if the response is a direct array
        if (Array.isArray(response.data)) {
          return { status: true, questionPapers: response.data };
        }
        
        // Check if using standard format with questionPapers array
        if (response.data.questionPapers && Array.isArray(response.data.questionPapers)) {
          return response.data;
        }
        
        // Check if the data is in a nested data property
        if (response.data.data && Array.isArray(response.data.data)) {
          return { status: true, questionPapers: response.data.data };
        }
      }
      
      // If we couldn't find question papers in any expected format, return empty array
      return { status: true, questionPapers: [] };
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error fetching question papers",
          questionPapers: []
        };
      }
      throw error;
    }
  }

  /**
   * Get question paper by ID
   * @param {string} id - Question Paper ID
   * @returns {Promise<{status: boolean, questionPaper: QuestionPaper}>}
   */
  async getQuestionPaperById(id: string) {
    try {
      
      // Skip the direct endpoint call that was causing 404 errors
      // and go straight to fetching all question papers and finding the matching one
      
      const allResponse = await this.getAllQuestionPapers();
      
      // Handle different response formats
      let questionPapers = [];
      
      if (allResponse.questionPapers && Array.isArray(allResponse.questionPapers)) {
        questionPapers = allResponse.questionPapers;
      } else if (Array.isArray(allResponse)) {
        questionPapers = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        questionPapers = allResponse.data;
      }
      
      // Find the question paper with matching ID
      const foundPaper = questionPapers.find((paper: any) => paper._id === id);
      
      if (foundPaper) {
        return { status: true, questionPaper: foundPaper };
      }
      
      // If we couldn't find it, return a not found error
      return { status: false, message: `Question paper not found with ID: ${id}` };
    } catch (error: any) {
      
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || `Error fetching question paper with ID: ${id}`
        };
      }
      
      throw error;
    }
  }

  /**
   * Get question papers by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, questionPapers: QuestionPaper[]}>}
   */
  async getQuestionPapersByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/question-papers/v1/course/${courseId}`);
      // Format the response if needed
      if (response.data && Array.isArray(response.data)) {
        return { status: true, questionPapers: response.data };
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { status: false, message: error.response.data?.message || "Error fetching question papers" };
      }
      throw error;
    }
  }

  /**
   * Create a new question paper
   * @param {QuestionPaperFormData} data - Question paper data
   * @returns {Promise<{status: boolean, questionPaper: QuestionPaper}>}
   */
  async createQuestionPaper(data: any) {
    try {
      const response = await axiosInstance.post("/question-papers/v1", data);
      
      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, questionPaper: response.data };
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
   * Update an existing question paper
   * @param {string} id - Question Paper ID
   * @param {Partial<QuestionPaperFormData>} data - Updated question paper data
   * @returns {Promise<{status: boolean, questionPaper: QuestionPaper}>}
   */
  async updateQuestionPaper(id: string, data: any) {
    try {
      
      const response = await axiosInstance.put(`/question-papers/v1/${id}`, data);
      
      // Format the response if needed
      if (response.data) {
        // Check if we got a standard response format
        if (response.data.questionPaper && response.data.status === true) {
          return response.data;
        }
        
        // Check if we got a direct object response with the correct ID
        if (response.data._id === id) {
          return { status: true, questionPaper: response.data };
        }
        
        // Check if the response is in a nested data property
        if (response.data.data && response.data.data._id === id) {
          return { status: true, questionPaper: response.data.data };
        }
        
        // If we can't determine a specific pattern but got a response object,
        // return it and let the component handle it
        return { status: true, questionPaper: response.data };
      }
      
      // If the response is empty, try to fetch the updated question paper
      return await this.getQuestionPaperById(id);
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
   * Delete a question paper
   * @param {string} id - Question Paper ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteQuestionPaper(id: string) {
    try {
      const response = await axiosInstance.delete(`/question-papers/v1/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error deleting question paper"
        };
      }
      throw error;
    }
  }

  /**
   * Toggle question paper active status
   * @param {string} id - Question Paper ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, questionPaper: QuestionPaper}>}
   */
  async updateQuestionPaperStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/question-papers/v1/${id}/active`, {
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
   * Restore a deleted question paper
   * @param {string} id - Question Paper ID
   * @returns {Promise<{status: boolean, questionPaper: QuestionPaper}>}
   */
  async restoreQuestionPaper(id: string) {
    try {
      
      // Skip the failing endpoints and go directly to the approach that works
      // First get the current question paper data
      const allResponse = await this.getAllQuestionPapers();
      let questionPapers = [];
      
      if (allResponse.questionPapers && Array.isArray(allResponse.questionPapers)) {
        questionPapers = allResponse.questionPapers;
      } else if (Array.isArray(allResponse)) {
        questionPapers = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        questionPapers = allResponse.data;
      }
      
      const foundPaper = questionPapers.find((paper: any) => paper._id === id);
      
      if (foundPaper) {
        // Update just the isDeleted property
        const updateResponse = await axiosInstance.put(`/question-papers/v1/${id}`, {
          ...foundPaper,
          isDeleted: false
        });
        return updateResponse.data;
      } else {
        return { 
          status: false, 
          message: `Question paper not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error restoring question paper"
        };
      }
      throw error;
    }
  }
}

export default new QuestionPaperService(); 
import axiosInstance from "../config/axiosInstance";

/**
 * FAQ Service for managing FAQ CRUD operations
 */
class FaqService {
  /**
   * Get all FAQs
   * @returns {Promise<{status: boolean, faqs: any[]}>}
   */
  async getAllFaqs() {
    try {
      const response = await axiosInstance.get("/faqs/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get FAQs by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, faqs: any[]}>}
   */
  async getFaqsByCourse(courseId: string) {
    try {
      // Get all FAQs and filter by course ID since there's no direct endpoint
      const response = await this.getAllFaqs();
      if (response?.faqs) {
        const courseFaqs = response.faqs.filter((faq: any) => faq.courseId === courseId);
        return {
          status: true,
          faqs: courseFaqs
        };
      }
      return {
        status: true,
        faqs: []
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create or update FAQs for a course
   * @param {string} courseId - Course ID
   * @param {Array} faqs - Array of FAQ objects with question and answer
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async createOrUpdateFaqs(courseId: string, faqs: Array<{question: string, answer: string}>) {
    try {
      const response = await axiosInstance.post("/faqs/v1", {
        courseId,
        faqs
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update FAQs by FAQ ID
   * @param {string} faqId - FAQ ID
   * @param {string} courseId - Course ID
   * @param {Array} faqs - Array of FAQ objects with question and answer
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async updateFaqs(faqId: string, courseId: string, faqs: Array<{question: string, answer: string}>) {
    try {
      const response = await axiosInstance.put(`/faqs/v1/${faqId}`, {
        courseId,
        faqs
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete FAQ by ID
   * @param {string} faqId - FAQ ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteFaqById(faqId: string) {
    try {
      const response = await axiosInstance.delete(`/faqs/v1/${faqId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete FAQs for a course
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteFaqsByCourse(courseId: string) {
    try {
      // Get FAQs for the course first, then delete by ID
      const courseFaqs = await this.getFaqsByCourse(courseId);
      if (courseFaqs?.faqs && courseFaqs.faqs.length > 0) {
        // Delete each FAQ by its ID
        for (const faq of courseFaqs.faqs) {
          await this.deleteFaqById(faq._id);
        }
        return {
          status: true,
          message: "FAQs deleted successfully"
        };
      }
      return {
        status: true,
        message: "No FAQs found for this course"
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new FaqService(); 
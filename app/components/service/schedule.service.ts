import axiosInstance from "../config/axiosInstance";
import { Schedule } from "../../types/schedule";

/**
 * API response type for schedule endpoints
 * @typedef {Object} ScheduleApiResponse
 * @property {boolean} status - Success status
 * @property {Schedule|Schedule[]} schedules - Single schedule or array of schedules
 */

class ScheduleService {
  /**
   * Get all schedules
   * @returns {Promise<{status: boolean, schedules: Schedule[]}>}
   */
  async getAllSchedules() {
    try {
      console.log("ScheduleService: Fetching all schedules");
      const response = await axiosInstance.get("/schedules/v1");
      console.log("ScheduleService: All schedules response:", response.data);

      // Simply return the response data, let the component handle it
      return response.data;
    } catch (error: any) {
      console.error("ScheduleService: Error fetching all schedules:", error);
      if (error.response) {
        console.error("ScheduleService: Response data:", error.response.data);
        return {
          status: false,
          message: error.response.data?.message || "Error fetching schedules",
          schedules: [],
        };
      }
      throw error;
    }
  }

  /**
   * Get schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async getScheduleById(id: string) {
    try {
      console.log("ScheduleService: Fetching schedule with ID:", id);

      try {
        // First try the direct endpoint
        const response = await axiosInstance.get(`/schedules/v1/${id}`);
        console.log(
          "ScheduleService: Direct endpoint response:",
          response.data
        );
        return response.data;
      } catch (directError) {
        console.log(
          "ScheduleService: Direct endpoint failed, using fallback method"
        );

        // If the direct endpoint fails, use fallback method
        const allResponse = await this.getAllSchedules();

        // Handle different response formats
        let schedules = [];

        if (allResponse.schedules && Array.isArray(allResponse.schedules)) {
          schedules = allResponse.schedules;
        } else if (Array.isArray(allResponse)) {
          schedules = allResponse;
        } else if (allResponse.data && Array.isArray(allResponse.data)) {
          schedules = allResponse.data;
        }

        // Find the schedule with matching ID
        const foundSchedule = schedules.find(
          (schedule: any) => schedule._id === id
        );

        if (foundSchedule) {
          console.log(
            "ScheduleService: Found schedule in list:",
            foundSchedule
          );
          return { status: true, schedule: foundSchedule };
        }

        // If we couldn't find it, return a not found error
        console.error("ScheduleService: Schedule not found with ID:", id);
        return { status: false, message: `Schedule not found with ID: ${id}` };
      }
    } catch (error: any) {
      console.error("ScheduleService: Error fetching schedule:", error);

      if (error.response) {
        console.error("ScheduleService: Response data:", error.response.data);
        return {
          status: false,
          message:
            error.response.data?.message ||
            `Error fetching schedule with ID: ${id}`,
        };
      }

      throw error;
    }
  }

  /**
   * Get schedules by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, schedules: Schedule[]}>}
   */
  async getSchedulesByCourseId(courseId: string) {
    try {
      // Try to get all schedules and filter by courseId
      const allResponse = await this.getAllSchedules();

      let schedules = [];
      if (allResponse.schedules && Array.isArray(allResponse.schedules)) {
        schedules = allResponse.schedules;
      } else if (Array.isArray(allResponse)) {
        schedules = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        schedules = allResponse.data;
      }

      // Filter by courseId
      const filteredSchedules = schedules.filter(
        (schedule: any) => schedule.courseId === courseId
      );

      return { status: true, schedules: filteredSchedules };
    } catch (error: any) {
      console.error("Error fetching schedules by course:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        return {
          status: false,
          message: error.response.data?.message || "Error fetching schedules",
        };
      }
      throw error;
    }
  }

  /**
   * Create a new schedule
   * @param {ScheduleFormData} data - Schedule data
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async createSchedule(data: any) {
    try {
      console.log("Sending schedule data:", JSON.stringify(data));
      const response = await axiosInstance.post("/schedules/v1", data);
      console.log("API response:", response.data);

      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, schedule: response.data };
      }

      return response.data;
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        // Return the error message from the server if available
        return {
          status: false,
          message:
            error.response.data?.message || "Server error. Please try again.",
        };
      }
      throw error;
    }
  }

  /**
   * Update an existing schedule
   * @param {string} id - Schedule ID
   * @param {Partial<ScheduleFormData>} data - Updated schedule data
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async updateSchedule(id: string, data: any) {
    try {
      console.log("ScheduleService: Updating schedule with ID:", id);
      console.log("ScheduleService: Update data:", JSON.stringify(data));

      const response = await axiosInstance.put(`/schedules/v1/${id}`, data);
      console.log("ScheduleService: Update response:", response.data);

      // Format the response if needed
      if (response.data) {
        // Check if we got a standard response format
        if (response.data.schedule && response.data.status === true) {
          return response.data;
        }

        // Check if we got a direct object response with the correct ID
        if (response.data._id === id) {
          return { status: true, schedule: response.data };
        }

        // Check if the response is in a nested data property
        if (response.data.data && response.data.data._id === id) {
          return { status: true, schedule: response.data.data };
        }

        // If we can't determine a specific pattern but got a response object,
        // return it and let the component handle it
        return { status: true, schedule: response.data };
      }

      // If the response is empty, try to fetch the updated schedule
      console.log(
        "ScheduleService: Empty response from update, fetching the schedule"
      );
      return await this.getScheduleById(id);
    } catch (error: any) {
      console.error("ScheduleService: Error updating schedule:", error);
      if (error.response) {
        console.error("ScheduleService: Response data:", error.response.data);
        console.error(
          "ScheduleService: Response status:",
          error.response.status
        );
        console.error(
          "ScheduleService: Response headers:",
          error.response.headers
        );

        // Return the error message from the server if available
        return {
          status: false,
          message:
            error.response.data?.message || "Server error. Please try again.",
        };
      }
      throw error;
    }
  }

  /**
   * Delete a schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteSchedule(id: string) {
    try {
      console.log(
        "ScheduleService: Attempting to delete schedule with ID:",
        id
      );
      const response = await axiosInstance.delete(`/schedules/v1/${id}`);
      console.log("ScheduleService: Delete response:", response.data);

      // Format the response consistently
      if (response.data) {
        if (response.data.status) {
          return response.data;
        } else if (response.data._id) {
          // If we get back the schedule object directly
          return {
            status: true,
            message: "Schedule deleted successfully",
            schedule: response.data,
          };
        } else {
          // Generic success response
          return { status: true, message: "Schedule deleted successfully" };
        }
      }

      return response.data;
    } catch (error: any) {
      console.error("ScheduleService: Error deleting schedule:", error);
      if (error.response) {
        console.error("ScheduleService: Server response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        return {
          status: false,
          message: error.response.data?.message || "Error deleting schedule",
        };
      }
      throw error;
    }
  }

  /**
   * Toggle schedule active status
   * @param {string} id - Schedule ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async updateScheduleStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/schedules/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating schedule status:", error);
      if (error.response) {
        return {
          status: false,
          message: error.response.data?.message || "Error updating status",
        };
      }
      throw error;
    }
  }

  /**
   * Restore a deleted schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async restoreSchedule(id: string) {
    try {
      console.log(
        "ScheduleService: Attempting to restore schedule with ID:",
        id
      );

      // Try different endpoint format (with and without hyphen)
      try {
        const response = await axiosInstance.put(
          `/schedules/v1/${id}/undo-delete`
        );
        console.log(
          "ScheduleService: Restore response (with hyphen):",
          response.data
        );

        // Format the response consistently regardless of the backend format
        if (response.data) {
          if (response.data.status && response.data.schedule) {
            return response.data;
          } else if (response.data._id) {
            return { status: true, schedule: response.data };
          } else {
            return { status: true, message: "Schedule restored successfully" };
          }
        }

        return response.data;
      } catch (primaryError: any) {
        console.warn(
          "ScheduleService: Primary undo-delete endpoint failed:",
          primaryError.message
        );

        // Try alternative endpoint without hyphen (undodelete)
        try {
          const altResponse = await axiosInstance.put(
            `/schedules/v1/${id}/undodelete`
          );
          console.log(
            "ScheduleService: Restore response (without hyphen):",
            altResponse.data
          );

          if (altResponse.data) {
            if (altResponse.data.status && altResponse.data.schedule) {
              return altResponse.data;
            } else if (altResponse.data._id) {
              return { status: true, schedule: altResponse.data };
            } else {
              return {
                status: true,
                message: "Schedule restored successfully",
              };
            }
          }

          return altResponse.data;
        } catch (secondaryError: any) {
          console.error("ScheduleService: Both restoration endpoints failed");
          throw primaryError; // Throw the original error
        }
      }
    } catch (error: any) {
      console.error("ScheduleService: Error restoring schedule:", error);
      if (error.response) {
        console.error("ScheduleService: Server response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        return {
          status: false,
          message: error.response.data?.message || "Error restoring schedule",
        };
      }
      throw error;
    }
  }
}

export default new ScheduleService();

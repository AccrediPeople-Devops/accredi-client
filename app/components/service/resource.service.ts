import axiosInstance from "../config/axiosInstance";

interface ResourceFile {
  url: string;
  key: string;
  path?: string;
  _id?: string;
}

interface ResourceItem {
  title: string;
  description: string;
  file: ResourceFile[];
  _id?: string;
}

interface Resource {
  _id?: string;
  courseId: string;
  content: ResourceItem[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class ResourceService {
  /**
   * Get all resources
   * @returns {Promise<{status: boolean, resources: Resource[]}>}
   */
  async getAllResources() {
    try {
      const response = await axiosInstance.get("/resources/v1");
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

  /**
   * Get resource by ID
   * @param {string} id - Resource ID
   * @returns {Promise<{status: boolean, resource: Resource}>}
   */
  async getResourceById(id: string) {
    try {
      console.log("ResourceService: Fetching resource with ID:", id);
      
      // Try direct endpoint first
      try {
        const response = await axiosInstance.get(`/resources/v1/${id}`);
        return response.data;
      } catch (directError) {
        console.log("Direct endpoint failed, using fallback method");
        
        // Fallback: fetch all and find the matching one
        const allResponse = await this.getAllResources();
        
        let resources = [];
        if (allResponse && allResponse.resources && Array.isArray(allResponse.resources)) {
          resources = allResponse.resources;
        } else if (Array.isArray(allResponse)) {
          resources = allResponse;
        } else if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
          resources = allResponse.data;
        }
        
        const foundResource = resources.find((resource: any) => resource._id === id);
        if (foundResource) {
          console.log("ResourceService: Found resource in all resources:", foundResource);
          return { status: true, resource: foundResource };
        }
        
        // Return a not found error if we couldn't find the resource
        return { 
          status: false, 
          message: `Resource not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      console.error("ResourceService: Error fetching resource:", error);
      
      // Return a structured error
      return { 
        status: false, 
        message: error.response?.data?.message || `Error fetching resource with ID: ${id}`
      };
    }
  }

  /**
   * Get resources by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, resources: Resource[]}>}
   */
  async getResourcesByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/resources/v1/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching resources by course ID:", error);
      throw error;
    }
  }

  /**
   * Create a new resource
   * @param {Resource} data - Resource data
   * @returns {Promise<{status: boolean, resource: Resource}>}
   */
  async createResource(data: Resource) {
    try {
      console.log("Creating resource with data:", JSON.stringify(data, null, 2));
      const response = await axiosInstance.post("/resources/v1", data);
      return response.data;
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error;
    }
  }

  /**
   * Update an existing resource
   * @param {string} id - Resource ID
   * @param {Partial<Resource>} data - Updated resource data
   * @returns {Promise<{status: boolean, resource: Resource}>}
   */
  async updateResource(id: string, data: Partial<Resource>) {
    try {
      console.log("Updating resource with ID:", id);
      console.log("Update data:", JSON.stringify(data, null, 2));
      
      const response = await axiosInstance.put(`/resources/v1/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Resource update error:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      
      throw error;
    }
  }

  /**
   * Delete a resource
   * @param {string} id - Resource ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteResource(id: string) {
    try {
      const response = await axiosInstance.delete(`/resources/v1/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  }

  /**
   * Restore a deleted resource
   * @param {string} id - Resource ID
   * @returns {Promise<{status: boolean, resource: Resource}>}
   */
  async restoreResource(id: string) {
    try {
      // Try multiple approaches to restore the resource
      try {
        console.log("Trying PUT to /resources/v1/{id}/undo-delete with isActive");
        const response = await axiosInstance.put(`/resources/v1/${id}/undo-delete`, {
          isActive: true
        });
        return response.data;
      } catch (firstError: any) {
        console.log("First restore attempt failed:", firstError.message);
        
        try {
          console.log("Trying PUT with standard endpoint");
          const response = await axiosInstance.put(`/resources/v1/${id}`, {
            isDeleted: false,
            isActive: true
          });
          return response.data;
        } catch (secondError: any) {
          console.log("Second restore attempt failed:", secondError.message);
          
          // Try PATCH as last resort
          console.log("Trying PATCH as final attempt");
      const response = await axiosInstance.patch(`/resources/v1/${id}`, {
            isDeleted: false,
            isActive: true
      });
      return response.data;
        }
      }
    } catch (error) {
      console.error("All restore attempts failed:", error);
      throw error;
    }
  }
}

export default new ResourceService(); 
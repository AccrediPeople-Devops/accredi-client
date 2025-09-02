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
      
      // Try direct endpoint first
      try {
        const response = await axiosInstance.get(`/resources/v1/${id}`);
        return response.data;
      } catch (directError) {
        
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
          return { status: true, resource: foundResource };
        }
        
        // Return a not found error if we couldn't find the resource
        return { 
          status: false, 
          message: `Resource not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      
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
      const response = await axiosInstance.post("/resources/v1", data);
      return response.data;
    } catch (error) {
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
      
      const response = await axiosInstance.put(`/resources/v1/${id}`, data);
      return response.data;
    } catch (error: any) {
      
      // Log more detailed error information
      if (error.response) {
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
        const response = await axiosInstance.put(`/resources/v1/${id}/undo-delete`, {
          isActive: true
        });
        return response.data;
      } catch (firstError: any) {
        
        try {
          const response = await axiosInstance.put(`/resources/v1/${id}`, {
            isDeleted: false,
            isActive: true
          });
          return response.data;
        } catch (secondError: any) {
          
          // Try PATCH as last resort
      const response = await axiosInstance.patch(`/resources/v1/${id}`, {
            isDeleted: false,
            isActive: true
      });
      return response.data;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new ResourceService(); 
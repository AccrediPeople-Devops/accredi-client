import axiosInstance from '../config/axiosInstance';

export interface EnterpriseFormData {
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  trainingDetails: string;
}

export interface EnterpriseFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

class EnterpriseService {
  /**
   * Submit enterprise form data
   * @param formData - The form data to submit
   * @returns Promise with response
   */
  async submitEnterpriseForm(formData: EnterpriseFormData): Promise<EnterpriseFormResponse> {
    try {
      
      const response = await axiosInstance.post('/form/enterprise', formData);
      
      
      return {
        success: true,
        message: response.data?.message || 'Thank you for your inquiry! Our enterprise solutions team will reach out shortly.',
        data: response.data
      };
    } catch (error: any) {
      
      let errorMessage = 'An error occurred while submitting the form. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error (${error.response.status}). Please try again.`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Validate enterprise form data
   * @param formData - The form data to validate
   * @returns Validation result with errors if any
   */
  validateFormData(formData: Partial<EnterpriseFormData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Full Name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.push('Full name is required and must be at least 2 characters long.');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }
    
    // Company Name validation
    if (!formData.companyName || formData.companyName.trim().length < 2) {
      errors.push('Company name is required and must be at least 2 characters long.');
    }
    
    // Phone Number validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number.');
    }
    
    // Training Details validation (optional but if provided, should be meaningful)
    if (formData.trainingDetails && formData.trainingDetails.trim().length === 0) {
      errors.push('Training details cannot be empty if provided.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const enterpriseService = new EnterpriseService();
export default enterpriseService;

import axiosInstance from '../config/axiosInstance';

export interface ReferEarnFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export interface ReferEarnFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

class ReferEarnService {
  /**
   * Submit refer and earn form data
   * @param formData - The form data to submit
   * @returns Promise with response
   */
  async submitReferEarnForm(formData: ReferEarnFormData): Promise<ReferEarnFormResponse> {
    try {
      
      const response = await axiosInstance.post('/form/refer-and-earn', formData);
      
      
      return {
        success: true,
        message: response.data?.message || 'Thank you for referring your friend! Our team will connect with them shortly.',
        data: response.data
      };
    } catch (error: any) {
      
      let errorMessage = 'An error occurred while submitting your request. Please try again.';
      
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
   * Validate refer and earn form data
   * @param formData - The form data to validate
   * @returns Validation result with errors if any
   */
  validateFormData(formData: Partial<ReferEarnFormData>): { isValid: boolean; errors: string[] } {
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
    
    // Phone Number validation
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 8) {
      errors.push('Please enter a valid phone number (minimum 8 digits).');
    }
    
    // Phone number format validation (only digits allowed)
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber.trim())) {
      errors.push('Phone number should contain only digits.');
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length === 0) {
      errors.push('Message is required.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize form data before submission
   * @param formData - Raw form data
   * @returns Sanitized form data
   */
  sanitizeFormData(formData: { name: string; email: string; phone: string; message: string }): ReferEarnFormData {
    return {
      fullName: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phone.replace(/\D/g, ''), // Remove non-digits
      message: formData.message.trim()
    };
  }
}

export const referEarnService = new ReferEarnService();
export default referEarnService;

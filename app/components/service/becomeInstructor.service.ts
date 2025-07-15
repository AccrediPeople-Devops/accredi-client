import axiosInstance from '../config/axiosInstance';

export interface BecomeInstructorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  resume: {
    _id?: string;
    path: string;
    key: string;
  };
  message: string;
}

export interface BecomeInstructorFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

class BecomeInstructorService {
  /**
   * Submit become instructor form data
   * @param formData - The form data to submit
   * @returns Promise with response
   */
  async submitBecomeInstructorForm(formData: BecomeInstructorFormData): Promise<BecomeInstructorFormResponse> {
    try {
      console.log('BecomeInstructorService: Submitting form data:', formData);
      
      const response = await axiosInstance.post('/form/become-instructor', formData);
      
      console.log('BecomeInstructorService: Form submission response:', response.data);
      
      return {
        success: true,
        message: response.data?.message || 'Thank you for your inquiry! Our instructor onboarding team will reach out shortly.',
        data: response.data
      };
    } catch (error: any) {
      console.error('BecomeInstructorService: Error submitting form:', error);
      
      let errorMessage = 'An error occurred while submitting your application. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('BecomeInstructorService: Response error:', error.response.data);
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error (${error.response.status}). Please try again.`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('BecomeInstructorService: No response received:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something else happened
        console.error('BecomeInstructorService: Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload resume file
   * @param file - The file to upload
   * @returns Promise with upload response
   */
  async uploadResume(file: File): Promise<{ success: boolean; data?: any; message: string }> {
    try {
      console.log('BecomeInstructorService: Uploading resume file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosInstance.post('/uploads/v1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('BecomeInstructorService: Resume upload response:', response.data);
      
      if (response.data && response.data.path && response.data.key) {
        return {
          success: true,
          data: response.data,
          message: 'Resume uploaded successfully'
        };
      } else {
        throw new Error('Invalid upload response format');
      }
    } catch (error: any) {
      console.error('BecomeInstructorService: Error uploading resume:', error);
      
      let errorMessage = 'Error uploading resume. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Upload failed (${error.response.status}). Please try again.`;
      } else if (error.request) {
        errorMessage = 'Network error during upload. Please check your connection.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Validate become instructor form data
   * @param formData - The form data to validate
   * @returns Validation result with errors if any
   */
  validateFormData(formData: Partial<BecomeInstructorFormData>, resumeFile?: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // First Name validation
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.push('First name is required and must be at least 2 characters long.');
    }
    
    // Last Name validation
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.push('Last name is required and must be at least 2 characters long.');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }
    
    // Phone Number validation
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 8) {
      errors.push('Please enter a valid phone number.');
    }
    
    // Country validation
    if (!formData.country || formData.country.trim().length < 2) {
      errors.push('Country is required.');
    }
    
    // City validation
    if (!formData.city || formData.city.trim().length < 2) {
      errors.push('City is required.');
    }
    
    // Resume validation
    if (!formData.resume && !resumeFile) {
      errors.push('Resume is required.');
    }
    
    if (resumeFile) {
      // Validate file type
      if (resumeFile.type !== 'application/pdf') {
        errors.push('Resume must be a PDF file.');
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (resumeFile.size > maxSize) {
        errors.push('Resume file size must be less than 5MB.');
      }
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length < 20) {
      errors.push('Message is required and must be at least 20 characters long.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const becomeInstructorService = new BecomeInstructorService();
export default becomeInstructorService;

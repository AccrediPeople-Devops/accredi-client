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
      console.log('BecomeInstructorService: File size:', file.size);
      console.log('BecomeInstructorService: File type:', file.type);
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('BecomeInstructorService: Auth token exists:', !!token);
      if (token) {
        console.log('BecomeInstructorService: Token preview:', token.substring(0, 20) + '...');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('BecomeInstructorService: FormData created, making request to /uploads/v1');
      console.log('BecomeInstructorService: API URL:', 'https://api.accredipeoplecertifications.com/api/uploads/v1');
      
      const response = await axiosInstance.post('/uploads/v1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('BecomeInstructorService: Raw response:', response);
      console.log('BecomeInstructorService: Response data:', response.data);
      console.log('BecomeInstructorService: Response data type:', typeof response.data);
      console.log('BecomeInstructorService: Is array?', Array.isArray(response.data));
      
      // Handle both array and single object responses
      let uploadData = response.data;
      
      // If response is an array, take the first item
      if (Array.isArray(response.data)) {
        console.log('BecomeInstructorService: Response is array, taking first item');
        uploadData = response.data[0];
      }
      
      console.log('BecomeInstructorService: Processed upload data:', uploadData);
      console.log('BecomeInstructorService: Has path?', !!uploadData?.path);
      console.log('BecomeInstructorService: Has key?', !!uploadData?.key);
      
      if (uploadData && uploadData.path && uploadData.key) {
        // Format the data according to the expected form submission format
        const formattedData = {
          _id: uploadData._id || uploadData.key, // Use key as _id if _id is not provided
          path: uploadData.path.startsWith('/') ? uploadData.path : `/${uploadData.path}`, // Ensure path starts with /
          key: uploadData.key
        };
        
        console.log('BecomeInstructorService: Formatted upload data:', formattedData);
        
        return {
          success: true,
          data: formattedData,
          message: 'Resume uploaded successfully'
        };
      } else {
        console.error('BecomeInstructorService: Invalid upload data structure:', uploadData);
        throw new Error('Invalid upload response format');
      }
    } catch (error: any) {
      console.error('BecomeInstructorService: Error uploading resume:', error);
      console.error('BecomeInstructorService: Error name:', error.name);
      console.error('BecomeInstructorService: Error message:', error.message);
      console.error('BecomeInstructorService: Error stack:', error.stack);
      console.error('BecomeInstructorService: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      });
      
      let errorMessage = 'Error uploading resume. Please try again.';
      
      if (error.response) {
        console.error('BecomeInstructorService: Server responded with error:', error.response.status, error.response.data);
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Upload failed (${error.response.status}): ${error.response.statusText}`;
      } else if (error.request) {
        console.error('BecomeInstructorService: No response received:', error.request);
        errorMessage = 'Network error during upload. Please check your connection.';
      } else {
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
      // Define allowed file types
      const allowedTypes = [
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-excel', // XLS
        'image/jpeg', // JPEG
        'image/jpg', // JPG
        'image/png', // PNG
        'image/gif', // GIF
        'image/webp' // WebP
      ];
      
      // Validate file type
      if (!allowedTypes.includes(resumeFile.type)) {
        errors.push('Resume must be a valid file type: PDF, DOC, DOCX, Excel, or image files (JPEG, PNG, GIF, WebP).');
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (resumeFile.size > maxSize) {
        errors.push('Resume file size must be less than 10MB.');
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

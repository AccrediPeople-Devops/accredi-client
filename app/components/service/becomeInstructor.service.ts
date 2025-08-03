import axiosInstance from '../config/axiosInstance';
import axios from 'axios'; // Added axios import

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
      
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('BecomeInstructorService: Making request to /uploads/v1');
      
      // For file uploads, we might not need authentication
      // Let's try without auth first, then with auth if it fails
      let response;
      try {
        // First try without authentication
        response = await axios.post('https://api.accredipeoplecertifications.com/api/uploads/v1', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('BecomeInstructorService: Upload successful without auth');
      } catch (authError: any) {
        console.log('BecomeInstructorService: Upload without auth failed, trying with auth:', authError.response?.status);
        
        // If that fails, try with authentication
        response = await axiosInstance.post('/uploads/v1', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('BecomeInstructorService: Upload successful with auth');
      }
      
      console.log('BecomeInstructorService: Raw response:', response);
      console.log('BecomeInstructorService: Response data:', response.data);
      console.log('BecomeInstructorService: Response data type:', typeof response.data);
      console.log('BecomeInstructorService: Is array?', Array.isArray(response.data));
      console.log('BecomeInstructorService: Response data keys:', Object.keys(response.data || {}));
      
      // Handle the response format from the backend
      let uploadData = response.data;
      
      // The backend returns { status: true, upload: Array(1) }
      // We need to extract the first item from the upload array
      if (response.data && response.data.upload && Array.isArray(response.data.upload)) {
        console.log('BecomeInstructorService: Found upload array, taking first item');
        uploadData = response.data.upload[0];
        console.log('BecomeInstructorService: First upload array item:', uploadData);
        console.log('BecomeInstructorService: Upload array item keys:', Object.keys(uploadData || {}));
      } else if (Array.isArray(response.data)) {
        // Fallback: if response is directly an array
        console.log('BecomeInstructorService: Response is array, taking first item');
        uploadData = response.data[0];
        console.log('BecomeInstructorService: First array item:', uploadData);
        console.log('BecomeInstructorService: First array item keys:', Object.keys(uploadData || {}));
      }
      
      console.log('BecomeInstructorService: Processed upload data:', uploadData);
      console.log('BecomeInstructorService: Upload data keys:', Object.keys(uploadData || {}));
      
      // Check what fields are actually available
      if (uploadData) {
        console.log('BecomeInstructorService: Available fields:');
        Object.keys(uploadData).forEach(key => {
          console.log(`  ${key}:`, uploadData[key]);
        });
      }
      
      // Try to extract the required fields from the response
      // The backend might be returning a different structure
      let path = uploadData?.path || uploadData?.url || uploadData?.filePath;
      let key = uploadData?.key || uploadData?.filename || uploadData?.name;
      let id = uploadData?._id || uploadData?.id || uploadData?.key;
      
      console.log('BecomeInstructorService: Extracted fields:');
      console.log('  path:', path);
      console.log('  key:', key);
      console.log('  id:', id);
      
      // If we still don't have the required fields, try to construct them
      if (!path && uploadData?.url) {
        path = uploadData.url;
      }
      
      if (!key && file.name) {
        key = file.name;
      }
      
      if (!id && key) {
        id = key;
      }
      
      // Validate that we have at least some form of path and key
      if (!path || !key) {
        console.error('BecomeInstructorService: Cannot extract required fields from response:', uploadData);
        throw new Error('Invalid upload response format - cannot extract file information');
      }
      
      // Format the data according to the expected form submission format
      const formattedData = {
        _id: id,
        path: path.startsWith('/') ? path : `/${path}`,
        key: key
      };
      
      console.log('BecomeInstructorService: Formatted upload data:', formattedData);
      
      return {
        success: true,
        data: formattedData,
        message: 'Resume uploaded successfully'
      };
    } catch (error: any) {
      console.error('BecomeInstructorService: Error uploading resume:', error);
      
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
    if (!formData.message || formData.message.trim().length === 0) {
      errors.push('Message is required.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const becomeInstructorService = new BecomeInstructorService();
export default becomeInstructorService;

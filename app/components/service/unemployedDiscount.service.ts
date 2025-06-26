import axiosInstance from '../config/axiosInstance';

export interface UnemployedDiscountFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export interface UnemployedDiscountResponse {
  success: boolean;
  message: string;
}

export const unemployedDiscountService = {
  submitForm: async (formData: UnemployedDiscountFormData): Promise<UnemployedDiscountResponse> => {
    try {
      const response = await axiosInstance.post('/form/unemployed', formData);
      return {
        success: true,
        message: response.data.message || 'Thank you! We\'ve received your request and will get back to you soon.'
      };
    } catch (error: any) {
      console.error('Unemployed discount form submission error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit form. Please try again.'
      };
    }
  }
}; 
import axiosInstance from '../config/axiosInstance';

export interface MilitaryDiscountFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export interface MilitaryDiscountResponse {
  success: boolean;
  message: string;
}

export const militaryDiscountService = {
  submitForm: async (formData: MilitaryDiscountFormData): Promise<MilitaryDiscountResponse> => {
    try {
      const response = await axiosInstance.post('/form/military', formData);
      return {
        success: true,
        message: response.data.message || 'Thank you for your service! We\'ve received your request and will get back to you shortly.'
      };
    } catch (error: any) {
      console.error('Military discount form submission error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit form. Please try again.'
      };
    }
  }
}; 
import { config } from '../config/config';

export interface PaymentData {
  type: string;
  amount: number;
  currency: string;
  email: string;
  description: string;
}

export interface PaymentResponse {
  status: boolean;
  message?: string;
  paymentId?: string;
  paymentUrl?: string;
}

class PaymentService {
  async processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${config.apiUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Payment failed with status ${response.status}`);
      }

      return {
        status: true,
        message: result.message || 'Payment processed successfully',
        paymentId: result.paymentId,
        paymentUrl: result.paymentUrl,
      };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        status: false,
        message: error.message || 'Payment processing failed',
      };
    }
  }

  async createStripePayment(amount: number, currency: string, email: string, description: string): Promise<PaymentResponse> {
    const paymentData: PaymentData = {
      type: 'stripe',
      amount,
      currency: currency.toLowerCase(),
      email,
      description,
    };

    return this.processPayment(paymentData);
  }

  // Utility method to format amount for display
  formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  // Utility method to validate payment data
  validatePaymentData(paymentData: Partial<PaymentData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      errors.push('Valid email is required');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!paymentData.currency) {
      errors.push('Currency is required');
    }

    if (!paymentData.description) {
      errors.push('Description is required');
    }

    if (!paymentData.type) {
      errors.push('Payment type is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService; 
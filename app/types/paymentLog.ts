/**
 * Payment Log Type Definitions
 * These interfaces match the backend API response structure
 */

export interface BillingAddress {
  city: string;
  country: string;
  line1: string;
  line2?: string | null;
  postal_code: string;
  state: string | null;
}

export interface PaymentLog {
  billingAddress: BillingAddress;
  _id: string;
  sessionId: string;
  paymentIntentId: string;
  amountTotal: number;
  amountSubtotal: number;
  currency: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  userId: string;
  courseId: string;
  scheduleId: string;
  createdAt: string;
  __v: number;
}

export interface PaymentLogResponse {
  status: string;
  data: PaymentLog[];
}

/**
 * Frontend Payment Log interface for UI display
 */
export interface PaymentLogDisplay {
  id: string;
  sessionId: string;
  paymentIntentId: string;
  amountTotal: number;
  amountSubtotal: number;
  currency: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  userId: string;
  courseId: string;
  scheduleId: string;
  createdAt: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'paid' | 'complete';
export type SortField = 'sessionId' | 'amountTotal' | 'paymentStatus' | 'createdAt' | 'customerName';
export type SortOrder = 'asc' | 'desc';

export interface PaymentLogFilters {
  searchTerm: string;
  statusFilter: string;
  dateRange?: {
    start: string;
    end: string;
  };
  currencyFilter: string;
} 
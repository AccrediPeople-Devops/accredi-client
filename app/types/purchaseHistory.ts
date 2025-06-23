/**
 * Purchase History Type Definitions
 * These interfaces match the backend API response structure
 */

export interface BillingAddress {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface PurchaseHistoryItem {
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
  scheduleType: string;
  createdAt: string;
  __v: number;
}

export interface PurchaseHistoryResponse {
  status: boolean;
  history: PurchaseHistoryItem[];
}

/**
 * Frontend Transaction interface for UI display
 */
export interface Transaction {
  id: string;
  transactionId: string;
  amountPaid: number;
  currency: string;
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded' | 'paid' | 'complete';
  paymentDate: string;
  orderDetails: {
    courseName: string;
    courseType: string;
    quantity: number;
  };
  paymentMethod: string;
  invoiceUrl?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export type SortField = 'transactionId' | 'amountPaid' | 'paymentStatus' | 'paymentDate';
export type SortOrder = 'asc' | 'desc'; 
/**
 * Admin Audit Log Type Definitions
 * These interfaces match the backend API response structure
 */

export const ACTION_TYPES = {
  user: 'USER',
  schedule: 'SCHEDULE',
  review: 'REVIEW',
  resource: 'RESOURCE',
  questionPaper: 'QUESTION_PAPER',
  payment: 'PAYMENT',
  exam: 'EXAM',
  dashboard: 'DASHBOARD',
  curriculum: 'CURRICULUM',
  courseLink: 'COURSE_LINK',
  course: 'COURSE',
  courseCategory: 'COURSE_CATEGORY',
  coupon: 'COUPON',
} as const;

export const ACTION_METHODS = {
  create: 'CREATE',
  update: 'UPDATE',
  delete: 'DELETE',
  read: 'READ',
  undoDelete: 'UNDO_DELETE',
  updateActive: 'UPDATE_ACTIVE',
  permanentDelete: 'PERMANENT_DELETE',
} as const;

export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];
export type ActionMethod = typeof ACTION_METHODS[keyof typeof ACTION_METHODS];

export interface AdminAuditLog {
  _id: string;
  action: ActionType;
  actionType: ActionMethod;
  userId: string;
  userName?: string;
  userEmail?: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
  __v: number;
}

export interface AdminAuditLogParams {
  limit?: number;
  page?: number;
  sortOrder?: number;
  action?: ActionType;
  actionType?: ActionMethod;
}

export interface AdminAuditLogResponse {
  status: string;
  data: AdminAuditLog[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface AdminAuditLogFilters {
  searchTerm: string;
  actionFilter: string;
  actionTypeFilter: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type SortField = 'timestamp' | 'action' | 'actionType' | 'userName';
export type SortOrder = 'asc' | 'desc'; 
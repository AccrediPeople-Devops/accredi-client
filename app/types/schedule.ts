export interface Schedule {
  _id: string;
  courseId: string;
  country: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
  courseId: string;
  country: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  isActive?: boolean;
}

export interface ScheduleApiResponse {
  status: boolean;
  schedules?: Schedule[];
  schedule?: Schedule;
  message?: string;
} 
export interface CourseLink {
  _id: string;
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseLinkFormData {
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive?: boolean;
} 
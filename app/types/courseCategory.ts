export interface ImageItem {
  _id?: string;
  path: string;
  key: string;
  url?: string;
}

export interface CourseCategory {
  _id: string;
  name: string;
  description: string;
  courseCount: number;
  image: ImageItem[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategoryFormData {
  name: string;
  description: string;
  image: ImageItem[];
  isActive: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

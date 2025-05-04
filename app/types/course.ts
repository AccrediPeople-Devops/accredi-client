import { ImageItem } from "./courseCategory";

export interface CourseUpload {
  courseImage?: ImageItem[];
  courseSampleCertificate?: ImageItem[];
  courseBadge?: ImageItem[];
}

export interface Course {
  _id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: CourseUpload;
  keyFeatures?: string[];
  broucher?: ImageItem[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: CourseUpload;
  keyFeatures?: string[];
  broucher?: ImageItem[];
  isActive: boolean;
}

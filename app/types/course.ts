export interface FileUpload {
  url?: string;
  key: string;
  path?: string;
  _id?: string;
}

export interface Course {
  _id: string;
  title: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate?: FileUpload[];
    courseBadge?: FileUpload[];
  };
  keyFeatures?: string[];
  isActive: boolean;
  isDeleted?: boolean;
  broucher?: FileUpload[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface CourseFormData {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate: FileUpload[];
    courseBadge: FileUpload[];
  };
  keyFeatures: string[];
  isActive: boolean;
  broucher: FileUpload[];
}

export interface CourseApiResponse {
  status: boolean;
  courses?: Course[];
  course?: Course;
  message?: string;
}

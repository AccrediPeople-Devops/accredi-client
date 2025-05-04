export interface CurriculumContent {
  _id?: string;
  title: string;
  description: string;
}

export interface Curriculum {
  _id?: string;
  courseId: string;
  content: CurriculumContent[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CurriculumFormData {
  courseId: string;
  content: CurriculumContent[];
}

export interface CurriculumApiResponse {
  status: boolean;
  curriculum: Curriculum | Curriculum[];
  message?: string;
}

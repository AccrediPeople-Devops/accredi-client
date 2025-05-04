export interface CurriculumContent {
  title: string;
  description: string;
}

export interface Curriculum {
  _id?: string;
  courseId: string;
  content: CurriculumContent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CurriculumFormData {
  courseId: string;
  content: CurriculumContent[];
} 
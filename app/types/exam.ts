export interface Exam {
  _id: string;
  courseId: string;
  questionPaperSetId: string;
  title: string;
  timeLimit: number;
  resultMethod: "manual" | "auto";
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamFormData {
  courseId: string;
  questionPaperSetId: string;
  title: string;
  timeLimit: number;
  resultMethod: "manual" | "auto";
  isActive?: boolean;
} 
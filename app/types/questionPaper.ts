export interface QuestionOption {
  option: string;
}

export interface QuestionItem {
  question: string;
  options: string[];
  answer: string;
  answerDescription: string;
}

export interface QuestionPaper {
  _id: string;
  courseId: string;
  title: string;
  content: QuestionItem[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPaperFormData {
  courseId: string;
  title: string;
  content: QuestionItem[];
  isActive?: boolean;
} 
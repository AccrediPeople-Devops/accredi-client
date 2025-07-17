export interface QuestionOption {
  option: string;
}

export interface QuestionItem {
  question: string;
  options: string[];
  answer: string | string[]; // Can be single string or array of strings for multiple answers
  multipleChoiceQuestions?: boolean; // Flag to indicate if multiple answers are allowed
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
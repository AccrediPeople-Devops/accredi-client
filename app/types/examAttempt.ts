export interface ExamAnswer {
  questionId: string;
  question: string;
  selectedOptions: string[];
  correctAnswers: string[];
  isCorrect: boolean | null;
  answerDescription: string;
  userDescription: string;
  _id?: string;
}

export interface ExamAttempt {
  _id?: string;
  userId: string;
  examId: string;
  courseId: string;
  questionPaperSetId: string;
  isCompleted: boolean;
  answers: ExamAnswer[];
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  isResultShown: boolean;
  resultMethod: 'manual' | 'automatic';
  isActive: boolean;
  isDeleted: boolean;
  startTime?: string;
  endTime?: string;
  timeSpent?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// For API responses
export interface ExamAttemptResponse {
  status: boolean;
  examAttempt: ExamAttempt;
}

export interface ExamAttemptsResponse {
  status: boolean;
  examAttempts: ExamAttemptWithDetails[];
}

// For admin dashboard with populated user, exam, and course details
export interface ExamAttemptWithDetails extends Omit<ExamAttempt, 'userId' | 'examId' | 'courseId'> {
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  examId: {
    _id: string;
    title: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
}

// For starting an exam attempt
export interface StartExamAttemptRequest {
  examId: string;
}

// For saving progress
export interface SaveProgressRequest {
  answers: ExamAnswer[];
}

// For submitting exam
export interface SubmitExamRequest {
  answers: ExamAnswer[];
  endTime: string;
  timeSpent: number;
}

// For updating exam attempt (admin)
export interface UpdateExamAttemptRequest {
  isCompleted?: boolean;
  answers?: ExamAnswer[];
  correctAnswers?: number;
  incorrectAnswers?: number;
  percentage?: number;
  isResultShown?: boolean;
  resultMethod?: 'manual' | 'automatic';
  isActive?: boolean;
  endTime?: string;
  timeSpent?: number;
}

// Exam details for the start attempt response
export interface ExamDetails {
  _id: string;
  courseId: {
    upload: {
      courseImage: Array<{
        path: string;
        key: string;
        _id: string;
      }>;
      courseSampleCertificate: Array<{
        path: string;
        key: string;
        _id: string;
      }>;
      courseBadge: Array<{
        path: string;
        key: string;
        _id: string;
      }>;
    };
    _id: string;
    title: string;
    categoryId: string;
    shortDescription: string;
    description: string;
    keyFeatures: string[];
    isActive: boolean;
    isDeleted: boolean;
    broucher: Array<{
      path: string;
      _id: string;
    }>;
    components: Array<{
      image: {
        path: string;
        key: string;
      };
      description: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
    faqId: string;
  };
  title: string;
  timeLimit: number;
  resultMethod: 'manual' | 'automatic';
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  questions: Array<{
    _id: string;
    question: string;
    options: string[];
    multipleChoiceQuestions: boolean;
  }>;
}

export interface StartExamAttemptResponse {
  status: boolean;
  examAttempt: ExamAttempt;
  exam: ExamDetails;
} 
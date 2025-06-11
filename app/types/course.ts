export interface FileUpload {
  url?: string;
  key: string;
  path?: string;
  _id?: string;
}

export interface Schedule {
  _id: string;
  courseId: string;
  country: string;
  scheduleType: 'classroom' | 'self-paced' | 'live-online';
  startDate?: string;
  endDate?: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Curriculum {
  title: string;
  description: string;
  _id: string;
}

export interface Component {
  image: {
    path: string;
    key: string;
  };
  description: string;
  _id: string;
}

export interface FAQ {
  question: string;
  answer: string;
  _id: string;
}

export interface FAQData {
  _id: string;
  courseId: string;
  faqs: FAQ[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Course {
  _id: string;
  title: string;
  categoryId: string | {
    _id: string;
    name: string;
    description: string;
    courseCount: number;
    image: FileUpload[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  shortDescription?: string;
  description?: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate?: FileUpload[];
    courseBadge?: FileUpload;
  };
  keyFeatures?: string[];
  isActive?: boolean;
  isDeleted?: boolean;
  broucher?: FileUpload[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  schedules?: Schedule[];
  curriculum?: Curriculum[];
  components?: Component[];
  faqId?: FAQData;
}

export interface CourseFormData {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate: FileUpload[];
    courseBadge: FileUpload;
  };
  keyFeatures: string[];
  isActive: boolean;
  broucher: FileUpload[];
  components: Component[];
}

export interface CourseApiResponse {
  status: boolean;
  courses?: Course[];
  course?: Course;
  message?: string;
}

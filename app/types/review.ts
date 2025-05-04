export interface ImageItem {
  _id?: string;
  path: string;
  key: string;
}

export interface Review {
  _id: string;
  name: string;
  designation: string;
  review: string;
  image: ImageItem;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  name: string;
  designation: string;
  review: string;
  image: ImageItem;
  isActive: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

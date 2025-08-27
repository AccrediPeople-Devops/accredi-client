export interface ProfileImage {
  path?: string;
  key?: string;
  _id?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  country: string;
  city: string;
  profileImage?: ProfileImage;
  profileImageUrl?: string;
  role: "superadmin" | "admin" | "user";
  isActive: boolean;
  isDeleted?: boolean;
  isEmailVerified?: boolean;
  twoStepVerification?: boolean;
  is2FAEnabled?: boolean;
  twoStepVerificationCodeSentCount?: number;
  password?: string;
  course?: any[];
  status?: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  country: string;
  city: string;
  role: "superadmin" | "admin" | "user";
  profileImage?: ProfileImage;
}

export interface UserApiResponse {
  status: boolean;
  users?: User[];
  user?: User;
  message?: string;
}

export interface ProfileApiResponse extends User {
  // The profile endpoint returns the user object directly with all fields
}

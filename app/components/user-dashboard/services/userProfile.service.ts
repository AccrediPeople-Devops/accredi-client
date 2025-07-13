import axiosInstance from "../../config/axiosInstance";
import { User, UserFormData } from "../../../types/user";
import { PurchaseHistoryResponse } from "../../../types/purchaseHistory";

/**
 * User link interface based on the API schema
 */
export interface UserLink {
  _id: string;
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * User links response interface
 */
export interface UserLinksResponse {
  status: boolean;
  links: UserLink[];
}

/**
 * Password change request interface
 */
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  is2FAEnabled: boolean;
}

/**
 * User resource file interface
 */
export interface UserResourceFile {
  path: string;
  key: string;
  _id: string;
}

/**
 * User resource content interface
 */
export interface UserResourceContent {
  title: string;
  description: string;
  file: UserResourceFile[];
  _id: string;
}

/**
 * User resource interface based on the API schema
 */
export interface UserResource {
  _id: string;
  courseId: string;
  content: UserResourceContent[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * User resources response interface
 */
export interface UserResourcesResponse {
  status: boolean;
  resources: UserResource[];
}

/**
 * Course upload interface
 */
export interface CourseUpload {
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
  courseBadge: any[];
}

/**
 * Course component interface
 */
export interface CourseComponent {
  image: {
    path: string;
    key: string;
  };
  description: string;
  _id: string;
}

/**
 * Course details interface
 */
export interface PurchasedCourseDetails {
  upload: CourseUpload;
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
  components: CourseComponent[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Schedule details interface
 */
export interface PurchasedScheduleDetails {
  _id: string;
  courseId: string;
  country: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Purchased course interface based on the API schema
 */
export interface PurchasedCourse {
  _id: string;
  userId: string;
  paymentId: string;
  courseId: PurchasedCourseDetails;
  scheduleId: PurchasedScheduleDetails;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Purchased courses response interface
 */
export interface PurchasedCoursesResponse {
  status: boolean;
  courses: PurchasedCourse[];
}

/**
 * Purchase history billing address interface
 */
export interface PurchaseHistoryBillingAddress {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

/**
 * Purchase history item interface based on the API schema
 */
export interface PurchaseHistoryItem {
  billingAddress: PurchaseHistoryBillingAddress;
  _id: string;
  sessionId: string;
  paymentIntentId: string;
  amountTotal: number;
  amountSubtotal: number;
  currency: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  userId: string;
  courseId: string;
  scheduleId: string;
  scheduleType: string;
  createdAt: string;
  __v: number;
}

/**
 * New purchase history response interface based on updated API
 */
export interface NewPurchaseHistoryResponse {
  status: boolean;
  history: PurchaseHistoryItem[];
}

/**
 * User Profile Service for User Dashboard
 * Handles profile-related API calls for regular users
 */
class UserProfileService {
  /**
   * Get current user's profile
   * @returns {Promise<User>}
   */
  async getCurrentUserProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update current user's profile
   * @param {Partial<UserFormData>} data - Updated profile data
   * @returns {Promise<User>}
   */
  async updateCurrentUserProfile(data: Partial<UserFormData>): Promise<User> {
    try {
      const response = await axiosInstance.put("/users/profile", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {ChangePasswordRequest} data - Password change data
   * @returns {Promise<any>}
   */
  async changePassword(data: ChangePasswordRequest): Promise<any> {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update 2FA setting
   * @param {boolean} is2FAEnabled - 2FA enabled status
   * @returns {Promise<User>}
   */
  async update2FA(is2FAEnabled: boolean): Promise<User> {
    try {
      const response = await axiosInstance.put("/users/profile", {
        is2FAEnabled: is2FAEnabled
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's purchase history
   * @returns {Promise<NewPurchaseHistoryResponse>}
   */
  async getPurchaseHistory(): Promise<NewPurchaseHistoryResponse> {
    try {
      console.log("UserProfileService: Fetching purchase history");
      const response = await axiosInstance.get("/users/purchased-history");
      console.log("UserProfileService: Purchase history response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("UserProfileService: Error fetching purchase history:", error);
      if (error.response) {
        console.error("UserProfileService: Response data:", error.response.data);
        console.error("UserProfileService: Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get user's session links
   * @returns {Promise<UserLinksResponse>}
   */
  async getUserLinks(): Promise<UserLinksResponse> {
    try {
      console.log("UserProfileService: Fetching user links");
      const response = await axiosInstance.get("/users/links");
      console.log("UserProfileService: User links response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("UserProfileService: Error fetching user links:", error);
      if (error.response) {
        console.error("UserProfileService: Response data:", error.response.data);
        console.error("UserProfileService: Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get user's resources
   * @returns {Promise<UserResourcesResponse>}
   */
  async getUserResources(): Promise<UserResourcesResponse> {
    try {
      console.log("UserProfileService: Fetching user resources");
      const response = await axiosInstance.get("/users/resources");
      console.log("UserProfileService: User resources response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("UserProfileService: Error fetching user resources:", error);
      if (error.response) {
        console.error("UserProfileService: Response data:", error.response.data);
        console.error("UserProfileService: Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get user's purchased courses
   * @returns {Promise<PurchasedCoursesResponse>}
   */
  async getPurchasedCourses(): Promise<PurchasedCoursesResponse> {
    try {
      console.log("UserProfileService: Fetching purchased courses");
      const response = await axiosInstance.get("/users/purchased-courses");
      console.log("UserProfileService: Purchased courses response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("UserProfileService: Error fetching purchased courses:", error);
      if (error.response) {
        console.error("UserProfileService: Response data:", error.response.data);
        console.error("UserProfileService: Response status:", error.response.status);
      }
      throw error;
    }
  }
}

export default new UserProfileService(); 
import axios from "axios";
import config from "./config";
import AuthService from "../service/auth.service";

// Check if we're running on client-side before accessing localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const token = getToken();

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000, // 30 seconds timeout
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Only set Authorization if we have a token and we're on client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  // Don't override Content-Type if it's already set (for multipart/form-data)
  if (!config.headers["Content-Type"] && config.data instanceof FormData) {
    // Let axios set the Content-Type for FormData automatically
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  
  return config;
});

// Add an interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to get new token
        await AuthService.generateTokenByRefreshToken();

        // Update the authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh token fails, clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

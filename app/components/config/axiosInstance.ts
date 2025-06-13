import axios from "axios";
import config from "./config";
import AuthService from "../service/auth.service";
import Cookies from 'js-cookie';

// Check if we're running on client-side before accessing localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("token") || localStorage.getItem("token");
  }
  return null;
};

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

      // Check if we have a refresh token before attempting refresh
      const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token available for 401 error");
        
        // Clear any existing invalid tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token");
          Cookies.remove("refreshToken");
        }
        
        // Check if this is a public endpoint that should work without auth
        const isPublicEndpoint = originalRequest.url?.includes('/courses/v1') || 
                                originalRequest.url?.includes('/courses-categories/v1');
        
        if (isPublicEndpoint) {
          // For public endpoints, try the request again without auth headers
          delete originalRequest.headers.Authorization;
          return axiosInstance(originalRequest);
        }
        
        // For protected endpoints, redirect to login if not on public page
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/landing', '/login', '/signup', '/courses'];
          const isPublicPath = publicPaths.some(path => 
            currentPath === path || currentPath.startsWith(path + '/')
          );
          
          if (!isPublicPath) {
            console.log("Redirecting to login due to missing refresh token");
            window.location.href = "/login";
          }
        }
        
        return Promise.reject(new Error("Authentication required"));
      }

      try {
        // Try to get new token
        await AuthService.generateTokenByRefreshToken();

        // Update the authorization header with new token
        const newToken = getToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to get new token");
        }
      } catch (refreshError: any) {
        console.warn("Token refresh failed:", refreshError.message);
        
        // Clear tokens on refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token");
          Cookies.remove("refreshToken");
        }
        
        // Only redirect to login if we're on a protected page
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/landing', '/login', '/signup', '/courses'];
          const isPublicPath = publicPaths.some(path => 
            currentPath === path || currentPath.startsWith(path + '/')
          );
          
          if (!isPublicPath) {
            console.log("Redirecting to login due to auth failure");
            window.location.href = "/login";
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

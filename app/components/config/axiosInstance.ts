import axios from "axios";
import config from "./config";
import AuthService from "../service/auth.service";
import Cookies from 'js-cookie';

// Track ongoing token refresh to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Check if we're running on client-side before accessing localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("token") || localStorage.getItem("token");
  }
  return null;
};

// Debug utility function
const debugTokens = () => {
  if (typeof window === "undefined") {
    console.log("Not running on client side");
    return;
  }
  
  const tokenInfo = AuthService.getTokenInfo();
  console.log("=== TOKEN DEBUG INFO ===");
  console.log("Token Info:", tokenInfo);
  
  const cookieRefreshToken = Cookies.get("refreshToken");
  const localRefreshToken = localStorage.getItem("refreshToken");
  
  if (cookieRefreshToken || localRefreshToken) {
    const token = cookieRefreshToken || localRefreshToken;
    console.log("Refresh Token Details:", {
      source: cookieRefreshToken ? 'cookie' : 'localStorage',
      length: token?.length || 0,
      isValidFormat: token?.split('.').length === 3,
      preview: token?.substring(0, 50) + '...'
    });
  }
  
  console.log("=== END DEBUG INFO ===");
};

// Expose debug function globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
  (window as any).debugTokens = debugTokens;
  console.log("Debug function available: window.debugTokens()");
}

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request with auth:", config.url);
  } else {
    console.log("Request without auth:", config.url);
  }
  return config;
});

// Add an interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Successful response:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.log("Response error:", error.config?.url, error.response?.status, error.message);
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this is a public endpoint that should work without auth
      const isPublicEndpoint = originalRequest.url?.includes('/courses') || 
                              originalRequest.url?.includes('/courses-categories/v1');
      
      if (isPublicEndpoint) {
        console.log("Retrying public endpoint without auth:", originalRequest.url);
        // For public endpoints, try the request again without auth headers
        delete originalRequest.headers.Authorization;
        return axiosInstance(originalRequest);
      }

      // Check if we have a refresh token before attempting refresh
      const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token available for 401 error on:", originalRequest.url);
        
        // Clear any existing invalid tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("refreshToken", { path: "/" });
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

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
          return Promise.reject(new Error("Token refresh failed"));
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to get new token
        console.log("Attempting token refresh for 401 error...");
        await AuthService.generateTokenByRefreshToken();

        // Update the authorization header with new token
        const newToken = getToken();
        if (newToken) {
          console.log("Token refresh successful, retrying original request");
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process the queue with the new token
          processQueue(null, newToken);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to get new token after refresh");
        }
      } catch (refreshError: any) {
        console.warn("Token refresh failed:", refreshError.message);
        
        // Process the queue with the error
        processQueue(refreshError, null);
        
        // Clear tokens on refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("refreshToken", { path: "/" });
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
            // Add a small delay to prevent immediate redirect during page transitions
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

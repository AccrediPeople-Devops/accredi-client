import axios from "axios";

// Check if we're running on client-side before accessing localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const token = getToken();

const axiosInstance = axios.create({
  baseURL: "http://148.135.137.229:3000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

// Add an interceptor to update the token on each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Update token on each request in case it changed
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

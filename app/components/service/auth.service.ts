import axiosInstance from "../config/axiosInstance";
import Cookies from 'js-cookie';

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/v1/login", {
        email,
        password,
      });

      // Only set token if we're on the client side
      if (typeof window !== "undefined") {
        const { accessToken, refreshToken } = response.data.token;
        
        // Set in localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Set in cookies
        Cookies.set("token", accessToken, { path: "/" });
        Cookies.set("refreshToken", refreshToken, { path: "/" });
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const response = await axiosInstance.post("/auth/v1/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    }
  }

  async isAuthenticated() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await axiosInstance.get("/auth/v1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async generateTokenByRefreshToken() {
    try {
      const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
      
      // Check if refresh token exists
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Validate refresh token format (basic JWT check)
      if (refreshToken.split('.').length !== 3) {
        throw new Error("Invalid refresh token format");
      }

      const response = await axiosInstance.post("/auth/v1/refresh-token", {
        refreshToken,
      });
      
      if (response.status === 200) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.token;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        Cookies.set("token", accessToken, { path: "/" });
        Cookies.set("refreshToken", newRefreshToken, { path: "/" });
      }
      return response.data;
    } catch (error: any) {
      // Log the specific error for debugging
      console.error("Refresh token error:", error.response?.status, error.response?.data || error.message);
      
      // Clear tokens if refresh fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        Cookies.remove("token");
        Cookies.remove("refreshToken");
      }
      
      throw error;
    }
  }
}

export default new AuthService();

import axiosInstance from "../config/axiosInstance";

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/v1/login", {
        email,
        password,
      });

      // Only set token if we're on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
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
    }
  }

  isAuthenticated() {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  }
}

export default new AuthService();

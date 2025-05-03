import axiosInstance from "../config/axiosInstance";

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/v1/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
}

export default new AuthService();

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
        localStorage.setItem("token", response.data.token.accessToken);
        localStorage.setItem("refreshToken", response.data.token.refreshToken);
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
    }
  }

  async isAuthenticated() {
    try {
      const response = await axiosInstance.get("/auth/v1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const response = await axiosInstance.post("/auth/v1/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();

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
        
        // Set in cookies with secure options
        Cookies.set("token", accessToken, { 
          path: "/",
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        Cookies.set("refreshToken", refreshToken, { 
          path: "/",
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
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
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
    }
  }

  async isAuthenticated() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) {
        return false;
      }
      
      const response = await axiosInstance.get("/auth/v1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private validateRefreshToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Remove any whitespace
    token = token.trim();
    
    // Check if it's a JWT format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length === 3) {
      // Additional JWT validation - each part should be base64url encoded
      try {
        for (const part of parts) {
          if (!part || part.length === 0) {
            return false;
          }
          // Basic check for base64url characters
          if (!/^[A-Za-z0-9_-]+$/.test(part)) {
            return false;
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    }
    
    // If not JWT format, check if it's a valid non-empty string
    // (some APIs might use different token formats)
    return token.length > 10; // Minimum reasonable token length
  }

  async generateTokenByRefreshToken() {
    try {
      // Get refresh token from both sources
      const cookieRefreshToken = Cookies.get("refreshToken");
      const localStorageRefreshToken = localStorage.getItem("refreshToken");
      
      let refreshToken = cookieRefreshToken || localStorageRefreshToken;
      
      // Check if refresh token exists
      if (!refreshToken) {
        console.warn("No refresh token found in cookies or localStorage");
        throw new Error("No refresh token available");
      }

      // Validate refresh token format
      if (!this.validateRefreshToken(refreshToken)) {
        console.warn("Invalid refresh token format detected:", {
          tokenLength: refreshToken.length,
          tokenStart: refreshToken.substring(0, 20) + '...',
          hasValidFormat: refreshToken.split('.').length === 3
        });
        
        // Try to get token from the other source if validation fails
        const alternateToken = cookieRefreshToken ? localStorageRefreshToken : cookieRefreshToken;
        if (alternateToken && this.validateRefreshToken(alternateToken)) {
          console.log("Using alternate refresh token source");
          refreshToken = alternateToken;
        } else {
          // Clear invalid tokens
          this.clearTokens();
          throw new Error("Invalid refresh token format");
        }
      }

      console.log("Attempting token refresh...");
      const response = await axiosInstance.post("/auth/v1/refresh-token", {
        refreshToken,
      });
      
      if (response.status === 200 && response.data?.token) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.token;
        
        if (!accessToken || !newRefreshToken) {
          throw new Error("Invalid tokens received from server");
        }
        
        // Update tokens in both storage locations
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        Cookies.set("token", accessToken, { 
          path: "/",
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        Cookies.set("refreshToken", newRefreshToken, { 
          path: "/",
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        console.log("Token refresh successful");
        return response.data;
      } else {
        throw new Error("Invalid response from token refresh endpoint");
      }
    } catch (error: any) {
      // Enhanced error logging
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      };
      
      console.error("Refresh token error:", errorDetails);
      
      // Clear tokens if refresh fails
      this.clearTokens();
      
      // Re-throw with more context
      const enhancedError = new Error(`Token refresh failed: ${error.message}`);
      enhancedError.cause = error;
      throw enhancedError;
    }
  }

  private clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
    }
  }

  // Helper method to get current token info for debugging
  getTokenInfo() {
    if (typeof window === "undefined") {
      return { client: false };
    }
    
    const cookieToken = Cookies.get("token");
    const localStorageToken = localStorage.getItem("token");
    const cookieRefreshToken = Cookies.get("refreshToken");
    const localStorageRefreshToken = localStorage.getItem("refreshToken");
    
    return {
      client: true,
      hasTokenInCookie: !!cookieToken,
      hasTokenInLocalStorage: !!localStorageToken,
      hasRefreshTokenInCookie: !!cookieRefreshToken,
      hasRefreshTokenInLocalStorage: !!localStorageRefreshToken,
      tokensMatch: cookieToken === localStorageToken,
      refreshTokensMatch: cookieRefreshToken === localStorageRefreshToken
    };
  }
}

export default new AuthService();

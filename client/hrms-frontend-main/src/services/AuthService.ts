import axios, { AxiosResponse } from "axios";

// Define types for login and register payloads
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Define type for the API response
interface AuthResponse {
  token: string;
  message?: string;
  [key: string]: any;
}

const BASE_URL = "http://localhost:5000/api/auth";

class AuthService {
  // Register a user
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res: AxiosResponse<AuthResponse> = await axios.post(`${BASE_URL}/register`, payload);

      const { token } = res.data;
      localStorage.setItem("token", token);
      return res.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Registration failed" };
    }
  }

  // Login a user
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res: AxiosResponse<AuthResponse> = await axios.post(`${BASE_URL}/login`, payload);

      const { token } = res.data;
      localStorage.setItem("token", token);
      return res.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Login failed" };
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem("token");
  }

  // Optional: Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}

export default new AuthService();

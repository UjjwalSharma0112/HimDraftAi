import { apiRequest } from "../api/client";

export interface User {
  id: string;
  name: string;
  email: string;
  provider: "local" | "google";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    provider: "local" | "google";
  };
}

export const authService = {
  login(payload: any): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload: any): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export default authService;

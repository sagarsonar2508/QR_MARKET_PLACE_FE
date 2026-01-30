import apiRequest, { setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api";
import { LoginUserRequestData, EmailSignupRequestData, LoginResponse, ApiResponse, Platform } from "@/types";

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  const payload: LoginUserRequestData = {
    email,
    password,
    platform: Platform.WEB,
  };

  const response = await apiRequest<ApiResponse<LoginResponse>>("/user/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.data && response.data.token) {
    setAuthToken(response.data.token);
  }

  return response.data;
};

export const signupService = async (
  email: string,
  firstName: string,
  lastName: string
): Promise<LoginResponse> => {
  const payload: EmailSignupRequestData = {
    email,
    firstName,
    lastName,
    platform: Platform.WEB,
  };

  const response = await apiRequest<ApiResponse<LoginResponse>>("/user/signup/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.data && response.data.token) {
    setAuthToken(response.data.token);
  }

  return response.data;
};

export const logoutService = (): void => {
  removeAuthToken();
};

export const getToken = (): string | null => {
  return getAuthToken();
};

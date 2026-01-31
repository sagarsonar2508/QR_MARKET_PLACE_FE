import apiRequest, { setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api";
import { LoginUserRequestData, EmailSignupRequestData, LoginResponse, ApiResponse, Platform } from "@/types";

export interface OtpResponse {
  message: string;
}

export interface SetPasswordData {
  email: string;
  password: string;
  confirmPassword: string;
}

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
): Promise<OtpResponse> => {
  const payload: EmailSignupRequestData = {
    email,
    firstName,
    lastName,
    platform: Platform.WEB,
  };

  const response = await apiRequest<ApiResponse<OtpResponse>>("/user/signup/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
};

export const verifyOtpService = async (email: string, otp: string): Promise<OtpResponse> => {
  const payload = {
    email,
    otp,
    platform: Platform.WEB,
  };

  const response = await apiRequest<ApiResponse<OtpResponse>>("/user/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
};

export const setPasswordService = async (data: SetPasswordData): Promise<OtpResponse> => {
  const payload = {
    ...data,
    platform: Platform.WEB,
  };

  const response = await apiRequest<ApiResponse<OtpResponse>>("/user/set-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
};

export const logoutService = (): void => {
  removeAuthToken();
};

export const getToken = (): string | null => {
  return getAuthToken();
};

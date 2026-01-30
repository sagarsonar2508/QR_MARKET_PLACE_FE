export enum Platform {
  WEB = "WEB",
  MOBILE = "MOBILE",
}

export interface LoginUserRequestData {
  email: string;
  password: string;
  platform: Platform;
}

export interface EmailSignupRequestData {
  email: string;
  firstName: string;
  lastName: string;
  platform: Platform;
}

export interface LoginResponse {
  email: string;
  role: string | null;
  expiresIn: number;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface AuthContextType {
  user: { email: string; role: string | null } | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const getAuthToken = (): string | null => {
  return Cookies.get("authToken") || null;
};

export const setAuthToken = (token: string): void => {
  Cookies.set("authToken", token, {
    httpOnly: false, // Note: Next.js cannot set truly httpOnly cookies from client, ideally set from server
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 60 * 60, // 3 hours
  });
};

export const removeAuthToken = (): void => {
  Cookies.remove("authToken");
};

export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

export default apiRequest;

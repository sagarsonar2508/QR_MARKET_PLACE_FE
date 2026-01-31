import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const getAuthToken = (): string | null => {
  return Cookies.get("authToken") || null;
};

export const setAuthToken = (token: string): void => {
  const cookieOptions: Cookies.CookieAttributes = {
    sameSite: "Strict",
    expires: 1 / 8, // 3 hours = 0.125 days
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  Cookies.set("authToken", token, cookieOptions);
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

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType } from "@/types";
import { loginService, signupService, logoutService, getToken } from "@/services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string | null } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      // Note: In a real app, you'd decode the JWT to get user info
      // For now, we'll assume user is set after login
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginService(email, password);
      setToken(response.token);
      setUser({ email: response.email, role: response.role || null });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const response = await signupService(email, firstName, lastName);
      setToken(response.token);
      setUser({ email: response.email, role: response.role || null });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

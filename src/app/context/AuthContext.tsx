"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ _updateTrigger, setUpdateTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login-mock");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateUser = (userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 
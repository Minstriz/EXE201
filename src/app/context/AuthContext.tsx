"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Import mongoose types if needed, but string is simpler for frontend
// import mongoose from 'mongoose';

export interface User {
  _id: string; // Changed from id: number
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  // Add other fields if necessary, e.g., createdAt, updatedAt
  createdAt?: string; // Assuming ISO string from backend
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void; // Allow partial updates
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [ _updateTrigger, setUpdateTrigger] = useState(0); // Removed as it seems unused
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          // Ensure parsed user has _id (from MongoDB)
          if (parsedUser._id) {
             setUser(parsedUser);
             setIsAuthenticated(true);
          } else {
             // Data format might be old (using 'id'), handle migration or clear
             console.warn("User data in localStorage is in old format, clearing.");
             localStorage.removeItem("user");
             setUser(null);
             setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
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
     // Optionally add router as dependency if needed for checkAuth on route changes
     // }, [router]);
  }, []); // Empty dependency array means this runs once on mount

  const login = (userData: User) => {
    try {
      // Ensure user data has _id before storing
       if (!userData._id) {
           console.error("Login data missing _id");
           // Optionally handle error or return
           return;
       }
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      // setUpdateTrigger(prev => prev + 1); // Removed
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
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

  // Allow updating partial user data
  const updateUser = (userData: Partial<User>) => {
    try {
       // Get current user to merge updates
       const currentUser = user ? { ...user } : null;
       if (!currentUser) {
          console.error("Cannot update user, no user logged in.");
          return;
       }

       // Merge updated data, ensuring _id is preserved
       const updatedUserData = { ...currentUser, ...userData };

       // Ensure updated user data has _id before storing
        if (!updatedUserData._id) {
            console.error("Updated user data missing _id after merge.");
            // Optionally handle error
            return;
        }

      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (error) {
      console.error("Error updating user data in localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, isLoading }}
    >
      {!isLoading && children} {/* Only render children after loading state is determined */}
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
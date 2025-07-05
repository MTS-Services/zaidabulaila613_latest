"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation"; // use 'next/router' if using Pages Router
import { LoginUser } from "@/types/auth";

interface AuthContextType {
  user: LoginUser | null;
  login: (data: LoginUser) => void;
  updateUser: (newAccount: LoginUser["user"]["account"]) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loginUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (data: LoginUser) => {
    setUser(data);
    localStorage.setItem("loginUser", JSON.stringify(data));
  };

 const updateUser = (newAccount: LoginUser["user"]["account"]) => {
  if (!user) return;

  const updatedUser: LoginUser = {
    ...user,
    user: {
      ...user.user,
      account: newAccount, // ✅ Replace, not merge
    },
  };

  setUser(updatedUser);
  localStorage.setItem("loginUser", JSON.stringify(updatedUser));
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loginUser");
    router.push("/login");
  };

  const isAuthenticated = !!user?.access_token;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

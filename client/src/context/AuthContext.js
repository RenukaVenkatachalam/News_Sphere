import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Load User on Startup ---------- */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user || res.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ---------- Refresh User ---------- */
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  /* ---------- Login ---------- */
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      if (!token) throw new Error("Token missing from response");

      localStorage.setItem("token", token);

      setUser(user || res.data);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  /* ---------- Register ---------- */
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });

      const { token, user } = res.data;

      if (!token) throw new Error("Token missing from response");

      localStorage.setItem("token", token);

      setUser(user || res.data);

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  /* ---------- Logout ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
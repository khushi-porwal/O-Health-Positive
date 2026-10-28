
import { createContext, useContext, useState } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login
  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await loginUser(credentials);

      const userData =
        response?.user ??
        response?.data?.user ??
        null;

      setUser(userData);

      return response;
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (userData) => {
    setLoading(true);

    try {
      const response = await signupUser(userData);

      const registeredUser =
        response?.user ??
        response?.data?.user ??
        null;

      if (registeredUser) {
        setUser(registeredUser);
      }

      return response;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);

    try {
      await logoutUser();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

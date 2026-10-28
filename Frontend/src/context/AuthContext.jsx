
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginUser,
  signupUser,
  logoutUser,
  getMe,
} from  "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login session on app load
  const checkAuth = useCallback(async () => {
    try {
      const response = await getMe();

      const currentUser =
        response.data?.user ?? response.data ?? null;

      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login user
  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser = response.data?.user;

    if (!loggedInUser) {
      throw new Error(
        "Login response does not contain user data."
      );
    }

    setUser(loggedInUser);

    return response.data;
  };

  // Register new user
  const signup = async (userData) => {
    const response = await signupUser(userData);

    // Update context only if signup also logs the user in
    if (response.data?.user) {
      setUser(response.data.user);
    }

    return response.data;
  };

  // Logout user
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

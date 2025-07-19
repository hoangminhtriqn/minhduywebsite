import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { toast } from "react-toastify";
import { ROUTERS } from "../utils/constant";

interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Role: string;
  Status: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
          const response = await apiClient.get(`/users/${userId}`);
          setUser(response.data.data);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    performAuthCheck();
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await apiClient.post("/users/login", {
        UserName: email,
        Password: password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      if (
        !response.data.data ||
        !response.data.data.token ||
        !response.data.data.user
      ) {
        throw new Error("Invalid response structure from server");
      }

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      setUser(user);
      toast.success("Đăng nhập thành công!");

      // Return redirect path based on user role
      if (user.Role === "admin") {
        return ROUTERS.ADMIN.DASHBOARD;
      } else {
        return ROUTERS.USER.HOME;
      }
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);

      // Handle error response from backend
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Có lỗi xảy ra khi đăng nhập";
        throw new Error(errorMessage);
      } else {
        throw new Error(error.message || "Có lỗi xảy ra khi đăng nhập");
      }
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await apiClient.post("/users/register", {
        username,
        email,
        password,
      });
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData } as User;
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.Role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

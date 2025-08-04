import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { toast } from "react-toastify";
import { ROUTERS } from "../utils/constant";
import { UserRole } from "@/types/enum";
import { getAllPermissions } from "@/utils/permissionConfig";

interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Role: UserRole;
  Status: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  permissions: string[];
  login: (email: string, password: string) => Promise<string>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshPermissions: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isUser: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessAdminPanel: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  // Function to fetch user permissions
  const fetchUserPermissions = async (userId: string) => {
    try {
      const response = await apiClient.get(`/permissions/user/${userId}`);
      if (response.data.success) {
        setPermissions(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const performAuthCheck = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
          const response = await apiClient.get(`/users/${userId}`);
          const userData = response.data.data;
          setUser(userData);

          // Fetch permissions for employee role
          if (userData.Role === UserRole.EMPLOYEE) {
            await fetchUserPermissions(userId);
          } else if (userData.Role === UserRole.ADMIN) {
            // Admin has all permissions
            setPermissions(getAllPermissions());
          } else {
            // Regular user has no admin permissions
            setPermissions([]);
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null);
          setPermissions([]);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        setPermissions([]);
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

      // Fetch permissions after login
      if (user.Role === UserRole.EMPLOYEE) {
        await fetchUserPermissions(user._id);
      } else if (user.Role === UserRole.ADMIN) {
        setPermissions(getAllPermissions());
      } else {
        setPermissions([]);
      }

      toast.success("Đăng nhập thành công!");

      // Return redirect path based on user role
      if (user.Role === UserRole.ADMIN || user.Role === UserRole.EMPLOYEE) {
        return ROUTERS.ADMIN.DASHBOARD;
      } else {
        return ROUTERS.USER.HOME;
      }
    } catch (error: unknown) {
      // Don't clear localStorage or setUser to null on login failure
      // This prevents unnecessary state changes that could cause page reloads

      // Handle error response from backend
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data
      ) {
        const errorMessage =
          (error.response.data as { message?: string }).message ||
          "Có lỗi xảy ra khi đăng nhập";
        throw new Error(errorMessage);
      } else {
        throw new Error(
          (error as Error).message || "Có lỗi xảy ra khi đăng nhập"
        );
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
    setPermissions([]);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData } as User;
    });
  };

  // Function to refresh user permissions
  const refreshPermissions = async () => {
    if (!user) return;

    if (user.Role === UserRole.EMPLOYEE) {
      await fetchUserPermissions(user._id);
    } else if (user.Role === UserRole.ADMIN) {
      setPermissions(getAllPermissions());
    }
  };

  // Permission helper functions
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.Role === UserRole.ADMIN) return true;
    if (user.Role === UserRole.EMPLOYEE) {
      return permissions.includes(permission);
    }
    return false;
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (!user) return false;
    if (user.Role === UserRole.ADMIN) return true;
    if (user.Role === UserRole.EMPLOYEE) {
      return requiredPermissions.some((permission) =>
        permissions.includes(permission)
      );
    }
    return false;
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!user) return false;
    if (user.Role === UserRole.ADMIN) return true;
    if (user.Role === UserRole.EMPLOYEE) {
      return requiredPermissions.every((permission) =>
        permissions.includes(permission)
      );
    }
    return false;
  };

  // Check if user can access admin panel
  const canAccessAdminPanel = (): boolean => {
    if (!user) return false;
    return user.Role === UserRole.ADMIN || user.Role === UserRole.EMPLOYEE;
  };

  const value = {
    user,
    loading,
    permissions,
    login,
    register,
    logout,
    updateUser,
    refreshPermissions,
    isAuthenticated: !!user,
    isAdmin: user?.Role === UserRole.ADMIN,
    isEmployee: user?.Role === UserRole.EMPLOYEE,
    isUser: user?.Role === UserRole.USER,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdminPanel: canAccessAdminPanel(),
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

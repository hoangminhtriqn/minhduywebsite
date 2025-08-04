import { useAuth } from "@/contexts/AuthContext";

// Hook để sử dụng permissions dễ dàng hơn
export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, isAdmin, isEmployee, permissions } = useAuth();

  return {
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isEmployee,
    permissions,
    // Helper functions for common permission checks
    canViewUsers: () => hasPermission("users.view"),
    canEditUsers: () => hasPermission("users.edit"),
    canViewProducts: () => hasPermission("products.view"),
    canCreateProducts: () => hasPermission("products.create"),
    canEditProducts: () => hasPermission("products.edit"),
    canDeleteProducts: () => hasPermission("products.delete"),
    canViewBookings: () => hasPermission("bookings.view"),
    canViewNews: () => hasPermission("news.view"),
    canCreateNews: () => hasPermission("news.create"),
    canEditNews: () => hasPermission("news.edit"),
    canDeleteNews: () => hasPermission("news.delete"),
    canViewCategories: () => hasPermission("categories.view"),
    canCreateCategories: () => hasPermission("categories.create"),
    canEditCategories: () => hasPermission("categories.edit"),
    canDeleteCategories: () => hasPermission("categories.delete"),
    canViewServices: () => hasPermission("services.view"),
    canCreateServices: () => hasPermission("services.create"),
    canEditServices: () => hasPermission("services.edit"),
    canDeleteServices: () => hasPermission("services.delete"),
    canViewPricing: () => hasPermission("pricing.view"),
    canCreatePricing: () => hasPermission("pricing.create"),
    canEditPricing: () => hasPermission("pricing.edit"),
    canDeletePricing: () => hasPermission("pricing.delete"),
    canViewSettings: () => hasPermission("settings.view"),
    canUpdateSettings: () => hasPermission("settings.update"),
    canManageLocations: () => hasPermission("settings.locations.manage"),
    canManageSlides: () => hasPermission("settings.slides.manage"),
    canViewPermissions: () => hasPermission("permissions.view"),
    canAssignPermissions: () => hasPermission("permissions.assign"),
    canViewDashboard: () => hasPermission("dashboard.view"),
  };
};

export default usePermissions;
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPermissions,
  ProductPermissions,
  BookingPermissions,
  NewsPermissions,
  CategoryPermissions,
  ServicePermissions,
  PricingPermissions,
  SettingsPermissions,
  DashboardPermissions,
  PermissionManagementPermissions,
} from "@/types/enum";

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
    canViewUsers: () => hasPermission(UserPermissions.VIEW),
    canEditUsers: () => hasPermission(UserPermissions.EDIT),
    canViewProducts: () => hasPermission(ProductPermissions.VIEW),
    canCreateProducts: () => hasPermission(ProductPermissions.CREATE),
    canEditProducts: () => hasPermission(ProductPermissions.EDIT),
    canDeleteProducts: () => hasPermission(ProductPermissions.DELETE),
    canViewBookings: () => hasPermission(BookingPermissions.VIEW),
    canViewNews: () => hasPermission(NewsPermissions.VIEW),
    canCreateNews: () => hasPermission(NewsPermissions.CREATE),
    canEditNews: () => hasPermission(NewsPermissions.EDIT),
    canDeleteNews: () => hasPermission(NewsPermissions.DELETE),
    canViewCategories: () => hasPermission(CategoryPermissions.VIEW),
    canCreateCategories: () => hasPermission(CategoryPermissions.CREATE),
    canEditCategories: () => hasPermission(CategoryPermissions.EDIT),
    canDeleteCategories: () => hasPermission(CategoryPermissions.DELETE),
    canViewServices: () => hasPermission(ServicePermissions.VIEW),
    canCreateServices: () => hasPermission(ServicePermissions.CREATE),
    canEditServices: () => hasPermission(ServicePermissions.EDIT),
    canDeleteServices: () => hasPermission(ServicePermissions.DELETE),
    canViewPricing: () => hasPermission(PricingPermissions.VIEW),
    canCreatePricing: () => hasPermission(PricingPermissions.CREATE),
    canEditPricing: () => hasPermission(PricingPermissions.EDIT),
    canDeletePricing: () => hasPermission(PricingPermissions.DELETE),
    canViewSettings: () => hasPermission(SettingsPermissions.VIEW),
    canUpdateSettings: () => hasPermission(SettingsPermissions.UPDATE),
    canManageLocations: () => hasPermission(SettingsPermissions.LOCATIONS_MANAGE),
    canManageSlides: () => hasPermission(SettingsPermissions.SLIDES_MANAGE),
    canViewPermissions: () => hasPermission(PermissionManagementPermissions.VIEW),
    canAssignPermissions: () => hasPermission(PermissionManagementPermissions.ASSIGN),
    canViewDashboard: () => hasPermission(DashboardPermissions.VIEW),
  };
};

export default usePermissions;
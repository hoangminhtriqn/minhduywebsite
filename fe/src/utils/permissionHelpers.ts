/**
 * Permission Helper Functions
 * 
 * This file provides utility functions to work with the new permission system.
 * It demonstrates how to use the enum-based permissions instead of hardcoded strings.
 */

import {
  DashboardPermissions,
  UserPermissions,
  ProductPermissions,
  CategoryPermissions,
  ServicePermissions,
  BookingPermissions,
  NewsPermissions,
  PricingPermissions,
  SettingsPermissions,
  PermissionManagementPermissions,
  AllPermissions,
  PermissionModules
} from '@/types/enum';

// Example: Check if user can manage products
export const canManageProducts = (userPermissions: string[]): boolean => {
  const requiredPermissions = [
    ProductPermissions.CREATE,
    ProductPermissions.EDIT,
    ProductPermissions.DELETE
  ];
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

// Example: Check if user can view any admin section
export const canAccessAnyAdminSection = (userPermissions: string[]): boolean => {
  const basicViewPermissions = [
    DashboardPermissions.VIEW,
    UserPermissions.VIEW,
    ProductPermissions.VIEW,
    CategoryPermissions.VIEW,
    ServicePermissions.VIEW,
    BookingPermissions.VIEW,
    NewsPermissions.VIEW,
    PricingPermissions.VIEW,
    SettingsPermissions.VIEW,
    PermissionManagementPermissions.VIEW
  ];
  
  return basicViewPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

// Example: Get permissions for a specific module
export const getProductModulePermissions = (): string[] => {
  return Object.values(ProductPermissions);
};

export const getUserModulePermissions = (): string[] => {
  return Object.values(UserPermissions);
};

export const getCategoryModulePermissions = (): string[] => {
  return Object.values(CategoryPermissions);
};

// Example: Check if user has full access to a module
export const hasFullProductAccess = (userPermissions: string[]): boolean => {
  const allProductPermissions = Object.values(ProductPermissions);
  return allProductPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

// Example: Get missing permissions for a module
export const getMissingProductPermissions = (userPermissions: string[]): string[] => {
  const allProductPermissions = Object.values(ProductPermissions);
  return allProductPermissions.filter(permission => 
    !userPermissions.includes(permission)
  );
};

// Example: Permission validation for specific actions
export const canCreateContent = (userPermissions: string[]): boolean => {
  const createPermissions = [
    ProductPermissions.CREATE,
    CategoryPermissions.CREATE,
    ServicePermissions.CREATE,
    NewsPermissions.CREATE,
    PricingPermissions.CREATE
  ];
  
  return createPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export const canDeleteContent = (userPermissions: string[]): boolean => {
  const deletePermissions = [
    ProductPermissions.DELETE,
    CategoryPermissions.DELETE,
    ServicePermissions.DELETE,
    NewsPermissions.DELETE,
    PricingPermissions.DELETE,
    BookingPermissions.DELETE
  ];
  
  return deletePermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

// Example: Get all available permissions (useful for admin interfaces)
export const getAllAvailablePermissions = (): string[] => {
  return Object.values(AllPermissions);
};

// Example: Group permissions by category for UI display
export const getPermissionsByCategory = () => {
  return {
    [PermissionModules.DASHBOARD]: Object.values(DashboardPermissions),
    [PermissionModules.USERS]: Object.values(UserPermissions),
    [PermissionModules.PRODUCTS]: Object.values(ProductPermissions),
    [PermissionModules.CATEGORIES]: Object.values(CategoryPermissions),
    [PermissionModules.SERVICES]: Object.values(ServicePermissions),
    [PermissionModules.BOOKINGS]: Object.values(BookingPermissions),
    [PermissionModules.NEWS]: Object.values(NewsPermissions),
    [PermissionModules.PRICING]: Object.values(PricingPermissions),
    [PermissionModules.SETTINGS]: Object.values(SettingsPermissions),
    [PermissionModules.PERMISSIONS]: Object.values(PermissionManagementPermissions)
  };
};

// Example: Validate permission format
export const isValidPermission = (permission: string): boolean => {
  return (Object.values(AllPermissions) as string[]).includes(permission);
};

// Example: Get permission category from permission string
export const getPermissionCategory = (permission: string): string | null => {
  if ((Object.values(DashboardPermissions) as string[]).includes(permission)) return PermissionModules.DASHBOARD;
  if ((Object.values(UserPermissions) as string[]).includes(permission)) return PermissionModules.USERS;
  if ((Object.values(ProductPermissions) as string[]).includes(permission)) return PermissionModules.PRODUCTS;
  if ((Object.values(CategoryPermissions) as string[]).includes(permission)) return PermissionModules.CATEGORIES;
  if ((Object.values(ServicePermissions) as string[]).includes(permission)) return PermissionModules.SERVICES;
  if ((Object.values(BookingPermissions) as string[]).includes(permission)) return PermissionModules.BOOKINGS;
  if ((Object.values(NewsPermissions) as string[]).includes(permission)) return PermissionModules.NEWS;
  if ((Object.values(PricingPermissions) as string[]).includes(permission)) return PermissionModules.PRICING;
  if ((Object.values(SettingsPermissions) as string[]).includes(permission)) return PermissionModules.SETTINGS;
  if ((Object.values(PermissionManagementPermissions) as string[]).includes(permission)) return PermissionModules.PERMISSIONS;
  
  return null;
};
/**
 * PermissionGuard Component
 *
 * A reusable component that conditionally renders children based on user permissions.
 * This demonstrates how to use the new enum-based permission system.
 */

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  adminOnly?: boolean;
  employeeOnly?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  requireAll = false,
  fallback = null,
  adminOnly = false,
  employeeOnly = false,
}) => {
  const {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isEmployee,
  } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return <>{fallback}</>;
  }

  // Admin only check
  if (adminOnly && !isAdmin) {
    return <>{fallback}</>;
  }

  // Employee only check (excludes admin)
  if (employeeOnly && !isEmployee) {
    return <>{fallback}</>;
  }

  // No specific permissions required
  if (
    !permissions ||
    (Array.isArray(permissions) && permissions.length === 0)
  ) {
    return <>{children}</>;
  }

  // Single permission check
  if (typeof permissions === "string") {
    if (hasPermission(permissions)) {
      return <>{children}</>;
    }
    return <>{fallback}</>;
  }

  // Multiple permissions check
  if (Array.isArray(permissions)) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (hasAccess) {
      return <>{children}</>;
    }
  }

  return <>{fallback}</>;
};

export default PermissionGuard;

// Example usage components demonstrating the new permission system

/**
 * Example 1: Simple permission check
 *
 * <PermissionGuard permissions={ProductPermissions.CREATE}>
 *   <Button>Create Product</Button>
 * </PermissionGuard>
 */

/**
 * Example 2: Multiple permissions (any)
 *
 * <PermissionGuard permissions={[ProductPermissions.EDIT, ProductPermissions.DELETE]}>
 *   <Button>Manage Product</Button>
 * </PermissionGuard>
 */

/**
 * Example 3: Multiple permissions (all required)
 *
 * <PermissionGuard
 *   permissions={[ProductPermissions.CREATE, ProductPermissions.EDIT]}
 *   requireAll={true}
 * >
 *   <Button>Full Product Management</Button>
 * </PermissionGuard>
 */

/**
 * Example 4: Admin only
 *
 * <PermissionGuard adminOnly={true}>
 *   <AdminOnlyComponent />
 * </PermissionGuard>
 */

/**
 * Example 5: With fallback
 *
 * <PermissionGuard
 *   permissions={UserPermissions.VIEW}
 *   fallback={<div>You don't have permission to view users</div>}
 * >
 *   <UserList />
 * </PermissionGuard>
 */

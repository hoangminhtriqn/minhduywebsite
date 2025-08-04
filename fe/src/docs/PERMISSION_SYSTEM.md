# Hệ Thống Phân Quyền Mới

## Tổng Quan

Hệ thống phân quyền đã được cải thiện để sử dụng enum thay vì hardcode strings, giúp:

- Tăng tính type-safe
- Dễ dàng maintain và refactor
- Tránh lỗi typo
- Tự động complete trong IDE
- Tập trung quản lý permissions

## Cấu Trúc

### 1. Enums Permissions (`/src/types/enum.ts`)

```typescript
// Ví dụ: Product Permissions
export enum ProductPermissions {
  VIEW = "products.view",
  CREATE = "products.create",
  EDIT = "products.edit",
  DELETE = "products.delete",
  SEARCH = "products.search",
  FAVORITES_VIEW = "products.favorites.view",
}
```

### 2. Permission Config (`/src/utils/permissionConfig.ts`)

Chứa mapping giữa permission keys và labels tiếng Việt:

```typescript
export const PERMISSION_LABELS: PermissionConfig = {
  [ProductPermissions.VIEW]: {
    label: "Xem Danh Sách Sản Phẩm",
    group: PermissionGroups.PRODUCTS,
    description: "Quyền xem danh sách tất cả sản phẩm",
  },
  // ...
};
```

### 3. AuthContext Cải Thiện (`/src/contexts/AuthContext.tsx`)

Thêm các helper functions mới:

- `hasAllPermissions()`: Kiểm tra có tất cả permissions
- `refreshPermissions()`: Refresh permissions từ server
- `canAccessAdminPanel`: Boolean check admin access

## Cách Sử Dụng

### 1. Trong Components

#### Sử dụng enum thay vì strings:

```typescript
// ❌ Cũ - hardcode string
const canView = hasPermission("products.view");

// ✅ Mới - sử dụng enum
import { ProductPermissions } from "@/types/enum";
const canView = hasPermission(ProductPermissions.VIEW);
```

#### Kiểm tra multiple permissions:

```typescript
import { ProductPermissions, CategoryPermissions } from "@/types/enum";

// Kiểm tra có ít nhất 1 permission
const canManageContent = hasAnyPermission([
  ProductPermissions.CREATE,
  CategoryPermissions.CREATE,
]);

// Kiểm tra có tất cả permissions
const canFullyManageProducts = hasAllPermissions([
  ProductPermissions.CREATE,
  ProductPermissions.EDIT,
  ProductPermissions.DELETE,
]);
```

### 2. Sử dụng PermissionGuard Component

```typescript
import PermissionGuard from '@/components/admin/PermissionGuard';
import { ProductPermissions } from '@/types/enum';

// Hiển thị button chỉ khi có quyền
<PermissionGuard permissions={ProductPermissions.CREATE}>
  <Button>Tạo Sản Phẩm</Button>
</PermissionGuard>

// Với fallback message
<PermissionGuard
  permissions={ProductPermissions.VIEW}
  fallback={<div>Bạn không có quyền xem sản phẩm</div>}
>
  <ProductList />
</PermissionGuard>

// Yêu cầu tất cả permissions
<PermissionGuard
  permissions={[ProductPermissions.CREATE, ProductPermissions.EDIT]}
  requireAll={true}
>
  <AdvancedProductManager />
</PermissionGuard>
```

### 3. Trong Menu/Navigation

```typescript
// AdminLayout.tsx
import { DashboardPermissions, ProductPermissions } from "@/types/enum";

const MENU_PERMISSIONS = {
  [ROUTERS.ADMIN.DASHBOARD]: [DashboardPermissions.VIEW],
  [ROUTERS.ADMIN.PRODUCTS]: [ProductPermissions.VIEW],
  // ...
};
```

### 4. Helper Functions

```typescript
import {
  canManageProducts,
  hasFullProductAccess,
} from "@/utils/permissionHelpers";

// Kiểm tra có thể quản lý products
if (canManageProducts(userPermissions)) {
  // Show management UI
}

// Kiểm tra có full access
if (hasFullProductAccess(userPermissions)) {
  // Show advanced features
}
```

## Migration Guide

### Từ Hardcode Strings sang Enums

1. **Tìm và thay thế strings:**

   ```typescript
   // ❌ Cũ
   hasPermission("products.view");

   // ✅ Mới
   hasPermission(ProductPermissions.VIEW);
   ```

2. **Import enums:**

   ```typescript
   import { ProductPermissions, UserPermissions } from "@/types/enum";
   ```

3. **Cập nhật permission configs:**

   ```typescript
   // ❌ Cũ
   const MENU_PERMISSIONS = {
     "/admin/products": ["products.view"],
   };

   // ✅ Mới
   const MENU_PERMISSIONS = {
     [ROUTERS.ADMIN.PRODUCTS]: [ProductPermissions.VIEW],
   };
   ```

## Best Practices

### 1. Luôn sử dụng Enums

```typescript
// ✅ Tốt
import { ProductPermissions } from "@/types/enum";
hasPermission(ProductPermissions.CREATE);

// ❌ Tránh
hasPermission("products.create");
```

### 2. Sử dụng PermissionGuard cho UI

```typescript
// ✅ Tốt - Declarative
<PermissionGuard permissions={ProductPermissions.CREATE}>
  <CreateButton />
</PermissionGuard>

// ❌ Tránh - Imperative
{hasPermission(ProductPermissions.CREATE) && <CreateButton />}
```

### 3. Group related permissions

```typescript
// ✅ Tốt
const productManagementPermissions = [
  ProductPermissions.CREATE,
  ProductPermissions.EDIT,
  ProductPermissions.DELETE,
];

const canManageProducts = hasAllPermissions(productManagementPermissions);
```

### 4. Sử dụng helper functions

```typescript
// ✅ Tốt - Reusable logic
import { canManageProducts } from '@/utils/permissionHelpers';
if (canManageProducts(userPermissions)) { ... }

// ❌ Tránh - Duplicate logic
if (hasPermission(ProductPermissions.CREATE) &&
    hasPermission(ProductPermissions.EDIT) &&
    hasPermission(ProductPermissions.DELETE)) { ... }
```

## Lợi Ích

1. **Type Safety**: TypeScript sẽ báo lỗi nếu sử dụng sai permission
2. **Auto-complete**: IDE sẽ suggest available permissions
3. **Refactoring**: Dễ dàng rename/reorganize permissions
4. **Consistency**: Đảm bảo sử dụng đúng permission keys
5. **Maintainability**: Tập trung quản lý tại một nơi
6. **Documentation**: Self-documenting code với enum names

## Troubleshooting

### Lỗi thường gặp:

1. **Import sai enum:**

   ```typescript
   // ❌ Sai
   import ProductPermissions from "@/types/enum";

   // ✅ Đúng
   import { ProductPermissions } from "@/types/enum";
   ```

2. **Sử dụng string thay vì enum:**

   ```typescript
   // ❌ Sai
   hasPermission("products.view");

   // ✅ Đúng
   hasPermission(ProductPermissions.VIEW);
   ```

3. **Quên import enum:**

   ```typescript
   // ❌ Sai - ProductPermissions is not defined
   hasPermission(ProductPermissions.VIEW);

   // ✅ Đúng
   import { ProductPermissions } from "@/types/enum";
   hasPermission(ProductPermissions.VIEW);
   ```

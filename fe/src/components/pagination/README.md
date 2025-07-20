# Pagination System

Hệ thống pagination tùy chỉnh với theme chung cho toàn bộ ứng dụng Minh Duy.

## 🎨 **Tính năng:**

- ✅ **Theme Responsive**: Tự động thay đổi theo theme hiện tại
- ✅ **Animation Smooth**: Hiệu ứng hover và transition mượt mà
- ✅ **Responsive Design**: Tối ưu cho mobile và desktop
- ✅ **Customizable**: Dễ dàng tùy chỉnh style và text
- ✅ **Reusable**: Có thể sử dụng cho toàn bộ hệ thống

## 📦 **Components:**

### 1. **CustomPagination**

Component cơ bản với Ant Design Pagination được tùy chỉnh style.

```tsx
import { CustomPagination } from "../components/pagination";

<CustomPagination
  current={1}
  pageSize={12}
  total={100}
  onChange={(page, pageSize) => console.log(page, pageSize)}
  showSizeChanger
  showQuickJumper
  showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
  pageSizeOptions={["12", "24", "48", "96"]}
/>;
```

### 2. **PaginationWrapper**

Wrapper component với logic chung và text tùy chỉnh.

```tsx
import { PaginationWrapper } from "../components/pagination";

<PaginationWrapper
  current={1}
  pageSize={12}
  total={100}
  onChange={(page, pageSize) => console.log(page, pageSize)}
  showSizeChanger
  showQuickJumper
  showTotal
  pageSizeOptions={["12", "24", "48", "96"]}
  totalText="{start}-{end} của {total} sản phẩm"
/>;
```

### 3. **usePagination Hook**

Hook để quản lý state pagination.

```tsx
import { usePagination } from "../components/pagination";

const { pagination, handlePageChange, updateTotal, resetPagination } =
  usePagination({
    initialPage: 1,
    initialPageSize: 12,
    initialTotal: 0,
  });
```

## 🎯 **Sử dụng trong ProductListPage:**

```tsx
import { PaginationWrapper, usePagination } from "../components/pagination";

const ProductListPage = () => {
  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 12,
  });

  // Fetch data và update total
  const fetchProducts = async () => {
    const response = await axios.get("/api/products", {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
      },
    });

    setProducts(response.data.products);
    updateTotal(response.data.pagination.total);
  };

  return (
    <div>
      {/* Products list */}

      {/* Pagination */}
      {pagination.total > 0 && (
        <PaginationWrapper
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal
          pageSizeOptions={["12", "24", "48", "96"]}
          totalText="{start}-{end} của {total} sản phẩm"
        />
      )}
    </div>
  );
};
```

## 🎨 **Theme Variables:**

Component sử dụng các CSS variables từ theme:

```scss
--theme-primary: #667eea --theme-primary-dark: #5a6fd8
  --theme-bg-primary: #ffffff --theme-bg-secondary: #f8fafc
  --theme-text-primary: #1a202c --theme-text-secondary: #718096
  --theme-border: #e2e8f0 --theme-border-light: #f1f5f9
  --theme-shadow: rgba(0, 0, 0, 0.1) --theme-shadow-light: rgba(0, 0, 0, 0.05);
```

## 📱 **Responsive Breakpoints:**

- **Desktop**: Full pagination với tất cả options
- **Tablet (768px)**: Compact pagination
- **Mobile (480px)**: Stacked layout

## 🔧 **Tùy chỉnh:**

### Thay đổi style:

```scss
// Trong CustomPagination.module.scss
.customPagination {
  .pagination {
    :global(.ant-pagination-item) {
      // Tùy chỉnh style cho page numbers
    }
  }
}
```

### Thay đổi text:

```tsx
<PaginationWrapper totalText="Hiển thị {start} đến {end} trong tổng số {total} mục" />
```

## 🚀 **Migration từ Ant Design Pagination:**

```tsx
// Trước
<Pagination
  current={current}
  pageSize={pageSize}
  total={total}
  onChange={onChange}
/>

// Sau
<PaginationWrapper
  current={current}
  pageSize={pageSize}
  total={total}
  onChange={onChange}
/>
```

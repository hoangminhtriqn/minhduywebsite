# SEO System Documentation

## Tổng quan

Hệ thống SEO được thiết kế để dễ dàng quản lý và tối ưu hóa SEO cho từng trang trong ứng dụng Minh Duy Đà Nẵng.

## Cấu trúc thư mục

```
src/components/SEO/
├── index.ts              # Export tất cả components và utilities
├── SEOHead.tsx           # Component chính để render meta tags
├── PageSEO.tsx           # Wrapper component để sử dụng dễ dàng
├── seoConfig.ts          # Cấu hình SEO cho từng trang
└── README.md            # Tài liệu hướng dẫn
```

## Cách sử dụng

### 1. Sử dụng cơ bản cho Homepage

```tsx
import { PageSEO } from "@/components/SEO";

const HomePage: React.FC = () => {
  return (
    <>
      <PageSEO pageKey="home" />
      {/* Nội dung trang */}
    </>
  );
};
```

### 2. Sử dụng với dữ liệu động

```tsx
import { PageSEO } from "@/components/SEO";

const ProductDetailPage: React.FC = () => {
  const product = {
    name: "Minh Duy 3 Series",
    price: "2.5 tỷ VNĐ",
    description: "Minh Duy 3 Series mới nhất 2024",
  };

  return (
    <>
      <PageSEO
        pageKey="productDetail"
        dynamicData={{
          productName: product.name,
          productPrice: product.price,
          productDescription: product.description,
          productId: "minhduy-3-series-2024",
        }}
      />
      {/* Nội dung trang */}
    </>
  );
};
```

### 3. Sử dụng với cấu hình tùy chỉnh

```tsx
import { PageSEO } from "@/components/SEO";

const CustomPage: React.FC = () => {
  return (
    <>
      <PageSEO
        pageKey="products"
        customConfig={{
          title: "Xe Minh Duy Đặc Biệt | Minh Duy Đà Nẵng",
          description: "Mô tả tùy chỉnh cho trang này",
        }}
      />
      {/* Nội dung trang */}
    </>
  );
};
```

### 4. Sử dụng trực tiếp SEOHead

```tsx
import { SEOHead } from "@/components/SEO";

const CustomPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Tiêu đề tùy chỉnh"
        description="Mô tả tùy chỉnh"
        keywords="từ khóa, tùy chỉnh"
        canonical="https://minduywebsite.com/custom-page"
        ogImage="/images/custom-image.jpg"
        structuredData={[
          {
            type: "breadcrumb",
            data: {
              currentPage: "Trang Tùy Chỉnh",
              currentPath: "/custom-page",
            },
          },
        ]}
      />
      {/* Nội dung trang */}
    </>
  );
};
```

## Cấu hình SEO cho trang mới

### 1. Thêm cấu hình vào seoConfig.ts

```tsx
// Trong seoConfig.ts
export const seoConfigs: Record<string, SEOConfig> = {
  // ... các cấu hình khác

  // Thêm cấu hình mới
  newPage: {
    title: "Tiêu đề trang mới | Minh Duy Đà Nẵng",
    description: "Mô tả trang mới",
    keywords: "từ khóa, trang mới, Minh Duy",
    canonical: "https://minduywebsite.com/new-page",
    ogImage: "/images/new-page.jpg",
    structuredData: [
      {
        type: "breadcrumb",
        data: {
          currentPage: "Trang Mới",
          currentPath: "/new-page",
        },
      },
    ],
  },
};
```

### 2. Sử dụng trong component

```tsx
import { PageSEO } from "@/components/SEO";

const NewPage: React.FC = () => {
  return (
    <>
      <PageSEO pageKey="newPage" />
      {/* Nội dung trang */}
    </>
  );
};
```

## Các loại Structured Data hỗ trợ

### 1. Organization

```tsx
{
  type: 'organization',
  data: {}
}
```

### 2. CarDealer

```tsx
{
  type: 'carDealer',
  data: {}
}
```

### 3. Breadcrumb

```tsx
{
  type: 'breadcrumb',
  data: {
    currentPage: "Tên trang hiện tại",
    currentPath: "/đường-dẫn-hiện-tại"
  }
}
```

### 4. Product

```tsx
{
  type: 'product',
  data: {
    name: "Tên sản phẩm",
    description: "Mô tả sản phẩm",
    price: "Giá sản phẩm"
  }
}
```

## Placeholder hỗ trợ

Hệ thống hỗ trợ các placeholder sau để thay thế bằng dữ liệu động:

- `{productName}` - Tên sản phẩm
- `{productPrice}` - Giá sản phẩm
- `{productDescription}` - Mô tả sản phẩm
- `{productId}` - ID sản phẩm
- `{newsTitle}` - Tiêu đề tin tức
- `{newsDescription}` - Mô tả tin tức
- `{newsKeywords}` - Từ khóa tin tức
- `{newsId}` - ID tin tức
- `{newsImage}` - Hình ảnh tin tức

## Lưu ý quan trọng

1. **Luôn sử dụng PageSEO** thay vì SEOHead trực tiếp để đảm bảo tính nhất quán
2. **Cập nhật sitemap.xml** khi thêm trang mới
3. **Kiểm tra canonical URL** để tránh duplicate content
4. **Tối ưu hóa hình ảnh** cho Open Graph
5. **Sử dụng từ khóa địa phương** cho SEO local (Đà Nẵng)

## Ví dụ thực tế

### Homepage

```tsx
<PageSEO pageKey="home" />
```

### Product List

```tsx
<PageSEO pageKey="products" />
```

### Product Detail

```tsx
<PageSEO
  pageKey="productDetail"
  dynamicData={{
    productName: "Minh Duy 3 Series 2024",
    productPrice: "2.5 tỷ VNĐ",
    productDescription: "Minh Duy 3 Series mới nhất với công nghệ tiên tiến",
    productId: "minhduy-3-series-2024",
  }}
/>
```

### News Detail

```tsx
<PageSEO
  pageKey="newsDetail"
  dynamicData={{
    newsTitle: "Khuyến mãi Minh Duy tháng 12",
    newsDescription: "Chương trình khuyến mãi đặc biệt cho Minh Duy",
    newsKeywords: "khuyến mãi, Minh Duy, tháng 12",
    newsId: "khuyen-mai-minhduy-thang-12",
    newsImage: "/images/promotion-minhduy.jpg",
  }}
/>
```

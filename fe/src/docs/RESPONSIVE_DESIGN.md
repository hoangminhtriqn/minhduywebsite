# BMW Website - Responsive Design System

## Tổng quan

Hệ thống responsive design của BMW website được xây dựng với phương pháp mobile-first, sử dụng SCSS mixins và utility classes để đảm bảo trải nghiệm người dùng tốt trên mọi thiết bị.

## Breakpoints

```scss
$breakpoint-xs: 480px; // Extra small devices
$breakpoint-sm: 576px; // Small devices
$breakpoint-md: 768px; // Medium devices (tablets)
$breakpoint-lg: 992px; // Large devices (desktops)
$breakpoint-xl: 1200px; // Extra large devices
$breakpoint-xxl: 1400px; // Extra extra large devices
```

## Mixins

### Media Query Mixins

```scss
// Min-width media query
@include min-width($breakpoint) {
  // Styles for screens >= breakpoint
}

// Max-width media query
@include max-width($breakpoint) {
  // Styles for screens < breakpoint
}

// Specific breakpoint range
@include respond-to($breakpoint) {
  // Styles for specific breakpoint range
}
```

### Device Detection Mixins

```scss
// Touch device detection
@include touch-device {
  // Styles for touch devices
}

// Non-touch device detection
@include non-touch-device {
  // Styles for non-touch devices
}

// Orientation detection
@include landscape {
  // Styles for landscape orientation
}

@include portrait {
  // Styles for portrait orientation
}
```

## Container System

### Container Classes

```scss
.container {
  // Responsive container with max-widths
  // xs: 100%
  // sm: 540px
  // md: 720px
  // lg: 960px
  // xl: 1140px
  // xxl: 1320px
}

.container-fluid {
  // Full-width container
}
```

### Usage

```html
<div class="container">
  <!-- Content with responsive max-width -->
</div>

<div class="container-fluid">
  <!-- Full-width content -->
</div>
```

## Grid System

### 12-Column Grid

```scss
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
}

.col {
  flex: 1 0 0%;
  padding: 0 0.75rem;
}
```

### Column Classes

```html
<!-- Basic columns -->
<div class="col-1">1/12</div>
<div class="col-2">2/12</div>
<div class="col-3">3/12</div>
<div class="col-4">4/12</div>
<div class="col-6">6/12</div>
<div class="col-12">12/12</div>

<!-- Responsive columns -->
<div class="col-md-6 col-lg-4">Responsive column</div>
```

### Available Column Classes

- `col-1` to `col-12` (basic)
- `col-sm-1` to `col-sm-12` (≥576px)
- `col-md-1` to `col-md-12` (≥768px)
- `col-lg-1` to `col-lg-12` (≥992px)
- `col-xl-1` to `col-xl-12` (≥1200px)
- `col-xxl-1` to `col-xxl-12` (≥1400px)

## Display Utilities

### Basic Display Classes

```scss
.d-none {
  display: none !important;
}
.d-inline {
  display: inline !important;
}
.d-inline-block {
  display: inline-block !important;
}
.d-block {
  display: block !important;
}
.d-flex {
  display: flex !important;
}
.d-inline-flex {
  display: inline-flex !important;
}
.d-grid {
  display: grid !important;
}
```

### Responsive Display Classes

```html
<!-- Hide on mobile, show on desktop -->
<div class="d-none d-md-block">Desktop only</div>

<!-- Show on mobile, hide on desktop -->
<div class="d-block d-md-none">Mobile only</div>

<!-- Different displays at different breakpoints -->
<div class="d-block d-md-flex d-lg-grid">Responsive display</div>
```

## Spacing Utilities

### Margin and Padding Classes

```scss
// Margin
.m-0, .mt-0, .mr-0, .mb-0, .ml-0, .mx-0, .my-0
.m-1, .mt-1, .mr-1, .mb-1, .ml-1, .mx-1, .my-1
.m-2, .mt-2, .mr-2, .mb-2, .ml-2, .mx-2, .my-2
.m-3, .mt-3, .mr-3, .mb-3, .ml-3, .mx-3, .my-3
.m-4, .mt-4, .mr-4, .mb-4, .ml-4, .mx-4, .my-4
.m-5, .mt-5, .mr-5, .mb-5, .ml-5, .mx-5, .my-5

// Padding
.p-0, .pt-0, .pr-0, .pb-0, .pl-0, .px-0, .py-0
.p-1, .pt-1, .pr-1, .pb-1, .pl-1, .px-1, .py-1
.p-2, .pt-2, .pr-2, .pb-2, .pl-2, .px-2, .py-2
.p-3, .pt-3, .pr-3, .pb-3, .pl-3, .px-3, .py-3
.p-4, .pt-4, .pr-4, .pb-4, .pl-4, .px-4, .py-4
.p-5, .pt-5, .pr-5, .pb-5, .pl-5, .px-5, .py-5
```

### Spacing Scale

```scss
$spacing-xs: 0.25rem; // 4px
$spacing-sm: 0.5rem; // 8px
$spacing-md: 1rem; // 16px
$spacing-lg: 1.5rem; // 24px
$spacing-xl: 2rem; // 32px
$spacing-2xl: 3rem; // 48px
$spacing-3xl: 4rem; // 64px
$spacing-4xl: 6rem; // 96px
```

### Responsive Spacing

```html
<!-- Different spacing at different breakpoints -->
<div class="p-2 p-md-3 p-lg-4">Responsive padding</div>
<div class="m-1 m-md-2 m-lg-3">Responsive margin</div>
```

## Text Utilities

### Text Alignment

```scss
.text-left {
  text-align: left !important;
}
.text-center {
  text-align: center !important;
}
.text-right {
  text-align: right !important;
}
.text-justify {
  text-align: justify !important;
}
```

### Responsive Text Alignment

```html
<!-- Center on mobile, left on desktop -->
<p class="text-center text-md-left">Responsive text alignment</p>
```

### Font Sizes

```scss
.fs-xs {
  font-size: 0.75rem;
} // 12px
.fs-sm {
  font-size: 0.875rem;
} // 14px
.fs-base {
  font-size: 1rem;
} // 16px
.fs-lg {
  font-size: 1.125rem;
} // 18px
.fs-xl {
  font-size: 1.25rem;
} // 20px
.fs-2xl {
  font-size: 1.5rem;
} // 24px
.fs-3xl {
  font-size: 1.875rem;
} // 30px
.fs-4xl {
  font-size: 2.25rem;
} // 36px
.fs-5xl {
  font-size: 3rem;
} // 48px
.fs-6xl {
  font-size: 3.75rem;
} // 60px
```

### Font Weights

```scss
.fw-light {
  font-weight: 300;
}
.fw-normal {
  font-weight: 400;
}
.fw-medium {
  font-weight: 500;
}
.fw-semibold {
  font-weight: 600;
}
.fw-bold {
  font-weight: 700;
}
.fw-extrabold {
  font-weight: 800;
}
```

## Flex Utilities

### Flex Direction

```scss
.flex-row {
  flex-direction: row !important;
}
.flex-row-reverse {
  flex-direction: row-reverse !important;
}
.flex-col {
  flex-direction: column !important;
}
.flex-col-reverse {
  flex-direction: column-reverse !important;
}
```

### Flex Wrap

```scss
.flex-wrap {
  flex-wrap: wrap !important;
}
.flex-nowrap {
  flex-wrap: nowrap !important;
}
.flex-wrap-reverse {
  flex-wrap: wrap-reverse !important;
}
```

### Justify Content

```scss
.justify-start {
  justify-content: flex-start !important;
}
.justify-end {
  justify-content: flex-end !important;
}
.justify-center {
  justify-content: center !important;
}
.justify-between {
  justify-content: space-between !important;
}
.justify-around {
  justify-content: space-around !important;
}
.justify-evenly {
  justify-content: space-evenly !important;
}
```

### Align Items

```scss
.items-start {
  align-items: flex-start !important;
}
.items-end {
  align-items: flex-end !important;
}
.items-center {
  align-items: center !important;
}
.items-baseline {
  align-items: baseline !important;
}
.items-stretch {
  align-items: stretch !important;
}
```

## Grid Utilities

### Grid Template Columns

```scss
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}
.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
}
.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
}
.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
}
```

### Responsive Grid Columns

```html
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
  <!-- Grid items -->
</div>
```

## BMW Specific Utilities

### BMW Typography Classes

```scss
.bmw-title {
  // Responsive title with BMW styling
  // Mobile: 24px, Tablet: 30px, Desktop: 36px, Large: 48px
}

.bmw-subtitle {
  // Responsive subtitle with BMW styling
  // Mobile: 18px, Tablet: 20px, Desktop: 24px
}

.bmw-body {
  // Responsive body text with BMW styling
  // Mobile: 14px, Tablet: 16px, Desktop: 18px
}
```

### BMW Layout Classes

```scss
.bmw-section {
  // Responsive section padding
  // Mobile: 32px, Tablet: 48px, Desktop: 64px, Large: 96px
}

.bmw-container {
  // BMW branded container with responsive padding
}

.bmw-grid {
  // BMW branded responsive grid
  // Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large: 4 columns
}
```

### BMW Component Classes

```scss
.bmw-btn {
  // Responsive BMW button
  // Mobile: 40px height, Tablet: 48px height, Desktop: 52px height
}

.bmw-card {
  // Responsive BMW card with hover effects
}

.bmw-nav {
  // Responsive BMW navigation
  // Mobile: column layout, Tablet+: row layout
}

.bmw-hero {
  // Responsive BMW hero section
  // Mobile: 60vh height, Tablet: 70vh height, Desktop: 80vh height
}
```

## Component Examples

### Responsive Header

```scss
.header {
  @include max-width($breakpoint-md) {
    padding: $spacing-md;

    .nav {
      flex-direction: column;
      gap: $spacing-sm;
    }

    .logo {
      width: 120px;
    }
  }

  @include min-width($breakpoint-md) {
    padding: $spacing-lg;

    .nav {
      flex-direction: row;
      gap: $spacing-lg;
    }

    .logo {
      width: 150px;
    }
  }
}
```

### Responsive Product Card

```scss
.product-card {
  @include max-width($breakpoint-md) {
    padding: $spacing-md;

    .title {
      font-size: $font-size-lg;
    }

    .price {
      font-size: $font-size-xl;
    }
  }

  @include min-width($breakpoint-md) {
    padding: $spacing-lg;

    .title {
      font-size: $font-size-xl;
    }

    .price {
      font-size: $font-size-2xl;
    }
  }

  @include min-width($breakpoint-lg) {
    padding: $spacing-xl;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-xl;
    }
  }
}
```

### Responsive Grid Layout

```scss
.products-grid {
  display: grid;
  gap: $spacing-lg;

  @include max-width($breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  @include min-width($breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }

  @include min-width($breakpoint-lg) {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-xl;
  }

  @include min-width($breakpoint-xxl) {
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-2xl;
  }
}
```

## Best Practices

### 1. Mobile-First Approach

Luôn bắt đầu với mobile styles, sau đó sử dụng `min-width` media queries để mở rộng cho các màn hình lớn hơn.

```scss
// ✅ Good - Mobile first
.component {
  padding: $spacing-md;

  @include min-width($breakpoint-md) {
    padding: $spacing-lg;
  }

  @include min-width($breakpoint-lg) {
    padding: $spacing-xl;
  }
}

// ❌ Bad - Desktop first
.component {
  padding: $spacing-xl;

  @include max-width($breakpoint-lg) {
    padding: $spacing-lg;
  }

  @include max-width($breakpoint-md) {
    padding: $spacing-md;
  }
}
```

### 2. Sử dụng Mixins

Luôn sử dụng mixins thay vì viết media queries trực tiếp để đảm bảo tính nhất quán.

```scss
// ✅ Good - Using mixins
.component {
  @include min-width($breakpoint-md) {
    // styles
  }
}

// ❌ Bad - Direct media queries
.component {
  @media (min-width: 768px) {
    // styles
  }
}
```

### 3. Responsive Typography

Sử dụng các utility classes có sẵn cho typography responsive.

```scss
// ✅ Good - Using utility classes
.title {
  @extend .bmw-title;
}

// ❌ Bad - Manual responsive typography
.title {
  font-size: 24px;

  @media (min-width: 768px) {
    font-size: 30px;
  }

  @media (min-width: 992px) {
    font-size: 36px;
  }
}
```

### 4. Touch Device Optimization

Tối ưu hóa cho touch devices bằng cách sử dụng touch device mixins.

```scss
.button {
  @include touch-device {
    min-height: 44px; // Minimum touch target size
    padding: $spacing-md;
  }

  @include non-touch-device {
    &:hover {
      transform: translateY(-2px);
    }
  }
}
```

### 5. Performance Considerations

- Sử dụng `transform` và `opacity` cho animations thay vì `width`, `height`, `top`, `left`
- Tránh layout shifts bằng cách sử dụng `aspect-ratio` hoặc fixed dimensions
- Sử dụng `will-change` cho elements có animations

```scss
.animated-element {
  transform: translateY(0);
  transition: transform $transition-normal;
  will-change: transform;

  &:hover {
    transform: translateY(-4px);
  }
}
```

## Testing

### Breakpoint Testing

Test website trên các breakpoints chính:

- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Device Testing

Test trên các thiết bị thực tế:

- **iOS**: iPhone SE, iPhone 12, iPhone 12 Pro Max
- **Android**: Samsung Galaxy S21, Google Pixel 5
- **Tablets**: iPad, iPad Pro, Samsung Galaxy Tab
- **Desktop**: MacBook, Windows PC với các độ phân giải khác nhau

### Browser Testing

Test trên các trình duyệt chính:

- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Edge (Desktop)

## Tools & Resources

### Development Tools

- **Chrome DevTools**: Responsive design mode
- **Firefox DevTools**: Responsive design mode
- **Safari Web Inspector**: Responsive design mode

### Testing Tools

- **BrowserStack**: Cross-browser testing
- **LambdaTest**: Cross-browser testing
- **Responsively App**: Local responsive testing

### Design Tools

- **Figma**: Responsive design
- **Adobe XD**: Responsive design
- **Sketch**: Responsive design

## Troubleshooting

### Common Issues

1. **Layout Shifts**: Sử dụng `aspect-ratio` hoặc fixed dimensions
2. **Text Overflow**: Sử dụng `text-overflow: ellipsis` và `overflow: hidden`
3. **Touch Targets**: Đảm bảo minimum 44px cho touch targets
4. **Performance**: Tránh layout thrashing bằng cách sử dụng `transform`

### Debug Tips

```scss
// Debug responsive layout
.debug-responsive {
  outline: 2px solid red;

  @include max-width($breakpoint-md) {
    outline-color: blue;
  }

  @include min-width($breakpoint-lg) {
    outline-color: green;
  }
}
```

## Conclusion

Hệ thống responsive design này cung cấp một foundation vững chắc cho BMW website, đảm bảo trải nghiệm người dùng tốt trên mọi thiết bị. Luôn tuân thủ các best practices và test kỹ lưỡng trên nhiều thiết bị khác nhau.

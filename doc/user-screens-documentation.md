# TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE

## TỔNG QUAN

Website Minh Duy cung cấp trải nghiệm mua sắm và dịch vụ toàn diện cho khách hàng, bao gồm xem sản phẩm, đặt lịch dịch vụ, theo dõi tin tức và quản lý tài khoản cá nhân.

---

## 1. MÀN HÌNH CHÍNH & ĐIỀU HƯỚNG

### 1.1 Trang Chủ (HomePage)

**Đường dẫn:** `/`
**Mô tả:** Màn hình đầu tiên khi truy cập website

**Các thành phần chính:**

- **Hero Section:** Banner chính với hình ảnh Minh Duy và thông điệp chào mừng
- **Brand Experience:** Giới thiệu trải nghiệm thương hiệu Minh Duy
- **Featured Models:** Hiển thị các mẫu xe nổi bật
- **Popular News:** Tin tức được xem nhiều nhất

**Tính năng:**

- Loading animation khi tải trang
- SEO tối ưu với meta tags
- Responsive design cho mọi thiết bị

---

## 2. KHÁM PHÁ SẢN PHẨM

### 2.1 Danh Sách Sản Phẩm (ProductListPage)

**Đường dẫn:** `/products`
**Mô tả:** Hiển thị tất cả sản phẩm với bộ lọc nâng cao

**Tính năng chính:**

- **Bộ lọc thông minh:**

  - Tìm kiếm theo tên sản phẩm
  - Lọc theo danh mục
  - Lọc theo khoảng giá
  - Lọc theo trạng thái
  - Sắp xếp theo nhiều tiêu chí

- **Hiển thị sản phẩm:**

  - Grid layout responsive
  - Card sản phẩm với hình ảnh, tên, giá
  - Nút yêu thích (favorite)
  - Nút xem chi tiết

- **Phân trang:** Hỗ trợ phân trang với nhiều tùy chọn

**Giao diện:**

- Sidebar bộ lọc (desktop)
- Drawer bộ lọc (mobile)
- Skeleton loading khi tải dữ liệu

### 2.2 Chi Tiết Sản Phẩm (ProductDetailPage)

**Đường dẫn:** `/products/:id`
**Mô tả:** Hiển thị thông tin chi tiết của sản phẩm

**Thông tin hiển thị:**

- Hình ảnh sản phẩm (gallery)
- Tên và mô tả sản phẩm
- Thông số kỹ thuật
- Giá cả và khuyến mãi
- Nút yêu thích và mua hàng
- Sản phẩm liên quan

---

## 3. DỊCH VỤ & ĐẶT LỊCH

### 3.1 Trang Dịch Vụ (ServicePage)

**Đường dẫn:** `/services`
**Mô tả:** Giới thiệu các dịch vụ sửa chữa và bảo dưỡng

**Nội dung chính:**

- **Overview Section:** Lý do chọn dịch vụ của chúng tôi
- **Service Categories:** 9 loại dịch vụ chính:
  1. Bảo Dưỡng Định Kỳ
  2. Sửa Chữa & Đồng Sơn
  3. Nâng Cấp Hiệu Suất
  4. Thay Dầu & Lọc
  5. Kiểm Tra Điện Tử
  6. Bảo Dưỡng Phanh
  7. Lắp Đặt Phụ Kiện
  8. Tư Vấn Kỹ Thuật
  9. Dịch Vụ Khẩn Cấp

**Tính năng:**

- Service cards với icon và mô tả
- Nút đặt lịch tư vấn
- Thông tin địa chỉ các chi nhánh

### 3.2 Đặt Lịch Dịch Vụ (BookingPage)

**Đường dẫn:** `/booking`
**Mô tả:** Form đặt lịch dịch vụ và tư vấn

**Form đăng ký:**

- Thông tin cá nhân (Họ tên, Email, SĐT, Địa chỉ)
- Chọn dịch vụ cần tư vấn
- Chọn ngày và thời gian đặt lịch
- Ghi chú bổ sung

**Tính năng:**

- Validation form real-time
- Timeline 4 bước quy trình
- Modal form cho mobile
- Responsive design

---

## 4. BÁO GIÁ & TÀI LIỆU

### 4.1 Bảng Giá Dịch Vụ (PriceListPage)

**Đường dẫn:** `/pricing`
**Mô tả:** Hiển thị báo giá các dịch vụ với tài liệu đính kèm

**Cấu trúc:**

- **Pricing Cards:** Hiển thị theo grid
- **Card Content:**
  - Tiêu đề dịch vụ
  - Mô tả chi tiết
  - Danh sách tính năng
  - Tài liệu đính kèm (PDF, Word, Excel)

**Tính năng:**

- Phân trang với nhiều tùy chọn
- Download tài liệu
- Responsive grid layout
- Loading states

---

## 5. TIN TỨC & SỰ KIỆN

### 5.1 Danh Sách Tin Tức (NewsPage)

**Đường dẫn:** `/news`
**Mô tả:** Hiển thị tất cả tin tức và sự kiện

**Giao diện:**

- **News Items:** Card tin tức với hình ảnh
- **Meta Information:** Ngày đăng, trạng thái
- **Content Preview:** Tóm tắt nội dung
- **Pagination:** Phân trang tin tức

**Tính năng:**

- Responsive layout
- Error handling
- Loading states
- SEO optimization

### 5.2 Chi Tiết Tin Tức (NewsDetailPage)

**Đường dẫn:** `/news/:id`
**Mô tả:** Hiển thị nội dung chi tiết tin tức

**Nội dung:**

- Tiêu đề và meta thông tin
- Hình ảnh chính
- Nội dung chi tiết (HTML)
- Tin tức liên quan
- Social sharing

---

## 6. QUẢN LÝ TÀI KHOẢN

### 6.1 Đăng Nhập (LoginPage)

**Đường dẫn:** `/login`
**Mô tả:** Form đăng nhập tài khoản

**Form fields:**

- Tên đăng nhập hoặc Email
- Mật khẩu
- Checkbox "Ghi nhớ đăng nhập"
- Link "Quên mật khẩu"

**Tính năng:**

- Validation real-time
- Error handling
- Loading states
- Redirect sau đăng nhập
- Remember me functionality

### 6.2 Đăng Ký (RegisterPage)

**Đường dẫn:** `/register`
**Mô tả:** Form đăng ký tài khoản mới

**Form fields:**

- Họ và tên
- Tên đăng nhập
- Email
- Số điện thoại
- Mật khẩu
- Xác nhận mật khẩu
- Địa chỉ

### 6.3 Hồ Sơ Cá Nhân (ProfilePage)

**Đường dẫn:** `/profile`
**Mô tả:** Quản lý thông tin cá nhân

**Tính năng:**

- **View Mode:** Hiển thị thông tin cá nhân
- **Edit Mode:** Chỉnh sửa thông tin
- **Avatar:** Hiển thị chữ cái đầu tên
- **Information Fields:**
  - Tên đăng nhập
  - Email
  - Số điện thoại (có thể edit)
  - Địa chỉ (có thể edit)
  - Trạng thái tài khoản

**Actions:**

- Edit profile
- Save changes
- Cancel editing

### 6.4 Trang Yêu Thích (FavoritesPage)

**Đường dẫn:** `/favorites`
**Mô tả:** Quản lý danh sách sản phẩm yêu thích

**Tính năng:**

- Hiển thị sản phẩm đã yêu thích
- Xóa khỏi danh sách yêu thích
- Chuyển đến trang chi tiết sản phẩm
- Empty state khi chưa có sản phẩm yêu thích

---

## 7. MÀN HÌNH HỖ TRỢ

### 7.1 Trang 404 (NotFoundPage)

**Đường dẫn:** `*` (catch-all)
**Mô tả:** Trang lỗi khi không tìm thấy đường dẫn

**Nội dung:**

- Thông báo lỗi 404
- Hướng dẫn quay về trang chủ
- Tìm kiếm sản phẩm

---

## THỐNG KÊ TỔNG QUAN

### Số lượng màn hình: 13 màn hình chính

**Phân loại theo chức năng:**

- **Màn hình chính:** 1 (HomePage)
- **Sản phẩm:** 2 (ProductList, ProductDetail)
- **Dịch vụ:** 2 (Service, Booking)
- **Báo giá:** 1 (PriceList)
- **Tin tức:** 2 (News, NewsDetail)
- **Tài khoản:** 4 (Login, Register, Profile, Favorites)
- **Hỗ trợ:** 1 (NotFound)

### Đặc điểm kỹ thuật:

- **Framework:** React + TypeScript
- **Styling:** SCSS Modules
- **UI Library:** Ant Design
- **State Management:** Context API
- **Routing:** React Router
- **API Integration:** Axios
- **Responsive:** Mobile-first approach

### Tính năng chung:

- SEO optimization
- Loading states
- Error handling
- Responsive design
- Accessibility support
- Toast notifications
- Form validation

---

## LUỒNG NGƯỜI DÙNG ĐIỂN HÌNH

### 1. Khách hàng mới:

HomePage → ProductList → ProductDetail → Register → Login → Profile

### 2. Khách hàng đã đăng nhập:

HomePage → ServicePage → BookingPage → Profile

### 3. Khách hàng quan tâm tin tức:

HomePage → NewsPage → NewsDetail

### 4. Khách hàng tìm hiểu giá:

HomePage → PriceListPage → BookingPage

---

_Tài liệu này được cập nhật lần cuối: [Ngày hiện tại]_

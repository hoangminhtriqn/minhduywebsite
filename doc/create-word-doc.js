const fs = require('fs');
const path = require('path');

// Content for the Word document
const documentTitle = 'TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE';

const overviewText = 'Website Minh Duy cung cấp trải nghiệm mua sắm và dịch vụ toàn diện cho khách hàng, bao gồm xem sản phẩm, đặt lịch dịch vụ, theo dõi tin tức và quản lý tài khoản cá nhân.';

const documentContent = `
TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE

TỔNG QUAN
${overviewText}

1. MÀN HÌNH CHÍNH & ĐIỀU HƯỚNG

1.1 Trang Chủ (HomePage)
Đường dẫn: /
Mô tả: Màn hình đầu tiên khi truy cập website

Các thành phần chính:
- Hero Section: Banner chính với hình ảnh Minh Duy và thông điệp chào mừng
- Brand Experience: Giới thiệu trải nghiệm thương hiệu Minh Duy
- Featured Models: Hiển thị các mẫu xe nổi bật
- Popular News: Tin tức được xem nhiều nhất

Tính năng:
- Loading animation khi tải trang
- SEO tối ưu với meta tags
- Responsive design cho mọi thiết bị

2. KHÁM PHÁ SẢN PHẨM

2.1 Danh Sách Sản Phẩm (ProductListPage)
Đường dẫn: /products
Mô tả: Hiển thị tất cả sản phẩm với bộ lọc nâng cao

Tính năng chính:
- Bộ lọc thông minh:
  + Tìm kiếm theo tên sản phẩm
  + Lọc theo danh mục
  + Lọc theo khoảng giá
  + Lọc theo trạng thái
  + Sắp xếp theo nhiều tiêu chí

- Hiển thị sản phẩm:
  + Grid layout responsive
  + Card sản phẩm với hình ảnh, tên, giá
  + Nút yêu thích (favorite)
  + Nút xem chi tiết

- Phân trang: Hỗ trợ phân trang với nhiều tùy chọn

Giao diện:
- Sidebar bộ lọc (desktop)
- Drawer bộ lọc (mobile)
- Skeleton loading khi tải dữ liệu

2.2 Chi Tiết Sản Phẩm (ProductDetailPage)
Đường dẫn: /products/:id
Mô tả: Hiển thị thông tin chi tiết của sản phẩm

Thông tin hiển thị:
- Hình ảnh sản phẩm (gallery)
- Tên và mô tả sản phẩm
- Thông số kỹ thuật
- Giá cả và khuyến mãi
- Nút yêu thích và mua hàng
- Sản phẩm liên quan

3. DỊCH VỤ & ĐẶT LỊCH

3.1 Trang Dịch Vụ (ServicePage)
Đường dẫn: /services
Mô tả: Giới thiệu các dịch vụ sửa chữa và bảo dưỡng

Nội dung chính:
- Overview Section: Lý do chọn dịch vụ của chúng tôi
- Service Categories: 9 loại dịch vụ chính:
  1. Bảo Dưỡng Định Kỳ
  2. Sửa Chữa & Đồng Sơn
  3. Nâng Cấp Hiệu Suất
  4. Thay Dầu & Lọc
  5. Kiểm Tra Điện Tử
  6. Bảo Dưỡng Phanh
  7. Lắp Đặt Phụ Kiện
  8. Tư Vấn Kỹ Thuật
  9. Dịch Vụ Khẩn Cấp

Tính năng:
- Service cards với icon và mô tả
- Nút đặt lịch tư vấn
- Thông tin địa chỉ các chi nhánh

3.2 Đặt Lịch Dịch Vụ (BookingPage)
Đường dẫn: /booking
Mô tả: Form đặt lịch dịch vụ và tư vấn

Form đăng ký:
- Thông tin cá nhân (Họ tên, Email, SĐT, Địa chỉ)
- Chọn dịch vụ cần tư vấn
- Chọn ngày và thời gian đặt lịch
- Ghi chú bổ sung

Tính năng:
- Validation form real-time
- Timeline 4 bước quy trình
- Modal form cho mobile
- Responsive design

4. BÁO GIÁ & TÀI LIỆU

4.1 Bảng Giá Dịch Vụ (PriceListPage)
Đường dẫn: /pricing
Mô tả: Hiển thị báo giá các dịch vụ với tài liệu đính kèm

Cấu trúc:
- Pricing Cards: Hiển thị theo grid
- Card Content:
  + Tiêu đề dịch vụ
  + Mô tả chi tiết
  + Danh sách tính năng
  + Tài liệu đính kèm (PDF, Word, Excel)

Tính năng:
- Phân trang với nhiều tùy chọn
- Download tài liệu
- Responsive grid layout
- Loading states

5. TIN TỨC & SỰ KIỆN

5.1 Danh Sách Tin Tức (NewsPage)
Đường dẫn: /news
Mô tả: Hiển thị tất cả tin tức và sự kiện

Giao diện:
- News Items: Card tin tức với hình ảnh
- Meta Information: Ngày đăng, trạng thái
- Content Preview: Tóm tắt nội dung
- Pagination: Phân trang tin tức

Tính năng:
- Responsive layout
- Error handling
- Loading states
- SEO optimization

5.2 Chi Tiết Tin Tức (NewsDetailPage)
Đường dẫn: /news/:id
Mô tả: Hiển thị nội dung chi tiết tin tức

Nội dung:
- Tiêu đề và meta thông tin
- Hình ảnh chính
- Nội dung chi tiết (HTML)
- Tin tức liên quan
- Social sharing

6. QUẢN LÝ TÀI KHOẢN

6.1 Đăng Nhập (LoginPage)
Đường dẫn: /login
Mô tả: Form đăng nhập tài khoản

Form fields:
- Tên đăng nhập hoặc Email
- Mật khẩu
- Checkbox "Ghi nhớ đăng nhập"
- Link "Quên mật khẩu"

Tính năng:
- Validation real-time
- Error handling
- Loading states
- Redirect sau đăng nhập
- Remember me functionality

6.2 Đăng Ký (RegisterPage)
Đường dẫn: /register
Mô tả: Form đăng ký tài khoản mới

Form fields:
- Họ và tên
- Tên đăng nhập
- Email
- Số điện thoại
- Mật khẩu
- Xác nhận mật khẩu
- Địa chỉ

6.3 Hồ Sơ Cá Nhân (ProfilePage)
Đường dẫn: /profile
Mô tả: Quản lý thông tin cá nhân

Tính năng:
- View Mode: Hiển thị thông tin cá nhân
- Edit Mode: Chỉnh sửa thông tin
- Avatar: Hiển thị chữ cái đầu tên
- Information Fields:
  + Tên đăng nhập
  + Email
  + Số điện thoại (có thể edit)
  + Địa chỉ (có thể edit)
  + Trạng thái tài khoản

Actions:
- Edit profile
- Save changes
- Cancel editing

6.4 Trang Yêu Thích (FavoritesPage)
Đường dẫn: /favorites
Mô tả: Quản lý danh sách sản phẩm yêu thích

Tính năng:
- Hiển thị sản phẩm đã yêu thích
- Xóa khỏi danh sách yêu thích
- Chuyển đến trang chi tiết sản phẩm
- Empty state khi chưa có sản phẩm yêu thích

7. MÀN HÌNH HỖ TRỢ

7.1 Trang 404 (NotFoundPage)
Đường dẫn: * (catch-all)
Mô tả: Trang lỗi khi không tìm thấy đường dẫn

Nội dung:
- Thông báo lỗi 404
- Hướng dẫn quay về trang chủ
- Tìm kiếm sản phẩm

THỐNG KÊ TỔNG QUAN

Số lượng màn hình: 13 màn hình chính

Phân loại theo chức năng:
- Màn hình chính: 1 (HomePage)
- Sản phẩm: 2 (ProductList, ProductDetail)
- Dịch vụ: 2 (Service, Booking)
- Báo giá: 1 (PriceList)
- Tin tức: 2 (News, NewsDetail)
- Tài khoản: 4 (Login, Register, Profile, Favorites)
- Hỗ trợ: 1 (NotFound)

Đặc điểm kỹ thuật:
- Framework: React + TypeScript
- Styling: SCSS Modules
- UI Library: Ant Design
- State Management: Context API
- Routing: React Router
- API Integration: Axios
- Responsive: Mobile-first approach

Tính năng chung:
- SEO optimization
- Loading states
- Error handling
- Responsive design
- Accessibility support
- Toast notifications
- Form validation

LUỒNG NGƯỜI DÙNG ĐIỂN HÌNH

1. Khách hàng mới:
HomePage → ProductList → ProductDetail → Register → Login → Profile

2. Khách hàng đã đăng nhập:
HomePage → ServicePage → BookingPage → Profile

3. Khách hàng quan tâm tin tức:
HomePage → NewsPage → NewsDetail

4. Khách hàng tìm hiểu giá:
HomePage → PriceListPage → BookingPage

Tài liệu này được cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}
`;

// Create a simple HTML file that can be opened in Word
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 1in;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20pt;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 20pt;
            margin-bottom: 10pt;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 15pt;
            margin-bottom: 8pt;
        }
        p {
            margin-bottom: 8pt;
        }
        ul {
            margin-bottom: 8pt;
        }
        li {
            margin-bottom: 4pt;
        }
        .highlight {
            font-weight: bold;
        }
        .section {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <h1>TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE</h1>
    
    <h2>TỔNG QUAN</h2>
    <p>${overviewText}</p>
    
    <div class="section">
        <h2>1. MÀN HÌNH CHÍNH & ĐIỀU HƯỚNG</h2>
        
        <h3>1.1 Trang Chủ (HomePage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /</p>
        <p><span class="highlight">Mô tả:</span> Màn hình đầu tiên khi truy cập website</p>
        
        <p><span class="highlight">Các thành phần chính:</span></p>
        <ul>
            <li><span class="highlight">Hero Section:</span> Banner chính với hình ảnh Minh Duy và thông điệp chào mừng</li>
            <li><span class="highlight">Brand Experience:</span> Giới thiệu trải nghiệm thương hiệu Minh Duy</li>
            <li><span class="highlight">Featured Models:</span> Hiển thị các mẫu xe nổi bật</li>
            <li><span class="highlight">Popular News:</span> Tin tức được xem nhiều nhất</li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Loading animation khi tải trang</li>
            <li>SEO tối ưu với meta tags</li>
            <li>Responsive design cho mọi thiết bị</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>2. KHÁM PHÁ SẢN PHẨM</h2>
        
        <h3>2.1 Danh Sách Sản Phẩm (ProductListPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /products</p>
        <p><span class="highlight">Mô tả:</span> Hiển thị tất cả sản phẩm với bộ lọc nâng cao</p>
        
        <p><span class="highlight">Tính năng chính:</span></p>
        <ul>
            <li><span class="highlight">Bộ lọc thông minh:</span>
                <ul>
                    <li>Tìm kiếm theo tên sản phẩm</li>
                    <li>Lọc theo danh mục</li>
                    <li>Lọc theo khoảng giá</li>
                    <li>Lọc theo trạng thái</li>
                    <li>Sắp xếp theo nhiều tiêu chí</li>
                </ul>
            </li>
            <li><span class="highlight">Hiển thị sản phẩm:</span>
                <ul>
                    <li>Grid layout responsive</li>
                    <li>Card sản phẩm với hình ảnh, tên, giá</li>
                    <li>Nút yêu thích (favorite)</li>
                    <li>Nút xem chi tiết</li>
                </ul>
            </li>
            <li><span class="highlight">Phân trang:</span> Hỗ trợ phân trang với nhiều tùy chọn</li>
        </ul>
        
        <p><span class="highlight">Giao diện:</span></p>
        <ul>
            <li>Sidebar bộ lọc (desktop)</li>
            <li>Drawer bộ lọc (mobile)</li>
            <li>Skeleton loading khi tải dữ liệu</li>
        </ul>
        
        <h3>2.2 Chi Tiết Sản Phẩm (ProductDetailPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /products/:id</p>
        <p><span class="highlight">Mô tả:</span> Hiển thị thông tin chi tiết của sản phẩm</p>
        
        <p><span class="highlight">Thông tin hiển thị:</span></p>
        <ul>
            <li>Hình ảnh sản phẩm (gallery)</li>
            <li>Tên và mô tả sản phẩm</li>
            <li>Thông số kỹ thuật</li>
            <li>Giá cả và khuyến mãi</li>
            <li>Nút yêu thích và mua hàng</li>
            <li>Sản phẩm liên quan</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>3. DỊCH VỤ & ĐẶT LỊCH</h2>
        
        <h3>3.1 Trang Dịch Vụ (ServicePage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /services</p>
        <p><span class="highlight">Mô tả:</span> Giới thiệu các dịch vụ sửa chữa và bảo dưỡng</p>
        
        <p><span class="highlight">Nội dung chính:</span></p>
        <ul>
            <li><span class="highlight">Overview Section:</span> Lý do chọn dịch vụ của chúng tôi</li>
            <li><span class="highlight">Service Categories:</span> 9 loại dịch vụ chính:
                <ol>
                    <li>Bảo Dưỡng Định Kỳ</li>
                    <li>Sửa Chữa & Đồng Sơn</li>
                    <li>Nâng Cấp Hiệu Suất</li>
                    <li>Thay Dầu & Lọc</li>
                    <li>Kiểm Tra Điện Tử</li>
                    <li>Bảo Dưỡng Phanh</li>
                    <li>Lắp Đặt Phụ Kiện</li>
                    <li>Tư Vấn Kỹ Thuật</li>
                    <li>Dịch Vụ Khẩn Cấp</li>
                </ol>
            </li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Service cards với icon và mô tả</li>
            <li>Nút đặt lịch tư vấn</li>
            <li>Thông tin địa chỉ các chi nhánh</li>
        </ul>
        
        <h3>3.2 Đặt Lịch Dịch Vụ (BookingPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /booking</p>
        <p><span class="highlight">Mô tả:</span> Form đặt lịch dịch vụ và tư vấn</p>
        
        <p><span class="highlight">Form đăng ký:</span></p>
        <ul>
            <li>Thông tin cá nhân (Họ tên, Email, SĐT, Địa chỉ)</li>
            <li>Chọn dịch vụ cần tư vấn</li>
            <li>Chọn ngày và thời gian đặt lịch</li>
            <li>Ghi chú bổ sung</li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Validation form real-time</li>
            <li>Timeline 4 bước quy trình</li>
            <li>Modal form cho mobile</li>
            <li>Responsive design</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>4. BÁO GIÁ & TÀI LIỆU</h2>
        
        <h3>4.1 Bảng Giá Dịch Vụ (PriceListPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /pricing</p>
        <p><span class="highlight">Mô tả:</span> Hiển thị báo giá các dịch vụ với tài liệu đính kèm</p>
        
        <p><span class="highlight">Cấu trúc:</span></p>
        <ul>
            <li><span class="highlight">Pricing Cards:</span> Hiển thị theo grid</li>
            <li><span class="highlight">Card Content:</span>
                <ul>
                    <li>Tiêu đề dịch vụ</li>
                    <li>Mô tả chi tiết</li>
                    <li>Danh sách tính năng</li>
                    <li>Tài liệu đính kèm (PDF, Word, Excel)</li>
                </ul>
            </li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Phân trang với nhiều tùy chọn</li>
            <li>Download tài liệu</li>
            <li>Responsive grid layout</li>
            <li>Loading states</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>5. TIN TỨC & SỰ KIỆN</h2>
        
        <h3>5.1 Danh Sách Tin Tức (NewsPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /news</p>
        <p><span class="highlight">Mô tả:</span> Hiển thị tất cả tin tức và sự kiện</p>
        
        <p><span class="highlight">Giao diện:</span></p>
        <ul>
            <li><span class="highlight">News Items:</span> Card tin tức với hình ảnh</li>
            <li><span class="highlight">Meta Information:</span> Ngày đăng, trạng thái</li>
            <li><span class="highlight">Content Preview:</span> Tóm tắt nội dung</li>
            <li><span class="highlight">Pagination:</span> Phân trang tin tức</li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Responsive layout</li>
            <li>Error handling</li>
            <li>Loading states</li>
            <li>SEO optimization</li>
        </ul>
        
        <h3>5.2 Chi Tiết Tin Tức (NewsDetailPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /news/:id</p>
        <p><span class="highlight">Mô tả:</span> Hiển thị nội dung chi tiết tin tức</p>
        
        <p><span class="highlight">Nội dung:</span></p>
        <ul>
            <li>Tiêu đề và meta thông tin</li>
            <li>Hình ảnh chính</li>
            <li>Nội dung chi tiết (HTML)</li>
            <li>Tin tức liên quan</li>
            <li>Social sharing</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>6. QUẢN LÝ TÀI KHOẢN</h2>
        
        <h3>6.1 Đăng Nhập (LoginPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /login</p>
        <p><span class="highlight">Mô tả:</span> Form đăng nhập tài khoản</p>
        
        <p><span class="highlight">Form fields:</span></p>
        <ul>
            <li>Tên đăng nhập hoặc Email</li>
            <li>Mật khẩu</li>
            <li>Checkbox "Ghi nhớ đăng nhập"</li>
            <li>Link "Quên mật khẩu"</li>
        </ul>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Validation real-time</li>
            <li>Error handling</li>
            <li>Loading states</li>
            <li>Redirect sau đăng nhập</li>
            <li>Remember me functionality</li>
        </ul>
        
        <h3>6.2 Đăng Ký (RegisterPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /register</p>
        <p><span class="highlight">Mô tả:</span> Form đăng ký tài khoản mới</p>
        
        <p><span class="highlight">Form fields:</span></p>
        <ul>
            <li>Họ và tên</li>
            <li>Tên đăng nhập</li>
            <li>Email</li>
            <li>Số điện thoại</li>
            <li>Mật khẩu</li>
            <li>Xác nhận mật khẩu</li>
            <li>Địa chỉ</li>
        </ul>
        
        <h3>6.3 Hồ Sơ Cá Nhân (ProfilePage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /profile</p>
        <p><span class="highlight">Mô tả:</span> Quản lý thông tin cá nhân</p>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li><span class="highlight">View Mode:</span> Hiển thị thông tin cá nhân</li>
            <li><span class="highlight">Edit Mode:</span> Chỉnh sửa thông tin</li>
            <li><span class="highlight">Avatar:</span> Hiển thị chữ cái đầu tên</li>
            <li><span class="highlight">Information Fields:</span>
                <ul>
                    <li>Tên đăng nhập</li>
                    <li>Email</li>
                    <li>Số điện thoại (có thể edit)</li>
                    <li>Địa chỉ (có thể edit)</li>
                    <li>Trạng thái tài khoản</li>
                </ul>
            </li>
        </ul>
        
        <p><span class="highlight">Actions:</span></p>
        <ul>
            <li>Edit profile</li>
            <li>Save changes</li>
            <li>Cancel editing</li>
        </ul>
        
        <h3>6.4 Trang Yêu Thích (FavoritesPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> /favorites</p>
        <p><span class="highlight">Mô tả:</span> Quản lý danh sách sản phẩm yêu thích</p>
        
        <p><span class="highlight">Tính năng:</span></p>
        <ul>
            <li>Hiển thị sản phẩm đã yêu thích</li>
            <li>Xóa khỏi danh sách yêu thích</li>
            <li>Chuyển đến trang chi tiết sản phẩm</li>
            <li>Empty state khi chưa có sản phẩm yêu thích</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>7. MÀN HÌNH HỖ TRỢ</h2>
        
        <h3>7.1 Trang 404 (NotFoundPage)</h3>
        <p><span class="highlight">Đường dẫn:</span> * (catch-all)</p>
        <p><span class="highlight">Mô tả:</span> Trang lỗi khi không tìm thấy đường dẫn</p>
        
        <p><span class="highlight">Nội dung:</span></p>
        <ul>
            <li>Thông báo lỗi 404</li>
            <li>Hướng dẫn quay về trang chủ</li>
            <li>Tìm kiếm sản phẩm</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>THỐNG KÊ TỔNG QUAN</h2>
        
        <p><span class="highlight">Số lượng màn hình:</span> 13 màn hình chính</p>
        
        <p><span class="highlight">Phân loại theo chức năng:</span></p>
        <ul>
            <li><span class="highlight">Màn hình chính:</span> 1 (HomePage)</li>
            <li><span class="highlight">Sản phẩm:</span> 2 (ProductList, ProductDetail)</li>
            <li><span class="highlight">Dịch vụ:</span> 2 (Service, Booking)</li>
            <li><span class="highlight">Báo giá:</span> 1 (PriceList)</li>
            <li><span class="highlight">Tin tức:</span> 2 (News, NewsDetail)</li>
            <li><span class="highlight">Tài khoản:</span> 4 (Login, Register, Profile, Favorites)</li>
            <li><span class="highlight">Hỗ trợ:</span> 1 (NotFound)</li>
        </ul>
        
        <p><span class="highlight">Đặc điểm kỹ thuật:</span></p>
        <ul>
            <li><span class="highlight">Framework:</span> React + TypeScript</li>
            <li><span class="highlight">Styling:</span> SCSS Modules</li>
            <li><span class="highlight">UI Library:</span> Ant Design</li>
            <li><span class="highlight">State Management:</span> Context API</li>
            <li><span class="highlight">Routing:</span> React Router</li>
            <li><span class="highlight">API Integration:</span> Axios</li>
            <li><span class="highlight">Responsive:</span> Mobile-first approach</li>
        </ul>
        
        <p><span class="highlight">Tính năng chung:</span></p>
        <ul>
            <li>SEO optimization</li>
            <li>Loading states</li>
            <li>Error handling</li>
            <li>Responsive design</li>
            <li>Accessibility support</li>
            <li>Toast notifications</li>
            <li>Form validation</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>LUỒNG NGƯỜI DÙNG ĐIỂN HÌNH</h2>
        
        <h3>1. Khách hàng mới:</h3>
        <p>HomePage → ProductList → ProductDetail → Register → Login → Profile</p>
        
        <h3>2. Khách hàng đã đăng nhập:</h3>
        <p>HomePage → ServicePage → BookingPage → Profile</p>
        
        <h3>3. Khách hàng quan tâm tin tức:</h3>
        <p>HomePage → NewsPage → NewsDetail</p>
        
        <h3>4. Khách hàng tìm hiểu giá:</h3>
        <p>HomePage → PriceListPage → BookingPage</p>
    </div>
    
    <p style="margin-top: 30pt; text-align: center; font-style: italic;">
        Tài liệu này được cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}
    </p>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'user-screens-documentation.html'), htmlContent);

console.log('✅ Đã tạo file HTML: doc/user-screens-documentation.html');
console.log('📝 Bạn có thể mở file này trong Word hoặc trình duyệt để xem tài liệu');
console.log('💡 Để chuyển sang Word: Mở file HTML → Copy to Word → Save as .docx'); 
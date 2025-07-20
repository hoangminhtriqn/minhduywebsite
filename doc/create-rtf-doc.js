const fs = require('fs');
const path = require('path');

// RTF header with Vietnamese font support
const rtfHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl ;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\f0\\fs24\\cf1
`;

const rtfFooter = `}`;

// Function to convert text to RTF format
const toRtf = (text) => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par ')
    .replace(/\r/g, '');
};

// RTF content
const rtfContent = `
{\\b TÀI LIỆU MÔ TẢ GIAO DIỆN NGƯỜI DÙNG - MINH DUY WEBSITE}\\par\\par

{\\b TỔNG QUAN}\\par
Website Minh Duy cung cấp trải nghiệm mua sắm và dịch vụ toàn diện cho khách hàng, bao gồm xem sản phẩm, đặt lịch dịch vụ, theo dõi tin tức và quản lý tài khoản cá nhân.\\par\\par

{\\b 1. MÀN HÌNH CHÍNH & ĐIỀU HƯỚNG}\\par\\par

{\\b 1.1 Trang Chủ (HomePage)}\\par
{\\b Đường dẫn:} /\\par
{\\b Mô tả:} Màn hình đầu tiên khi truy cập website\\par\\par

{\\b Các thành phần chính:}\\par
• {\\b Hero Section:} Banner chính với hình ảnh Minh Duy và thông điệp chào mừng\\par
• {\\b Brand Experience:} Giới thiệu trải nghiệm thương hiệu Minh Duy\\par
• {\\b Featured Models:} Hiển thị các mẫu xe nổi bật\\par
• {\\b Popular News:} Tin tức được xem nhiều nhất\\par\\par

{\\b Tính năng:}\\par
• Loading animation khi tải trang\\par
• SEO tối ưu với meta tags\\par
• Responsive design cho mọi thiết bị\\par\\par

{\\b 2. KHÁM PHÁ SẢN PHẨM}\\par\\par

{\\b 2.1 Danh Sách Sản Phẩm (ProductListPage)}\\par
{\\b Đường dẫn:} /products\\par
{\\b Mô tả:} Hiển thị tất cả sản phẩm với bộ lọc nâng cao\\par\\par

{\\b Tính năng chính:}\\par
{\\b Bộ lọc thông minh:}\\par
  - Tìm kiếm theo tên sản phẩm\\par
  - Lọc theo danh mục\\par
  - Lọc theo khoảng giá\\par
  - Lọc theo trạng thái\\par
  - Sắp xếp theo nhiều tiêu chí\\par\\par

{\\b Hiển thị sản phẩm:}\\par
  - Grid layout responsive\\par
  - Card sản phẩm với hình ảnh, tên, giá\\par
  - Nút yêu thích (favorite)\\par
  - Nút xem chi tiết\\par\\par

{\\b Phân trang:} Hỗ trợ phân trang với nhiều tùy chọn\\par\\par

{\\b Giao diện:}\\par
• Sidebar bộ lọc (desktop)\\par
• Drawer bộ lọc (mobile)\\par
• Skeleton loading khi tải dữ liệu\\par\\par

{\\b 2.2 Chi Tiết Sản Phẩm (ProductDetailPage)}\\par
{\\b Đường dẫn:} /products/:id\\par
{\\b Mô tả:} Hiển thị thông tin chi tiết của sản phẩm\\par\\par

{\\b Thông tin hiển thị:}\\par
• Hình ảnh sản phẩm (gallery)\\par
• Tên và mô tả sản phẩm\\par
• Thông số kỹ thuật\\par
• Giá cả và khuyến mãi\\par
• Nút yêu thích và mua hàng\\par
• Sản phẩm liên quan\\par\\par

{\\b 3. DỊCH VỤ & ĐẶT LỊCH}\\par\\par

{\\b 3.1 Trang Dịch Vụ (ServicePage)}\\par
{\\b Đường dẫn:} /services\\par
{\\b Mô tả:} Giới thiệu các dịch vụ sửa chữa và bảo dưỡng\\par\\par

{\\b Nội dung chính:}\\par
• {\\b Overview Section:} Lý do chọn dịch vụ của chúng tôi\\par
• {\\b Service Categories:} 9 loại dịch vụ chính:\\par
  1. Bảo Dưỡng Định Kỳ\\par
  2. Sửa Chữa & Đồng Sơn\\par
  3. Nâng Cấp Hiệu Suất\\par
  4. Thay Dầu & Lọc\\par
  5. Kiểm Tra Điện Tử\\par
  6. Bảo Dưỡng Phanh\\par
  7. Lắp Đặt Phụ Kiện\\par
  8. Tư Vấn Kỹ Thuật\\par
  9. Dịch Vụ Khẩn Cấp\\par\\par

{\\b Tính năng:}\\par
• Service cards với icon và mô tả\\par
• Nút đặt lịch tư vấn\\par
• Thông tin địa chỉ các chi nhánh\\par\\par

{\\b 3.2 Đặt Lịch Dịch Vụ (BookingPage)}\\par
{\\b Đường dẫn:} /booking\\par
{\\b Mô tả:} Form đặt lịch dịch vụ và tư vấn\\par\\par

{\\b Form đăng ký:}\\par
• Thông tin cá nhân (Họ tên, Email, SĐT, Địa chỉ)\\par
• Chọn dịch vụ cần tư vấn\\par
• Chọn ngày và thời gian đặt lịch\\par
• Ghi chú bổ sung\\par\\par

{\\b Tính năng:}\\par
• Validation form real-time\\par
• Timeline 4 bước quy trình\\par
• Modal form cho mobile\\par
• Responsive design\\par\\par

{\\b 4. BÁO GIÁ & TÀI LIỆU}\\par\\par

{\\b 4.1 Bảng Giá Dịch Vụ (PriceListPage)}\\par
{\\b Đường dẫn:} /pricing\\par
{\\b Mô tả:} Hiển thị báo giá các dịch vụ với tài liệu đính kèm\\par\\par

{\\b Cấu trúc:}\\par
• {\\b Pricing Cards:} Hiển thị theo grid\\par
• {\\b Card Content:}\\par
  - Tiêu đề dịch vụ\\par
  - Mô tả chi tiết\\par
  - Danh sách tính năng\\par
  - Tài liệu đính kèm (PDF, Word, Excel)\\par\\par

{\\b Tính năng:}\\par
• Phân trang với nhiều tùy chọn\\par
• Download tài liệu\\par
• Responsive grid layout\\par
• Loading states\\par\\par

{\\b 5. TIN TỨC & SỰ KIỆN}\\par\\par

{\\b 5.1 Danh Sách Tin Tức (NewsPage)}\\par
{\\b Đường dẫn:} /news\\par
{\\b Mô tả:} Hiển thị tất cả tin tức và sự kiện\\par\\par

{\\b Giao diện:}\\par
• {\\b News Items:} Card tin tức với hình ảnh\\par
• {\\b Meta Information:} Ngày đăng, trạng thái\\par
• {\\b Content Preview:} Tóm tắt nội dung\\par
• {\\b Pagination:} Phân trang tin tức\\par\\par

{\\b Tính năng:}\\par
• Responsive layout\\par
• Error handling\\par
• Loading states\\par
• SEO optimization\\par\\par

{\\b 5.2 Chi Tiết Tin Tức (NewsDetailPage)}\\par
{\\b Đường dẫn:} /news/:id\\par
{\\b Mô tả:} Hiển thị nội dung chi tiết tin tức\\par\\par

{\\b Nội dung:}\\par
• Tiêu đề và meta thông tin\\par
• Hình ảnh chính\\par
• Nội dung chi tiết (HTML)\\par
• Tin tức liên quan\\par
• Social sharing\\par\\par

{\\b 6. QUẢN LÝ TÀI KHOẢN}\\par\\par

{\\b 6.1 Đăng Nhập (LoginPage)}\\par
{\\b Đường dẫn:} /login\\par
{\\b Mô tả:} Form đăng nhập tài khoản\\par\\par

{\\b Form fields:}\\par
• Tên đăng nhập hoặc Email\\par
• Mật khẩu\\par
• Checkbox "Ghi nhớ đăng nhập"\\par
• Link "Quên mật khẩu"\\par\\par

{\\b Tính năng:}\\par
• Validation real-time\\par
• Error handling\\par
• Loading states\\par
• Redirect sau đăng nhập\\par
• Remember me functionality\\par\\par

{\\b 6.2 Đăng Ký (RegisterPage)}\\par
{\\b Đường dẫn:} /register\\par
{\\b Mô tả:} Form đăng ký tài khoản mới\\par\\par

{\\b Form fields:}\\par
• Họ và tên\\par
• Tên đăng nhập\\par
• Email\\par
• Số điện thoại\\par
• Mật khẩu\\par
• Xác nhận mật khẩu\\par
• Địa chỉ\\par\\par

{\\b 6.3 Hồ Sơ Cá Nhân (ProfilePage)}\\par
{\\b Đường dẫn:} /profile\\par
{\\b Mô tả:} Quản lý thông tin cá nhân\\par\\par

{\\b Tính năng:}\\par
• {\\b View Mode:} Hiển thị thông tin cá nhân\\par
• {\\b Edit Mode:} Chỉnh sửa thông tin\\par
• {\\b Avatar:} Hiển thị chữ cái đầu tên\\par
• {\\b Information Fields:}\\par
  - Tên đăng nhập\\par
  - Email\\par
  - Số điện thoại (có thể edit)\\par
  - Địa chỉ (có thể edit)\\par
  - Trạng thái tài khoản\\par\\par

{\\b Actions:}\\par
• Edit profile\\par
• Save changes\\par
• Cancel editing\\par\\par

{\\b 6.4 Trang Yêu Thích (FavoritesPage)}\\par
{\\b Đường dẫn:} /favorites\\par
{\\b Mô tả:} Quản lý danh sách sản phẩm yêu thích\\par\\par

{\\b Tính năng:}\\par
• Hiển thị sản phẩm đã yêu thích\\par
• Xóa khỏi danh sách yêu thích\\par
• Chuyển đến trang chi tiết sản phẩm\\par
• Empty state khi chưa có sản phẩm yêu thích\\par\\par

{\\b 7. MÀN HÌNH HỖ TRỢ}\\par\\par

{\\b 7.1 Trang 404 (NotFoundPage)}\\par
{\\b Đường dẫn:} * (catch-all)\\par
{\\b Mô tả:} Trang lỗi khi không tìm thấy đường dẫn\\par\\par

{\\b Nội dung:}\\par
• Thông báo lỗi 404\\par
• Hướng dẫn quay về trang chủ\\par
• Tìm kiếm sản phẩm\\par\\par

{\\b THỐNG KÊ TỔNG QUAN}\\par\\par

{\\b Số lượng màn hình:} 13 màn hình chính\\par\\par

{\\b Phân loại theo chức năng:}\\par
• {\\b Màn hình chính:} 1 (HomePage)\\par
• {\\b Sản phẩm:} 2 (ProductList, ProductDetail)\\par
• {\\b Dịch vụ:} 2 (Service, Booking)\\par
• {\\b Báo giá:} 1 (PriceList)\\par
• {\\b Tin tức:} 2 (News, NewsDetail)\\par
• {\\b Tài khoản:} 4 (Login, Register, Profile, Favorites)\\par
• {\\b Hỗ trợ:} 1 (NotFound)\\par\\par

{\\b Đặc điểm kỹ thuật:}\\par
• {\\b Framework:} React + TypeScript\\par
• {\\b Styling:} SCSS Modules\\par
• {\\b UI Library:} Ant Design\\par
• {\\b State Management:} Context API\\par
• {\\b Routing:} React Router\\par
• {\\b API Integration:} Axios\\par
• {\\b Responsive:} Mobile-first approach\\par\\par

{\\b Tính năng chung:}\\par
• SEO optimization\\par
• Loading states\\par
• Error handling\\par
• Responsive design\\par
• Accessibility support\\par
• Toast notifications\\par
• Form validation\\par\\par

{\\b LUỒNG NGƯỜI DÙNG ĐIỂN HÌNH}\\par\\par

{\\b 1. Khách hàng mới:}\\par
HomePage → ProductList → ProductDetail → Register → Login → Profile\\par\\par

{\\b 2. Khách hàng đã đăng nhập:}\\par
HomePage → ServicePage → BookingPage → Profile\\par\\par

{\\b 3. Khách hàng quan tâm tin tức:}\\par
HomePage → NewsPage → NewsDetail\\par\\par

{\\b 4. Khách hàng tìm hiểu giá:}\\par
HomePage → PriceListPage → BookingPage\\par\\par

{\\i Tài liệu này được cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}}\\par
`;

// Create RTF file
const rtfDocument = rtfHeader + rtfContent + rtfFooter;

// Write the RTF file
fs.writeFileSync(path.join(__dirname, 'user-screens-documentation.rtf'), rtfDocument);

console.log('✅ Đã tạo file RTF: doc/user-screens-documentation.rtf');
console.log('📝 Bạn có thể mở file này trực tiếp trong Word');
console.log('💡 File RTF sẽ giữ nguyên định dạng khi mở trong Word'); 
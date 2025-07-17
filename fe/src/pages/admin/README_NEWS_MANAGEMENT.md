# Quản Lý Tin Tức - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống quản lý tin tức cho phép admin tạo, chỉnh sửa, xóa và quản lý các bài viết tin tức với giao diện thân thiện và đầy đủ tính năng.

## Tính Năng Chính

### 1. Danh Sách Tin Tức (`/admin/news`)

- **Xem danh sách**: Hiển thị tất cả tin tức với hình ảnh, tiêu đề, trạng thái và ngày tạo
- **Tìm kiếm**: Tìm kiếm tin tức theo tiêu đề
- **Phân trang**: Hỗ trợ phân trang với 10 tin tức mỗi trang
- **Xem chi tiết**: Xem trước nội dung tin tức trong modal
- **Chỉnh sửa**: Chuyển đến trang chỉnh sửa tin tức
- **Xóa**: Xóa tin tức với xác nhận

### 2. Thêm Tin Tức Mới (`/admin/news/add`)

- **Tiêu đề**: Nhập tiêu đề tin tức (bắt buộc)
- **Nội dung**: Sử dụng TinyMCE editor với định dạng HTML
- **Hình ảnh**: Upload hình ảnh đại diện (tùy chọn)
- **Trạng thái**: Chọn trạng thái (active, inactive, draft, published, archived)
- **Lưu**: Lưu tin tức mới

### 3. Chỉnh Sửa Tin Tức (`/admin/news/edit/:id`)

- **Tải dữ liệu**: Tự động tải thông tin tin tức hiện có
- **Chỉnh sửa**: Cập nhật tất cả thông tin tin tức
- **Hình ảnh**: Thay đổi hoặc xóa hình ảnh đại diện
- **Cập nhật**: Lưu thay đổi

## Trạng Thái Tin Tức

| Trạng thái  | Mô tả           | Màu sắc    |
| ----------- | --------------- | ---------- |
| `active`    | Hoạt động       | Xanh lá    |
| `inactive`  | Không hoạt động | Đỏ         |
| `draft`     | Bản nháp        | Cam        |
| `published` | Đã xuất bản     | Xanh dương |
| `archived`  | Đã lưu trữ      | Xám        |

## Cấu Trúc Dữ Liệu

### Backend Model (NewsEvent)

```javascript
{
  _id: String,
  Title: String (required),
  Content: String (required),
  ImageUrl: String (optional),
  Status: String (enum: ['active', 'inactive', 'draft', 'published', 'archived']),
  PublishDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Frontend Interface

```typescript
interface NewsEvent {
  _id: string;
  Title: string;
  Content: string;
  ImageUrl?: string;
  Status: "draft" | "published" | "archived" | "active" | "inactive";
  PublishDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Backend Routes

- `GET /api/tin-tuc-su-kien` - Lấy danh sách tin tức
- `GET /api/tin-tuc-su-kien/:id` - Lấy chi tiết tin tức
- `POST /api/tin-tuc-su-kien` - Tạo tin tức mới
- `PUT /api/tin-tuc-su-kien/:id` - Cập nhật tin tức
- `DELETE /api/tin-tuc-su-kien/:id` - Xóa tin tức

### Frontend Routes

- `/admin/news` - Danh sách tin tức
- `/admin/news/add` - Thêm tin tức mới
- `/admin/news/edit/:id` - Chỉnh sửa tin tức

## Tính Năng Đặc Biệt

### 1. TinyMCE Editor

- **Định dạng**: Hỗ trợ HTML với các thẻ cơ bản
- **Toolbar**: Bold, italic, lists, links, images, tables
- **Responsive**: Tự động điều chỉnh kích thước
- **Placeholder**: Hướng dẫn người dùng

### 2. Upload Hình Ảnh

- **Cloudinary**: Lưu trữ hình ảnh trên Cloudinary
- **Preview**: Xem trước hình ảnh trước khi upload
- **Validation**: Kiểm tra định dạng và kích thước file
- **Loading**: Hiển thị trạng thái upload

### 3. Responsive Design

- **Mobile**: Tối ưu cho thiết bị di động
- **Tablet**: Giao diện thích ứng cho tablet
- **Desktop**: Giao diện đầy đủ cho desktop

## CSS Classes

### NewsListPage

- `.newsListPage` - Container chính
- `.contentCard` - Card chứa bảng
- `.toolbar` - Thanh công cụ

### NewsFormPage

- `.newsFormPage` - Container chính
- `.formCard` - Card chứa form
- `.imageUploadNew` - Khu vực upload hình ảnh
- `.uploadDropAreaNew` - Vùng kéo thả
- `.imagePreview` - Xem trước hình ảnh

## Lưu Ý Kỹ Thuật

### 1. Bảo Mật

- **Authentication**: Yêu cầu đăng nhập admin
- **Authorization**: Kiểm tra quyền admin
- **File Upload**: Validate file type và size

### 2. Performance

- **Pagination**: Phân trang để tối ưu hiệu suất
- **Image Optimization**: Nén hình ảnh tự động
- **Lazy Loading**: Tải hình ảnh theo nhu cầu

### 3. UX/UI

- **Loading States**: Hiển thị trạng thái tải
- **Error Handling**: Xử lý lỗi thân thiện
- **Success Feedback**: Thông báo thành công
- **Confirmation**: Xác nhận trước khi xóa

## Troubleshooting

### Lỗi Thường Gặp

1. **Upload ảnh thất bại**

   - Kiểm tra kết nối internet
   - Kiểm tra định dạng file (JPG, PNG)
   - Kiểm tra kích thước file (< 5MB)

2. **Editor không tải**

   - Kiểm tra API key TinyMCE
   - Kiểm tra kết nối internet
   - Refresh trang

3. **Lưu tin tức thất bại**
   - Kiểm tra các trường bắt buộc
   - Kiểm tra kết nối backend
   - Kiểm tra quyền admin

### Debug

- Mở Developer Tools (F12)
- Kiểm tra Console để xem lỗi
- Kiểm tra Network tab để xem API calls
- Kiểm tra Application tab để xem localStorage

## Cập Nhật Tương Lai

1. **SEO Optimization**: Meta tags, Open Graph
2. **Rich Text Editor**: Thêm tính năng cho TinyMCE
3. **Image Gallery**: Quản lý nhiều hình ảnh
4. **Categories**: Phân loại tin tức
5. **Tags**: Gắn thẻ tin tức
6. **Comments**: Hệ thống bình luận
7. **Social Sharing**: Chia sẻ mạng xã hội
8. **Analytics**: Thống kê xem tin tức

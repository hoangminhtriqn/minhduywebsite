# Migration Guide

## Tổng quan

Migration script sẽ tạo dữ liệu mẫu cho hệ thống Minh Duy Test Drive Booking.

## Các lệnh có sẵn

### 1. Chạy migration bình thường

```bash
yarn migrate
# hoặc
node migrate.js
```

### 2. Chạy migration với force reset (xóa dữ liệu cũ)

```bash
yarn migrate:force
# hoặc
node migrate.js --force
```

### 3. Kiểm tra trạng thái migration

```bash
yarn check-migration
# hoặc
node check-migration.js
```

### 4. Chạy server (tự động chạy migration trước)

```bash
yarn start
```

## Dữ liệu được tạo

### Roles

- **admin**: Quản trị viên hệ thống
- **user**: Người dùng thông thường

### Users

- **admin**: Tài khoản quản trị (admin/admin123)
- **10 users mẫu**: Người dùng thông thường

### Product Categories

- Minh Duy Series 1, 3, 5, 7
- Minh Duy X Series (SUV/SAV)
- Minh Duy M Series (hiệu suất cao)
- Minh Duy i Series (xe điện)

### Categories

- Xe mới
- Xe đã qua sử dụng
- Dịch vụ
- Tin tức

### Products

- 50+ sản phẩm Minh Duy mẫu
- Bao gồm hình ảnh và thông tin chi tiết

### Services

- Dịch vụ bảo hành
- Dịch vụ bảo dưỡng
- Dịch vụ sửa chữa

### News & Events

- Tin tức và sự kiện mẫu

### Test Drive Orders

- 200+ đơn lái thử mẫu

## Troubleshooting

### Lỗi MONGO_URI

```
❌ MONGO_URI chưa được cấu hình
```

**Giải pháp:**

1. Kiểm tra file `.env` có tồn tại không
2. Đảm bảo `MONGO_URI` được cấu hình đúng
3. Ví dụ: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database`

### Lỗi duplicate key

```
❌ Lỗi trong quá trình migration: E11000 duplicate key error
```

**Giải pháp:**

- Migration script đã được cập nhật để kiểm tra dữ liệu hiện có
- Sử dụng `yarn migrate:force` để xóa dữ liệu cũ và tạo lại

### Kiểm tra trạng thái

```bash
yarn check-migration
```

Lệnh này sẽ hiển thị số lượng dữ liệu trong từng collection và trạng thái migration.

## Deployment

### Render

Migration sẽ tự động chạy khi deploy lên Render thông qua:

- `prestart` script trong package.json
- `startCommand` trong render.yaml

### Local Development

```bash
# Cài đặt dependencies
yarn install

# Chạy migration
yarn migrate

# Khởi động server
yarn dev
```

## Environment Variables

Đảm bảo các biến môi trường sau được cấu hình:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

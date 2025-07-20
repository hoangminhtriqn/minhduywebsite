# 🗄️ Hướng Dẫn Migration Database

## 🚀 Cách Sử Dụng

### 1. Cập nhật Connection String

Thay đổi `MONGO_URI` trong file `.env`:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/minhduy-website
```

### 2. Chạy Migration

```bash
# Sử dụng npm
npm run migrate

# Sử dụng yarn
yarn migrate

# Chạy trực tiếp
node migrate.js
```

## 🔑 Tài Khoản Đăng Nhập

### Admin

- **Username**: `admin`
- **Password**: `password123`
- **Email**: `admin@minhduy.com`

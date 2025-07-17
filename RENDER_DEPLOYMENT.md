# 🚀 Render Deployment Guide

## Backend Deployment trên Render

### Bước 1: Tạo tài khoản Render

1. Truy cập [render.com](https://render.com)
2. Đăng ký tài khoản (có thể dùng GitHub)
3. Xác nhận email

### Bước 2: Tạo Web Service

1. Vào Dashboard → New → Web Service
2. Connect GitHub repository
3. Chọn repository `DA22062025`

### Bước 3: Cấu hình Service

- **Name**: `test-drive-booking-backend`
- **Environment**: `Node`
- **Region**: `Singapore` (gần Việt Nam nhất)
- **Branch**: `master`
- **Build Command**: `cd be && npm install`
- **Start Command**: `cd be && npm run migrate && npm start`

### Bước 4: Environment Variables

Thêm các biến môi trường sau:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/test-drive-booking?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Bước 5: Deploy

1. Click "Create Web Service"
2. Đợi build và deploy (5-10 phút)
3. Kiểm tra logs nếu có lỗi

### Bước 6: Kiểm tra

- URL sẽ có dạng: `https://your-app-name.onrender.com`
- Health check: `https://your-app-name.onrender.com/api/users`
- API docs: `https://your-app-name.onrender.com/api-docs`

## Troubleshooting

### Lỗi thường gặp:

1. **Build failed**: Kiểm tra package.json trong thư mục be/
2. **MongoDB connection failed**: Kiểm tra MONGO_URI
3. **Port binding error**: Đảm bảo sử dụng process.env.PORT

### Logs:

- Vào service → Logs để xem chi tiết
- Có thể restart service nếu cần

## Cập nhật Code

- Push code lên GitHub
- Render sẽ auto-deploy
- Hoặc manual deploy từ dashboard

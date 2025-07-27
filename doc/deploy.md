# Hướng dẫn Deploy Backend lên Render

## Bước 1: Chuẩn bị

### 1.1. Tạo tài khoản Render

- Truy cập: https://render.com/
- Đăng ký tài khoản (có thể dùng GitHub)

### 1.2. Chuẩn bị MongoDB

- Tạo MongoDB Atlas cluster: https://cloud.mongodb.com/

## Bước 2: Deploy Backend

### 2.1. Push code lên GitHub

```bash
# Push toàn bộ project (bao gồm cả be/, fe/, doc/)
git add .
git commit -m "Prepare for Render deployment with yarn"
git push origin master
```

### 2.2. Deploy trên Render

1. Truy cập Render Dashboard
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Chọn repository của bạn
5. Chọn branch `master`

### 2.3. Cấu hình Service

- **Name**: `test-drive-booking-backend`
- **Environment**: `Node`
- **Region**: `Singapore` (gần Việt Nam nhất)
- **Branch**: `master`
- **Build Command**: `cd be && yarn install`
- **Start Command**: `cd be && yarn migrate && yarn start`

### 2.4. Cấu hình Environment Variables

Trong Render Dashboard, thêm các biến môi trường:

```
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2.5. Deploy

1. Click "Create Web Service"
2. Đợi build và deploy (5-10 phút)
3. Kiểm tra logs nếu có lỗi

## Bước 3: Kiểm tra Deployment

### 3.1. Health Check

- API sẽ có endpoint: `https://your-app.onrender.com/api/users`
- Swagger docs: `https://your-app.onrender.com/api-docs`

### 3.2. Test API

```bash
curl https://your-app.onrender.com/api/users
```

## Bước 4: Cấu hình Frontend

### 4.1. Cập nhật API URL trong Frontend

Trong file `fe/src/api/config.ts`, thay đổi:

```typescript
export const API_BASE_URL = "https://your-app.onrender.com/api";
```

### 4.2. Cập nhật CORS trong Backend

Trong `be/server.js`, CORS đã được cấu hình cho Render domains.

## Troubleshooting

### Lỗi thường gặp:

1. **Build failed**:

   - Kiểm tra package.json trong thư mục be/
   - Đảm bảo có `start` script trong `package.json`
   - Kiểm tra yarn.lock file có tồn tại

2. **MongoDB connection failed**: Kiểm tra MONGO_URI
3. **Port binding error**: Đảm bảo sử dụng process.env.PORT
4. **Migrate failed**:
   - Kiểm tra MONGO_URI có đúng không
   - Xem logs để biết lỗi cụ thể
   - Có thể chạy lại migrate bằng cách redeploy

### Logs:

- Vào service → Logs để xem chi tiết
- Có thể restart service nếu cần

## Monitoring

### Render Dashboard:

- CPU/Memory usage
- Request logs
- Error tracking

### Health Checks:

- Render tự động monitor endpoint `/api/users`
- Nếu fail → auto restart

## Cost Optimization

### Free Tier:

- 750 hours/month
- 512MB RAM
- Shared CPU

### Upgrade khi cần:

- $7/month cho 1GB RAM
- $15/month cho 2GB RAM

## Yarn vs NPM

### Tại sao sử dụng Yarn:

- **Faster**: Yarn cài đặt dependencies nhanh hơn
- **Reliable**: Lock file đảm bảo version consistency
- **Secure**: Kiểm tra integrity của packages
- **Offline**: Có thể cài đặt offline nếu đã cache

### Cấu hình Yarn trong Render:

- **Build Command**: `cd be && yarn install`
- **Start Command**: `cd be && yarn migrate && yarn start`
- **Lock file**: `yarn.lock` được commit vào git

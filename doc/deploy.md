# Hướng dẫn Deploy Backend lên Railway

## Bước 1: Chuẩn bị

### 1.1. Tạo tài khoản Railway

- Truy cập: https://railway.app/
- Đăng ký tài khoản (có thể dùng GitHub)

### 1.2. Chuẩn bị MongoDB

- Tạo MongoDB Atlas cluster: https://cloud.mongodb.com/
- Hoặc sử dụng Railway MongoDB service

## Bước 2: Deploy Backend

### 2.1. Push code lên GitHub

```bash
# Push toàn bộ project (bao gồm cả be/, fe/, doc/)
git add .
git commit -m "Prepare for Railway deployment"
git push origin master
```

### 2.2. Deploy trên Railway

1. Truy cập Railway Dashboard
2. Click "New Project"
3. Chọn "Deploy from GitHub repo"
4. Chọn repository của bạn
5. Chọn branch `master`

**Lưu ý:** Railway sẽ sử dụng Dockerfile trong thư mục `be/` để build và deploy backend

### 2.3. Cấu hình Environment Variables

Trong Railway Dashboard, thêm các biến môi trường:

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Lưu ý:** Railway sẽ tự động chạy migrate khi deploy lần đầu để tạo dữ liệu mẫu.

### 2.4. Cấu hình Domain

- Railway sẽ tự động tạo domain
- Có thể custom domain trong Settings

## Bước 3: Kiểm tra Deployment

### 3.1. Health Check

- API sẽ có endpoint: `https://your-app.railway.app/api/users`
- Swagger docs: `https://your-app.railway.app/api-docs`

### 3.2. Test API

```bash
curl https://your-app.railway.app/api/users
```

## Bước 4: Cấu hình Frontend

### 4.1. Cập nhật API URL trong Frontend

Trong file `fe/src/api/config.ts`, thay đổi:

```typescript
export const API_BASE_URL = "https://your-app.railway.app/api";
```

### 4.2. Cập nhật CORS trong Backend

Trong `be/server.js`, cập nhật CORS origins:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-frontend-domain.vercel.app", // Thêm domain frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
```

## Troubleshooting

### Lỗi thường gặp:

1. **Nixpacks build failed**:

   - Đảm bảo file `railway.json` ở thư mục gốc
   - Kiểm tra `package.json` trong thư mục `be/` có đúng cấu trúc
   - Đảm bảo có `start` script trong `package.json`

2. **MongoDB connection failed**: Kiểm tra MONGO_URI
3. **Port binding error**: Railway tự động set PORT
4. **Build failed**: Kiểm tra package.json scripts
5. **Migrate failed**:
   - Kiểm tra MONGO_URI có đúng không
   - Xem logs để biết lỗi cụ thể
   - Có thể chạy lại migrate bằng cách redeploy

### Logs:

- Xem logs trong Railway Dashboard
- Hoặc dùng Railway CLI: `railway logs`

## Monitoring

### Railway Dashboard:

- CPU/Memory usage
- Request logs
- Error tracking

### Health Checks:

- Railway tự động monitor endpoint `/api/users`
- Nếu fail 3 lần → auto restart

## Cost Optimization

### Free Tier:

- 500 hours/month
- 512MB RAM
- Shared CPU

### Upgrade khi cần:

- $5/month cho 1GB RAM
- $10/month cho 2GB RAM

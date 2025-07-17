# Hướng dẫn Deploy Backend lên Render với Yarn

## Cấu hình Render

### 1. Tạo Web Service trên Render

1. Truy cập https://render.com/
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Chọn repository: `hoangminhtriqn/minhduywebsite`

### 2. Cấu hình Service

- **Name**: `test-drive-booking-backend`
- **Environment**: `Node`
- **Region**: `Singapore` (gần Việt Nam nhất)
- **Branch**: `main`
- **Root Directory**: `be`
- **Build Command**: `yarn install`
- **Start Command**: `yarn migrate && yarn start`

### 3. Environment Variables

Thêm các biến môi trường trong Render Dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Troubleshooting

### Lỗi Build thường gặp:

1. **Yarn not found**:

   - Render tự động cài đặt yarn
   - Đảm bảo sử dụng `yarn install` thay vì `npm install`

2. **Migrate failed**:

   - Kiểm tra MONGO_URI có đúng không
   - Xem logs để biết lỗi cụ thể
   - Có thể chạy lại migrate bằng cách redeploy

3. **Port binding error**:

   - Đảm bảo sử dụng `process.env.PORT` trong server.js
   - Render sẽ tự động set PORT

4. **Dependencies not found**:
   - Kiểm tra `yarn.lock` file có tồn tại
   - Đảm bảo `package.json` có đúng dependencies

### Logs:

- Vào service → Logs để xem chi tiết
- Có thể restart service nếu cần

## Cấu hình Files

### 1. be/package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node migrate.js",
    "migrate:force": "node migrate.js --force",
    "build": "yarn install",
    "postinstall": "yarn migrate"
  }
}
```

### 2. be/.dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.nyc_output
coverage
.DS_Store
*.log
dist
build
.vscode
.idea
fe/
doc/
```

### 3. render.yaml

```yaml
services:
  - type: web
    name: test-drive-booking-backend
    env: node
    plan: free
    buildCommand: cd be && yarn install
    startCommand: cd be && yarn migrate && yarn start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

## Deploy Process

1. **Push code lên GitHub**:

   ```bash
   git add .
   git commit -m "Configure for Render deployment with yarn"
   git push origin main
   ```

2. **Render sẽ tự động**:

   - Clone repository
   - Chạy `yarn install` trong thư mục `be/`
   - Chạy `yarn migrate` để tạo dữ liệu
   - Chạy `yarn start` để khởi động server

3. **Kiểm tra deployment**:
   - API: `https://your-app.onrender.com/api/users`
   - Swagger: `https://your-app.onrender.com/api-docs`
   - Health check: `https://your-app.onrender.com/api/health`

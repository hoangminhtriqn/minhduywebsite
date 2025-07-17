# 🚀 Render Frontend Deployment Guide

## Deploy Frontend lên Render

### Bước 1: Tạo Static Site trên Render

1. Vào [render.com](https://render.com)
2. Click **New** → **Static Site**
3. Connect GitHub repository `DA22062025`

### Bước 2: Cấu hình Static Site

- **Name**: `test-drive-booking-frontend`
- **Build Command**: `cd fe && npm install && npm run build`
- **Publish Directory**: `fe/dist`
- **Branch**: `master`

### Bước 3: Environment Variables

Thêm biến môi trường:

```
VITE_API_BASE_URL=https://da22062025.onrender.com/api
```

### Bước 4: Deploy

1. Click **Create Static Site**
2. Đợi build và deploy (3-5 phút)
3. URL sẽ có dạng: `https://your-app-name.onrender.com`

## Ưu điểm của Render Frontend:

- ✅ **Cùng domain** với backend (không có CORS issues)
- ✅ **Free tier** tốt
- ✅ **Auto-deploy** từ GitHub
- ✅ **HTTPS tự động**
- ✅ **Custom domains**

## Troubleshooting:

1. **Build failed**: Kiểm tra Node.js version (nên dùng 18+)
2. **CORS issues**: Không còn vì cùng domain
3. **Routing issues**: File `_redirects` đã được tạo

## Sau khi deploy:

- Frontend: `https://your-frontend-name.onrender.com`
- Backend: `https://da22062025.onrender.com`
- Cả hai sẽ hoạt động cùng nhau không có CORS issues!

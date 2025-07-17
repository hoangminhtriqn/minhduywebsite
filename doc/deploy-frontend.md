# Hướng dẫn Deploy Frontend lên Vercel

## Phân tích Source Code Frontend

### Công nghệ sử dụng:

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Ant Design** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **SCSS** - Styling
- **Axios** - HTTP client

### Cấu trúc chính:

- **Pages**: Home, Login, Register, Products, Admin Dashboard
- **Components**: Layout, Navigation, Product Cards
- **Contexts**: Auth, Theme, Favorites
- **API**: Axios config với interceptors
- **Routing**: Public routes + Protected routes + Admin routes

## Bước 1: Chuẩn bị

### 1.1. Tạo tài khoản Vercel

- Truy cập: https://vercel.com/
- Đăng ký tài khoản (có thể dùng GitHub)

### 1.2. Cài đặt Vercel CLI (tùy chọn)

```bash
npm install -g vercel
```

## Bước 2: Cấu hình Frontend

### 2.1. Cập nhật API URL

Trong file `fe/src/api/config.ts`, thay đổi:

```typescript
export const API_BASE_URL = isDevelopment
  ? "http://localhost:3000/api"
  : "https://your-railway-app.railway.app/api"; // Thay bằng URL backend thực tế
```

### 2.2. Cập nhật Vercel config

Trong file `fe/vercel.json`, thay đổi:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.railway.app/api/$1"
    }
  ]
}
```

## Bước 3: Deploy Frontend

### 3.1. Push code lên GitHub

```bash
cd fe
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

### 3.2. Deploy trên Vercel

1. Truy cập Vercel Dashboard
2. Click "New Project"
3. Import repository từ GitHub
4. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `fe`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3. Cấu hình Environment Variables

Trong Vercel Dashboard, thêm:

```
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
```

## Bước 4: Cấu hình Backend CORS

### 4.1. Cập nhật CORS trong Backend

Trong file `be/server.js`, thêm domain Vercel:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-app.vercel.app", // Thêm domain Vercel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
```

## Bước 5: Kiểm tra Deployment

### 5.1. Test Frontend

- Truy cập: `https://your-app.vercel.app`
- Kiểm tra các trang chính: Home, Login, Products

### 5.2. Test API Connection

- Mở Developer Tools → Network
- Kiểm tra API calls có thành công không
- Kiểm tra CORS errors

## Troubleshooting

### Lỗi thường gặp:

1. **Build failed**:

   - Kiểm tra TypeScript errors
   - Kiểm tra import paths
   - Xem build logs trong Vercel

2. **API connection failed**:

   - Kiểm tra API_BASE_URL
   - Kiểm tra CORS configuration
   - Kiểm tra Railway backend có hoạt động không

3. **Routing issues**:

   - Kiểm tra `vercel.json` rewrites
   - Đảm bảo SPA routing hoạt động

4. **Environment variables**:
   - Kiểm tra VITE\_ prefix cho client-side variables
   - Redeploy sau khi thay đổi env vars

### Logs:

- Xem logs trong Vercel Dashboard
- Function logs cho API calls
- Build logs cho deployment issues

## Performance Optimization

### Vercel Features:

- **Edge Network**: CDN toàn cầu
- **Automatic HTTPS**: SSL certificates
- **Preview Deployments**: Test trước khi merge
- **Analytics**: Performance monitoring

### Build Optimization:

- **Code splitting**: Tự động với Vite
- **Tree shaking**: Loại bỏ unused code
- **Image optimization**: Tự động optimize images

## Monitoring

### Vercel Analytics:

- Page views
- Performance metrics
- Error tracking
- Real user monitoring

### Custom Domain:

1. Thêm domain trong Vercel Dashboard
2. Cấu hình DNS records
3. SSL certificate tự động

## Cost

### Free Tier:

- **Unlimited deployments**
- **100GB bandwidth/month**
- **100GB storage**
- **Custom domains**

### Pro Plan ($20/month):

- **Unlimited bandwidth**
- **Team collaboration**
- **Advanced analytics**
- **Priority support**

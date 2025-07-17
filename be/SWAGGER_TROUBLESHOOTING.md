# Swagger Troubleshooting Guide

## Vấn đề: Không map được URL nào lên Swagger

### 🔍 Kiểm tra từng bước:

#### 1. **Cài đặt Dependencies**

```bash
cd be
npm install
```

#### 2. **Kiểm tra cấu hình Swagger**

Chạy test script để kiểm tra:

```bash
node test-swagger.js
```

#### 3. **Kiểm tra file paths**

Đảm bảo file `config/swagger.js` có đúng đường dẫn:

```javascript
apis: [
  path.join(__dirname, "../routes/*.js"),
  path.join(__dirname, "../controllers/*.js"),
  path.join(__dirname, "../models/*.js"),
  path.join(__dirname, "../docs/*.js"),
];
```

#### 4. **Kiểm tra JSDoc Comments**

Đảm bảo các file routes có JSDoc comments đúng format:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success
 */
```

### 🚨 Các lỗi thường gặp:

#### **Lỗi 1: "No paths found"**

**Nguyên nhân:**

- JSDoc comments không đúng format
- File paths không đúng
- Dependencies chưa được cài đặt

**Giải pháp:**

1. Kiểm tra format JSDoc comments
2. Đảm bảo `@swagger` annotation đúng
3. Kiểm tra đường dẫn file trong `apis` array

#### **Lỗi 2: "Module not found"**

**Nguyên nhân:** Dependencies chưa được cài đặt

**Giải pháp:**

```bash
npm install swagger-jsdoc swagger-ui-express
```

#### **Lỗi 3: "Cannot read property 'paths'"**

**Nguyên nhân:** Cấu hình Swagger không đúng

**Giải pháp:**

1. Kiểm tra file `config/swagger.js`
2. Đảm bảo `swaggerJsdoc(options)` được gọi đúng cách

### 🔧 Script tự động:

Chạy script setup để tự động kiểm tra và cài đặt:

```bash
node setup-swagger.js
```

### 📋 Checklist kiểm tra:

- [ ] Dependencies đã được cài đặt (`swagger-jsdoc`, `swagger-ui-express`)
- [ ] File `config/swagger.js` tồn tại và đúng cấu hình
- [ ] File `server.js` đã import và sử dụng Swagger
- [ ] Các file routes có JSDoc comments
- [ ] Đường dẫn trong `apis` array đúng
- [ ] Server đã được khởi động
- [ ] Truy cập `http://localhost:3000/api-docs`

### 🎯 Test nhanh:

1. **Tạo file test đơn giản:**

```javascript
// test-simple.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
console.log("Paths found:", Object.keys(specs.paths || {}));
```

2. **Chạy test:**

```bash
node test-simple.js
```

### 📞 Nếu vẫn không hoạt động:

1. Kiểm tra console errors khi khởi động server
2. Đảm bảo tất cả file routes có ít nhất một JSDoc comment
3. Thử restart server sau khi thêm documentation
4. Kiểm tra version của Node.js (yêu cầu Node.js 12+)

### 🆘 Debug mode:

Thêm debug logging vào `server.js`:

```javascript
const specs = swaggerJsdoc(options);
console.log("Swagger specs:", JSON.stringify(specs, null, 2));
```

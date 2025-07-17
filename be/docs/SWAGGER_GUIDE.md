# Hướng dẫn sử dụng Swagger cho Test Drive Booking API

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Khởi động server:

```bash
npm run dev
```

3. Truy cập Swagger UI:

```
http://localhost:3000/api-docs
```

## Cấu trúc Swagger

### 1. File cấu hình chính

- `config/swagger.js`: Cấu hình chính cho Swagger
- Định nghĩa thông tin API, servers, schemas, security schemes

### 2. Documentation cho Routes

- Thêm JSDoc comments vào các file routes
- Sử dụng annotations `@swagger` để mô tả endpoints

## Cách thêm Documentation cho Route mới

### Bước 1: Thêm Schema (nếu cần)

Trong file route hoặc controller, thêm:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     YourModel:
 *       type: object
 *       properties:
 *         field1:
 *           type: string
 *           description: Description of field1
 *         field2:
 *           type: number
 *           description: Description of field2
 */
```

### Bước 2: Thêm Tags

```javascript
/**
 * @swagger
 * tags:
 *   name: YourTag
 *   description: Description of your tag
 */
```

### Bước 3: Document Endpoint

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Brief description
 *     tags: [YourTag]
 *     parameters:
 *       - in: query
 *         name: param1
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/YourModel'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

## Các loại HTTP Methods

### GET Request

```javascript
/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get all resources
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success
 */
```

### POST Request

```javascript
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create new resource
 *     tags: [Resource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 */
```

### PUT Request

```javascript
/**
 * @swagger
 * /api/resource/{id}:
 *   put:
 *     summary: Update resource
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 */
```

### DELETE Request

```javascript
/**
 * @swagger
 * /api/resource/{id}:
 *   delete:
 *     summary: Delete resource
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
```

## Authentication

### Bearer Token

```javascript
/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Protected endpoint
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
```

## Response Schemas

### Success Response

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 */
```

### Error Response

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 */
```

## Best Practices

1. **Tổ chức Tags**: Nhóm các endpoints liên quan vào cùng một tag
2. **Mô tả rõ ràng**: Viết summary và description chi tiết
3. **Validation**: Mô tả các validation rules trong schema
4. **Error Handling**: Document tất cả các error responses có thể
5. **Examples**: Cung cấp examples cho request/response
6. **Security**: Chỉ định security requirements cho protected endpoints

## Testing với Swagger UI

1. Mở `http://localhost:3000/api-docs`
2. Chọn endpoint muốn test
3. Click "Try it out"
4. Điền parameters/body nếu cần
5. Click "Execute"
6. Xem response

## Troubleshooting

### Swagger không load được

- Kiểm tra file `config/swagger.js` có đúng syntax không
- Đảm bảo đã import đúng trong `server.js`
- Kiểm tra console errors

### Documentation không hiển thị

- Đảm bảo JSDoc comments đúng format
- Kiểm tra đường dẫn trong `apis` array của swagger config
- Restart server sau khi thêm documentation mới

### Authentication issues

- Đảm bảo đã cấu hình `securitySchemes` trong swagger config
- Kiểm tra middleware authentication hoạt động đúng

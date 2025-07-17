FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --omit=dev

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"] 
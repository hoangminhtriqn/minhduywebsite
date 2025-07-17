FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files từ thư mục be
COPY be/package*.json ./

# Cài đặt dependencies
RUN yarn install --production

# Copy toàn bộ source code từ thư mục be
COPY be/ .

# Expose port
EXPOSE 3000

# Start command with migration
CMD ["sh", "-c", "yarn migrate && yarn start"] 
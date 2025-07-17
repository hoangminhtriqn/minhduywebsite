FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy toàn bộ source code trước
COPY . .

# Cài đặt dependencies với yarn
RUN yarn install --frozen-lockfile

# Expose port
EXPOSE 3000

# Start command
CMD ["yarn", "start"] 
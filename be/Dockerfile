FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Cài đặt dependencies với yarn
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["yarn", "start"] 
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy backend source code
COPY be/ .

# Cài đặt dependencies với yarn
RUN yarn install --frozen-lockfile

# Expose port
EXPOSE 3000

# Start command with migration
CMD ["sh", "-c", "yarn migrate:force && yarn start"] 
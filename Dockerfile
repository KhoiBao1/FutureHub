# Sử dụng image Node.js
FROM node:16

# Đặt thư mục làm việc trong container
WORKDIR /FutureHub

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng 
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]

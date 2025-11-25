# Giai đoạn 1: BUILD (Biên dịch mã nguồn Vue/Vite)
# Sử dụng Image Node.js chính thức làm nền
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt dependency
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Biên dịch ứng dụng (Tạo ra thư mục dist/ chứa các file tĩnh)
RUN npm run build


# Giai đoạn 2: SERVE (Phục vụ các file tĩnh bằng Nginx)
# Sử dụng Image Nginx siêu nhẹ làm nền
FROM nginx:alpine

# Xóa các file cấu hình mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép cấu hình Nginx tùy chỉnh (Xem Bước 3)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép các file tĩnh đã biên dịch từ giai đoạn 'builder' vào thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở cổng 80 (cổng HTTP mặc định)
EXPOSE 80

# Chạy Nginx khi container khởi động
CMD ["nginx", "-g", "daemon off;"]

# Build Stage

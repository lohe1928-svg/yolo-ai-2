# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

# Cài dependencies chính xác theo package-lock.json
RUN npm ci


COPY . .

# Vite build React thành các file static trong /app/dist
RUN npm run build


# Stage 2: Serve
FROM nginx:alpine

# Chỉ lấy kết quả build từ Stage 1, không mang Node.js/node_modules sang
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Chạy Nginx ở foreground để container tiếp tục running
CMD ["nginx", "-g", "daemon off;"]
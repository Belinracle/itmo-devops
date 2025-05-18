# Stage 1: Сборка фронтенда
FROM node:18 as builder

WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники
COPY . .

# Собираем проект
RUN npm run build

# Stage 2: Отдаем статику через Nginx
FROM nginx:latest

# Копируем наш кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем результат сборки из первой стадии
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспортируем порт
EXPOSE 80
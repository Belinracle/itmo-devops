# Stage 1: Сборка фронтенда с помощью Node.js
FROM node:18 as builder

WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники
COPY . .

# Устанавливаем base для Vite через env или vite.config.js
# (смотри ниже как это сделать)

# Собираем проект
RUN npm run build

# Stage 2: Отдаем статику через Nginx
FROM nginx:latest

# Копируем наш кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем результат сборки из первой стадии
COPY --from=builder /app/dist /etc/nginx/html

EXPOSE 80
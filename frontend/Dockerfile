FROM node:20 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY ./ ./
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM node:20 AS runner

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

CMD ["serve", "dist"]
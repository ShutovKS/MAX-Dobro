# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Копируем скомпилированный код из стадии сборки
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 10000

CMD ["node", "dist/index.js"]
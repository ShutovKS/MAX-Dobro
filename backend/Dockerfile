# Stage 1: Установка зависимостей
FROM node:20-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# --------------------------------------------------------------------

# Stage 2: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma
COPY . .

RUN npm run build

# Stage 3: Финальный образ для production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=deps /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["node", "dist/main"]
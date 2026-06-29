# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Dummy URL satisfies prisma.config.ts guard — generate doesn't need a real DB
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx prisma generate
RUN npm run build

# Stage 2: production — v2
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7860

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 7860

ENTRYPOINT ["./entrypoint.sh"]

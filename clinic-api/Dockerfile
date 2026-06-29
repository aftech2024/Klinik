FROM node:20-alpine
WORKDIR /app

ENV PORT=7860

COPY package*.json ./
RUN npm ci

COPY . .
# Dummy URL for prisma generate — real URL injected at runtime via secrets
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev

ENV NODE_ENV=production

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 7860
ENTRYPOINT ["./entrypoint.sh"]

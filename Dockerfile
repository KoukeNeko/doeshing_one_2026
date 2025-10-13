# syntax=docker/dockerfile:1.7

FROM node:20-slim AS deps
ENV PYTHON=python3
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl libssl-dev \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
ENV PYTHON=python3
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl libssl-dev \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doeshing?schema=public"
ENV DIRECT_URL="postgresql://postgres:postgres@localhost:5432/doeshing"
ENV NEXTAUTH_SECRET="change-me"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_SITE_URL="http://localhost:3000"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

CMD ["npm", "run", "start"]

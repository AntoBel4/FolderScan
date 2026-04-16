# docker/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || true
COPY . .
RUN npm run build || true

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm ci --production || true
ENTRYPOINT ["node", "dist/cli/index.js"]

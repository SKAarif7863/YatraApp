# Simple production Dockerfile for the API server
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

COPY server ./server

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "server/index.js"]

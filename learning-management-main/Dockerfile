######### Multi-stage Dockerfile for fullstack LMS #########
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/ .
RUN npm ci --silent
RUN npm run build

FROM node:20-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/ ./backend/
RUN cd backend && npm ci --only=production --silent

# copy frontend dist into backend/client so server can serve it
COPY --from=frontend-build /app/frontend/dist ./backend/client

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]

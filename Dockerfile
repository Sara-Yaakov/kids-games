# Build the Angular client
FROM node:24-slim AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

# Runtime: API server that also serves the built client
FROM node:24-slim
ENV NODE_ENV=production \
    PORT=3000 \
    DB_FILE=/data/db.json
WORKDIR /app
COPY server/package*.json server/
RUN npm ci --prefix server --omit=dev
COPY server/src server/src
COPY --from=client /app/client/dist client/dist
# Runs as root because hosting volumes (e.g. Railway) are mounted root-owned.
EXPOSE 3000
CMD ["node", "server/src/index.js"]

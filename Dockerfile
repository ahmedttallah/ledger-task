# ---- Base Image ----
FROM node:22-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (to leverage Docker cache)
COPY package*.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Copy .env.example and rename to .env (for container runtime)
RUN cp .env.example .env

# ---- Build Stage ----
FROM base AS build
RUN yarn build

# ---- Production Image ----
FROM node:22-alpine AS prod

WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy .env.example as .env into the prod image
COPY .env.example .env

# Expose app port
EXPOSE 8001

# Start the app
CMD ["node", "dist/main.js"]

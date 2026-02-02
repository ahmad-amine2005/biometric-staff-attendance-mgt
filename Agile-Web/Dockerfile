# Multi-stage build for Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Node.js http-server
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy built app from build stage
COPY --from=build /app/dist/attendflow/browser ./dist

# Expose port 4300
EXPOSE 4300

# Start http-server on port 4300
CMD ["http-server", "dist", "-p", "4300", "-a", "0.0.0.0", "--proxy", "http://localhost:4300?"]


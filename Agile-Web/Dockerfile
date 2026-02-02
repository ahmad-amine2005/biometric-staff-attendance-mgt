# Multi-stage build for Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Node.js serve package
FROM node:20-alpine

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/dist/attendflow/browser ./dist

# Expose port 4300
EXPOSE 4300

# Start serve with SPA routing (-s flag)
CMD ["serve", "-s", "dist", "-l", "4300"]


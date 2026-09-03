# Use Node.js 20 (LTS) as base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the compiled app
CMD ["node", "dist/index.js"]

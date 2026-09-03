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

# Expose port 3000
EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]

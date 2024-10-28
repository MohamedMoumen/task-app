# Use the official Node.js 18 image as the base image
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --foce

# Copy the entire project directory
COPY . .

# Build the Next.js app
RUN npm run build

# Use a minimal Node.js image for the final production stage
FROM node:18-slim AS runner

# Set environment variables
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy only the build output and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]

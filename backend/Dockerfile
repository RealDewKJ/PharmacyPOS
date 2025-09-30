FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
RUN bun prisma generate

# Build the application
RUN bun run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]

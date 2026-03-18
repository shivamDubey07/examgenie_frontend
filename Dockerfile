# Development stage
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run dev server (HMR enabled)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

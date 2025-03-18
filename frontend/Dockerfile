FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# TypeScript build
RUN npm run build

# Expose the port Vite uses
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
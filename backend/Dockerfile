# Use a small Node image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install only production deps first (better layer cache)
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy the rest of the source code
COPY . .

# Port your app listens on (keep in sync with server.js)
EXPOSE 3000

# Start the app (adjust if your entry is different)
CMD ["node", "server.js"]

FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite with host binding for Docker access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

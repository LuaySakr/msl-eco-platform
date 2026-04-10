FROM node:18-alpine

WORKDIR /app

<<<<<<< HEAD
# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the frontend port
EXPOSE 2468

# Start the frontend application
CMD ["npm", "start"]
=======
# Copy package files
COPY package*.json ./

# Install dependencies (ignoring scripts during install to avoid triggering concurrently/start-all)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the frontend port from README
EXPOSE 2468

# Start the frontend dev server as per README
CMD ["npm", "run", "client"]
>>>>>>> cf1a2a7 (add Docker configuration files for backend and frontend services)

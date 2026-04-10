FROM node:18-alpine

WORKDIR /app

<<<<<<< HEAD
# Copy dependency files
=======
# Copy package files and .npmrc for dependencies
>>>>>>> cf1a2a7 (add Docker configuration files for backend and frontend services)
COPY package*.json .npmrc ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

<<<<<<< HEAD
# Expose the backend port
EXPOSE 1357

# Start the backend server
=======
# Expose the default backend port from config.js
EXPOSE 1357

# Start the server as per README
>>>>>>> cf1a2a7 (add Docker configuration files for backend and frontend services)
CMD ["npm", "start"]

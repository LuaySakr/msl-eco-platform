FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json .npmrc ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 1357

# Start the backend server
CMD ["npm", "start"]

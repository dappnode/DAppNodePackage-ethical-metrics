# Dockerfile
FROM node:alpine3.18
# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY backend/package*.json backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy the backend code
COPY backend/ backend/

# Copy the frontend files
COPY index.html .
COPY dappnode.png .

# Expose the port on which the Node.js server is running
EXPOSE 3000

# Start the Node.js server
CMD ["node", "backend/api.js"]
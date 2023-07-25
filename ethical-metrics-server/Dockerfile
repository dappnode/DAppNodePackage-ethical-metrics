# Use a multi-stage build
# First stage: Build the application
FROM node:alpine3.18 AS build

# Set the working directory for the build stage
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY src/package*.json src/

# Install backend dependencies
RUN cd src && npm install

# Copy the code
COPY src/ src/

# Second stage: Create the final runtime image
FROM node:alpine3.18 AS runtime

# Set the working directory for the runtime stage
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/src/ src/
COPY index.html .

# Expose the port on which the Node.js server is running
EXPOSE 3000

# Start the Node.js server
CMD ["node", "src/api.js"]

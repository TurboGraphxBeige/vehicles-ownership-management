# Use the official Node.js image.
FROM node:24 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and build
RUN npm install
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:24

# Set the working directory
WORKDIR /usr/src/app

# Copy built content from previous stage
COPY --from=build /usr/src/app .

# Expose the port your app runs on
EXPOSE 3001

# Run the application
CMD [ "npm", "start" ]
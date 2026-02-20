# Use the official Node.js image
FROM node:24 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and build the client
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files to Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 5174

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
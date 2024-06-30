# Use the official Node.js image
FROM node:16

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the client code
COPY . .

# Build the React app using Vite
RUN npm run build

# Install `serve` to serve the static files
RUN npm install -g serve

# Expose the port
EXPOSE 5000

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "5000"]
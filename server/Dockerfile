# Use the official Node.js image (matches engines.node 22.x in package.json)
FROM node:22

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
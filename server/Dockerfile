# Use an official Node runtime as a parent image (Alpine for a smaller footprint)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the server runs on
EXPOSE 5001

# Command to run the backend server
CMD ["npm", "start"]

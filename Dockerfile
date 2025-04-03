# Use official Node.js image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have it)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app uses (e.g., 3000)
EXPOSE 5000

# Command to start your app
CMD ["npm", "start"]
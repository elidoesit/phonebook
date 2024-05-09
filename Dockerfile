# Use a base image with Node.js installed
ARG NODE_VERSION=16.19.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Set production environment
ENV NODE_ENV="production"

# Set working directory
WORKDIR /app

# Install necessary packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python

# Copy package files and install dependencies
COPY --link package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY --link . .

# Build the frontend
FROM base as build_frontend

# Change directory to the frontend directory
WORKDIR /app/phonebook_front

# Install frontend dependencies and build
RUN npm ci && npm run build

# Final stage for app image
FROM base

# Copy built frontend application
COPY --from=build_frontend /app/phonebook_front/build /app/phonebook_front/build

# Expose port 3000 (assuming frontend runs on port 3000)
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]



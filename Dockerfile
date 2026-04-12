# Stage 1: Build the React Application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built output from Vite (usually dist/) to Nginx document root
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port (default nginx port is 80, but we can map it via compose)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Use the nginx base image
FROM nginx:1.25
# Copy nginx configuration file
COPY ./nginx-conf/default.conf /etc/nginx/conf.d/default.conf

# Copy frontend files
COPY ./frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

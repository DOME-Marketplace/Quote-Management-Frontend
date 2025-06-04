# Use official nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy application files
COPY index.html .
COPY styles.css .
COPY quotes.js .
COPY products.html .
COPY products.js .
COPY login.html .

# Copy custom nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
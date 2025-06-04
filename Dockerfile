# Use official nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy application files
COPY src/index.html ./index.html
COPY src/styles.css ./styles.css
COPY src/css/ ./css/
COPY src/js/ ./js/
COPY src/products.html ./products.html
COPY src/login.html ./login.html

# Copy legacy files for backwards compatibility
COPY quotes.js ./quotes.js
COPY products.js ./products.js

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
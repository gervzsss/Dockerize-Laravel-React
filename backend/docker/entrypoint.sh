#!/bin/bash

# Exit on error
set -e

echo "Starting Laravel application..."

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan db:show --database=mysql 2>/dev/null; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "Database is up - continuing..."

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run seeders if needed (optional - uncomment if you want to seed on startup)
# echo "Running seeders..."
# php artisan db:seed --force

# Cache configuration for better performance
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM in the background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'

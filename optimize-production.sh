#!/bin/bash

# ===========================================
# PRODUCTION OPTIMIZATION SCRIPT FOR LARAVEL
# ===========================================
# Run this script after deploying to production server
# Usage: bash optimize-production.sh

echo "🚀 Starting Laravel Production Optimization..."

# Check if running in production directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the Laravel root directory."
    exit 1
fi

echo ""
echo "📦 Step 1: Installing Composer dependencies (production only)..."
composer install --optimize-autoloader --no-dev --no-interaction

echo ""
echo "🔧 Step 2: Caching configuration..."
php artisan config:cache

echo ""
echo "🛤️  Step 3: Caching routes..."
php artisan route:cache

echo ""
echo "👁️  Step 4: Caching views..."
php artisan view:cache

echo ""
echo "🎯 Step 5: Caching events..."
php artisan event:cache

echo ""
echo "📊 Step 6: Running database migrations..."
php artisan migrate --force

echo ""
echo "🔗 Step 7: Creating storage symlink..."
php artisan storage:link 2>/dev/null || echo "Storage link already exists"

echo ""
echo "🧹 Step 8: Clearing old caches..."
php artisan cache:clear

echo ""
echo "⚡ Step 9: Optimizing autoloader..."
php artisan optimize

echo ""
echo "🎨 Step 10: Building frontend assets..."
if [ -f "package.json" ]; then
    npm ci --production=false 2>/dev/null || npm install
    npm run build
else
    echo "⚠️  No package.json found, skipping frontend build"
fi

echo ""
echo "🔒 Step 11: Setting correct permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || echo "Could not change ownership (run as root if needed)"

echo ""
echo "✅ Laravel Production Optimization Complete!"
echo ""
echo "📋 Summary of optimizations applied:"
echo "   - Composer autoloader optimized"
echo "   - Configuration cached"
echo "   - Routes cached"
echo "   - Views cached"
echo "   - Events cached"
echo "   - Old cache cleared"
echo "   - Laravel optimized"
echo "   - Frontend assets built"
echo ""
echo "💡 Additional recommendations:"
echo "   1. Enable OPcache in PHP for better performance"
echo "   2. Use Redis for cache/session if available"
echo "   3. Configure proper database indexes"
echo "   4. Set up a queue worker for background jobs"
echo ""

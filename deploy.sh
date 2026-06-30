#!/bin/bash
# Crazy Chips — Hostinger VPS Deployment Script
# Run this on your VPS: bash deploy.sh

set -e
echo "🍟 Deploying Crazy Chips..."

APP_DIR="/var/www/crazy-chips"

# Pull latest code
cd $APP_DIR
git pull origin main

# Install dependencies
npm ci --omit=dev

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build Next.js
npm run build

# Copy public folder into standalone output
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# Restart app with PM2
pm2 restart crazy-chips || pm2 start ecosystem.config.js

echo "✅ Deployment complete!"
pm2 status

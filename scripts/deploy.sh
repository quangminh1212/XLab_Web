#!/bin/bash

# XLab Web Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Deploying XLab Web to $ENVIRONMENT environment..."

# Check if environment file exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo "❌ Environment file .env.$ENVIRONMENT not found!"
    echo "Please create .env.$ENVIRONMENT with required variables."
    exit 1
fi

# Copy environment file
cp ".env.$ENVIRONMENT" ".env.local"
echo "✅ Environment variables loaded"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run linting
echo "🧹 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Start the application (for server deployment)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌟 Starting production server..."
    npm run start
else
    echo "✅ Build completed successfully!"
    echo "Run 'npm run start' to start the production server"
fi

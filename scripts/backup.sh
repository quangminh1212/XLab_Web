#!/bin/bash

# XLab Web Backup Script
# Usage: ./scripts/backup.sh

set -e

BACKUP_DIR="/var/backups/xlab-web"
APP_DIR="/var/www/xlab-web"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🗄️ Bắt đầu backup XLab Web..."

# Tạo thư mục backup
sudo mkdir -p $BACKUP_DIR

# Backup data directory
echo "📁 Backup data directory..."
sudo tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" -C "$APP_DIR" data/

# Backup environment files
echo "⚙️ Backup environment files..."
sudo cp "$APP_DIR/.env.local" "$BACKUP_DIR/env_$DATE.backup"

# Backup nginx configuration
echo "🌐 Backup nginx config..."
sudo cp /etc/nginx/sites-available/xlab.vn "$BACKUP_DIR/nginx_$DATE.conf"

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleanup old backups..."
sudo find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
sudo find $BACKUP_DIR -name "*.backup" -mtime +7 -delete
sudo find $BACKUP_DIR -name "*.conf" -mtime +7 -delete

echo "✅ Backup hoàn tất: $BACKUP_DIR"
echo "📊 Dung lượng backup:"
sudo du -sh $BACKUP_DIR

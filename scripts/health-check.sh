#!/bin/bash

# XLab Web Health Check Script
# Usage: ./scripts/health-check.sh

echo "🏥 XLab Web Health Check - $(date)"
echo "=================================="

# Check website response
echo "🌐 Kiểm tra website..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://xlab.id.vn)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Website hoạt động bình thường (HTTP $HTTP_STATUS)"
else
    echo "❌ Website có vấn đề (HTTP $HTTP_STATUS)"
fi

# Check SSL certificate
echo "🔒 Kiểm tra SSL certificate..."
SSL_EXPIRY=$(echo | openssl s_client -servername xlab.id.vn -connect xlab.id.vn:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo "📅 SSL hết hạn: $SSL_EXPIRY"

# Check PM2 processes
echo "⚙️ Kiểm tra PM2 processes..."
pm2 jlist | jq -r '.[] | select(.name=="xlab-web") | "Process: \(.name) | Status: \(.pm2_env.status) | CPU: \(.monit.cpu)% | Memory: \(.monit.memory/1024/1024 | floor)MB"'

# Check disk space
echo "💾 Kiểm tra dung lượng disk..."
df -h / | awk 'NR==2 {print "Disk usage: " $5 " (" $3 " used / " $2 " total)"}'

# Check memory usage
echo "🧠 Kiểm tra memory..."
free -h | awk 'NR==2 {print "Memory usage: " $3 " used / " $2 " total"}'

# Check nginx status
echo "🌐 Kiểm tra Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx đang hoạt động"
else
    echo "❌ Nginx không hoạt động"
fi

# Check recent errors in logs
echo "📝 Kiểm tra logs gần đây..."
ERROR_COUNT=$(tail -100 /var/log/xlab-web/error.log 2>/dev/null | wc -l)
echo "Số lỗi trong 100 dòng log gần nhất: $ERROR_COUNT"

echo "=================================="
echo "✅ Health check hoàn tất"

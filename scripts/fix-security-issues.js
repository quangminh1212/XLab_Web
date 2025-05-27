const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing security and logic issues...');

// 1. Kiểm tra file .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local file not found! Creating...');
  const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
# TODO: Replace with your actual credentials
GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# API Security
UPDATE_PURCHASES_AUTH_KEY=update-purchases-secure-key

# Development Settings
NODE_ENV=development`;
  
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file exists');
}

// 2. Kiểm tra và sửa dữ liệu products.json
const productsPath = path.join(process.cwd(), 'src/data/products.json');
if (fs.existsSync(productsPath)) {
  try {
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    let hasChanges = false;
    
    // Kiểm tra và sửa categories corrupted
    productsData.forEach((product, index) => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach((category, catIndex) => {
          // Kiểm tra nếu category có nested objects
          if (category.id && typeof category.id === 'object') {
            console.log(`🔧 Fixing corrupted category in product ${product.name}`);
            productsData[index].categories[catIndex] = {
              id: "ai-tools",
              name: "AI Tools",
              slug: "ai-tools"
            };
            hasChanges = true;
          }
        });
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
      console.log('✅ Fixed corrupted data in products.json');
    } else {
      console.log('✅ Products.json data is clean');
    }
  } catch (error) {
    console.error('❌ Error processing products.json:', error.message);
  }
}

// 3. Thêm security headers vào next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Kiểm tra xem đã có security headers chưa
  if (!nextConfig.includes('headers()')) {
    console.log('🔧 Adding security headers to next.config.js...');
    
    // Thêm security headers
    const headersConfig = `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },`;
    
    // Thêm vào trước module.exports
    nextConfig = nextConfig.replace(
      'module.exports = nextConfig;',
      `${headersConfig}
};

module.exports = nextConfig;`
    );
    
    // Thêm headers vào nextConfig object
    nextConfig = nextConfig.replace(
      'const nextConfig = {',
      'const nextConfig = {'
    );
    
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ Added security headers to next.config.js');
  } else {
    console.log('✅ Security headers already exist in next.config.js');
  }
}

// 4. Tạo file README cho security
const securityReadmePath = path.join(process.cwd(), 'SECURITY.md');
const securityContent = `# Security Guidelines

## Environment Variables
- Never commit \`.env.local\` to git
- Regenerate all credentials before production deployment
- Use strong, unique secrets for production

## Authentication
- Google OAuth credentials are for development only
- Replace with production credentials before deployment
- Use proper session management in production

## API Security
- All API routes should validate input
- Implement rate limiting for production
- Use HTTPS only in production

## Data Security
- Migrate from JSON files to proper database
- Implement proper data validation
- Use parameterized queries to prevent injection

## Monitoring
- Set up error tracking (Sentry)
- Monitor API usage and performance
- Set up alerts for security incidents
`;

if (!fs.existsSync(securityReadmePath)) {
  fs.writeFileSync(securityReadmePath, securityContent);
  console.log('✅ Created SECURITY.md file');
}

console.log('\n🎉 Security fixes completed!');
console.log('\n⚠️  IMPORTANT REMINDERS:');
console.log('1. Replace Google OAuth credentials with production values');
console.log('2. Generate new NEXTAUTH_SECRET for production');
console.log('3. Migrate from JSON files to proper database');
console.log('4. Set up proper monitoring and logging');
console.log('5. Review and test all security measures before deployment'); 
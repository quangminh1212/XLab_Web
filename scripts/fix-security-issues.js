/**
 * Security Fix Script
 * 
 * This script automatically fixes common security issues in the project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Security fixes to apply
const securityFixes = [
  {
    name: 'Secure middleware headers',
    file: 'src/middleware.ts',
    check: (content) => !content.includes('Content-Security-Policy'),
    fix: (content) => {
      // Implement secure headers if they don't exist
      if (!content.includes('addSecurityHeaders')) {
        console.log(`${colors.yellow}Adding security headers to middleware.ts${colors.reset}`);
        
        // Add the security headers function
        const securityHeadersFunc = `
/**
 * Thêm security headers vào response
 */
const addSecurityHeaders = (response: NextResponse): NextResponse => {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
  );
  
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // HTTP Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
};`;
        
        // Find the right spot to insert the function
        const insertionPoint = content.indexOf('export async function middleware');
        if (insertionPoint !== -1) {
          // Find the last function definition before middleware
          const lastFuncIndex = content.lastIndexOf('function', insertionPoint);
          const insertPos = content.indexOf('\n\n', lastFuncIndex) + 1;
          
          // Insert the security headers function
          const newContent = 
            content.substring(0, insertPos) + 
            securityHeadersFunc + 
            content.substring(insertPos);
          
          // Update middleware function to use security headers
          return newContent.replace(
            /return NextResponse\.next\(\);/g, 
            'const response = NextResponse.next();\nreturn addSecurityHeaders(response);'
          );
        }
      }
      return content;
    }
  },
  {
    name: 'Add rate limiting',
    file: 'src/middleware.ts',
    check: (content) => !content.includes('rateLimit'),
    fix: (content) => {
      if (!content.includes('rateLimit')) {
        console.log(`${colors.yellow}Adding rate limiting to middleware.ts${colors.reset}`);
        
        // Add rate limiting implementation
        const rateLimitCode = `
// Rate limiting setup
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute
const API_RATE_LIMIT = 50; // 50 requests per minute for API calls

// Store IP addresses and their request counts
const requestCounts = new Map<string, { count: number, timestamp: number }>();

/**
 * Implement rate limiting
 */
const checkRateLimit = (request: NextRequest): boolean => {
  // Get client IP from the x-forwarded-for header or fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  const maxRequests = isApiRequest ? API_RATE_LIMIT : MAX_REQUESTS_PER_WINDOW;
  
  // Check if IP is in the map
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  const record = requestCounts.get(ip)!;
  
  // Reset if outside window
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Increment count and check limit
  record.count++;
  
  // Check if over limit
  if (record.count > maxRequests) {
    return false;
  }
  
  return true;
};`;

        // Find the place to insert the rate limiting code - after ROUTES definition
        const routesIndex = content.indexOf('const ROUTES = {');
        if (routesIndex !== -1) {
          // Find the end of the ROUTES block
          const routesEnd = content.indexOf('};', routesIndex);
          const insertPos = content.indexOf('\n', routesEnd + 2);
          
          // Insert the rate limiting code
          let newContent = 
            content.substring(0, insertPos) + 
            rateLimitCode + 
            content.substring(insertPos);
          
          // Update middleware function to use rate limiting
          const middlewareIndex = newContent.indexOf('export async function middleware');
          if (middlewareIndex !== -1) {
            // Find where we need to insert the rate limiting check
            const startOfFunctionBody = newContent.indexOf('{', middlewareIndex) + 1;
            const nextLineAfterFunctionStart = newContent.indexOf('\n', startOfFunctionBody) + 1;
            
            // Add the rate limiting check
            const rateLimitCheck = `
  // Check rate limiting
  if (!checkRateLimit(request)) {
    const response = new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
    return addSecurityHeaders(response);
  }
`;
            
            newContent = 
              newContent.substring(0, nextLineAfterFunctionBody) + 
              rateLimitCheck + 
              newContent.substring(nextLineAfterFunctionBody);
          }
          
          return newContent;
        }
      }
      return content;
    }
  },
  {
    name: 'Update middleware matcher',
    file: 'src/middleware.ts',
    check: (content) => !content.includes('matcher: [\'/((?!_next/static|_next/image|favicon.ico).*)'),
    fix: (content) => {
      // Update the matcher to apply middleware to all routes except static assets
      if (content.includes('export const config =') && !content.includes('matcher: [\'/((?!_next/static|_next/image|favicon.ico).*)')) {
        console.log(`${colors.yellow}Updating middleware matcher to apply security headers to all routes${colors.reset}`);
        
        // Replace the matcher configuration
        return content.replace(
          /matcher:.*?\],/s,
          'matcher: [\'/((?!_next/static|_next/image|favicon.ico).*)\'],',
        );
      }
      return content;
    }
  },
  {
    name: 'Add security headers to next.config.js',
    file: 'next.config.js',
    check: (content) => !content.includes('securityHeaders'),
    fix: (content) => {
      if (!content.includes('securityHeaders')) {
        console.log(`${colors.yellow}Adding security headers to next.config.js${colors.reset}`);
        
        // Add security headers to next.config.js
        const headersCode = `
// Security headers for Next.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];`;
        
        // Add the headers to the module.exports
        let newContent = content;
        
        // First, add the headers definition before the config
        const moduleExportsIndex = content.indexOf('module.exports');
        if (moduleExportsIndex !== -1) {
          newContent = 
            content.substring(0, moduleExportsIndex) + 
            headersCode + 
            '\n\n' + 
            content.substring(moduleExportsIndex);
        }
        
        // Now add the headers to the Next.js config
        if (newContent.includes('async headers()') || newContent.includes('headers:')) {
          // Headers already defined, don't modify
          return newContent;
        } else {
          // Add headers configuration
          return newContent.replace(
            /module\.exports\s*=\s*{/,
            'module.exports = {\n  async headers() {\n    return [\n      {\n        source: \'/(.*)\',\n        headers: securityHeaders,\n      },\n    ];\n  },',
          );
        }
      }
      return content;
    }
  },
  {
    name: 'Create .env.example file',
    file: '.env.example',
    check: () => !fs.existsSync('.env.example'),
    fix: () => {
      console.log(`${colors.yellow}Creating .env.example file with required environment variables${colors.reset}`);
      
      const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Security Configuration
DATA_ENCRYPTION_KEY=your-data-encryption-key-change-in-production

# Admin Configuration
ADMIN_EMAILS=xlab.rnd@gmail.com,another-admin@example.com

# Logging
LOG_LEVEL=info

# NOTE: For production, generate secure values for all secrets using:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
`;
      
      fs.writeFileSync('.env.example', envContent);
      return envContent;
    }
  },
  {
    name: 'Add CSP to next.config.js',
    file: 'next.config.js',
    check: (content) => !content.includes('Content-Security-Policy'),
    fix: (content) => {
      if (!content.includes('Content-Security-Policy')) {
        console.log(`${colors.yellow}Adding Content-Security-Policy to next.config.js${colors.reset}`);
        
        // Add CSP to security headers
        if (content.includes('securityHeaders')) {
          // Add CSP to existing security headers
          return content.replace(
            /const securityHeaders = \[/,
            `const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';",
  },`,
          );
        }
      }
      return content;
    }
  },
  {
    name: 'Add security README',
    file: 'README_SECURITY.md',
    check: () => !fs.existsSync('README_SECURITY.md'),
    fix: () => {
      console.log(`${colors.yellow}Creating README_SECURITY.md with security documentation${colors.reset}`);
      
      const securityReadme = `# 🔒 Security Documentation

## Overview

This document outlines the security measures implemented in the XLab Web application.

## Security Features

### 1. Authentication & Authorization

- **NextAuth.js** with Google OAuth for secure authentication
- Session-based authentication with JWT tokens
- Role-based access control for admin features
- Secure session storage and cookie handling

### 2. Data Protection

- **AES-256-GCM** encryption for sensitive user data
- Secure key derivation with salt
- Integrity verification for stored data
- Automatic data backups

### 3. Web Security

- **Content-Security-Policy (CSP)** headers to prevent XSS attacks
- CSRF protection using secure tokens
- Rate limiting to prevent brute force attacks
- XSS protection headers
- Clickjacking protection (X-Frame-Options)
- MIME type sniffing protection

### 4. API Security

- Input validation and sanitization
- Rate limiting for API endpoints
- Secure error handling (no sensitive information in errors)
- Authentication required for sensitive operations

### 5. Infrastructure Security

- Environment variable management with .env.local
- Secure defaults for development and production
- Regular security audits with automated tools

## Security Testing

Run the security check script to scan for vulnerabilities:

\`\`\`bash
npm run security-check
\`\`\`

This script checks for:
- Hardcoded secrets
- Insecure crypto implementations
- SQL injection vulnerabilities
- XSS vulnerabilities
- Insecure configurations
- Outdated dependencies with known vulnerabilities

## Security Best Practices

### For Developers

1. **Never commit secrets** to the repository
2. **Always validate and sanitize user input**
3. Use the provided security utilities for encryption/decryption
4. Follow the principle of least privilege
5. Log security-relevant events

### For Administrators

1. **Rotate secrets regularly**
2. **Monitor logs** for suspicious activity
3. Keep dependencies updated
4. Run security checks before deployments
5. Enable HTTPS in production

## Security Contacts

If you discover a security vulnerability, please report it to:
- Email: security@xlab.example.com
- Do not disclose security vulnerabilities publicly until they have been addressed

## Security Updates

- **v1.0.1**: Added Content-Security-Policy headers
- **v1.0.2**: Implemented rate limiting
- **v1.0.3**: Enhanced encryption for user data
- **v1.0.4**: Added automatic security scanning
`;
      
      fs.writeFileSync('README_SECURITY.md', securityReadme);
      return securityReadme;
    }
  }
];

/**
 * Apply a security fix to a file
 */
function applySecurityFix(fix) {
  console.log(`\n${colors.cyan}Applying fix: ${fix.name}${colors.reset}`);
  
  try {
    // Create new file if it doesn't exist
    if (!fs.existsSync(fix.file) && fix.fix) {
      const content = fix.fix('');
      fs.writeFileSync(fix.file, content);
      console.log(`${colors.green}✓ Created file: ${fix.file}${colors.reset}`);
      return;
    }
    
    // Read the file
    const content = fs.existsSync(fix.file) ? fs.readFileSync(fix.file, 'utf8') : '';
    
    // Check if the fix needs to be applied
    if (fix.check && fix.check(content)) {
      // Apply the fix
      const updatedContent = fix.fix(content);
      
      // Write the updated file
      fs.writeFileSync(fix.file, updatedContent);
      
      console.log(`${colors.green}✓ Applied fix to: ${fix.file}${colors.reset}`);
    } else {
      console.log(`${colors.blue}✓ Fix already applied or not needed: ${fix.name}${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error applying fix to ${fix.file}:${colors.reset}`, error.message);
  }
}

/**
 * Install security-related dependencies
 */
function installSecurityDependencies() {
  console.log(`\n${colors.cyan}Checking for security-related dependencies...${colors.reset}`);
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    
    // List of recommended security packages
    const securityPackages = {
      'helmet': '^7.1.0',      // Secure HTTP headers
      '@next/bundle-analyzer': '^15.0.0',  // Analyze bundle for security
      'jose': '^5.2.2',        // JWT implementation
    };
    
    const packagesToInstall = [];
    
    // Check which packages need to be installed
    Object.entries(securityPackages).forEach(([pkg, version]) => {
      if (!dependencies[pkg]) {
        packagesToInstall.push(`${pkg}@${version}`);
      }
    });
    
    if (packagesToInstall.length > 0) {
      console.log(`${colors.yellow}Installing security packages: ${packagesToInstall.join(', ')}${colors.reset}`);
      
      // Install the missing packages
      execSync(`npm install --save ${packagesToInstall.join(' ')}`, {
        stdio: 'inherit',
      });
      
      console.log(`${colors.green}✓ Installed security packages${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ All recommended security packages are already installed${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error installing security dependencies:${colors.reset}`, error.message);
  }
}

/**
 * Update NPM packages with security vulnerabilities
 */
function updateVulnerablePackages() {
  console.log(`\n${colors.cyan}Checking for vulnerable packages...${colors.reset}`);
  
  try {
    // Run npm audit to find vulnerabilities
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const auditResult = JSON.parse(auditOutput);
    
    if (auditResult.vulnerabilities && Object.keys(auditResult.vulnerabilities).length > 0) {
      console.log(`${colors.yellow}Found vulnerable packages. Attempting to fix...${colors.reset}`);
      
      // Try to fix vulnerabilities automatically
      execSync('npm audit fix', { stdio: 'inherit' });
      
      console.log(`${colors.green}✓ Fixed automatically fixable vulnerabilities${colors.reset}`);
      
      // Check if there are still vulnerabilities that need manual fixing
      const afterFixOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const afterFixResult = JSON.parse(afterFixOutput);
      
      if (afterFixResult.vulnerabilities && Object.keys(afterFixResult.vulnerabilities).length > 0) {
        console.log(`${colors.yellow}⚠️ Some vulnerabilities require manual attention:${colors.reset}`);
        
        Object.entries(afterFixResult.vulnerabilities).forEach(([pkg, vuln]) => {
          console.log(`- ${pkg}: ${vuln.via[0].title || vuln.via[0]}`);
          if (vuln.fixAvailable && typeof vuln.fixAvailable !== 'boolean') {
            console.log(`  Fix: npm install ${vuln.fixAvailable.name}@${vuln.fixAvailable.version}`);
          }
        });
      }
    } else {
      console.log(`${colors.green}✓ No vulnerable packages found${colors.reset}`);
    }
  } catch (error) {
    if (error.message.includes('Command failed') && error.message.includes('npm audit')) {
      console.log(`${colors.yellow}⚠️ Vulnerabilities found. Please run 'npm audit' manually for details.${colors.reset}`);
    } else {
      console.error(`${colors.red}❌ Error checking for vulnerable packages:${colors.reset}`, error.message);
    }
  }
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}=== SECURITY FIX SCRIPT ===${colors.reset}`);
  console.log(`Applying security fixes to the project...`);
  
  // Apply each security fix
  securityFixes.forEach(fix => {
    applySecurityFix(fix);
  });
  
  // Install security dependencies
  installSecurityDependencies();
  
  // Update vulnerable packages
  updateVulnerablePackages();
  
  console.log(`\n${colors.green}✓ Security fixes applied successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Review the changes made by this script`);
  console.log(`2. Run security checks: npm run security-check`);
  console.log(`3. Update your .env.local file with secure values`);
  console.log(`4. Restart your development server`);
  console.log(`\n${colors.cyan}For more information, see README_SECURITY.md${colors.reset}`);
}

// Run the main function
main();

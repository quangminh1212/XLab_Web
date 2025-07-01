/**
 * Security Check Script
 * 
 * This script performs a security check on the codebase and identifies potential
 * security vulnerabilities.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

// Security check rules
const securityRules = [
  {
    id: 'SEC001',
    name: 'Hard-coded secrets',
    pattern: /(password|secret|key|token|auth).*['"][A-Za-z0-9+\/=]{16,}['"]|const\s+[A-Z_]+KEY\s*=\s*['"][A-Za-z0-9+\/=]{16,}['"]/gi,
    severity: 'HIGH',
    description: 'Hard-coded secrets found in code',
    excludeFiles: ['.env.example', '.env.sample', '*.md', 'security-check.js'],
  },
  {
    id: 'SEC002',
    name: 'Insecure hash algorithms',
    pattern: /createHash\(['"](md5|sha1)['"]\)/g,
    severity: 'HIGH',
    description: 'Insecure hash algorithms (MD5/SHA1) are being used',
  },
  {
    id: 'SEC003',
    name: 'Insecure random values',
    pattern: /Math\.random\(\)/g,
    severity: 'MEDIUM',
    description: 'Math.random() is not cryptographically secure',
  },
  {
    id: 'SEC004',
    name: 'SQL Injection risk',
    pattern: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b.*\$\{/gi,
    severity: 'HIGH',
    description: 'Potential SQL injection vulnerability',
  },
  {
    id: 'SEC005',
    name: 'XSS vulnerability',
    pattern: /dangerouslySetInnerHTML|innerHTML\s*=|document\.write/g,
    severity: 'MEDIUM',
    description: 'Potential XSS vulnerability',
  },
  {
    id: 'SEC006',
    name: 'Insecure CORS configuration',
    pattern: /Access-Control-Allow-Origin:\s*\*/g,
    severity: 'MEDIUM',
    description: 'Overly permissive CORS configuration',
  },
  {
    id: 'SEC007',
    name: 'Eval usage',
    pattern: /eval\s*\(/g,
    severity: 'HIGH',
    description: 'Dangerous eval() usage detected',
  },
  {
    id: 'SEC008',
    name: 'Missing content security policy',
    pattern: /'Content-Security-Policy'|"Content-Security-Policy"/g,
    severity: 'MEDIUM',
    description: 'No Content Security Policy header found',
    invertMatch: true,
    targetFiles: ['src/middleware.ts', 'next.config.js'],
  },
  {
    id: 'SEC009',
    name: 'Insecure cookie settings',
    pattern: /cookie.*secure:\s*false|cookie.*httpOnly:\s*false/g,
    severity: 'MEDIUM',
    description: 'Insecure cookie settings detected',
  },
  {
    id: 'SEC010',
    name: 'Directory traversal risk',
    pattern: /\.\.\//g,
    severity: 'MEDIUM',
    description: 'Potential directory traversal vulnerability',
    targetFiles: ['src/app/api/**/*.ts'],
  },
];

// Paths to check
const checkPaths = [
  'src',
  'scripts',
  'pages',
  'app',
  'public',
  'utils',
  'lib',
  'components',
];

// File extensions to check
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html'];

// Files to exclude
const excludeFiles = [
  'node_modules',
  '.next',
  'out',
  'build',
  'dist',
  '.git',
  'package-lock.json',
  'yarn.lock',
];

// Results storage
const results = {
  high: [],
  medium: [],
  low: [],
};

/**
 * Check if a file should be scanned based on its extension and exclusion rules
 */
function shouldScanFile(filePath, rule) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);
  
  // Check if file is in exclude list
  if (excludeFiles.some(exclude => filePath.includes(exclude))) {
    return false;
  }
  
  // Check rule-specific exclusions
  if (rule.excludeFiles && 
      rule.excludeFiles.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(fileName);
        }
        return filePath.includes(pattern);
      })) {
    return false;
  }
  
  // Check target files restriction
  if (rule.targetFiles) {
    return rule.targetFiles.some(targetPattern => {
      if (targetPattern.includes('*')) {
        const escapedPattern = targetPattern
          .replace(/\//g, '\\/') // Escape slashes
          .replace(/\*/g, '.*');  // Convert * to .*
        const regex = new RegExp(escapedPattern);
        return regex.test(filePath);
      }
      return filePath.includes(targetPattern);
    });
  }
  
  // Check file extension
  return fileExtensions.includes(ext);
}

/**
 * Check a file for security issues
 */
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    securityRules.forEach(rule => {
      if (!shouldScanFile(filePath, rule)) {
        return;
      }
      
      const matches = content.match(rule.pattern);
      
      // Skip if we need to invert the match (i.e., we're looking for missing patterns)
      if (rule.invertMatch) {
        if (!matches) {
          results[rule.severity.toLowerCase()].push({
            rule,
            file: filePath,
            line: 'N/A',
            match: 'Pattern not found',
          });
        }
        return;
      }
      
      if (matches) {
        // Find the line numbers for each match
        matches.forEach(match => {
          const lines = content.split('\n');
          let lineNumber = 0;
          
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match)) {
              lineNumber = i + 1;
              break;
            }
          }
          
          results[rule.severity.toLowerCase()].push({
            rule,
            file: filePath,
            line: lineNumber,
            match,
          });
        });
      }
    });
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan a directory for files to check
 */
function scanDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      // Skip excluded files/directories
      if (excludeFiles.some(exclude => filePath.includes(exclude))) {
        return;
      }
      
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        scanDirectory(filePath);
      } else if (stats.isFile()) {
        checkFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

/**
 * Print the security check results
 */
function printResults() {
  console.log('\n');
  console.log(`${colors.cyan}=== SECURITY CHECK RESULTS ===${colors.reset}`);
  console.log('\n');
  
  const totalIssues = results.high.length + results.medium.length + results.low.length;
  
  if (totalIssues === 0) {
    console.log(`${colors.green}✓ No security issues found!${colors.reset}`);
    return;
  }
  
  if (results.high.length > 0) {
    console.log(`${colors.red}⚠️ HIGH SEVERITY ISSUES: ${results.high.length}${colors.reset}`);
    results.high.forEach(issue => {
      console.log(`\n${colors.red}[${issue.rule.id}] ${issue.rule.name}${colors.reset}`);
      console.log(`File: ${issue.file}`);
      console.log(`Line: ${issue.line}`);
      console.log(`Description: ${issue.rule.description}`);
      console.log(`Match: ${issue.match.substring(0, 100)}${issue.match.length > 100 ? '...' : ''}`);
    });
  }
  
  if (results.medium.length > 0) {
    console.log(`\n${colors.yellow}⚠️ MEDIUM SEVERITY ISSUES: ${results.medium.length}${colors.reset}`);
    results.medium.forEach(issue => {
      console.log(`\n${colors.yellow}[${issue.rule.id}] ${issue.rule.name}${colors.reset}`);
      console.log(`File: ${issue.file}`);
      console.log(`Line: ${issue.line}`);
      console.log(`Description: ${issue.rule.description}`);
      console.log(`Match: ${issue.match.substring(0, 100)}${issue.match.length > 100 ? '...' : ''}`);
    });
  }
  
  if (results.low.length > 0) {
    console.log(`\n${colors.blue}⚠️ LOW SEVERITY ISSUES: ${results.low.length}${colors.reset}`);
    results.low.forEach(issue => {
      console.log(`\n${colors.blue}[${issue.rule.id}] ${issue.rule.name}${colors.reset}`);
      console.log(`File: ${issue.file}`);
      console.log(`Line: ${issue.line}`);
      console.log(`Description: ${issue.rule.description}`);
      console.log(`Match: ${issue.match.substring(0, 100)}${issue.match.length > 100 ? '...' : ''}`);
    });
  }
  
  console.log('\n');
  console.log(`${colors.cyan}Total issues found: ${totalIssues}${colors.reset}`);
  console.log('\n');
}

/**
 * Checks for outdated dependencies with known vulnerabilities
 */
function checkDependencies() {
  console.log(`${colors.cyan}Checking for vulnerable dependencies...${colors.reset}`);
  
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8' });
    const auditResult = JSON.parse(output);
    
    if (auditResult.vulnerabilities) {
      const vulns = Object.values(auditResult.vulnerabilities);
      
      if (vulns.length > 0) {
        console.log(`\n${colors.red}⚠️ VULNERABLE DEPENDENCIES FOUND:${colors.reset}`);
        
        vulns.forEach(vuln => {
          console.log(`\n${colors.red}[DEP${vuln.severity.toUpperCase()}] ${vuln.name}@${vuln.version}${colors.reset}`);
          console.log(`Severity: ${vuln.severity}`);
          console.log(`Description: ${vuln.via[0].title || vuln.via[0]}`);
          console.log(`Recommendation: ${vuln.recommendation || 'Update to a non-vulnerable version'}`);
        });
      } else {
        console.log(`${colors.green}✓ No vulnerable dependencies found!${colors.reset}`);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error checking dependencies:${colors.reset}`, error.message);
  }
}

/**
 * Check for environment variables
 */
function checkEnvironmentVariables() {
  console.log(`${colors.cyan}Checking for missing environment variables...${colors.reset}`);
  
  const requiredEnvVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DATA_ENCRYPTION_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];
  
  const dotEnvSample = fs.existsSync('.env.example')
    ? fs.readFileSync('.env.example', 'utf8')
    : '';
  
  const missingVars = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!dotEnvSample.includes(envVar)) {
      missingVars.push(envVar);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`${colors.yellow}⚠️ Missing environment variables in .env.example:${colors.reset}`);
    missingVars.forEach(variable => {
      console.log(`- ${variable}`);
    });
  } else {
    console.log(`${colors.green}✓ All required environment variables found in sample file!${colors.reset}`);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}=== SECURITY CHECK SCRIPT ===${colors.reset}`);
  console.log(`Scanning project for security issues...`);
  
  // Check each directory in the paths list
  checkPaths.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
      scanDirectory(dirPath);
    }
  });
  
  // Print results
  printResults();
  
  // Check dependencies
  checkDependencies();
  
  // Check environment variables
  checkEnvironmentVariables();
  
  // Exit with code 1 if there are high severity issues
  if (results.high.length > 0) {
    console.log(`${colors.red}❌ Security check failed due to HIGH severity issues.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ Security check completed.${colors.reset}`);
  }
}

// Run the main function
main(); 
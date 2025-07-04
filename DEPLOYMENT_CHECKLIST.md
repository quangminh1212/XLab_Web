# XLab Web Deployment Checklist

## Pre-Deployment Setup

### 1. Domain & DNS Configuration
- [ ] Purchase domain `xlab.vn` (if not already owned)
- [ ] Configure DNS A records pointing to server IP
- [ ] Set up www subdomain (CNAME or A record)
- [ ] Configure MX records for email (optional)
- [ ] Verify DNS propagation

### 2. SSL Certificate
- [ ] Obtain SSL certificate for `xlab.vn` and `www.xlab.vn`
- [ ] Configure automatic renewal (Let's Encrypt recommended)
- [ ] Test HTTPS connectivity

### 3. Environment Variables
- [ ] Copy `.env.production` to `.env.local`
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Update `NEXTAUTH_URL` to `https://xlab.vn`
- [ ] Configure production Google OAuth credentials
- [ ] Set production admin emails
- [ ] Add any additional environment variables

### 4. Google OAuth Setup
- [ ] Create new OAuth app in Google Cloud Console
- [ ] Add authorized redirect URIs:
  - `https://xlab.vn/api/auth/callback/google`
  - `https://www.xlab.vn/api/auth/callback/google`
- [ ] Update environment variables with new credentials

## Deployment Options

### Option A: Vercel Deployment
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Configure custom domain in Vercel dashboard
- [ ] Set environment variables in Vercel dashboard

### Option B: Docker Deployment
- [ ] Build Docker image: `docker build -t xlab-web .`
- [ ] Test locally: `docker run -p 3000:3000 xlab-web`
- [ ] Deploy to server using docker-compose
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL termination

### Option C: Traditional Server Deployment
- [ ] Set up Node.js server (18+ required)
- [ ] Clone repository to server
- [ ] Run deployment script: `./scripts/deploy.sh production`
- [ ] Configure process manager (PM2 recommended)
- [ ] Set up reverse proxy (Nginx/Apache)

## Post-Deployment Verification

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Admin panel accessible
- [ ] Product pages display properly
- [ ] Cart functionality works
- [ ] Payment integration functional

### 2. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness
- [ ] SEO meta tags present

### 3. Security Tests
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Admin routes protected
- [ ] Environment variables secure

### 4. Monitoring Setup
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor server resources

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor security vulnerabilities
- [ ] Backup data directory
- [ ] Review and rotate secrets
- [ ] Monitor performance metrics

### Emergency Procedures
- [ ] Document rollback procedure
- [ ] Set up staging environment
- [ ] Create incident response plan
- [ ] Maintain contact information for critical services

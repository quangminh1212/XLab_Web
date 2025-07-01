# Security Guidelines

## Environment Variables
- Never commit `.env.local` to git
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

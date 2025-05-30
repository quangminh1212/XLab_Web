@echo off
echo ==========================================
echo    XLab Web - Environment Setup
echo ==========================================
echo.

echo Creating .env.local file...

echo # NextAuth Configuration > .env.local
echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
echo NEXTAUTH_SECRET=K2P5fgz9WJdLsY7mXn4A6BcRtVxZqH8DbE3NpQuT >> .env.local
echo. >> .env.local
echo # Google OAuth credentials (need to be configured for production) >> .env.local
echo GOOGLE_CLIENT_ID=your_google_client_id_here >> .env.local
echo GOOGLE_CLIENT_SECRET=your_google_client_secret_here >> .env.local
echo. >> .env.local
echo # Node Environment >> .env.local
echo NODE_ENV=development >> .env.local
echo. >> .env.local
echo # Next.js Configuration >> .env.local
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env.local

echo.
echo ✅ .env.local file created successfully!
echo.
echo IMPORTANT: For production use, you need to:
echo 1. Get real Google OAuth credentials from Google Cloud Console
echo 2. Replace the placeholder values in .env.local
echo 3. Generate a secure NEXTAUTH_SECRET
echo.
pause 
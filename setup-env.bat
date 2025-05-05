@echo off
echo Setting up environment files...

echo # .env.local > .env.local
echo: >> .env.local
echo # NextAuth Config >> .env.local
echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
echo NEXTAUTH_SECRET=your_random_string_here >> .env.local
echo: >> .env.local
echo # Google Auth >> .env.local
echo GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com >> .env.local
echo GOOGLE_CLIENT_SECRET=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 >> .env.local
echo: >> .env.local
echo # Suppress Warnings >> .env.local
echo NEXT_SUPPRESS_WARNINGS=1 >> .env.local
echo NEXT_TELEMETRY_DISABLED=1 >> .env.local
echo NEXT_FONT_MANIFEST_FALLBACK=true >> .env.local

echo Creating .npmrc to suppress npm warnings...
echo loglevel=error > .npmrc
echo fund=false >> .npmrc
echo audit=false >> .npmrc
echo update-notifier=false >> .npmrc

echo Setting up for fast startup and clean builds...
rem Tạo thư mục .next để tránh lỗi khi chạy
if not exist .next mkdir .next
if not exist .next\server mkdir .next\server
if not exist .next\server\app mkdir .next\server\app
if not exist .next\server\pages mkdir .next\server\pages
if not exist .next\server\chunks mkdir .next\server\chunks
if not exist .next\static mkdir .next\static
if not exist .next\cache mkdir .next\cache

rem Tạo prerender-manifest.json để tránh lỗi khi khởi động
if not exist .next\prerender-manifest.json (
  echo { "version": 4, "routes": {}, "dynamicRoutes": {}, "preview": { "previewModeId": "", "previewModeSigningKey": "", "previewModeEncryptionKey": "" }, "notFoundRoutes": [] } > .next\prerender-manifest.json
)

echo Environment setup complete!
echo Run './run.bat' to start the application in production mode.
echo Or run './run.bat dev' to start in development mode. 
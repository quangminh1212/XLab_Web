# XLab Web

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0.0-4B32C3?style=flat&logo=eslint)](https://eslint.org/)
[![License](https://img.shields.io/badge/license-ISC-green?style=flat)](LICENSE)

> Web application for software products and services marketplace

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [🚀 Production Hosting](#-production-hosting)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Scripts](#-scripts)
- [Authentication](#-authentication)
- [Performance Optimizations](#-performance-optimizations)
- [License](#-license)

## ✨ Features

- **Product Marketplace**: Browse, search, and purchase software products and services
- **User Authentication**: Complete authentication flow with NextAuth.js and Google OAuth
- **Shopping Cart**: Add products to cart, manage quantity, and checkout
- **Payment Integration**: Support for multiple payment methods
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Optimized for all device sizes
- **Internationalization**: Support for multiple languages (Vietnamese and English)
- **SEO Optimized**: Built with SEO best practices

## 🏗️ Project Structure

The project follows a modular architecture, organized by feature and responsibility:

```
src/
├── app/               # Next.js app directory (routes)
│   ├── api/           # API routes
│   ├── admin/         # Admin dashboard
│   ├── products/      # Product pages
│   └── ...            # Other routes
├── components/        # React components organized by module
│   ├── auth/          # Authentication components
│   ├── cart/          # Cart components
│   ├── common/        # Shared UI components
│   ├── layout/        # Layout components
│   ├── payment/       # Payment components
│   └── product/       # Product components
├── contexts/          # React contexts for state management
├── data/              # Data files and mock data
├── lib/               # Utility libraries and helpers
├── models/            # Data models and schemas
├── scripts/           # Utility scripts
├── shared/            # Shared utilities, types, constants
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## 🚀 Production Hosting

XLab Web is configured for automated production hosting on the **xlab.id.vn** domain.

### Automated Hosting Script

The `start.bat` script has been transformed into an automated production hosting solution:

```bash
# Start production server for xlab.id.vn
start.bat
```

**Features:**
- ✅ **Fully Automated** - No user input required
- ✅ **Production Environment** - Configured for xlab.id.vn domain
- ✅ **Auto Build** - Builds production if needed
- ✅ **Continuous Hosting** - Runs as a persistent service
- ✅ **Error Recovery** - Automatic restart on failures
- ✅ **Logging** - Timestamped logs in `logs/` directory

### Server Management Scripts

| Script | Purpose |
|--------|---------|
| `start.bat` | **Main hosting script** - Starts production server |
| `status.bat` | Check server status and health |
| `restart.bat` | Restart server with clean cache |
| `monitor.bat` | Continuous monitoring with auto-restart |
| `setup-service.bat` | Install as Windows Service (requires admin) |
| `start-dev.bat` | Development mode (backup of old start.bat) |

### Production Configuration

**Domain:** https://xlab.id.vn
**Local Access:** http://localhost:3000
**Environment:** Production
**Port:** 3000
**Host:** 0.0.0.0 (All interfaces)

**Environment Variables:**
```env
NEXTAUTH_URL=https://xlab.id.vn
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### Quick Start Hosting

1. **Start Production Server:**
   ```bash
   start.bat
   ```

2. **Monitor Server:**
   ```bash
   monitor.bat
   ```

3. **Check Status:**
   ```bash
   status.bat
   ```

4. **Install as Windows Service:**
   ```bash
   # Run as Administrator
   setup-service.bat
   ```

### Server Output Example

```
================================================================
                   XLab Web Production Server
                  Hosting for xlab.id.vn Domain
================================================================

[SUCCESS] Node.js v22.14.0 installed
[SUCCESS] npm 10.9.2 installed
[SUCCESS] Production environment configured for xlab.id.vn
[SUCCESS] Dependencies installed
[SUCCESS] Production build ready

================================================================
                    PRODUCTION SERVER READY
================================================================
   Domain: xlab.id.vn
   Environment: Production
   Port: 3000
   Status: Starting...
================================================================

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://[YOUR-IP]:3000

 ✓ Ready in 2.1s
```

For detailed hosting documentation, see [HOSTING_GUIDE.md](HOSTING_GUIDE.md).

### Component Imports

Components are organized by feature and can be imported using aliases:

```tsx
// Import specific components
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { Button } from '@/components/common';

// Import utilities
import { formatCurrency } from '@/shared/utils';
```

## 🚀 Technologies

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) - React framework with SSR and SSG
  - [React 18](https://reactjs.org/) - UI library
  - [TypeScript 5](https://www.typescriptlang.org/) - Type safety
  - [Tailwind CSS 3](https://tailwindcss.com/) - Utility-first CSS

- **State Management**:
  - [React Context](https://react.dev/reference/react/createContext) - App-wide state management
  - [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) - Server-side mutations

- **Authentication**:
  - [NextAuth.js 4](https://next-auth.js.org/) - Authentication solution
  - Google OAuth - Social login

- **Development Tools**:
  - [ESLint 9](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting

## 🚀 Quick Start (Windows)

### Cách 1: Sử dụng Script Tự Động (Khuyến nghị)

1. **Clone repository:**
```bash
git clone https://github.com/quangminh1212/XLab_Web.git
cd XLab_Web
```

2. **Chạy script chính:**
```bash
start.bat
```

Script sẽ tự động:
- ✅ Kiểm tra Node.js và npm
- ✅ Cài đặt dependencies
- ✅ Tạo environment files
- ✅ Sửa lỗi thường gặp
- ✅ Hiển thị menu interactive

### Cách 2: Scripts Chuyên Biệt

```bash
# Build production nhanh
build.bat

# Dọn dẹp cache
clean.bat

# Development với menu
start.bat
```

### Cách 3: Manual Setup

```bash
# Cài đặt dependencies
npm install

# Khởi động development
npm run dev

# Mở http://localhost:3000
```

## 🏁 Getting Started (Manual Setup)

### Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# File .env.local will be created automatically
# Or manually create with:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

3. Run development server:
```bash
npm run dev
```

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:log` - Start development server with detailed logging
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build cache
- `npm run check` - Run lint + type-check

## 🔨 Windows Scripts

### 📁 Available Scripts

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| **`start.bat`** | Script chính với menu interactive | Double-click hoặc `start.bat` |
| **`build.bat`** | Build production nhanh | Double-click hoặc `build.bat` |
| **`clean.bat`** | Dọn dẹp cache và temp files | Double-click hoặc `clean.bat` |

### 🎯 start.bat - Menu Chính

```
╔══════════════════════════════════════════════════════════════╗
║                        MENU LỰA CHỌN                        ║
╠══════════════════════════════════════════════════════════════╣
║  1. 🚀 Development Server (npm run dev)                     ║
║  2. 📝 Development với Logger (npm run dev:log)             ║
║  3. 🔨 Build Production (npm run build)                     ║
║  4. ⚡ Start Production (npm run start)                     ║
║  5. 🔍 Lint Code (npm run lint)                             ║
║  6. 📋 Type Check (npm run type-check)                      ║
║  7. 🧹 Clean Cache (clean.bat)                              ║
║  8. 📊 Project Info                                         ║
║  9. 🔧 Quick Build (build.bat)                              ║
║  0. ❌ Thoát                                                 ║
╚══════════════════════════════════════════════════════════════╝
```

### 🚀 Workflow Khuyến Nghị

1. **Lần đầu setup:** `start.bat` → Option 1 (Development)
2. **Build production:** `build.bat` hoặc `start.bat` → Option 9
3. **Dọn dẹp khi có lỗi:** `clean.bat` hoặc `start.bat` → Option 7
4. **Check code quality:** `start.bat` → Option 5 (Lint) + Option 6 (Type Check)

## 📜 npm Scripts

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| `dev` | Development server | `npm run dev` |
| `dev:log` | Development với logging | `npm run dev:log` |
| `build` | Build production | `npm run build` |
| `start` | Start production server | `npm run start` |
| `lint` | Check code với ESLint | `npm run lint` |
| `lint:fix` | Auto-fix ESLint issues | `npm run lint:fix` |
| `type-check` | TypeScript type checking | `npm run type-check` |
| `format` | Format code với Prettier | `npm run format` |
| `clean` | Clean cache | `npm run clean` |
| `check` | Lint + Type check | `npm run check` |
| `update-purchases` | Update purchase counts | `npm run update-purchases` |
| `verify-products` | Verify product data | `npm run verify-products` |

## 🛠️ Troubleshooting

### Lỗi thường gặp

**1. Node.js chưa cài đặt:**
```bash
# Download từ: https://nodejs.org/
# Chọn LTS version
```

**2. Port 3000 đã được sử dụng:**
```bash
# Tìm process đang dùng port
netstat -ano | findstr :3000

# Kill process (thay PID)
taskkill /PID <PID> /F
```

**3. Dependencies lỗi:**
```bash
# Chạy clean script
clean.bat

# Hoặc manual
npm cache clean --force
rmdir /s node_modules
npm install
```

**4. Build lỗi:**
```bash
# Check TypeScript errors
npm run type-check

# Check ESLint errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```
- `npm run format` - Format with Prettier
- `npm run type-check` - Run TypeScript checks
- `npm run analyze` - Analyze bundle size

### Development Guidelines

1. **Naming Conventions**:
   - Components: PascalCase (e.g., `ProductCard.tsx`)
   - Utils/hooks: camelCase (e.g., `useCart.ts`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

2. **Component Structure**:
   - Use functional components with TypeScript
   - Define prop types as interfaces above component
   - Use named exports

3. **Code Style**:
   - Follow ESLint and Prettier configuration
   - Use explicit return types for functions
   - Document complex logic with comments

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Environment Considerations

- Set `NODE_ENV=production` for production environments
- Use proper `NEXTAUTH_URL` for authentication callback
- Configure CDN if applicable using `ASSET_PREFIX`

## 🔐 Authentication

### Setting Up Google OAuth

1. Create credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
3. Add your Client ID and Secret to `.env.local`

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirects to Google authentication page
3. After authentication, returns to callback URL
4. NextAuth creates a session and redirects to the app
5. User is authenticated with session data available

### Protected Routes

Routes can be protected using middleware:

- Admin routes: `/admin/*`
- User account routes: `/account/*`
- Checkout routes: `/checkout/*`

## ⚡ Performance Optimizations

- **Image Optimization**: Using Next.js Image component with WebP/AVIF formats
- **Code Splitting**: Automatic code splitting by pages and dynamic imports
- **Server Components**: Using React Server Components for better performance
- **Caching**: Implementing proper cache strategies
- **Bundle Analysis**: Regular bundle size monitoring with `npm run analyze`

## 📄 License

Copyright © 2023-2024 XLab. All rights reserved.

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

## 🚀 Quick Start

### For Windows Users

1. **Clone the repository:**
```bash
git clone https://github.com/quangminh1212/XLab_Web.git
cd XLab_Web
```

2. **Run the Windows starter script:**
```bash
start.bat
```

The script will automatically:
- ✅ Check Node.js and npm
- ✅ Install dependencies
- ✅ Set up environment files
- ✅ Fix common issues
- ✅ Provide a menu to start development

### For Linux/macOS Users

1. **Clone the repository:**
```bash
git clone https://github.com/quangminh1212/XLab_Web.git
cd XLab_Web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

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

## 🚀 Production Deployment

### Automated Deployment (Linux/Ubuntu)

For production deployment with HTTPS, SSL, and Nginx:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment (requires sudo)
sudo ./deploy.sh
```

The deployment script will automatically:
- ✅ Install Nginx, Certbot, PM2
- ✅ Build the Next.js application
- ✅ Configure Nginx with SSL
- ✅ Set up Let's Encrypt SSL certificate
- ✅ Configure PM2 process manager
- ✅ Set up auto-renewal for SSL
- ✅ Configure security headers

### Manual Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Start with PM2:**
```bash
pm2 start npm --name "xlab-web" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx** (see deploy.sh for full config)

4. **Set up SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d yourdomain.com
```

## 📜 Scripts

### Windows Scripts

- **`start.bat`** - Complete Windows development environment setup
  - Checks Node.js/npm installation
  - Installs dependencies
  - Sets up environment files
  - Provides interactive menu for development tasks

### Linux/macOS Scripts

- **`deploy.sh`** - Complete production deployment script
  - System dependencies installation
  - Nginx configuration with SSL
  - PM2 process management
  - Let's Encrypt SSL certificate
  - Security headers and optimization

### npm Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server on port 3000 |
| `dev:log` | Start development with detailed logging |
| `build` | Build optimized production bundle |
| `start` | Start production server |
| `lint` | Check code with ESLint |
| `lint:fix` | Auto-fix ESLint issues |
| `type-check` | Run TypeScript type checking |
| `format` | Format code with Prettier |
| `clean` | Clean build cache and node_modules cache |
| `check` | Run both lint and type-check |
| `deploy` | Run production deployment script |
| `update-purchases` | Update product purchase counts |
| `verify-products` | Verify product data integrity |
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

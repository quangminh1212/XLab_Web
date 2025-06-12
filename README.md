# XLab Web

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0.0-4B32C3?style=flat&logo=eslint)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.5.3-F7B93E?style=flat&logo=prettier)](https://prettier.io/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?style=flat&logo=jest)](https://jestjs.io/)
[![License](https://img.shields.io/badge/license-ISC-green?style=flat)](LICENSE)

> Web application for software products and services marketplace - Tối ưu theo chuẩn quốc tế

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Code Standards](#-code-standards)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Authentication](#-authentication)
- [Performance Optimizations](#-performance-optimizations)
- [Continuous Integration](#-continuous-integration)
- [Security](#-security)
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
- **Performance Optimized**: Fast loading with optimized assets and code splitting
- **Accessibility Compliant**: WCAG 2.1 AA compliant
- **Security Best Practices**: Implemented security headers and protection mechanisms

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
  - [Prettier 3](https://prettier.io/) - Code formatting
  - [Jest 29](https://jestjs.io/) - Unit & integration testing
  - [Testing Library](https://testing-library.com/) - Component testing
  - [Husky](https://typicode.github.io/husky/) - Git hooks
  - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance monitoring

## 🏁 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher (specified in .nvmrc)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd XLab_Web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your configuration:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Other configs
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:clean` - Start development server after cleaning cache
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format with Prettier
- `npm run format:check` - Check formatting
- `npm run type-check` - Run TypeScript checks
- `npm run analyze` - Analyze bundle size
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ci` - Run tests for CI
- `npm run validate` - Run all checks (lint, format, type, test)
- `npm run find:unused` - Find unused exports/files
- `npm run find:deadcode` - Find dead code
- `npm run find:circular` - Find circular dependencies
- `npm run security` - Run security audit
- `npm run optimize:images` - Optimize images

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

## 📏 Code Standards

We follow international coding standards:

### TypeScript

- Strict mode enabled
- No implicit any
- Explicit function return types
- Proper nullability handling
- Type imports separated from value imports

### ESLint

- Extended configs:
  - next/core-web-vitals
  - plugin:@typescript-eslint/recommended
  - plugin:import/recommended
  - prettier

### Prettier

- Single quotes
- 2 space indentation
- 100 character line length
- ES5 trailing commas
- Sorted imports with separate groups

### Git Workflow

- Conventional commits format
- Pre-commit hooks with Husky
- Lint and format checks before commit
- No direct commits to main branch

## 🧪 Testing

### Testing Strategy

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for critical flows
- E2E tests for core user journeys

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

### Test Coverage Goals

- 70%+ code coverage for critical paths
- Focus on business logic and user interactions
- Mocked external dependencies

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
- Set proper Content Security Policy headers

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

- **Image Optimization**: Using Next.js Image component with WebP/AVIF formats and responsive sizes
- **Code Splitting**: Automatic code splitting by pages and dynamic imports
- **Server Components**: Using React Server Components for better performance
- **Caching**: Implementing proper cache strategies with Cache-Control headers
- **Bundle Analysis**: Regular bundle size monitoring with `npm run analyze`
- **Chunk Optimization**: Vendor and framework chunks separated for better caching
- **Font Optimization**: Preloaded and subset fonts
- **CSS Optimization**: Purge unused CSS with Tailwind
- **Core Web Vitals**: Optimized for all Core Web Vitals metrics

## 🔄 Continuous Integration

We use a robust CI/CD pipeline:

- **Code Quality**: ESLint, TypeScript, and Prettier checks
- **Testing**: Automated tests with Jest
- **Performance**: Lighthouse CI for performance regression testing
- **Security**: Dependency scanning and security checks
- **Build Verification**: Verify production build completes successfully

## 🔒 Security

Security is a top priority:

- **Content Security Policy**: Strict CSP implemented
- **HTTPS Only**: All communication over HTTPS
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation**: All user input validated server-side
- **Dependency Scanning**: Regular security audits
- **Authentication**: Secure session management with NextAuth.js
- **XSS Protection**: React's built-in protection + extra measures
- **CSRF Protection**: Built-in protection with Next.js

For more details, see our [Security Policy](SECURITY.md).

## 📄 License

Copyright © 2023-2024 XLab. All rights reserved.

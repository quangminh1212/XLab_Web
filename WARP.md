# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Project: XLab Web (Next.js 15, TypeScript, Tailwind)
- Node: >= 18 (CI uses Node 20)
- App entry: Next.js App Router under src/app
- Path aliases: '@/*' -> src/* (see tsconfig.json)

Common commands
- Install deps (clean CI-style): npm ci
- Dev server: npm run dev
- Dev server (clean caches first): npm run dev:clean
- Dev server (suppress Node warnings): npm run dev:silent
- Build (prod): npm run build
- Build with bundle analyzer: ANALYZE=true npm run analyze
- Static export build: npm run build:export
- Start (prod server): npm run start
- Serve static export: npm run start:export
- Lint: npm run lint
- Lint (auto-fix): npm run lint:fix
- Format (Prettier): npm run format
- Type-check: npm run type-check
- Quick checks (lint + types): npm run check
- Clean caches: npm run clean
- Repair Next dev issues: npm run fix
- Security fix helper: npm run fix:security
- Health report: npm run health-check
- Gentle auto-improvements: npm run health-improve
- Build with logger: npm run build:log
- Logs GC: npm run logs:gc

Testing
- Test runner: Jest is available via devDependencies (jest, ts-jest, @testing-library/*, jest-environment-jsdom).
- Run all tests: npx jest
- Run a specific test file: npx jest __tests__/imagePaths.test.ts
- Filter a single test by name: npx jest __tests__/api.products.route.test.ts -t "sorts by popular"
Notes:
- Tests live under __tests__/ and use TS/ESM. If you encounter config issues, check for ts-jest usage and ensure Node >= 18 as in engines.

Environment
- Copy env example and configure local secrets:
  - cp .env.example .env.local
  - Required for auth: NEXTAUTH_URL, NEXTAUTH_SECRET
  - Google OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- Optional:
  - ASSET_PREFIX for CDN/static hosting
  - DATA_ENCRYPTION_KEY for secure user data (see README_SECURE_DATA.md)

Repo architecture (big picture)
- Next.js App Router (src/app):
  - Route groups for (auth), (dashboard), (public)
  - API routes under src/app/api/*, including admin endpoints (e.g., update-purchases)
  - Global layout and styles in src/app/layout.tsx and src/app/globals.css
- Clean Architecture + DDD layering (docs/ARCHITECTURE.md):
  - Domain (src/core/domain): entities/value objects; Application use cases in src/core/usecases; Interfaces in src/core/interfaces
  - Infrastructure (src/infrastructure): database, external APIs, auth config, storage
  - Presentation (src/app + UI under src/shared/components and feature UIs)
  - Feature modules under src/features/* (auth, products, cart, orders, admin)
  - Shared utilities: src/shared/{hooks,utils,types,constants,validations}
  - Central config: src/config/{database.ts, auth.ts, environment.ts}
- Path aliasing is used per tsconfig.json to keep imports absolute (e.g., import { ProductService } from '@/features/products/services').
- Internationalization lives under src/i18n with per-language modules (en/, vi/). See src/i18n/README.md for adding languages and usage via a LanguageContext.

Build/runtime specifics
- next.config.js:
  - reactStrictMode enabled
  - ESLint not blocking builds (ignoreDuringBuilds)
  - output: 'standalone' for containerized deploys
  - experimental: serverActions allowedOrigins set for localhost ports; optimizeCss disabled in development
  - images: wide remotePatterns; formats webp/avif; unoptimized in development
  - assetPrefix honors ASSET_PREFIX
  - security headers in production (CSP, HSTS, etc.)
  - Client-side code splitting tuned via custom splitChunks
- Bundle analysis: set ANALYZE=true and run npm run analyze

Data and admin utilities
- Secure user data system documented in README_SECURE_DATA.md: per-user encrypted files, backups, integrity checks. Never commit data/users or data/backups (see that doc for .gitignore patterns and operational guidance).
- Automated purchase count updater:
  - API: /api/admin/products/update-purchases
  - Script: src/scripts/update-purchases.js
  - Run: npm run update-purchases
  - Windows Task Scheduler example is in src/scripts/README.md
- Product verification helper: npm run verify-products

CI reference (GitHub Actions)
- Workflow runs on pushes/PRs:
  - Node 20, npm ci, then: npm run type-check, npm run lint, npm run build

Read this first
- README.md: high-level features, setup, scripts, auth flow, performance practices
- docs/ARCHITECTURE.md: the layering/feature organization to follow when adding or refactoring code
- src/i18n/README.md and src/scripts/README.md for their respective subsystems

Conventions to respect (from project docs)
- Strict TypeScript (noImplicitReturns, strictNullChecks, etc.) and path aliases
- Component naming: PascalCase; utils/hooks: camelCase; constants: UPPER_SNAKE_CASE
- Feature-first structure: keep feature code in src/features/<feature> with its own components/hooks/services

Windows (PowerShell) notes
- Set an env var for a single command:
  - $env:ANALYZE = 'true'; npm run analyze; $env:ANALYZE = $null
- Copy env example locally:
  - Copy-Item .env.example .env.local
- Run a single test file:
  - npx jest __tests__/api.products.route.test.ts
- Filter tests by name:
  - npx jest __tests__/api.products.route.test.ts -t "sorts by popular"

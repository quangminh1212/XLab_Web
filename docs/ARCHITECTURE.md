# XLab Web - Architecture Documentation

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles combined with **Domain-Driven Design (DDD)** patterns, optimized for Next.js 15+ with App Router.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (Pages & API Routes)
│   ├── (auth)/            # Route Groups for Authentication
│   ├── (dashboard)/       # Route Groups for Dashboard
│   ├── (public)/          # Route Groups for Public Pages
│   ├── api/               # API Routes
│   ├── globals.css        # Global Styles
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Home Page
├── core/                  # Core Business Logic (Domain Layer)
│   ├── domain/            # Domain Entities & Value Objects
│   ├── usecases/          # Application Use Cases
│   └── interfaces/        # Repository & Service Interfaces
├── infrastructure/        # External Concerns (Infrastructure Layer)
│   ├── database/          # Database Configuration & Migrations
│   ├── api/               # External API Clients
│   ├── auth/              # Authentication Configuration
│   └── storage/           # File Storage Configuration
├── shared/                # Shared Utilities & Common Code
│   ├── components/        # Reusable UI Components
│   ├── hooks/             # Custom React Hooks
│   ├── utils/             # Utility Functions
│   ├── types/             # TypeScript Type Definitions
│   ├── constants/         # Application Constants
│   └── validations/       # Validation Schemas
├── features/              # Feature-based Organization
│   ├── auth/              # Authentication Feature
│   ├── products/          # Products Feature
│   ├── cart/              # Shopping Cart Feature
│   ├── orders/            # Orders Feature
│   └── admin/             # Admin Feature
└── config/                # Configuration Files
    ├── database.ts        # Database Configuration
    ├── auth.ts            # Authentication Configuration
    └── environment.ts     # Environment Variables
```

## 🎯 Architecture Principles

### 1. **Clean Architecture Layers**

- **Domain Layer**: Core business logic, entities, and rules
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (DB, APIs, frameworks)
- **Presentation Layer**: UI components and pages

### 2. **Domain-Driven Design**

- **Aggregates**: Product, Order, User, Cart
- **Value Objects**: Money, Email, Address
- **Domain Events**: OrderCreated, ProductUpdated
- **Repositories**: Data access abstraction

### 3. **Feature-based Organization**

- Each feature contains its own components, hooks, and logic
- Promotes modularity and maintainability
- Easy to scale and test

## 🔧 Development Guidelines

### Component Organization

```
features/products/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── services/            # Feature-specific services
├── types/               # Feature-specific types
└── utils/               # Feature-specific utilities
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard`)
- **Files**: kebab-case (e.g., `product-card.tsx`)
- **Folders**: kebab-case (e.g., `user-profile`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_ITEMS_PER_PAGE`)

### Import Organization

```typescript
// 1. React imports
import React from 'react';

// 2. Third-party libraries
import { NextPage } from 'next';
import { z } from 'zod';

// 3. Internal imports (absolute paths)
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/hooks';
import { ProductService } from '@/features/products/services';

// 4. Relative imports
import './component.css';
```

## 🚀 Benefits

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Isolated components and services
4. **Developer Experience**: Consistent patterns and conventions
5. **Code Reusability**: Shared components and utilities
6. **Type Safety**: Strong TypeScript integration

## 📋 Migration Plan

1. **Phase 1**: Restructure shared components and utilities
2. **Phase 2**: Organize features into separate modules
3. **Phase 3**: Implement clean architecture layers
4. **Phase 4**: Add comprehensive testing structure
5. **Phase 5**: Optimize build and deployment processes

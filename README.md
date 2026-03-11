# E-commerce Frontend

A modern, type-safe e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library with concurrent features
- **TypeScript 5** - Type-safe development
- **Vite** - Fast development and optimized builds
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful SVG icons

## Architecture Overview

### Foundation

- **TypeScript Configuration** - Strict type checking with path aliases
- **ESLint & Prettier** - Code quality and consistent formatting
- **Git Hooks (Husky)** - Pre-commit linting and formatting validation
- **CI/CD Pipeline** - GitHub Actions workflow with Vercel deployment
- **Conventional Commits** - Standardized commit message format

### Context Decomposition

Split monolithic `ShoppingCartContext` into focused contexts:

- **AuthContext** - User authentication state
- **ProductContext** - Products, cart, orders, and UI state

Created custom hooks:

- `useAuthContext()` - Authentication operations
- `useProductContext()` - Product and cart operations
- `useProducts()` - Data fetching
- `useCart()` - Cart management
- `useFilters()` - Product filtering
- `useLocalStorage()` - Persistence layer

### Advanced Improvements

- **Error Handling** - ErrorBoundary with fallback UI
- **Performance** - React.memo, useMemo, lazy loading
- **Loading States** - LoadingSpinner component
- **Accessibility** - ARIA labels, semantic HTML
- **SEO** - Dynamic document titles

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── card/           # Product card with memoization
│   ├── navbar/         # Navigation with auth state
│   ├── productDetail/  # Product detail modal
│   ├── checkoutSideMenu/  # Cart/checkout panel
│   ├── orderCard/      # Order item display
│   ├── ordersCard/     # Order summary
│   ├── loadingSpinner/ # Loading state
│   ├── errorBoundary/  # Error handling
│   ├── errorFallback/  # Error UI
│   └── layout/         # Page layout wrapper
├── context/            # React Context providers
│   ├── auth.tsx       # AuthContext
│   ├── product.tsx    # ProductContext
│   └── index.ts       # Barrel exports
├── hooks/              # Custom React hooks
│   ├── useAuthContext.ts
│   ├── useProductContext.ts
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useFilters.ts
│   ├── useLocalStorage.ts
│   └── useDocumentTitle.ts
├── pages/              # Route pages
│   ├── app/           # App component with providers
│   ├── home/          # Home page with products
│   ├── myAccount/     # User account
│   ├── myOrder/       # Single order view
│   ├── myOrders/      # Order history
│   ├── signIn/        # Authentication
│   └── notFound/      # 404 page
├── services/           # API layer
│   └── api.ts         # ApiService class
├── types/              # TypeScript types
│   └── index.ts       # All type definitions
├── utils/              # Utility functions
│   └── index.ts       # Helper functions
└── constants/          # App constants
    └── index.ts       # API, routes, storage keys
```

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## Development Workflow

### Git Flow

1. Create feature branch from `develop`: `git checkout -b feature/name`
2. Make changes with conventional commits
3. Push branch and create PR to `develop`
4. After review, merge to `develop`
5. Release: merge `develop` to `main`

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Deployment

- **Production**: Auto-deploy on merge to `main`
- **Preview**: Auto-deploy on merge to `develop`
- **Platform**: Vercel

## Environment Variables

Required for CI/CD deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Key Features

- Type-safe throughout with TypeScript
- Optimized performance with React.memo and lazy loading
- Accessible UI with ARIA support
- Error boundaries for graceful error handling
- Responsive design with Tailwind CSS
- Clean architecture with separated concerns
- Automated testing and deployment pipeline

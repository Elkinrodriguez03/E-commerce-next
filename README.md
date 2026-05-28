# E-Commerce Application

A full-stack e-commerce application built with Next.js, Prisma, PostgreSQL, and TypeScript featuring role-based authentication (Customer & Seller), a seller admin dashboard, and a modern buyer experience with scoped search.

## Key Features

- **Role-Based Auth** — Customer and Seller roles with JWT + bcrypt
- **Seller Admin Dashboard** — Product CRUD, stats, status management (Active/Draft/Archived), image upload
- **Scoped Search** — Center-aligned search bar with category dropdown prefix, predictive results, intent-based smart filters, and keyboard shortcut (⌘K)
- **Hybrid Mobile Navigation** — Sticky top bar + fixed bottom tab bar (Home, Orders, Saved, Cart, Profile)
- **Full-Stack TypeScript** — End-to-end type safety
- **Database Persistence** — Cart and orders survive sessions via PostgreSQL
- **Responsive Admin UI** — Collapsible sidebar, responsive tables/forms, mobile hamburger menu
- **Accessible UI** — ARIA labels, keyboard navigation, focus management, semantic HTML
- **Optimized Performance** — React.memo, useMemo, lazy loading
- **Zod Validation** — Runtime schema validation for forms and API inputs
- **Pre-commit Hooks** — Automated linting and formatting via Husky

## Tech Stack

### Frontend

- **Next.js 16** — React framework with App Router
- **React 18** — UI library with concurrent features
- **TypeScript 5** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — SVG icon library
- **Heroicons** — Additional SVG icons

### Backend

- **Next.js API Routes** — REST API endpoints
- **Prisma ORM** — Type-safe database access
- **PostgreSQL** — Relational database
- **JWT** — Token-based authentication
- **bcryptjs** — Password hashing
- **Zod** — Schema validation

### Tooling

- **ESLint & Prettier** — Code quality and formatting
- **Husky + lint-staged** — Git hooks for pre-commit validation
- **Conventional Commits** — Standardized commit messages

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                     Frontend                         │
│  Next.js App Router + React Context                  │
│  ┌───────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │AuthContext|    ProductCtx    │  Components     │  │
│  │(JWT/Roles)|  (Cart/Filters)  │  TopBar, Admin  │  │
│  └───────────┘  └────────────┘  └─────────────────┘  │
├──────────────────────────────────────────────────────┤
│                   API Routes                         │
│  /api/auth/*  /api/cart  /api/orders  /api/products  │
│  /api/seller/products/*  /api/upload  /api/users/*   │
├──────────────────────────────────────────────────────┤
│  Middleware: withAuth (JWT) · withRole (SELLER)      │
├──────────────────────────────────────────────────────┤
│                    Prisma ORM                        │
├──────────────────────────────────────────────────────┤
│                   PostgreSQL                         │
│  Users │ Products │ Carts │ CartItems │ Orders       │
└──────────────────────────────────────────────────────┘
```

### Database Schema

```
User (id, email, password, name, role: CUSTOMER|SELLER)
 ├── Product (id, sellerId, title, description, price, image, category, stock, status: ACTIVE|DRAFT|ARCHIVED)
 ├── Cart (id, userId, status: ACTIVE/CONVERTED/ABANDONED)
 │    └── CartItem (id, cartId, productId, quantity, price, title, image, category)
 └── Order (id, userId, cartId, totalAmount, status: PENDING/COMPLETED/CANCELLED)
```

### API Endpoints

#### Authentication

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `/api/auth/login`    | Login (returns JWT + role)               |
| POST   | `/api/auth/register` | Register (with role: CUSTOMER or SELLER) |

#### Products (Public)

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/products`       | List all ACTIVE products   |
| GET    | `/api/products/stock` | Check/update product stock |

#### Seller Products (Protected — SELLER role)

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/seller/products`      | List own products     |
| POST   | `/api/seller/products`      | Create product        |
| GET    | `/api/seller/products/[id]` | Get own product by ID |
| PUT    | `/api/seller/products/[id]` | Update own product    |
| DELETE | `/api/seller/products/[id]` | Delete own product    |

#### Cart & Checkout (Protected)

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/api/cart`     | Get active cart       |
| POST   | `/api/cart`     | Add item to cart      |
| POST   | `/api/checkout` | Convert cart to order |
| GET    | `/api/orders`   | Get user orders       |

#### Users (Protected)

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/users`         | List all users         |
| POST   | `/api/users`         | Create user            |
| GET    | `/api/users/[id]`    | Get user by ID         |
| PUT    | `/api/users/[id]`    | Update user            |
| DELETE | `/api/users/[id]`    | Delete user            |
| GET    | `/api/users/profile` | Get current profile    |
| PUT    | `/api/users/profile` | Update current profile |

#### Upload

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | `/api/upload` | Upload product image |

### Authentication Flow

```
Client                          Server
  │── POST /api/auth/login ──────>│
  │   {email, password}           │
  │<── {token, user, role} ───────│
  │                               │
  │── GET /api/cart ─────────────>│
  │   Authorization: Bearer token │
  │<── {items: [...]} ────────────│
```

### Context Architecture

- **AuthContext** — User authentication, JWT session, role management (CUSTOMER/SELLER)
- **ProductContext** — Products, cart, orders, filtering, checkout UI state

### Custom Hooks

- `useAuthContext()` — Authentication operations (login, register, logout, role)
- `useProductContext()` — Product and cart operations
- `useProducts()` — Product data fetching (FakeStore API + seller products)
- `useCart()` — Cart management (add, remove, sync with API)
- `useFilters()` — Product filtering by title and category
- `useFormValidation()` — Form state, validation, field props (with Zod)
- `useDocumentTitle()` — Dynamic page titles
- `useLocalStorage()` — Persistent local storage state
- `useUI()` — UI state management

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (TopBar, BottomTabBar, Providers)
│   ├── providers.tsx             # Client-side context providers
│   ├── globals.css               # Tailwind CSS + custom utilities
│   ├── page.tsx                  # Home page (product grid)
│   ├── not-found.tsx             # 404 page
│   ├── sign-in/page.tsx          # Sign in (role-aware redirect)
│   ├── sign-up/page.tsx          # Sign up (role selector)
│   ├── my-account/page.tsx       # Customer account page
│   ├── my-orders/                # Customer orders
│   │   ├── page.tsx              # Orders list
│   │   ├── last/page.tsx         # Last order
│   │   └── [id]/page.tsx         # Order detail
│   ├── clothes/page.tsx          # Category pages
│   ├── electronics/page.tsx
│   ├── jewelery/page.tsx
│   ├── others/page.tsx
│   ├── admin/                    # Seller admin dashboard
│   │   ├── layout.tsx            # Admin layout (sidebar, topbar, auth guard)
│   │   ├── page.tsx              # Dashboard (stats, recent products)
│   │   ├── components/
│   │   │   ├── AdminTopBar.tsx    # Admin top bar with hamburger toggle
│   │   │   ├── AdminSidebar.tsx   # Collapsible sidebar navigation
│   │   │   └── SaveBar.tsx       # Sticky save bar for dirty forms
│   │   └── products/
│   │       ├── page.tsx          # Product list with search & status tabs
│   │       ├── new/page.tsx      # Create product form
│   │       └── [id]/edit/page.tsx# Edit product form
│   └── api/                      # API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── cart/route.ts
│       ├── checkout/route.ts
│       ├── orders/route.ts
│       ├── products/
│       │   ├── route.ts          # Public product listing
│       │   └── stock/route.ts    # Stock management
│       ├── seller/
│       │   └── products/
│       │       ├── route.ts      # Seller product CRUD (list/create)
│       │       └── [id]/route.ts # Seller product CRUD (get/update/delete)
│       ├── upload/route.ts       # Image upload
│       └── users/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── profile/route.ts
├── src/
│   ├── components/
│   │   ├── topBar/               # Buyer navigation system
│   │   │   ├── index.tsx         # Barrel exports
│   │   │   ├── TopBar.tsx        # Main top bar (desktop + mobile)
│   │   │   ├── ScopedSearch.tsx  # Scoped search with predictive results
│   │   │   └── MobileBottomTabBar.tsx # Fixed bottom tab bar
│   │   ├── navbar/               # Legacy navigation (unused by buyer layout)
│   │   ├── card/                 # Product card
│   │   ├── productDetail/        # Product detail panel
│   │   ├── checkoutSideMenu/     # Cart/checkout side panel
│   │   ├── orderCard/            # Order item display
│   │   ├── ordersCard/           # Order summary card
│   │   ├── formField/            # Reusable form field component
│   │   ├── imageUpload/          # Image upload component
│   │   ├── loadingSpinner/       # Loading indicator
│   │   ├── errorBoundary/        # Error handling wrapper
│   │   ├── errorFallback/        # Error fallback UI
│   │   ├── protectedRoute/       # Auth guard component
│   │   ├── authSuccessToast/     # Post-login toast notification
│   │   ├── passwordStrength/     # Password strength indicator
│   │   ├── successModal/         # Success modal dialog
│   │   └── layout/               # Layout utilities
│   ├── context/                  # React Context providers
│   │   ├── auth.tsx              # AuthContext (JWT, roles, session)
│   │   ├── product.tsx           # ProductContext (products, cart, filters)
│   │   └── index.ts              # Barrel exports
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuthContext.ts
│   │   ├── useProductContext.ts
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useFilters.ts
│   │   ├── useFormValidation.ts
│   │   ├── useDocumentTitle.ts
│   │   ├── useLocalStorage.ts
│   │   └── useUI.ts
│   ├── services/                 # API client and services
│   │   ├── api.ts                # External API (FakeStore)
│   │   ├── apiClient.ts          # Internal API client
│   │   ├── auth.ts               # Auth service
│   │   └── userService.ts        # User CRUD service
│   ├── types/                    # TypeScript definitions
│   ├── utils/                    # Utility functions
│   ├── validation/               # Zod schemas
│   └── views/                    # Legacy React Router pages (unused)
├── lib/                          # Backend utilities
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # JWT & password utilities
│   └── middleware.ts             # withAuth & withRole middleware
├── prisma/
│   ├── schema.prisma             # Database schema (roles, products, etc.)
│   ├── seed.ts                   # Database seeder (demo customer + seller)
│   └── migrations/               # Database migrations
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with demo users
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Demo Credentials

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Customer | demo@ecommerce.com   | password123 |
| Seller   | seller@ecommerce.com | password123 |

## Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server

# Production
npm run build            # Build for production (prisma generate + next build)
npm start                # Start production server

# Code quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed database
npx prisma generate      # Regenerate Prisma client
```

## Buyer Experience

### TopBar (Desktop)

- Announcement bar with promotional text
- Sticky header: logo, center-aligned scoped search, wishlist/cart/account actions
- Category navigation strip (dark theme, underline active indicator)

### Scoped Search

- Category dropdown prefix (All Categories, Men's Clothing, Women's Clothing, Electronics, Jewelery, Others)
- Predictive product results with images, prices, and categories
- Intent-based smart filters: In Stock Only, Eco-Friendly, Past Purchases
- Three UI states: zero-state (trending + recent), active typing (skeleton loaders), filter-applied (inline chips)
- Keyboard shortcut: ⌘K / Ctrl+K to focus
- Backdrop blur overlay when active
- Click-outside or Escape to dismiss

### Mobile Navigation

- Sticky top bar with hamburger menu + search row
- Fixed bottom tab bar: Home, Orders, Saved, Cart (with badge), Profile
- Navigation drawer for category browsing and account links

## Seller Admin Dashboard

- **Dashboard** — Product count stats (total, active, draft) + recent products table
- **Product List** — Searchable, filterable by status (All, Active, Draft, Archived)
- **Create/Edit Product** — Form with image upload, inventory fields, status management, validation
- **Responsive Sidebar** — Collapsible on mobile with hamburger toggle and backdrop overlay
- **SaveBar** — Sticky bar appears on unsaved form changes

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

### Vercel

- **Production**: Auto-deploy on merge to `main`
- **Preview**: Auto-deploy on merge to `develop`

### Database (Production)

Options for hosted PostgreSQL:

- **Vercel Postgres** — Native integration
- **Supabase** — Free tier available
- **Railway** — Simple setup

### Build Command (Vercel)

```bash
prisma generate && prisma migrate deploy && next build
```

### Required Environment Variables (Vercel)

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

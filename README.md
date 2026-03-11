# E-Commerce Application

A full-stack e-commerce application built with Next.js, Prisma, PostgreSQL, and TypeScript.

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - SVG icons

### Backend

- **Next.js API Routes** - REST API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Tooling

- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for pre-commit validation
- **Conventional Commits** - Standardized commit messages

## Architecture Overview

### Full-Stack Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  Next.js App Router + React Context          │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │AuthContext│  │ProductCtx │  │Components│ │
│  └──────────┘  └───────────┘  └──────────┘ │
├─────────────────────────────────────────────┤
│               API Routes                     │
│  /api/auth/*  /api/cart  /api/orders         │
│  /api/checkout  /api/users/*                 │
├─────────────────────────────────────────────┤
│              Prisma ORM                      │
├─────────────────────────────────────────────┤
│             PostgreSQL                       │
│  Users │ Carts │ CartItems │ Orders          │
└─────────────────────────────────────────────┘
```

### Database Schema

```
User (id, email, password, name)
 ├── Cart (id, userId, status: ACTIVE/CONVERTED/ABANDONED)
 │    └── CartItem (id, cartId, productId, quantity, price, title, image)
 └── Order (id, userId, cartId, totalAmount, status: PENDING/COMPLETED/CANCELLED)
```

### API Endpoints

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register new user      |
| POST   | `/api/auth/login`    | Login with JWT         |
| GET    | `/api/cart`          | Get active cart        |
| POST   | `/api/cart`          | Add item to cart       |
| POST   | `/api/checkout`      | Convert cart to order  |
| GET    | `/api/orders`        | Get user orders        |
| GET    | `/api/users`         | List all users         |
| POST   | `/api/users`         | Create user            |
| GET    | `/api/users/[id]`    | Get user by ID         |
| PUT    | `/api/users/[id]`    | Update user            |
| DELETE | `/api/users/[id]`    | Delete user            |
| GET    | `/api/users/profile` | Get current profile    |
| PUT    | `/api/users/profile` | Update current profile |

### Authentication Flow

```
Client                          Server
  │── POST /api/auth/login ──────>│
  │   {email, password}           │
  │<── {token, user} ─────────────│
  │                               │
  │── GET /api/cart ──────────────>│
  │   Authorization: Bearer token │
  │<── {items: [...]} ────────────│
```

### Context Architecture

- **AuthContext** - User authentication, JWT session management
- **ProductContext** - Products, cart, orders, and UI state

### Custom Hooks

- `useAuthContext()` - Authentication operations (login, register, logout)
- `useProductContext()` - Product and cart operations
- `useProducts()` - Product data fetching
- `useCart()` - Cart management
- `useFilters()` - Product filtering by title/category
- `useDocumentTitle()` - Dynamic page titles

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (Navbar, Providers)
│   ├── providers.tsx         # Client-side context providers
│   ├── globals.css           # Tailwind CSS imports
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 page
│   ├── sign-in/page.tsx      # Sign in page
│   ├── my-account/page.tsx   # User account page
│   ├── my-orders/
│   │   ├── page.tsx          # Orders list
│   │   ├── last/page.tsx     # Last order
│   │   └── [id]/page.tsx     # Order detail (dynamic)
│   ├── clothes/page.tsx      # Category pages
│   ├── electronics/page.tsx
│   ├── jewelery/page.tsx
│   ├── others/page.tsx
│   └── api/                  # API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── cart/route.ts
│       ├── checkout/route.ts
│       ├── orders/route.ts
│       └── users/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── profile/route.ts
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── card/             # Product card
│   │   ├── navbar/           # Navigation bar
│   │   ├── productDetail/    # Product detail panel
│   │   ├── checkoutSideMenu/ # Cart/checkout panel
│   │   ├── orderCard/        # Order item display
│   │   ├── ordersCard/       # Order summary card
│   │   ├── loadingSpinner/   # Loading indicator
│   │   ├── errorBoundary/    # Error handling
│   │   ├── errorFallback/    # Error UI
│   │   └── protectedRoute/   # Auth guard
│   ├── context/              # React Context providers
│   │   ├── auth.tsx          # AuthContext
│   │   ├── product.tsx       # ProductContext
│   │   └── index.ts          # Barrel exports
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API client and services
│   │   ├── api.ts            # External API (FakeStore)
│   │   ├── apiClient.ts      # Internal API client
│   │   ├── auth.ts           # Auth service
│   │   └── userService.ts    # User CRUD service
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Utility functions
│   ├── validation/           # Zod schemas
│   └── views/                # Legacy React Router pages
├── lib/                      # Backend utilities
│   ├── prisma.ts             # Prisma client singleton
│   └── auth.ts               # JWT & password utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeder
│   └── migrations/           # Database migrations
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
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

# Run database migration
npx prisma migrate dev --name init

# Seed database with demo user
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

- **Email**: demo@ecommerce.com
- **Password**: password123

## Available Scripts

```bash
# Development (Next.js)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed database
npx prisma generate      # Regenerate client
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

### Vercel

- **Production**: Auto-deploy on merge to `main`
- **Preview**: Auto-deploy on merge to `develop`

### Database (Production)

Options for hosted PostgreSQL:

- **Vercel Postgres** - Native integration
- **Supabase** - Free tier available
- **Railway** - Simple setup

### Build Command (Vercel)

```bash
prisma generate && prisma migrate deploy && next build
```

### Required Environment Variables (Vercel)

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Key Features

- **Full-Stack TypeScript** - End-to-end type safety
- **JWT Authentication** - Secure login with bcrypt + JWT
- **Database Persistence** - Cart and orders survive sessions
- **User CRUD** - Complete user management API
- **Prisma ORM** - Type-safe database queries with migrations
- **Next.js App Router** - Server and client components
- **Optimized Performance** - React.memo, useMemo, lazy loading
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Accessible UI** - ARIA labels, semantic HTML
- **Error Boundaries** - Graceful error handling
- **Zod Validation** - Runtime schema validation for forms
- **Pre-commit Hooks** - Automated linting and formatting

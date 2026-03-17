# PROJECT CONTEXT — E-commerce Next.js Application

> **Last updated:** 2026-03-12
> **Purpose:** Single source of truth for AI assistants and developers to understand this project quickly.
> **Maintainability:** Update this file whenever you add/remove pages, API routes, components, models, or make architectural changes.

---

## 1. Project Overview

A full-stack **e-commerce web application** built with **Next.js 16 (App Router)** and **React 18**. Products are fetched from the [FakeStore API](https://fakestoreapi.com/products) and displayed in a responsive grid. Users can browse by category, search by title, add items to a cart, and checkout. Authentication is handled via JWT tokens with bcrypt password hashing. The backend uses **Prisma ORM** with **PostgreSQL** for users, carts, and orders.

### Key Characteristics

- **Hybrid architecture:** The project was migrated from a Vite + React Router SPA to Next.js App Router. Legacy `src/views/` and `react-router-dom` code still exists alongside the active `app/` directory.
- **Client-heavy rendering:** Most pages use `'use client'` since state is managed via React Context on the client side.
- **Server-side auth:** Authentication is handled by Next.js API routes (`/api/auth/login`, `/api/auth/register`) using JWT + Prisma. The client stores the JWT in localStorage and validates it against `/api/users/profile` on app load.
- **No external UI library:** Styling is 100% Tailwind CSS utility classes with Heroicons for icons.

---

## 2. Tech Stack

| Layer              | Technology                                                                     |
| ------------------ | ------------------------------------------------------------------------------ |
| **Framework**      | Next.js 16 (App Router)                                                        |
| **UI**             | React 18, TypeScript, Tailwind CSS 3                                           |
| **Icons**          | @heroicons/react (Outline & Solid)                                             |
| **State**          | React Context API (AuthContext + ProductContext)                               |
| **Validation**     | Zod v4                                                                         |
| **ORM**            | Prisma 5.7 with PostgreSQL                                                     |
| **Auth**           | bcryptjs + jsonwebtoken (server-side JWT), localStorage token storage (client) |
| **Deployment**     | Vercel (configured via `vercel.json`)                                          |
| **Linting**        | ESLint + Prettier + Husky + lint-staged                                        |
| **Legacy bundler** | Vite (still configured, used via `dev:vite` script)                            |

### Key Dependencies

```
next@^16.1.6          react@^18.2.0           react-dom@^18.2.0
@prisma/client@5.7.0  bcryptjs@^3.0.3         jsonwebtoken@^9.0.3
zod@^4.3.6            @heroicons/react@^2.0.18 react-router-dom@^6.16.0 (legacy)
tailwindcss@^3.3.3    typescript@^5.9.3       prisma@5.7.0
```

---

## 3. Project Structure

```
E-commerce-next/
├── app/                          # Next.js App Router (ACTIVE frontend + API)
│   ├── layout.tsx                # Root layout: Providers > Navbar > main > CheckoutSideMenu
│   ├── providers.tsx             # Client wrapper: AuthProvider > ProductProvider
│   ├── globals.css               # Tailwind directives + body base styles
│   ├── page.tsx                  # Home page (product grid + search)
│   ├── not-found.tsx             # Custom 404 page
│   ├── sign-in/page.tsx          # Login form with Zod validation
│   ├── my-account/page.tsx       # Display user name & email
│   ├── my-orders/page.tsx        # List of all user orders
│   ├── my-orders/last/page.tsx   # Last order detail
│   ├── my-orders/[id]/page.tsx   # Specific order detail by index
│   ├── clothes/page.tsx          # Category page (reuses Home view)
│   ├── electronics/page.tsx      # Category page (reuses Home view)
│   ├── jewelery/page.tsx         # Category page (reuses Home view)
│   ├── others/page.tsx           # Category page (reuses Home view)
│   └── api/                      # Next.js API Routes (server-side)
│       ├── auth/login/route.ts   # POST  - Login with email/password
│       ├── auth/register/route.ts# POST  - Register new user
│       ├── cart/route.ts         # GET   - Get active cart | POST - Add item to cart
│       ├── checkout/route.ts     # POST  - Convert cart to order (transaction)
│       ├── orders/route.ts       # GET   - Get user's orders
│       ├── users/route.ts        # GET   - List all users | POST - Create user
│       ├── users/[id]/route.ts   # GET/PUT/DELETE - CRUD single user
│       └── users/profile/route.ts# GET/PUT - Current user profile
│
├── lib/                          # Server-side utilities
│   ├── prisma.ts                 # Singleton PrismaClient (hot-reload safe)
│   └── auth.ts                   # hashPassword, verifyPassword, generateToken, verifyToken, getUserFromToken
│
├── prisma/
│   ├── schema.prisma             # Data models: User, Cart, CartItem, Order
│   ├── seed.ts                   # Seeds demo user (demo@ecommerce.com / password123)
│   ├── migrations/               # Database migrations
│   └── dev.db                    # Local SQLite dev database (schema says PostgreSQL)
│
├── src/                          # Shared client-side code
│   ├── components/               # Reusable UI components
│   │   ├── card/                 # Product card (image, price, add/remove from cart)
│   │   ├── navbar/               # Top navigation bar (categories, auth links, cart icon, mobile menu)
│   │   ├── checkoutSideMenu/     # Slide-in cart sidebar with checkout button
│   │   ├── productDetail/        # Slide-in product detail sidebar
│   │   ├── orderCard/            # Single item card in an order (image, title, price, delete)
│   │   ├── ordersCard/           # Order summary card (date, total, article count)
│   │   ├── loadingSpinner/       # Animated spinner (sm/md/lg sizes)
│   │   ├── errorBoundary/        # Class-based React error boundary
│   │   ├── errorFallback/        # Error fallback UI component
│   │   ├── protectedRoute/       # Route guard (legacy, uses react-router-dom)
│   │   └── layout/               # Simple centered layout wrapper (legacy)
│   │
│   ├── context/
│   │   ├── index.ts              # Barrel exports for AuthProvider, ProductProvider, hooks
│   │   ├── auth.tsx              # AuthContext: user, isAuthenticated, login, register, logout
│   │   └── product.tsx           # ProductContext: items, cart, orders, filters, UI state
│   │
│   ├── hooks/
│   │   ├── useAuthContext.ts     # Typed hook for AuthContext
│   │   ├── useProductContext.ts  # Typed hook for ProductContext
│   │   ├── useCart.ts            # Cart state: add, remove, checkout, clear
│   │   ├── useFilters.ts        # Product filtering by title and/or category
│   │   ├── useProducts.ts       # Fetch products from FakeStore API
│   │   ├── useUI.ts             # UI toggles: product detail, checkout side menu (standalone, used in legacy)
│   │   ├── useDocumentTitle.ts   # Dynamic document title with suffix
│   │   └── useLocalStorage.ts   # Generic localStorage hook + useAuth shorthand (legacy)
│   │
│   ├── services/
│   │   ├── api.ts               # ApiService.getProducts() — fetches from FakeStore API
│   │   ├── apiClient.ts         # ApiClient class — internal API client for /api/* routes (JWT-aware)
│   │   ├── auth.ts              # AuthService — client-side auth with localStorage (login, register, logout, session)
│   │   └── userService.ts       # User CRUD via apiClient
│   │
│   ├── types/index.ts            # TypeScript interfaces: Product, CartItem, Order, User, Auth types, Context types
│   ├── constants/index.ts        # API_ENDPOINTS, CATEGORIES, ROUTES, LOCAL_STORAGE_KEYS
│   ├── utils/index.ts            # totalPrice, initializeLocalStorage, formatDateTime, filter functions
│   ├── validation/auth.ts        # Zod schemas: loginSchema, registerSchema
│   │
│   ├── views/                    # Legacy page-level components (from Vite/react-router era)
│   │   ├── home/                 # Home view (used by category pages)
│   │   ├── signIn/               # Sign-in view (uses react-router-dom)
│   │   ├── myAccount/            # Account view
│   │   ├── myOrder/              # Single order view
│   │   ├── myOrders/             # Orders list view
│   │   ├── notFound/             # 404 view
│   │   └── app/                  # Legacy app shell
│   │
│   ├── main.tsx                  # Legacy Vite entry point
│   └── main.jsx                  # Legacy Vite entry point (JSX)
│
├── public/                       # Static assets
├── scripts/                      # Utility scripts
├── .github/                      # GitHub config (CI/CD workflows)
├── .husky/                       # Git hooks (pre-commit lint)
│
├── next.config.js                # Next.js config (reactStrictMode, image domains)
├── tailwind.config.js            # Tailwind config (content paths: index.html, src/**, app/**)
├── tsconfig.json                 # TypeScript config with path aliases (@/*)
├── vite.config.js                # Legacy Vite config (still present)
├── postcss.config.js             # PostCSS (Tailwind + autoprefixer)
├── vercel.json                   # Vercel deployment config + security headers
├── .eslintrc.cjs                 # ESLint config (TS, React, React Hooks)
├── .prettierrc                   # Prettier config (single quotes, trailing commas, 100 width)
└── package.json                  # Dependencies + scripts
```

---

## 4. Data Models (Prisma Schema)

```
User (users)
├── id: String (UUID, PK)
├── email: String (unique)
├── password: String (bcrypt hash)
├── name: String
├── createdAt / updatedAt
├── → carts: Cart[]
└── → orders: Order[]

Cart (carts)
├── id: String (UUID, PK)
├── userId → User
├── status: String ("ACTIVE" | "CONVERTED")
├── createdAt / updatedAt
├── → items: CartItem[]
└── → order: Order? (one-to-one)

CartItem (cart_items)
├── id: String (UUID, PK)
├── cartId → Cart
├── productId: Int (FakeStore API product ID)
├── quantity: Int (default 1)
├── price: Float (snapshot at time of add)
├── title: String (snapshot)
├── image: String (snapshot)
└── category: String (snapshot)

Order (orders)
├── id: String (UUID, PK)
├── userId → User
├── cartId → Cart (unique, one-to-one)
├── totalAmount: Float
├── status: String ("PENDING" | "COMPLETED")
└── createdAt / updatedAt
```

**Database:** PostgreSQL (configured in schema), but `dev.db` (SQLite) exists for local dev.

---

## 5. API Routes

All API routes are in `app/api/` and use Next.js Route Handlers. Auth-protected routes use `verifyToken()` from `lib/auth.ts` (Bearer JWT).

| Method | Endpoint             | Auth | Description                         |
| ------ | -------------------- | ---- | ----------------------------------- |
| POST   | `/api/auth/login`    | No   | Login, returns JWT + user           |
| POST   | `/api/auth/register` | No   | Register, returns JWT + user        |
| GET    | `/api/cart`          | Yes  | Get user's active cart with items   |
| POST   | `/api/cart`          | Yes  | Add item to cart (or increment qty) |
| POST   | `/api/checkout`      | Yes  | Convert active cart → order (txn)   |
| GET    | `/api/orders`        | Yes  | Get user's orders (desc by date)    |
| GET    | `/api/users`         | Yes  | List all users (admin-like)         |
| POST   | `/api/users`         | Yes  | Create new user                     |
| GET    | `/api/users/[id]`    | Yes  | Get single user by ID               |
| PUT    | `/api/users/[id]`    | Yes  | Update user by ID                   |
| DELETE | `/api/users/[id]`    | Yes  | Delete user by ID (cascades)        |
| GET    | `/api/users/profile` | Yes  | Get current user's profile          |
| PUT    | `/api/users/profile` | Yes  | Update current user's profile       |

---

## 6. Frontend Pages & Routing

| Route             | File                          | Description                             |
| ----------------- | ----------------------------- | --------------------------------------- |
| `/`               | `app/page.tsx`                | Home: product grid + search bar         |
| `/clothes`        | `app/clothes/page.tsx`        | Clothes category (reuses Home view)     |
| `/electronics`    | `app/electronics/page.tsx`    | Electronics category (reuses Home view) |
| `/jewelery`       | `app/jewelery/page.tsx`       | Jewelery category (reuses Home view)    |
| `/others`         | `app/others/page.tsx`         | Others category (reuses Home view)      |
| `/sign-in`        | `app/sign-in/page.tsx`        | Login form with Zod validation          |
| `/my-account`     | `app/my-account/page.tsx`     | User profile (name, email)              |
| `/my-orders`      | `app/my-orders/page.tsx`      | List of all orders                      |
| `/my-orders/last` | `app/my-orders/last/page.tsx` | Last order detail                       |
| `/my-orders/[id]` | `app/my-orders/[id]/page.tsx` | Order detail by index                   |
| `/*` (404)        | `app/not-found.tsx`           | Custom 404 page                         |

---

## 7. State Management Architecture

### AuthContext (`src/context/auth.tsx`)

Manages user authentication state client-side.

- **State:** `user`, `isAuthenticated`, `isLoading`, `error`
- **Actions:** `login()`, `register()`, `logout()`, `clearError()`
- **Backend:** `AuthService` calls server API routes (`/api/auth/login`, `/api/auth/register`)
- **Session:** JWT + user data stored in localStorage; validated on app load via `GET /api/users/profile`
- **Demo user:** Seeded via `prisma db seed` (`demo@ecommerce.com` / `password123`)

### ProductContext (`src/context/product.tsx`)

Manages products, cart, orders, and UI state.

- **Products:** Fetched from FakeStore API via `useProducts` hook
- **Filtering:** `useFilters` hook — by title, category, or both
- **Cart:** `useCart` hook — add, remove, checkout, clear (in-memory, not persisted to DB)
- **UI:** Product detail sidebar, checkout side menu (toggle open/close)
- **Orders:** Created on checkout (in-memory array, not persisted to DB)

### Provider Hierarchy

```
<AuthProvider>
  <ProductProvider>
    <Navbar />
    <main>{children}</main>
    <CheckoutSideMenu />
  </ProductProvider>
</AuthProvider>
```

---

## 8. Component Inventory

| Component            | Path                               | Description                                                                       |
| -------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| **Navbar**           | `src/components/navbar/`           | Fixed top nav: logo, category links, auth links, cart icon, mobile hamburger menu |
| **Card**             | `src/components/card/`             | Product card: image, category badge, title, price, add/remove icon                |
| **CheckoutSideMenu** | `src/components/checkoutSideMenu/` | Right sidebar: cart items list, total, checkout button                            |
| **ProductDetail**    | `src/components/productDetail/`    | Right sidebar: product image, price, title, description, add to cart              |
| **OrderCard**        | `src/components/orderCard/`        | Single item row: image, title, price, optional delete                             |
| **OrdersCard**       | `src/components/ordersCard/`       | Order summary: article count, date, total price, chevron                          |
| **LoadingSpinner**   | `src/components/loadingSpinner/`   | Animated CSS spinner (sm/md/lg)                                                   |
| **ErrorBoundary**    | `src/components/errorBoundary/`    | Class-based error boundary with retry                                             |
| **ErrorFallback**    | `src/components/errorFallback/`    | Styled error display with retry button                                            |
| **FormField**        | `src/components/formField/`        | Reusable input with label, error/success states, password toggle (eye icon)       |
| **PasswordStrength** | `src/components/passwordStrength/` | Password strength bar + requirements checklist (real-time)                        |
| **SuccessModal**     | `src/components/successModal/`     | Animated success modal with progress bar and auto-redirect                        |
| **ProtectedRoute**   | `src/components/protectedRoute/`   | Legacy route guard (react-router-dom)                                             |
| **Layout**           | `src/components/layout/`           | Legacy centered content wrapper                                                   |

---

## 9. Custom Hooks

| Hook                | File                             | Purpose                                                             |
| ------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `useAuthContext`    | `src/hooks/useAuthContext.ts`    | Typed access to AuthContext                                         |
| `useProductContext` | `src/hooks/useProductContext.ts` | Typed access to ProductContext                                      |
| `useCart`           | `src/hooks/useCart.ts`           | Cart state + add/remove/checkout/clear                              |
| `useFilters`        | `src/hooks/useFilters.ts`        | Product filtering (title, category, both)                           |
| `useProducts`       | `src/hooks/useProducts.ts`       | Fetch products from FakeStore API                                   |
| `useUI`             | `src/hooks/useUI.ts`             | UI toggles (standalone, used in legacy code)                        |
| `useDocumentTitle`  | `src/hooks/useDocumentTitle.ts`  | Dynamic `<title>` with suffix                                       |
| `useFormValidation` | `src/hooks/useFormValidation.ts` | Real-time Zod-based form validation (blur + onChange after touched) |
| `useLocalStorage`   | `src/hooks/useLocalStorage.ts`   | Generic localStorage hook + `useAuth` (legacy)                      |

---

## 10. Services

| Service       | File                          | Purpose                                                                                                                              |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ApiService`  | `src/services/api.ts`         | Fetches products from FakeStore API                                                                                                  |
| `ApiClient`   | `src/services/apiClient.ts`   | Internal API client for `/api/*` routes (auto-reads JWT from AuthService, singleton `apiClient`)                                     |
| `AuthService` | `src/services/auth.ts`        | Auth service: calls server API routes for login/register, manages JWT session in localStorage, validates tokens via profile endpoint |
| `userService` | `src/services/userService.ts` | User CRUD via `apiClient`                                                                                                            |

---

## 11. Path Aliases (tsconfig.json)

```
@/*              → ./* and src/*
@/components/*   → src/components/*
@/pages/*        → src/views/*
@/hooks/*        → src/hooks/*
@/services/*     → src/services/*
@/types          → src/types/index.ts
@/utils          → src/utils/index.ts
@/constants/*    → src/constants/*
@/context        → src/context/index.ts
@/lib/*          → lib/*
@/validation/*   → src/validation/*
```

---

## 12. Scripts

| Script         | Command                         | Description                    |
| -------------- | ------------------------------- | ------------------------------ |
| `dev`          | `next dev`                      | Start Next.js dev server       |
| `build`        | `prisma generate && next build` | Generate Prisma client + build |
| `start`        | `next start`                    | Start production server        |
| `lint`         | `eslint ...`                    | Lint all JS/TS/JSX/TSX files   |
| `lint:fix`     | `eslint ... --fix`              | Auto-fix lint errors           |
| `format`       | `prettier --write ...`          | Format all source files        |
| `format:check` | `prettier --check ...`          | Check formatting               |
| `type-check`   | `tsc --noEmit`                  | TypeScript type checking       |
| `dev:vite`     | `vite`                          | Legacy Vite dev server         |
| `build:vite`   | `tsc && vite build`             | Legacy Vite build              |
| `prepare`      | `husky`                         | Setup git hooks                |
| `prisma seed`  | `tsx prisma/seed.ts`            | Seed database with demo user   |

---

## 13. Environment Variables

| Variable              | Used In                     | Description                                            |
| --------------------- | --------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`        | `prisma/schema.prisma`      | PostgreSQL connection string                           |
| `JWT_SECRET`          | `lib/auth.ts`               | Secret for JWT signing (fallback: `'fallback-secret'`) |
| `NEXT_PUBLIC_API_URL` | `src/services/apiClient.ts` | API base URL (default: `http://localhost:3000`)        |

---

## 14. Known Technical Debt & Legacy Code

1. **Dual routing system:** `react-router-dom` is still a dependency. `src/views/signIn/` uses `useNavigate` and `<Link to=...>` from react-router-dom. `src/components/protectedRoute/` also uses react-router-dom's `Navigate` and `useLocation`.
2. **Cart not persisted:** Cart and orders are in-memory (React state via `useCart` hook). The Prisma-backed cart/order API routes exist but aren't wired to the frontend.
3. **Legacy entry points:** `src/main.tsx`, `src/main.jsx`, `index.html`, `vite.config.js` are remnants from the Vite SPA setup.
4. **Category pages are thin wrappers:** `app/clothes/page.tsx`, `app/electronics/page.tsx`, etc. just render `<Home />` from `src/views/home/` — filtering is done via context state set by the Navbar's `setSearchByCategory()` call, not by the page itself.
5. **Database mismatch:** `prisma/schema.prisma` declares PostgreSQL but `prisma/dev.db` (SQLite) exists locally.
6. **`prop-types` dependency:** Listed in `package.json` but not used (TypeScript handles type checking).

---

## 15. External APIs

| API               | URL                                 | Usage                                                                 |
| ----------------- | ----------------------------------- | --------------------------------------------------------------------- |
| **FakeStore API** | `https://fakestoreapi.com/products` | Product data (id, title, price, description, category, image, rating) |

---

## 16. Deployment

- **Platform:** Vercel
- **Framework:** Next.js (auto-detected)
- **Database:** Vercel Postgres (Prisma-managed, via `DATABASE_URL`)
- **Build command:** `npm run build` (runs `prisma generate && next build`)
- **CI/CD:** GitHub Actions (`.github/workflows/ci-cd.yml`) — lint, build, deploy via Vercel CLI
- **Security headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`

---

## 17. Code Style & Conventions

- **TypeScript strict mode** enabled
- **Path aliases** via `@/` prefix for all imports
- **Component structure:** Each component is a folder with `index.tsx`
- **Naming:** camelCase folders for components/views, kebab-case for routes
- **Memoization:** `memo()` on heavy-render components (Card, Home)
- **Prettier:** Single quotes, trailing commas (ES5), 100 char width, 2-space indent
- **ESLint:** Unused vars prefixed with `_`, no explicit any (warn)

---

## 18. How to Update This File

**Keep this file in sync with the codebase.** Update the relevant sections when you:

- Add/remove a **page** → Update Section 6 (Pages & Routing)
- Add/remove an **API route** → Update Section 5 (API Routes)
- Add/remove a **component** → Update Section 8 (Component Inventory)
- Add/remove a **hook** → Update Section 9 (Custom Hooks)
- Add/remove a **service** → Update Section 10 (Services)
- Change the **data model** → Update Section 4 (Data Models)
- Add/remove a **dependency** → Update Section 2 (Tech Stack)
- Add/remove an **env variable** → Update Section 13 (Environment Variables)
- Resolve **tech debt** → Update Section 14 (Known Technical Debt)
- Change **deployment config** → Update Section 16 (Deployment)

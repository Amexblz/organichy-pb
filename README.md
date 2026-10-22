# Organichy PeaNut — Full-Stack E-Commerce Platform

> Production-ready health & sports nutrition direct-to-consumer (D2C) e-commerce platform inspired by **MyFitness.in**, powered by **Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and SQLite / PostgreSQL**.

---

## 🥜 1. Project Overview

**Organichy PeaNut** is an Indian D2C health and nutrition e-commerce platform dedicated to 32g high-protein peanut butter, zero palm oil formulas, clean dark chocolate spreads, and athlete combo bundles.

The application features three complete, isolated components:
1. **Public-Facing Storefront**: Announcement bar, dynamic hero banner carousel, collection browsing, faceted filters, real-time PIN code delivery checker, cart slide-out drawer, nutrition comparison showcase, and verified athlete reviews.
2. **Customer Portal (`/account`)**: Registration, login, password recovery, order history, package tracking, invoice preview, saved Indian addresses, and wishlist.
3. **Separate Admin Operations Panel (`/admin/*`)**: Secure role-based management dashboard with real-time analytics, product CRUD with variants, category management, order fulfillment, AWB tracking, inventory restock alerts, coupon rules engine, banner management, review moderation, and store settings.

---

## 🛠️ 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Dynamic Server Rendering)
- **Language**: TypeScript & React 18
- **Styling**: Tailwind CSS & Lucide React
- **ORM & Database**: Prisma ORM with SQLite (zero-setup local default) and full PostgreSQL compatibility
- **Authentication**: JWT sessions with `jose`, HTTP-only secure cookies, and `bcryptjs`
- **Analytics & Data**: Recharts for revenue trends, `canvas-confetti` for celebratory checkout
- **Validation**: Server-side stock checking, discount cap verification, and Indian PIN code validation

---

## 🔐 3. Default Credentials (Seeded)

### Administrator Portal (`/admin/login`)
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@organichy.com`
- **Password**: `AdminPassword@123`
- **Role**: `ADMIN` (Access to all `/admin/*` management routes)

### Demo Customer Portal (`/login`)
- **URL**: `http://localhost:3000/login`
- **Email**: `customer@gmail.com`
- **Password**: `CustomerPassword@123`
- **Role**: `CUSTOMER`

---

## 🎟️ 4. Active Promo Coupons

| Code | Type | Discount | Min Order | Description |
|---|---|---|---|---|
| `ORGANIC15` | Percentage | 15% OFF (Max ₹250) | ₹799 | 15% discount for dedicated athletes |
| `FITNESS100` | Flat INR | ₹100 FLAT OFF | ₹599 | Flat ₹100 discount on fitness orders |
| `WELCOME10` | Percentage | 10% OFF (Max ₹150) | ₹399 | Welcome offer for new customers |

---

## 🚀 5. Getting Started Locally

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Push Database Schema & Seed Data
```bash
# Push Prisma schema to create local SQLite database (dev.db)
npx prisma db push

# Populate with authentic products, images, categories, coupons, and demo data
npm run prisma:seed
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Run Automated Tests
```bash
node scripts/test-workflows.js
```

---

## 🌐 6. Key Application Routes

### Public Storefront
- `/` — Homepage with Hero Carousel, Category Pills, Bestsellers, High Protein, Nutrition Showcase, and Reviews
- `/shop` — Catalog with faceted filters (Category, Flavor, Texture, Price, Sort)
- `/collections/[slug]` — Category collections (e.g. `chocolate-collection`, `high-protein`, `natural-organic`, `combos`)
- `/products/[slug]` — Product detail page with interactive variant picker, 32g nutrition table, and PIN code delivery estimator
- `/cart` — Dedicated cart page with free shipping progress bar
- `/checkout` — Multi-step checkout with address validation and payment method selection
- `/order-success` — Order confirmation page with confetti and tracking link
- `/about` — Brand story and 4 purity pillars
- `/contact` — Contact details, operating hours, and customer query form
- `/faq` — Expandable FAQ on ingredients, shelf life, and oil separation
- `/track-order` — Order lookup by Order Number or Phone with 5-stage stepper
- `/policies/[slug]` — Dynamic legal policies (`privacy-policy`, `terms-conditions`, `shipping-policy`, `return-refund-policy`)

### Customer Account
- `/login` — Customer login
- `/register` — Customer registration
- `/forgot-password` — Password reset request
- `/account` — Account overview metrics
- `/account/orders` — Order history and shipment links
- `/account/profile` — Name, phone, and password updater
- `/account/addresses` — Saved Indian addresses manager
- `/account/wishlist` — Wishlist items with one-click Add to Cart

### Admin Management Panel
- `/admin/login` — Isolated administrator sign-in
- `/admin/dashboard` — Live sales charts, metrics, top selling products, recent orders
- `/admin/products` — Product CRUD catalog
- `/admin/products/new` — Create new product with variants and images
- `/admin/products/[id]/edit` — Edit product details and pricing
- `/admin/categories` — Category manager
- `/admin/orders` — Orders management and CSV export
- `/admin/orders/[id]` — Fulfillment status updater, AWB courier tracking, and printable GST invoice
- `/admin/inventory` — Stock levels, low-stock warnings, and stock adjustments
- `/admin/customers` — Customer directory with order counts and spend
- `/admin/coupons` — Coupon rules and usage caps
- `/admin/banners` — Homepage hero banner carousel CMS
- `/admin/reviews` — Review moderation (approve/hide/delete)
- `/admin/pages` — CMS editor for About Us, FAQ, and Policies
- `/admin/settings` — Top announcement ticker, free shipping threshold, and COD toggles

---

## 💳 7. Switching to PostgreSQL for Production

To switch from the default SQLite to a managed PostgreSQL database (e.g. Neon, Supabase, AWS RDS, Docker):

1. In `prisma/schema.prisma`, update the datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. In your `.env` file, set your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/organichydb?schema=public"
```

3. Run migrations:
```bash
npx prisma db push
npm run prisma:seed
```

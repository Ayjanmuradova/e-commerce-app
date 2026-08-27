# NORD — E-commerce (Final)

Stockholm-inspired tech storefront built for the course final assignment.

This submission includes **two repositories**:

| Project | Role | Repository |
|---------|------|------------|
| **Next.js** (this repo) | Storefront, admin panel, Auth0, Stripe Checkout UI, Prisma (MongoDB) | https://github.com/Ayjanmuradova/e-commerce-app |
| **Express.js** | Stripe webhook processing, order persistence, stock updates, Resend confirmation emails | https://github.com/Ayjanmuradova/express-backend |

---

## Live demo

**Frontend (Vercel):** https://e-commerce-app-five-coral.vercel.app

> After merging/pushing the `final-version` branch, redeploy on Vercel so the live site matches this final storefront (NORD branding, categories, favorites, discounted Stripe checkout). Update Auth0 **Allowed Callback / Logout URLs** to the Vercel domain.

---

## Demo credentials (for reviewers)

Use Auth0 login on the live site with these test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `e2e-admin@gmail.com` | `6Q#2jAcedrhYdz#` |
| **Normal user** | `e2e-user@gmail.com` | `user2026.` |

- Admin can open `/admin` (products CRUD, orders).
- Normal user can browse, favorites, cart, checkout, `/orders`, `/profile`.

---

## Features (above basic homework)

### Storefront
- Branded **NORD** home: hero, category grid, product catalog
- Product detail page (gallery, stock, quantity, discount)
- Search, category pages, favorites (per logged-in user)
- Cart with discount breakdown; Stripe Checkout with coupons for store discounts
- Orders history for signed-in users
- Mobile bottom tab bar + responsive layout
- 404 / error pages

### Admin
- Auth0 role-gated `/admin`
- Create / edit / delete products (images via Vercel Blob)
- Discount fields, stock, category
- Orders list from paid checkouts

### Payments & backend
- Stripe Checkout (Next.js `/api/checkout`)
- Stripe webhooks:
  - Next.js: `POST /api/webhooks/stripe`
  - Express: `POST /v1/stripe/webhooks` (stock + order + email)
- Per-user cart/favorites isolation in `localStorage` (no cross-user leak after logout)

---

## Local setup (Next.js)

### 1. Install

```bash
npm install
npx prisma generate
```

### 2. Environment

Copy `env.example.md` into a local `.env` and fill real values (see that file). Required groups:

- Auth0 (`AUTH0_*`, `APP_BASE_URL`)
- MongoDB (`DATABASE_URL`)
- Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`)
- Vercel Blob (`BLOB_READ_WRITE_TOKEN`)

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000

### Scripts

```bash
npm run build      # production build
npm test           # Jest unit tests
npm run test:e2e   # Playwright (needs saved Auth0 sessions in e2e/.auth/)
```

---

## Express backend

Repo: https://github.com/Ayjanmuradova/express-backend

Main responsibilities:

- Health check `GET /`
- Stripe webhook `POST /v1/stripe/webhooks` (raw body)
- Creates orders, decrements stock, sends confirmation email (Resend)

Local:

```bash
git clone https://github.com/Ayjanmuradova/express-backend.git
cd express-backend
cp .env.example .env   # fill DATABASE_URL, Stripe, Resend
npm install
npm run dev            # default PORT=8000
```

Point Stripe Dashboard webhook to your Express URL (or Next.js webhook) for `checkout.session.completed`.

---

## Deploy checklist (final submission)

1. Commit and push all final storefront work on branch `final-version`.
2. Deploy that branch on Vercel; set the same env vars as local (production `APP_BASE_URL` = Vercel URL).
3. Auth0 Application → add Vercel URLs to Callback / Logout / Web Origins.
4. Stripe → webhook endpoint + `STRIPE_WEBHOOK_SECRET` on Vercel (and/or Express host).
5. Confirm README live link + demo credentials still work after deploy.

---

## Tech stack

- **Next.js 16** (App Router), React 19, Tailwind CSS 4
- **Auth0** (`@auth0/nextjs-auth0`) with admin/user roles
- **Prisma** + MongoDB
- **Stripe** Checkout + coupons + webhooks
- **Vercel Blob** for product images
- **Express** + Prisma + Resend (separate repo)
- **Jest** + **Playwright**

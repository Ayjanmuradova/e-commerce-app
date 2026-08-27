# Environment variables (Next.js)

```bash
# App
APP_BASE_URL=http://localhost:3000

# Auth0
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=                 # openssl rand -hex 32

# Database (MongoDB)
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=        # required for /api/webhooks/stripe

# Vercel Blob (product image uploads)
BLOB_READ_WRITE_TOKEN=

# Optional: Playwright e2e mode
# PLAYWRIGHT_TEST=1
```

## Auth0 notes

- Role claim used by the app: `https://e-commerce.com/roles` (`admin` / `user`)
- Local callbacks typically:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/logout`
- Production: replace with your Vercel domain

## Express backend env

See https://github.com/Ayjanmuradova/express-backend `.env.example`:

- `PORT`, `DATABASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

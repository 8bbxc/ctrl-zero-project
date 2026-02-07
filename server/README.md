# Server (Express + Prisma)

Setup

1. Copy `.env.example` -> `.env` and fill values (DATABASE_URL, JWT_SECRET, ADMIN_SETUP_TOKEN etc.).
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Seed initial data (optional):
   ```bash
   npm run seed
   ```
   - If `DATABASE_URL` is not set, the seed script will write `prisma/seed-data.json` and `prisma/admin-seed.json` as fallbacks used by the API for development.
   - To seed an admin user, set these env vars in `server/.env` before running the seed:
     - `ADMIN_SETUP_TOKEN` (any secret token to enable admin seeding)
     - `ADMIN_EMAIL` (admin email)
     - `ADMIN_PASSWORD` (admin password)
     - `ADMIN_NAME` (admin display name)

How to seed & log in

1) Set admin environment variables in `server/.env` (example):

```
ADMIN_SETUP_TOKEN=some-secret-token
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123
ADMIN_NAME="Eng. Yazan Saadeh"
JWT_SECRET=your-jwt-secret
```

2) Run seed:

```
cd server
npm run seed
```

- If `DATABASE_URL` is set, the admin will be created in the DB (idempotent). If not, `prisma/admin-seed.json` will be written and the API will accept those credentials in development.

3) Start server and client:

```
npm run dev   # in server
cd ../client
npm run dev   # in client
```

4) Open Admin dashboard:

- Go to `http://localhost:5173/admin`
- Use the seeded credentials (email + password) to log in.

Notes

- The seed is idempotent and will not create duplicates.
- Admin seeding only runs when all required `ADMIN_*` env vars are present.
- If the DB is not available, admin credentials are stored in `prisma/admin-seed.json` (hashed) and the API will accept those credentials for login during development.
- **In production (`NODE_ENV=production`):**
  - Fallbacks are disabled. The server requires a working `DATABASE_URL` and will exit at startup if it's missing.
  - The seed will **only create missing records** and will not overwrite existing production data (no destructive updates).

PostgreSQL & pgAdmin (local setup)

1) Create a database in pgAdmin (or using psql):
   - Database name: `portfolio_db`
   - Owner: your postgres user (e.g., `postgres`)
2) Example `DATABASE_URL` (add to `server/.env`):

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/portfolio_db?schema=public"
```

3) After setting `DATABASE_URL`, run migrations and seed:

```
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Notes:
- In production, ensure `DATABASE_URL` is set and reachable before starting the server. The server will exit if the database is missing to avoid insecure fallbacks.
5. Start server:
   ```bash
   npm run dev
   ```

Endpoints

- GET /api/projects
- GET /api/projects/:slug  (response includes `gallery` and `images` arrays for screenshots)
- POST /api/projects (protected, JWT)
- PUT /api/projects/:id (protected)
- DELETE /api/projects/:id (protected)
- POST /api/contact
- POST /api/upload (protected, JWT) — accepts `files` (multipart/form-data) and optional `projectSlug`; returns `{ uploaded: ["https://.../uploads/...jpg"] }`
- POST /api/admin/register (requires `ADMIN_SETUP_TOKEN` body field)
- POST /api/admin/login

Health check

- GET /health — returns 200 only when the server and database are reachable. Example response when healthy:
  ```json
  { "ok": true, "server": true, "database": true }
  ```
  If the database is down it returns 500 with `{ ok: false, server: true, database: false }`.

Email / SMTP

- The contact form uses `nodemailer` to forward messages to the address in `DEFAULT_CONTACT_EMAIL`. Make sure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` are set in `.env` for the email forwarding to work. The server will still persist messages to the database even if SMTP is not configured.

Security

Uses `helmet`, CORS, and rate limiter. Admin routes are protected via JWT tokens.

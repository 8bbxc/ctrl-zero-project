# Personal Portfolio (MyWeb)

Full-stack personal portfolio built with React (Vite) + Express + PostgreSQL + Prisma. 

Folders:
- `client/` - React app (Vite + Tailwind)
- `server/` - Express API with Prisma ORM

Quick start

1) Server

- Copy `server/.env.example` to `server/.env` and update values (DATABASE_URL, JWT_SECRET, ADMIN_SETUP_TOKEN, SMTP...)
- Install & run:
  ```bash
  cd server
  npm install
  npx prisma generate
  npx prisma migrate dev --name init
  npm run dev
  ```

2) Client

- Copy `client/.env.example` to `client/.env` if you need to set `VITE_API_URL`.
- Install & run:
  ```bash
  cd client
  npm install
  npm run dev
  ```

Open the client at http://localhost:5173 and the API at http://localhost:4000.

Admin seeding & login (quick):

1) In `server/.env` set the admin vars:

```
ADMIN_SETUP_TOKEN=some-secret-token
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123
ADMIN_NAME="Eng. Yazan Saadeh"
JWT_SECRET=your-jwt-secret
```

2) Run:

```
cd server
npm run seed
```

- If `DATABASE_URL` is set, the admin will be created in the DB (idempotent). If not, `prisma/admin-seed.json` will be written and the API will accept those credentials in development.

Database setup (pgAdmin & local Postgres)

1) Create a PostgreSQL database using pgAdmin (local):
   - Open pgAdmin → Servers → Your server → Right-click Databases → Create → Database
   - Use **Database name**: portfolio_db
   - Use owner: your postgres user (e.g., postgres)

2) Connection string format (put this into `server/.env` as `DATABASE_URL`):

```
# Example for a local Postgres instance
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/portfolio_db?schema=public"

# Example with default postgres user:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/portfolio_db?schema=public"
```

3) After setting `DATABASE_URL`, run migrations & seed:

```
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4) Start the server and client and open the admin dashboard to log in:

```
npm run dev   # in server
cd ../client
npm run dev   # in client
# open http://localhost:5173/admin
```

See `server/README.md` for more details and security notes.

---

## How to Add Project Images (Image Asset Guide) 🔧

Follow these steps to add multi-screenshot support for your projects:

1. Where to place images
   - Create a folder in the client public assets: `client/public/projects/`.
   - Example: `client/public/projects/devlens-ai/`.

2. Naming convention
   - Use the project slug and an index for screenshots: `project-slug-1.jpg`, `project-slug-2.jpg`, `project-slug-3.jpg`.
   - Example:
     - `client/public/projects/devlens-ai/devlens-ai-1.jpg`
     - `client/public/projects/devlens-ai/devlens-ai-2.jpg`

3. Frontend usage (already implemented)
   - The frontend supports a `gallery` property (preferred) and `images` property (fallback) — both are arrays of image URLs and the UI will render a responsive carousel using `gallery` first.
   - If only `image` (single string) exists, the UI will fall back to using it as a single-slide carousel.

4. Updating the seed / database
   - Option A (recommended for quick local testing): Edit `server/prisma/seed-data.json` and add an `images` array to each project with URLs (you can use `/projects/<slug>/<file>` for local public files). Then run:
     ```bash
     cd server
     npm run seed
     ```
   - Option B (production DB): Update the project in the Admin dashboard (we can add UI later) or use Prisma directly to set the `images` field. The `Project` model includes `images String[] @default([])` so migrations are required if you change schema locally before running migrations.

5. Example entry in `seed-data.json`:

```json
{
  "title": "DevLens AI",
  "slug": "devlens-ai",
  "description": "...",
  "gallery": ["/projects/devlens-ai/devlens-ai-1.jpg", "/projects/devlens-ai/devlens-ai-2.jpg"],
  "images": ["/projects/devlens-ai/devlens-ai-1.jpg", "/projects/devlens-ai/devlens-ai-2.jpg"]
}
```

Upload images via Admin UI: Use the Admin Dashboard to upload screenshots directly to the server (protected). Uploaded files are saved under `/uploads/projects/<slug>/` and returned as absolute URLs which are saved to the project's `gallery` array. The server exposes `POST /api/upload` (authenticated) which accepts form-data `files` and optional `projectSlug` and returns `{ uploaded: ["https://.../uploads/projects/slug/...] }`.




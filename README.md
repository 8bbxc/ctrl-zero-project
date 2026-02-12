# Personal Portfolio (MyWeb)

Full-stack personal portfolio built with **React (Vite) + Express + PostgreSQL + Prisma**.

🎯 **Code-based project management** - No admin dashboard needed!

---

## 📁 Project Structure

```
MyWeb/
├── client/              React app (Vite + Tailwind)
├── server/              Express API (Prisma ORM)
├── PROJECT_MANAGEMENT.md   ← How to add/edit projects
├── CARD_DESIGN_GUIDE.md    ← Card design and layouts
└── README.md               This file
```

---

## 🚀 Quick Start

### 1️⃣ Server Setup

```bash
cd server
cp .env.example .env
# Edit .env with your values:
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET
# - ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

npm install
npx prisma generate
npx prisma migrate dev
npm run seed          # ← Loads projects from JSON
npm run dev           # Start at http://localhost:4000
```

### 2️⃣ Client Setup

```bash
cd client
cp .env.example .env
# Update VITE_API_URL if needed

npm install
npm run dev           # Start at http://localhost:5173
```

---

## ✨ Key Features

✅ **Code-Based Project Management**
- Add projects by editing `server/prisma/seed-data-projects.json`
- No admin dashboard UI
- All changes tracked in Git
- Automatic seeding on deploy

✅ **Professional Card Layouts**
- Responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- Hover effects and animations
- Sector-based color coding
- Image galleries with lightbox

✅ **Multi-Sector Portfolio**
- Medical & Healthcare
- E-Commerce
- Restaurants & Food
- Corporate & Business
- Education & Training
- Real Estate

✅ **Modern Tech Stack**
- React 18 + Vite
- Tailwind CSS
- Framer Motion animations
- Prisma ORM
- PostgreSQL
- Express.js

---

## 📋 Managing Projects

### Add a New Project

1. Edit `server/prisma/seed-data-projects.json`
2. Add new project object
3. Run: `npm run seed`
4. Git commit: `git add . && git commit -m "feat: add new project"`

**See [PROJECT_MANAGEMENT.md](./PROJECT_MANAGEMENT.md) for complete guide**

---

## 🎨 Card Design

All project cards display:
- Main image (hero)
- Project title & description
- Technology tags
- Call-to-action button
- Automatic sector color theming

When clicked → Detailed project page with:
- Full hero image (600px)
- Masonry gallery
- Full markdown content
- External links

**See [CARD_DESIGN_GUIDE.md](./CARD_DESIGN_GUIDE.md) for optimization tips**

---

## 🗄️ Database

### Schema

The project uses a clean, simple schema:

```prisma
model Project {
  id        Int      @id @default(autoincrement())
  title     String   ← Project name
  slug      String   @unique ← URL-friendly ID
  description String  ← One-liner summary
  content   String   ← Full markdown
  image     String   ← Main hero image
  gallery   String[] ← Additional images
  tags      String[] ← Technology tags
  link      String   ← Live project URL
  category  String   ← Sector (Medical, E-Commerce, etc.)
}

model Service {
  id               Int      @id @default(autoincrement())
  title            String
  slug             String   @unique
  shortDescription String
  fullContent      String   ← Detailed description
  features         String[] ← Key features list
  icon             String   ← Service icon
  image            String   ← Hero image
}
```

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
git push  # Automatically deploys to Vercel
```

### Backend (Render)

```bash
git push
# Render auto-deploys and runs npm run seed
# OR manually:
# SSH into Render → npm run seed
```

---

## 🔧 Common Commands

```bash
# Seeding
npm run seed              # Reload projects from JSON

# Database
npx prisma migrate dev    # Create new migration
npx prisma db push       # Push schema to DB
npx prisma studio       # Open Prisma Studio (GUI)

# Development
npm run dev              # Start dev server

# Cleanup
node reseed.js           # Clear all projects (fresh start)
```

---

## 📝 File Reference

| File | Purpose |
|------|---------|
| `server/prisma/seed-data-projects.json` | All projects data |
| `server/prisma/seed-data-services.json` | All services data |
| `server/prisma/seed.js` | Seed script (reads JSON files) |
| `PROJECT_MANAGEMENT.md` | How to manage projects |
| `CARD_DESIGN_GUIDE.md` | Card layout & design tips |

---

## 🎯 Workflow

### To Add a Project

```
Edit JSON → Test Locally → Commit → Push → Auto Deploy
```

**Step-by-step:**
1. Open `server/prisma/seed-data-projects.json`
2. Add new project object
3. Run `cd server && npm run seed`
4. Visit http://localhost:5173/projects (check it appears)
5. `git add . && git commit -m "feat: add new project"`
6. `git push` (auto-deploys to production)

### To Update a Project

Just edit the project in JSON, then seed & push.

### To Delete a Project

Remove from JSON, seed, and push.

---

## 🆘 Help

**See comprehensive documentation:**
- 📋 [PROJECT_MANAGEMENT.md](./PROJECT_MANAGEMENT.md) - Full project management guide
- 🎨 [CARD_DESIGN_GUIDE.md](./CARD_DESIGN_GUIDE.md) - Card design & optimization

---

## 👤 Admin

Admin functionality is intentionally removed.  
Projects are now managed purely through code commits.

If you need admin panel in future, create separate branch.

---

## 📜 License

Private portfolio - all rights reserved.

---

*Built with ❤️ using modern web technologies*  
*Last updated: February 2026*




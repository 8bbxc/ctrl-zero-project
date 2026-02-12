# 📋 PROJECT MANAGEMENT GUIDE
## Code-Based Portfolio Management System

---

## 🎯 Overview

This portfolio now uses **code-based project management**. All projects and services are managed through JSON files and Git commits. No admin dashboard required.

**Key Points:**
- 🚀 Projects added via code commits
- 📝 All data in JSON files (version controlled)
- 🔄 Single source of truth in Git
- ✨ Clean, professional workflow

---

## 📁 File Structure

```
server/
├── prisma/
│   ├── seed.js                      # Main seed script (reads JSON files)
│   ├── seed-data-projects.json      # ALL PROJECTS (edit this!)
│   ├── seed-data-services.json      # ALL SERVICES (edit this!)
│   └── schema.prisma                # Database schema
└── ..
```

---

## 🚀 ADDING A NEW PROJECT

### Step 1: Edit `seed-data-projects.json`

```json
{
  "projects": [
    {
      "title": "Your Project Name",
      "slug": "your-project-slug",
      "description": "One-line summary of the project",
      "content": "# Full markdown content...\nDetailed description here",
      "image": "https://url-to-main-image.jpg",
      "gallery": [
        "https://url-to-gallery-1.jpg",
        "https://url-to-gallery-2.jpg"
      ],
      "tags": ["React", "Node.js", "PostgreSQL"],
      "link": "https://project-live-link.com",
      "category": "Medical"  // or E-Commerce, Restaurant, Corporate, Education, Real Estate
    }
  ]
}
```

### Step 2: Required Fields Explained

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `title` | String | ✅ Yes | "ClinicHub Pro" |
| `slug` | String | ✅ Yes | "clinichub-pro" |
| `description` | String | ✅ Yes | "Complete practice management..." |
| `content` | String | ✅ Yes | "# ClinicHub Pro\n\nmarkdown content..." |
| `image` | String | ✅ Yes | Main hero image URL |
| `gallery` | Array | ✅ Yes | Additional images (min 1) |
| `tags` | Array | ✅ Yes | Technology tags |
| `link` | String | ⚠️ Optional | Live link to project |
| `category` | String | ✅ Yes | See categories below |

### Step 3: Valid Categories

```
Medical              → Healthcare & Medical projects
E-Commerce          → Online stores & marketplaces
Restaurant          → Food & hospitality
Corporate           → Business & enterprise
Education           → Learning & training platforms
Real Estate         → Property & real estate
```

### Step 4: Deploy Changes

```bash
# Option A: Local development
npm run seed
# OR
npx prisma db seed

# Option B: After pushing to GitHub
git add server/seed-data-projects.json
git commit -m "feat: add new project - Your Project Name"
git push

# Then on production (Render):
# The seed runs automatically on deploy
# OR manually run: npx prisma db seed
```

---

## 🛠️ UPDATING AN EXISTING PROJECT

### Step 1: Find the Project in `seed-data-projects.json`

Look for the project by slug:
```json
{
  "title": "ClinicHub Pro",
  "slug": "clinichub-pro",  // ← Search for this
  ...
}
```

### Step 2: Edit the Project

```json
{
  "title": "ClinicHub Pro - Enhanced",  // Changed title
  "slug": "clinichub-pro",               // Keep slug same
  "description": "Updated description...",
  "image": "https://new-image-url.jpg",  // Update image
  "gallery": [...],
  "tags": ["React", "Node.js", "PostgreSQL", "Stripe"],  // Add new tag
  "link": "https://live-update-link.com",
  "category": "Medical"
}
```

### Step 3: Deploy

```bash
git add server/seed-data-projects.json
git commit -m "update: enhanced ClinicHub Pro project details"
git push
```

---

## 🎨 MANAGING SERVICES

Services work similarly to projects. Edit `seed-data-services.json`:

```json
{
  "services": [
    {
      "title": "Full-Stack Development",
      "titleAr": "تطوير متكامل",
      "slug": "web-dev",
      "shortDescription": "Scalable web applications...",
      "fullContent": "# Full-Stack Development\n\nWe build...",
      "features": ["React & Next.js", "Node.js & Express"],
      "icon": "web-dev",
      "image": "https://service-image.jpg"
    }
  ]
}
```

---

## 🔄 SEEDING WORKFLOW

### When Seeding Happens

1. **Development**: `npm run seed` or `npx prisma db seed`
2. **Production (Render)**: Automatically on each deploy
3. **Manual**: SSH into Render and run `npx prisma db seed`

### What Seeding Does

1. ✅ Reads `seed-data-projects.json`
2. ✅ Reads `seed-data-services.json`
3. ✅ Clears existing data from database
4. ✅ Writes all projects and services to database

### Important!

> **Each seed run REPLACES all data from the JSON files.**
> Make sure your JSON files contain ALL projects you want to keep.

---

## ❌ DELETING A PROJECT

### Option 1: Remove from JSON (Recommended)

Just delete the project object from `seed-data-projects.json`:

```json
{
  "projects": [
    // Project to DELETE removed from here ↓
    {
      "title": "Project to Keep",
      ...
    }
  ]
}
```

Then seed:
```bash
npm run seed
```

### Option 2: Quick Cleanup

```bash
# Delete all and start fresh
node reseed.js
```

---

## 🎯 BEST PRACTICES

### ✅ Do's

- ✅ Use descriptive, professional titles
- ✅ Write detailed markdown `content`
- ✅ Include 3-5 gallery images
- ✅ Add relevant technology tags
- ✅ Use proper category names
- ✅ commit frequently with clear messages
- ✅ Test locally: `npm run seed`
- ✅ Use high-quality images (800px+ width)

### ❌ Don'ts

- ❌ Don't forget to include the `slug` (must be unique)
- ❌ Don't use special characters in slug (use hyphens only)
- ❌ Don't leave `gallery` array empty
- ❌ Don't use invalid categories
- ❌ Don't upload to production without testing
- ❌ Don't manually edit database (edit JSON files instead)

---

## 📐 IMAGE REQUIREMENTS

### Image Dimensions

| Use Case | Recommended Size | Format |
|----------|-----------------|--------|
| Main `image` | 800x600px or 1200x800px | JPG |
| `gallery` | 800x600px or 1200x800px | JPG |
| `services` image | 800x600px | JPG |

### Example Image URLs

Use professional stock photos:
- **Unsplash**: `https://images.unsplash.com/...`
- **Pexels**: `https://images.pexels.com/...`
- **Your server**: `https://api.yoursite.com/uploads/...`

---

## 🔍 VALIDATION CHECKLIST

Before committing, verify:

- [ ] All `title` fields are filled
- [ ] All `slug` fields follow pattern: `kebab-case-no-spaces`
- [ ] No duplicate slugs
- [ ] All `category` values are valid
- [ ] `gallery` arrays have at least 1 image
- [ ] All image URLs are valid (try opening in browser)
- [ ] JSON is valid (use VSCode JSON validator)
- [ ] Description under 150 characters
- [ ] `tags` array is not empty
- [ ] No broken markdown in `content`

---

## 🐛 TROUBLESHOOTING

### Problem: "Seed failed"

**Solution**: Check JSON syntax
```bash
node -e "console.log(require('./server/prisma/seed-data-projects.json'))"
```

### Problem: "Project not appearing after seed"

**Solution**: Make sure you ran seed:
```bash
npm run seed
```

### Problem: "Duplicate slug error"

**Solution**: Slugs must be unique. Check all projects don't have same slug:
```bash
grep '"slug"' server/prisma/seed-data-projects.json
```

### Problem: "Images not loading"

**Solution**: Verify image URLs are correct:
- Try opening URL in browser
- Check for typos
- Ensure HTTPS (not HTTP)
- Check image still exists on hosting service

---

## 📋 EXAMPLE COMPLETE PROJECT

```json
{
  "title": "ClinicHub Pro",
  "slug": "clinichub-pro",
  "description": "Complete practice management system for modern clinics and health centers",
  "content": "# ClinicHub Pro - Medical Practice Management\n\nA comprehensive solution designed for healthcare professionals to streamline patient management, appointments, and billing.\n\n## Key Features\n- Patient appointment scheduling\n- Electronic medical records (EMR)\n- Integrated billing system\n- Real-time notifications\n\n## Technologies Used\n- React for responsive UI\n- Node.js backend\n- PostgreSQL database\n- Stripe for payments",
  "image": "https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&w=800&q=80",
  "gallery": [
    "https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160648-112173f7f120?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160649-112173f7f121?auto=format&fit=crop&w=800&q=80"
  ],
  "tags": ["React", "Node.js", "PostgreSQL", "Stripe", "Healthcare"],
  "link": "https://clinichub-pro.example.com",
  "category": "Medical"
}
```

---

## 🚀 FULL WORKFLOW EXAMPLE

### Add a new project

```bash
# 1. Add to JSON
nano server/prisma/seed-data-projects.json
# Add new project object

# 2. Test locally
npm run seed

# 3. Check app shows new project
npm run dev
# Visit http://localhost:5173/projects

# 4. Commit & push
git add server/prisma/seed-data-projects.json
git commit -m "feat: add new ShopMax E-Commerce project"
git push

# 5. Deploy (automatic on Render)
# Or manually trigger seed on Render
```

---

## 📞 QUICK REFERENCE

| Task | Command |
|------|---------|
| Seed database | `npm run seed` |
| Clear database | `node reseed.js` |
| Validate JSON | `node -e "console.log(require('./server/prisma/seed-data-projects.json'))"` |
| View database | Use Render dashboard or `SELECT * FROM "Project";` |
| Test frontend | `npm run dev` then visit `/projects` |

---

## ✨ Summary

**No Admin Dashboard = No Headaches!**

1. Edit JSON files (version controlled)
2. Git commit changes
3. Push to GitHub
4. Automatic seed on deploy
5. Done! ✨

Your portfolio is now fully code-driven and professional. 🎉

---

*Last updated: February 2026*
*portfolio by [Your Name]*

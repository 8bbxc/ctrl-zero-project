# 🎨 CARD DESIGN & LAYOUT GUIDE

This guide explains how cards are displayed across the portfolio and how to optimize your projects for best appearance.

---

## 📱 Frontend Structure

### Projects Page (`/projects`)

```
┌─────────────────────────────────────┐
│     PROJECTS BY INDUSTRY            │
│                                     │
│  [Sector Card] [Sector Card] ...    │ ← Colorful sector buttons
├─────────────────────────────────────┤
│                                     │
│  Each sector shows:                 │
│  - Title (Medical & Health)         │
│  - Icon (stethoscope)               │
│  - Description                      │
│  - Hover effect: border glow        │
│  - Click → shows all projects       │
│                                     │
└─────────────────────────────────────┘
```

### Sector Projects Page (`/projects/sector/:sector`)

```
┌──────────────────────────────────────────┐
│  [Back] SECTOR NAME - Hero Section       │ ← Colored header
├──────────────────────────────────────────┤
│                                          │
│  Search | Filter | Sort Controls         │ ← Optional features
│                                          │
│  PROJECT GRID (Responsive):              │
│  ┌──────────┬──────────┬──────────┐      │
│  │ Project  │ Project  │ Project  │      │ 3 columns on large
│  │  Card 1  │  Card 2  │  Card 3  │      │ 2 columns on tablet
│  └──────────┴──────────┴──────────┘      │ 1 column on mobile
│                                          │
└──────────────────────────────────────────┘
```

### Project Card Design

```
┌──────────────────────────┐
│                          │
│   Project Image          │  ← gallery[0] or main image
│   (400x300px)            │     hover: scale + lightbox
│                          │
├──────────────────────────┤
│                          │
│ 🏷️  Project Title        │  ← Bold title
│                          │
│ Project description      │  ← 2-3 lines max
│ shown here              │
│                          │
│ 🏷️ React Node.js CSS     │  ← Technology tags
│                          │
│ [View Project →]         │  ← CTA button
│                          │
└──────────────────────────┘
  └─ Gradient border matches sector
```

---

## 🎯 Optimizable Elements

### 1. Images

**Main Image** (`image` field)
- Size: 800×600px or 1200×800px
- Format: JPG, compressed
- Purpose: Hero image shown on card
- Position: Top of card

**Gallery Images** (`gallery` array)
- Size: 800×600px
- Count: 3-5 recommended
- Purpose: Additional details
- Access: Click "View Project" → Lightbox

### 2. Title & Description

**Title** (under 60 characters)
```
Good:   "ClinicHub Pro"
Bad:    "ClinicHub Pro - Advanced Healthcare Management System"
```

**Description** (100-150 characters)
```
Good:   "Complete practice management system for modern clinics"
Bad:    "A comprehensive solution designed for healthcare...
         professionals to streamline patient management and...
         appointments and billing systems"
```

### 3. Tags

**Keep tags relevant and concise**
```json
"tags": ["React", "Node.js", "PostgreSQL", "Stripe"]
```

Max 4-5 tags per project

### 4. Category

**Must match one of:**
- Medical
- E-Commerce
- Restaurant
- Corporate
- Education
- Real Estate

---

## 🌈 Sector Colors & Icons

### Color Coding

| Sector | Color | Hex | Icon |
|--------|-------|-----|------|
| Medical | Rose/Red | #f43f5e | 🏥 Stethoscope |
| E-Commerce | Emerald/Green | #10b981 | 🛒 Shopping Cart |
| Restaurant | Orange/Amber | #f97316 | 🍽️ Utensils |
| Corporate | Blue | #3b82f6 | 💼 Briefcase |
| Education | Violet | #8b5cf6 | 🎓 Graduation Cap |
| Real Estate | Cyan | #06b6d4 | 🏢 Building |

These colors are **automatically applied** based on category!

---

## 📐 Responsive Behavior

### Desktop (1024px+)

```
3-Column Grid
┌────────┬────────┬────────┐
│ Card 1 │ Card 2 │ Card 3 │
├────────┼────────┼────────┤
│ Card 4 │ Card 5 │ Card 6 │
└────────┴────────┴────────┘
```

### Tablet (768px - 1024px)

```
2-Column Grid
┌────────┬────────┐
│ Card 1 │ Card 2 │
├────────┼────────┤
│ Card 3 │ Card 4 │
├────────┼────────┤
│ Card 5 │ Card 6 │
└────────┴────────┘
```

### Mobile (< 768px)

```
1-Column Stack
┌────────┐
│ Card 1 │
├────────┤
│ Card 2 │
├────────┤
│ Card 3 │
└────────┘
```

---

## ✨ Card Features

### Hover Effects

```
DESKTOP:
- Border glow (sector color)
- Image scale-up (1.05x)
- Shadow enhancement
- Title highlight

MOBILE:
- Tap to view details
- Native scroll behavior
```

### Interactions

**Click on Card** → Navigate to `/projects/:slug`

**View details page shows:**
- Large hero image (600px height)
- Masonry gallery
- Tags
- Full content
- Call-to-action buttons
- Navigate to previous/next project

---

## 🎨 Design Consistency

### Typography

```
Title:        Bold, 1.25rem
Description:  Regular, 0.95rem  
Tags:         Small, 0.85rem, uppercase
CTA Button:   Medium, 0.95rem
```

### Spacing

```
Card padding:       1rem
Grid gap:           1.5rem (desktop)
Section margin:     2rem top/bottom
Between elements:   0.5rem
```

### Shadows

```
Card default:   shadow-lg
Card hover:     shadow-xl + color-glow
Image hover:    shadow-xl
```

---

## 📊 Best Practices

### ✅ Do's

1. **Use high-quality images**
   - Clear, professional photos
   - Well-lit, good composition
   - Relevant to project

2. **Write compelling descriptions**
   - State problem solved
   - Highlight key features
   - Call to action

3. **Choose relevant tags**
   - Use actual technologies
   - 3-5 tags maximum
   - Consistent naming

4. **Test responsiveness**
   - Check mobile view
   - Verify images load
   - Test click interactions

### ❌ Don'ts

1. **Avoid**
   - Blurry/low-res images
   - Overly long descriptions
   - Too many tags (>5)
   - Poor color contrast

2. **Don't use**
   - Placeholder images
   - Broken image links
   - Invalid categories
   - Special characters in slug

---

## 🔗 URLs & Links

### Valid Image URLs

```
✅ https://images.unsplash.com/photo-...
✅ https://images.pexels.com/...
✅ https://your-cdn.com/images/project.jpg
❌ http://... (must be HTTPS)
❌ file:///... (local paths)
❌ Relative paths
```

### Valid Project Links

```
✅ "https://live-project.com"
✅ "https://github.com/username/project"
✅ "https://demo.example.com"
❌ "www.example.com" (missing https://)
❌ "project.com"
```

---

## 🖼️ Image Examples

### Good Project Card Setup

```json
{
  "title": "ClinicHub Pro",
  "image": "https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&w=800&q=80",
  "gallery": [
    "https://images.unsplash.com/photo-1576091160550-112173f7f869?...",
    "https://images.unsplash.com/photo-1576091160648-112173f7f120?...",
    "https://images.unsplash.com/photo-1576091160623-112411f7a5ca?...",
    "https://images.unsplash.com/photo-1579154204601-01d430c69e61?..."
  ]
}
```

### Image Quality Checklist

- [ ] Main image is at least 800×600px
- [ ] All gallery images are same resolution
- [ ] Images are JPEG (smaller file size)
- [ ] No watermarks visible
- [ ] Images are professional quality
- [ ] Aspect ratio is consistent

---

## 🎯 Performance Tips

### Optimize Images

```bash
# Compress images before uploading
# Use ImageOptim, TinyPNG, or online tools

# Original: 500KB → Optimized: 50KB
# Faster load, better UX
```

### Lazy Loading

Cards use lazy loading:
- Images load only when visible
- Improves page performance
- Better mobile experience

### Caching

- Browser caches images
- CDN caches static assets
- faster subsequent loads

---

## 📝 Complete Example

See [seed-data-projects.json](./server/prisma/seed-data-projects.json) for complete working examples with:
- All required fields
- Valid image URLs
- Proper structure
- Real project data

---

## 🆘 Troubleshooting

### Problem: Images not showing

**Solution:**
1. Check URL is HTTPS
2. Try opening URL in browser
3. Verify image still exists
4. Check for typos

### Problem: Card looks stretched

**Solution:**
1. Ensure image is 4:3 ratio (800×600)
2. Avoid very wide/tall images
3. Use consistent aspect ratios

### Problem: Text is cut off

**Solution:**
1. Shorten description to <150 chars
2. Use shorter title (<60 chars)
3. Reduce number of tags

---

## ✨ Summary

**Perfect Card = Great Image + Clear Description + Relevant Tags + Valid Link**

1. 📸 High-quality image (4:3 ratio, 800×600px)
2. 💬 Concise description (1-2 sentences)
3. 🏷️ 3-5 relevant technology tags
4. 🔗 Working live link / GitHub repo
5. 📚 Rich project content (markdown)

Follow this guide and your projects will look professional on all devices! 🎉

---

*Last updated: February 2026*

# 🎯 Dashboard Setup - Complete Guide

## ✅ Setup Complete!

Your dashboard is now fully configured and ready to use.

---

## 🔑 Admin Login Credentials

```
Email:    Yazan@2006.com
Password: Yazan@2006.com
```

---

## 📊 What's Been Added

### Projects (3 Total)
1. **DevLens AI** - Google Gemini API integration project
2. **Najah Hub** - Full-stack educational platform (MERN)
3. **My Portfolio** - This portfolio website (PostgreSQL + Prisma)

### Services (6 Total)
1. 🚀 Full Stack Web Development
2. 🗄️ Database Design & Optimization
3. 🔌 API Development
4. 🎨 Frontend Development
5. 🔐 Authentication & Security
6. ⚙️ Deployment & DevOps

### Messages
Currently: 0 (will track contact form submissions)

---

## 🚀 How to Run Locally

### 1. Start the Backend Server
```bash
cd MyWeb/server
npm run dev
```
Server will run on: **http://localhost:4000**

### 2. Start the Frontend (in another terminal)
```bash
cd MyWeb/client
npm run dev
```
Frontend will run on: **http://localhost:5173**

### 3. Access Admin Dashboard
1. Open: **http://localhost:5173/admin**
2. Login with credentials above
3. Manage projects, services, and messages

---

## 📝 What You Can Do in the Admin Dashboard

### Projects Management
- ✏️ **Edit** - Double-click any project to edit
- 🖼️ **Upload Images** - Add main image and gallery images
- 🏷️ **Add Tags** - Add technology tags (React, Node.js, etc.)
- 🔗 **Add Links** - Link to live demo or GitHub repo
- 🗑️ **Delete** - Remove projects you no longer want

### Services Management
- ✏️ **Edit** - Update service descriptions
- 🖼️ **Upload Images** - Add service hero images
- ✨ **Add Icons** - Include emoji icons
- 🗑️ **Delete** - Remove old services

### Messages Management
- 📧 **View** - See all contact form submissions
- ✅ **Mark as Read** - Track which messages you've read
- 🗑️ **Delete** - Remove old messages

---

## 🔒 Security Notes

- **JWT Authentication** - All admin routes are protected with JWT tokens
- **Password Hashing** - Passwords are hashed with bcrypt (never stored in plain text)
- **CORS Protection** - API only accepts requests from authorized origins
- **Rate Limiting** - API requests are rate-limited to prevent abuse

---

## 🌐 Production Deployment

### Frontend (Vercel)
- Deployed to: https://ctrl-zero.vercel.app
- Environment variable needed: `VITE_API_BASE_URL`
- Should point to your backend URL on Render

### Backend (Render)
- Database: PostgreSQL on Render
- Environment variables needed:
  - `DATABASE_URL` - PostgreSQL connection string
  - `JWT_SECRET` - Strong secret for JWT tokens
  - `CLIENT_ORIGIN` - Frontend URL (for CORS)
  - `ADMIN_EMAIL` - Admin user email
  - `ADMIN_PASSWORD` - Admin user password

---

## 📂 Project Structure

```
MyWeb/
├── client/              # React frontend with Vite
│   ├── src/
│   │   ├── pages/AdminDashboard.jsx    ← Admin panel
│   │   ├── services/api.js              ← API client
│   │   └── components/
│   └── index.html
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── projects.js
│   │   │   ├── services.js
│   │   │   ├── auth.js                  ← Login endpoint
│   │   │   ├── contact.js
│   │   │   └── messages.js
│   │   ├── middleware/auth.js           ← JWT protection
│   │   └── index.js
│   ├── prisma/schema.prisma             ← Database schema
│   └── setup-dashboard.js               ← This setup script
└── README.md
```

---

## 🛠️ Useful Commands

### Backend
```bash
# Start development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Setup admin and seed data
node setup-dashboard.js

# View database
npx prisma studio
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### "Cannot connect to API"
- Make sure backend server is running on port 4000
- Check that `VITE_API_BASE_URL` is set correctly
- Verify CORS is allowing your frontend origin

### "Login failed"
- Double-check email: `Yazan@2006.com`
- Double-check password: `Yazan@2006.com`
- Make sure backend server is running

### "Images not uploading"
- Check that `/uploads` directory exists
- Verify Cloudinary credentials in `.env`
- Check browser console for specific errors

### "Database connection failed"
- Verify `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running
- Test connection: `npx prisma db push`

---

## 📞 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login with email/password

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get specific project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Messages
- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all messages (admin only)
- `DELETE /api/messages/:id` - Delete message (admin only)

### Upload
- `POST /api/upload` - Upload single image
- `POST /api/upload/gallery` - Upload gallery images

---

## 🎉 You're All Set!

Everything is configured and ready to go. Start the servers and begin managing your portfolio!

**Questions?** Check the code comments or review the route files for implementation details.

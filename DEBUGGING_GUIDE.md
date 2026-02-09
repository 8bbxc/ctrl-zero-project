# 🔧 Debugging Guide - PUT /api/projects/:id 500 Error Fix

## 📌 Executive Summary

**Problem**: Production API returning 500 errors on project updates
**Root Cause**: Wrong API endpoint URL + insufficient error handling
**Solution**: Fixed URL + enhanced validation
**Status**: ✅ Committed and pushed to GitHub (commit: 7bf8ba4)

---

## 🔴 Original Problem

### Error Pattern
```
Browser Console Error (5+ times):
POST /projects/50 - Save 500 Internal Server Error
AxiosError: Request failed with status code 500
```

### Affected Operation
- **Endpoint**: `PUT /api/projects/50`
- **Server**: `https://ctrl-zero-0.onrender.com`
- **Client**: AdminDashboard.jsx handleSave()

---

## ✅ Fixes Applied

### Fix #1: Correct API Base URL
**File** `client/src/services/api.js` (Line 8)

**Before**:
```javascript
return import.meta.env.VITE_API_BASE_URL || 'https://ctrl-zero-api.onrender.com';
```

**After**:
```javascript
return 'https://ctrl-zero-0.onrender.com'; // Correct Render URL
```

**Why**: API was pointing to wrong server domain. The actual server is at `ctrl-zero-0.onrender.com`, not `ctrl-zero-api.onrender.com`.

---

### Fix #2: Increased Request Timeout
**File** `client/src/services/api.js` (Line 19)

**Before**:
```javascript
timeout: 8000 // 8 seconds
```

**After**:
```javascript
timeout: 15000 // 15 seconds
```

**Why**: Render free tier is slow, especially on first cold requests. 8 seconds may timeout legitimate requests to database.

---

### Fix #3: Enhanced PUT Endpoint Validation
**File** `server/src/routes/projects.js` (Lines 106-150)

**Changes**:

#### 3a. ID Validation
```javascript
const parsedId = parseInt(id);
if (isNaN(parsedId)) {
  return res.status(400).json({ error: 'Invalid project ID' });
}
```
**Prevents**: Passing invalid project IDs to database

#### 3b. Field Validation
```javascript
if (!title || !title.trim()) {
  return res.status(400).json({ error: 'Title is required' });
}
if (!slug || !slug.trim()) {
  return res.status(400).json({ error: 'Slug is required' });
}
```
**Prevents**: Saving empty titles or slugs

#### 3c. Slug Format Validation
```javascript
const slugRegex = /^[a-z0-9-_]+$/;
if (!slugRegex.test(slug.trim())) {
  return res.status(400).json({ error: 'Slug format invalid' });
}
```
**Prevents**: Invalid slug formats that violate database constraints

#### 3d. Existence Check
```javascript
const existingProject = await prisma.project.findUnique({
  where: { id: parsedId }
});
if (!existingProject) {
  return res.status(404).json({ error: 'Project not found' });
}
```
**Prevents**: Attempting update on non-existent projects

#### 3e. Data Trimming
```javascript
title: title.trim(),
slug: slug.trim(),
description: description || '',
content: content || ''
```
**Prevents**: Save whitespace or undefined values

#### 3f. Enhanced Error Logging
```javascript
console.error('Update Project Error:', {
  message: error.message,
  code: error.code,
  stack: error.stack
});
res.status(500).json({ error: 'Failed to update project', details: error.message });
```
**Provides**: Detailed error information for debugging

---

## 🧪 Testing Guide

### Local Testing Setup

#### 1. Start Development Server
```bash
cd MyWeb/server
npm install
npm run dev
# Server running on http://localhost:4000
```

#### 2. Start Development Client
```bash
cd MyWeb/client
npm run dev
# Client running on http://localhost:5173
```

#### 3. Get Authentication Token
In frontend, login via AdminDashboard:
- Email: admin@example.com
- Password: (check database)
- Copy token from browser localStorage under key `token`

#### 4. Test Update Endpoint
```bash
# Option A: Using curl
curl -X PUT http://localhost:4000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Title",
    "slug": "test-title",
    "description": "Test",
    "content": "Test content",
    "category": "Test"
  }'

# Option B: Using the test script
bash test-api.sh
```

#### 5. Expected Success Response
```json
{
  "id": 1,
  "title": "Test Title",
  "slug": "test-title",
  "description": "Test",
  "content": "Test content",
  "category": "Test",
  "image": "existing_url",
  "link": "existing_url",
  "tags": [],
  "gallery": [],
  "createdAt": "2025-02-05T15:57:18.000Z",
  "updatedAt": "2025-02-07T10:00:00.000Z"
}
```

---

## 🐛 Debugging Common Errors

### Error: "Invalid project ID"
- **Cause**: ID is not a valid integer
- **Solution**: Check project exists and ID is correct

### Error: "Project not found"
- **Cause**: ID doesn't exist in database
- **Solution**: Verify project ID in database using GET /projects

### Error: "Slug is already taken"
- **Cause**: Another project has same slug
- **Solution**: Check AdminDashboard, use unique slug

### Error: "Slug must contain only lowercase..."
- **Cause**: Slug has invalid characters
- **Solution**: Use only letters, numbers, hyphens, underscores

### Error: "403 Unauthorized"
- **Cause**: Token missing or invalid
- **Solution**: Login again, copy fresh token to tests

### Error: "408 Request Timeout"
- **Cause**: Server slow (Render cold start)
- **Solution**: Try again, Render will be warmer on second request

---

## 📊 Deployment to Production

### Step 1: Verify Local Tests
```bash
# Ensure local API works correctly
npm run dev  # in server folder
# Test endpoints manually
```

### Step 2: Push to GitHub
```bash
cd MyWeb
git add -A
git commit -m "Fix API endpoint URL and enhance validation"
git push origin main
```
✅ Already done in commit 7bf8ba4

### Step 3: Deploy to Render
Render auto-deploys on GitHub push. Monitor:
- Dashboard: https://dashboard.render.com/services
- Logs tab for deployment status
- Check for "Build successful"

### Step 4: Test in Production
```bash
# Test production API health
curl https://ctrl-zero-0.onrender.com/health

# Test in browser
# 1. Visit https://ctrl-zero.vercel.app
# 2. Login to AdminDashboard
# 3. Try to save a project
# 4. Check browser console for success or errors
```

---

## 🔍 Health Check Endpoints

### Local
```bash
curl http://localhost:4000/health
# Should return: {"ok": true, "server": true, "database": true}
```

### Production
```bash
curl https://ctrl-zero-0.onrender.com/health
# Should return: {"ok": true, "server": true, "database": true}
```

If `database: false`, PostgreSQL connection is down.

---

## 📈 Performance Improvements

| Aspect | Before | After | Impact |
|--------|--------|-------|--------|
| API Timeout | 8s | 15s | Better for slow requests |
| Validation | Minimal | Comprehensive | Catches errors early |
| Error Messages | Generic | Detailed | Easier debugging |
| Project Check | No | Yes | Prevents database errors |
| URL Routing | Wrong endpoint | Correct endpoint | Requests reach server |

---

## 📝 Code Review Checklist

- ✅ API URL corrected to `ctrl-zero-0.onrender.com`
- ✅ Timeout increased to 15 seconds
- ✅ ID validation added (isNaN check)
- ✅ Project existence check added
- ✅ Slug format validation added
- ✅ String trimming applied
- ✅ Error logging enhanced
- ✅ Build succeeds (544 modules)
- ✅ Commit pushed to GitHub
- ✅ Test script created

---

## 🚀 Next Steps

1. **Monitor Deployment**
   - Check Render dashboard for successful build
   - Watch logs for any startup errors

2. **Test in Production**
   - Try AdminDashboard save function
   - Verify projects are updating correctly

3. **User Feedback**
   - Test all create/read/update/delete operations
   - Report any remaining 500 errors

4. **Performance Monitoring**
   - Check response times in browser DevTools
   - Monitor Render dashboard for resource usage

---

## 📞 Support

If issues persist:

1. **Check server logs**
   - Render Dashboard → Service → Logs tab
   - Look for error messages around the timestamp of failure

2. **Check database connection**
   - Run: `curl https://ctrl-zero-0.onrender.com/health`
   - If database is false, PostgreSQL connection failed

3. **Run local tests**
   - Verify changes work locally before production
   - Use `npm run dev` to start development server

4. **Review git commit**
   - Check changes: `git show 7bf8ba4`
   - Verify fixes are in your code

---

**Last Updated**: 2025-02-07
**Status**: ✅ Fixes implemented and pushed
**Commit**: 7bf8ba4
**Branch**: main

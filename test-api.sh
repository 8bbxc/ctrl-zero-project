#!/bin/bash
# 📝 API Test Script - Test All Endpoints
# استخدم هذا الـ script للتأكد من عمل الـ API محليّاً

API_URL="http://localhost:4000/api"
AUTH_TOKEN=""  # ستحتاج لملء هذا بـ token فعلي من تسجيل الدخول

echo "🚀 Starting API Tests..."
echo "📍 API URL: $API_URL"
echo ""

# --- 1. Health Check ---
echo "✅ Test 1: Health Check"
curl -s "${API_URL%/api}/health" | jq . || echo "❌ Failed"
echo ""

# --- 2. Get All Projects ---
echo "✅ Test 2: Get All Projects"
curl -s "$API_URL/projects" | jq '. | length' || echo "❌ Failed"
echo ""

# --- 3. Get Single Project ---
echo "✅ Test 3: Get Single Project"
PROJECT_ID=1
curl -s "$API_URL/projects/$PROJECT_ID" | jq . || echo "❌ Failed"
echo ""

# --- 4. Create New Project (requires auth) ---
echo "✅ Test 4: Create Project (requires auth)"
if [ -z "$AUTH_TOKEN" ]; then
  echo "⚠️  Skipping - AUTH_TOKEN not set"
else
  curl -s -X POST "$API_URL/projects" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "title": "Test Project",
      "slug": "test-project-'$(date +%s)'",
      "description": "Test Description",
      "content": "Test Content",
      "category": "Testing",
      "tags": ["test", "api"]
    }' | jq . || echo "❌ Failed"
fi
echo ""

# --- 5. Update Project (CRITICAL TEST) ---
echo "✅ Test 5: Update Project (PUT - CRITICAL)"
if [ -z "$AUTH_TOKEN" ]; then
  echo "⚠️  Skipping - AUTH_TOKEN not set"
  echo "   To test: Set AUTH_TOKEN='your_token' before running"
else
  curl -s -X PUT "$API_URL/projects/1" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "title": "Updated Test Project",
      "slug": "updated-test-project",
      "description": "Updated Description",
      "content": "Updated Content",
      "category": "Updated",
      "tags": ["updated", "test"]
    }' | jq . || echo "❌ Failed"
fi
echo ""

# --- 6. Get All Services ---
echo "✅ Test 6: Get All Services"
curl -s "$API_URL/services" | jq '. | length' || echo "❌ Failed"
echo ""

echo "✅ Tests Complete!"
echo ""
echo "📋 For manual testing (requires jq installed):"
echo "  https://jqlang.github.io/jq/download/"
echo ""
echo "💡 To run this script:"
echo "  1. Start server: npm run dev (or node index.js)"
echo "  2. Get auth token from login response"
echo "  3. Run: AUTH_TOKEN='token' bash test-api.sh"

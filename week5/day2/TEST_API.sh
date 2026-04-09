#!/usr/bin/env bash
# API Testing Examples using curl

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "${BLUE}=== COMMENT SYSTEM API TESTING ===${NC}\n"

# ============================================
# 1. AUTHENTICATION
# ============================================

echo -e "${BLUE}1. AUTHENTICATION${NC}"
echo -e "${GREEN}→ Registering new user...${NC}"

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
  }')

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

echo "Access Token: $ACCESS_TOKEN"
echo "User ID: $USER_ID"
echo -e "Response:\n$REGISTER_RESPONSE\n"

# ============================================
# 2. USER OPERATIONS
# ============================================

echo -e "${BLUE}2. USER OPERATIONS${NC}"

echo -e "${GREEN}→ Get all users...${NC}"
curl -s -X GET "$BASE_URL/users" | jq . | head -20
echo ""

echo -e "${GREEN}→ Update user profile...${NC}"
curl -s -X PATCH "$BASE_URL/users/profile/$USER_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated",
    "bio": "Software developer and tech enthusiast",
    "profilePicture": "https://example.com/profile.jpg"
  }' | jq .
echo ""

# ============================================
# 3. COMMENT OPERATIONS
# ============================================

echo -e "${BLUE}3. COMMENT OPERATIONS${NC}"

echo -e "${GREEN}→ Create a comment...${NC}"
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/comments" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my first comment!"
  }')

COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Comment ID: $COMMENT_ID"
echo "Response:"
echo $COMMENT_RESPONSE | jq .
echo ""

echo -e "${GREEN}→ Get all comments...${NC}"
curl -s -X GET "$BASE_URL/comments" | jq . | head -30
echo ""

echo -e "${GREEN}→ Create a reply to comment...${NC}"
REPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/comments" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"Thanks for the comment!\",
    \"parentCommentId\": \"$COMMENT_ID\"
  }")

REPLY_ID=$(echo $REPLY_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Reply ID: $REPLY_ID"
echo "Response:"
echo $REPLY_RESPONSE | jq .
echo ""

# ============================================
# 4. LIKE OPERATIONS
# ============================================

echo -e "${BLUE}4. LIKE OPERATIONS${NC}"

echo -e "${GREEN}→ Like a comment...${NC}"
curl -s -X POST "$BASE_URL/likes/$COMMENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

echo -e "${GREEN}→ Check if liked...${NC}"
curl -s -X GET "$BASE_URL/likes/check/$COMMENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

echo -e "${GREEN}→ Get comment likes...${NC}"
curl -s -X GET "$BASE_URL/likes/comment/$COMMENT_ID" | jq .
echo ""

# ============================================
# 5. NOTIFICATION OPERATIONS
# ============================================

echo -e "${BLUE}5. NOTIFICATION OPERATIONS${NC}"

echo -e "${GREEN}→ Get notifications...${NC}"
curl -s -X GET "$BASE_URL/notifications?limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq . | head -30
echo ""

echo -e "${GREEN}→ Get unread count...${NC}"
curl -s -X GET "$BASE_URL/notifications/unread-count" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

# ============================================
# 6. FOLLOW OPERATIONS
# ============================================

echo -e "${BLUE}6. FOLLOW OPERATIONS${NC}"

# Get another user to follow
ANOTHER_USER=$(curl -s -X GET "$BASE_URL/users" | jq -r '.[1]._id')

if [ -n "$ANOTHER_USER" ] && [ "$ANOTHER_USER" != "null" ]; then
  echo -e "${GREEN}→ Following user: $ANOTHER_USER${NC}"
  curl -s -X POST "$BASE_URL/users/follow/$ANOTHER_USER" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
  echo ""

  echo -e "${GREEN}→ Get followers...${NC}"
  curl -s -X GET "$BASE_URL/users/followers/$ANOTHER_USER" | jq .
  echo ""
fi

# ============================================
# 7. UPDATE AND DELETE
# ============================================

echo -e "${BLUE}7. UPDATE AND DELETE${NC}"

echo -e "${GREEN}→ Update comment...${NC}"
curl -s -X PATCH "$BASE_URL/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment content!"
  }' | jq .
echo ""

echo -e "${GREEN}→ Unlike comment...${NC}"
curl -s -X DELETE "$BASE_URL/likes/$COMMENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

# ============================================
# 8. LOGIN TEST
# ============================================

echo -e "${BLUE}8. LOGIN TEST${NC}"

echo -e "${GREEN}→ Login with registered user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }')

echo "Response:"
echo $LOGIN_RESPONSE | jq .
echo ""

echo -e "${GREEN}Testing complete!${NC}"

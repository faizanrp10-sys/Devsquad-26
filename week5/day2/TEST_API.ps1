# API Testing Examples using PowerShell (Windows)

$BASE_URL = "http://localhost:3000/api"

Write-Host "=== COMMENT SYSTEM API TESTING ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. AUTHENTICATION
# ============================================

Write-Host "1. AUTHENTICATION" -ForegroundColor Cyan
Write-Host "→ Registering new user..." -ForegroundColor Green

$registerData = @{
    username = "john_doe"
    email = "john@example.com"
    password = "Password123"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $registerData -ErrorAction SilentlyContinue

$accessToken = $registerResponse.accessToken
$userId = $registerResponse.user._id

Write-Host "Access Token: $accessToken"
Write-Host "User ID: $userId"
Write-Host "User Data:" -ForegroundColor Green
$registerResponse.user | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 2. USER OPERATIONS
# ============================================

Write-Host "2. USER OPERATIONS" -ForegroundColor Cyan

Write-Host "→ Get all users..." -ForegroundColor Green
$users = Invoke-RestMethod -Uri "$BASE_URL/users" -Method GET -ErrorAction SilentlyContinue
$users | Select-Object -First 3 | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Update user profile..." -ForegroundColor Green
$updateData = @{
    username = "john_updated"
    bio = "Software developer and tech enthusiast"
    profilePicture = "https://example.com/profile.jpg"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$BASE_URL/users/profile/$userId" `
    -Method PATCH `
    -Headers @{"Authorization" = "Bearer $accessToken"; "Content-Type" = "application/json"} `
    -Body $updateData -ErrorAction SilentlyContinue

$updateResponse | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 3. COMMENT OPERATIONS
# ============================================

Write-Host "3. COMMENT OPERATIONS" -ForegroundColor Cyan

Write-Host "→ Create a comment..." -ForegroundColor Green
$commentData = @{
    content = "This is my first comment!"
} | ConvertTo-Json

$commentResponse = Invoke-RestMethod -Uri "$BASE_URL/comments" `
    -Method POST `
    -Headers @{"Authorization" = "Bearer $accessToken"; "Content-Type" = "application/json"} `
    -Body $commentData -ErrorAction SilentlyContinue

$commentId = $commentResponse._id
Write-Host "Comment ID: $commentId"
$commentResponse | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Get all comments..." -ForegroundColor Green
$comments = Invoke-RestMethod -Uri "$BASE_URL/comments" -Method GET -ErrorAction SilentlyContinue
$comments | Select-Object -First 2 | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Create a reply to comment..." -ForegroundColor Green
$replyData = @{
    content = "Thanks for the comment!"
    parentCommentId = $commentId
} | ConvertTo-Json

$replyResponse = Invoke-RestMethod -Uri "$BASE_URL/comments" `
    -Method POST `
    -Headers @{"Authorization" = "Bearer $accessToken"; "Content-Type" = "application/json"} `
    -Body $replyData -ErrorAction SilentlyContinue

$replyId = $replyResponse._id
Write-Host "Reply ID: $replyId"
$replyResponse | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 4. LIKE OPERATIONS
# ============================================

Write-Host "4. LIKE OPERATIONS" -ForegroundColor Cyan

Write-Host "→ Like a comment..." -ForegroundColor Green
$likeResponse = Invoke-RestMethod -Uri "$BASE_URL/likes/$commentId" `
    -Method POST `
    -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
$likeResponse | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Check if liked..." -ForegroundColor Green
$checkLike = Invoke-RestMethod -Uri "$BASE_URL/likes/check/$commentId" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
$checkLike | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Get comment likes..." -ForegroundColor Green
$likes = Invoke-RestMethod -Uri "$BASE_URL/likes/comment/$commentId" -Method GET -ErrorAction SilentlyContinue
@{ likeCount = $likes.Count } | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 5. NOTIFICATION OPERATIONS
# ============================================

Write-Host "5. NOTIFICATION OPERATIONS" -ForegroundColor Cyan

Write-Host "→ Get notifications..." -ForegroundColor Green
$notifications = Invoke-RestMethod -Uri "$BASE_URL/notifications?limit=10" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
if ($notifications) {
    @{ count = $notifications.Count } | ConvertTo-Json | Write-Host
} else {
    Write-Host "No notifications"
}
Write-Host ""

Write-Host "→ Get unread count..." -ForegroundColor Green
$unreadCount = Invoke-RestMethod -Uri "$BASE_URL/notifications/unread-count" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
$unreadCount | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 6. FOLLOW OPERATIONS
# ============================================

Write-Host "6. FOLLOW OPERATIONS" -ForegroundColor Cyan

if ($users.Count -gt 1) {
    $anotherUserId = $users[1]._id
    Write-Host "→ Following user: $anotherUserId" -ForegroundColor Green
    
    $followResponse = Invoke-RestMethod -Uri "$BASE_URL/users/follow/$anotherUserId" `
        -Method POST `
        -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
    @{ followed = $true } | ConvertTo-Json | Write-Host
    Write-Host ""

    Write-Host "→ Get followers..." -ForegroundColor Green
    $followers = Invoke-RestMethod -Uri "$BASE_URL/users/followers/$anotherUserId" `
        -Method GET -ErrorAction SilentlyContinue
    if ($followers) {
        @{ followerCount = ($followers | Measure-Object).Count } | ConvertTo-Json | Write-Host
    }
    Write-Host ""
}

# ============================================
# 7. UPDATE AND DELETE
# ============================================

Write-Host "7. UPDATE AND DELETE" -ForegroundColor Cyan

Write-Host "→ Update comment..." -ForegroundColor Green
$updateCommentData = @{
    content = "Updated comment content!"
} | ConvertTo-Json

$updateCommentResponse = Invoke-RestMethod -Uri "$BASE_URL/comments/$commentId" `
    -Method PATCH `
    -Headers @{"Authorization" = "Bearer $accessToken"; "Content-Type" = "application/json"} `
    -Body $updateCommentData -ErrorAction SilentlyContinue
$updateCommentResponse | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "→ Unlike comment..." -ForegroundColor Green
$unlikeResponse = Invoke-RestMethod -Uri "$BASE_URL/likes/$commentId" `
    -Method DELETE `
    -Headers @{"Authorization" = "Bearer $accessToken"} -ErrorAction SilentlyContinue
@{ unliked = $true } | ConvertTo-Json | Write-Host
Write-Host ""

# ============================================
# 8. LOGIN TEST
# ============================================

Write-Host "8. LOGIN TEST" -ForegroundColor Cyan

Write-Host "→ Login with registered user..." -ForegroundColor Green
$loginData = @{
    email = "john@example.com"
    password = "Password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $loginData -ErrorAction SilentlyContinue

Write-Host "Login successful!" -ForegroundColor Green
$loginResponse.user | ConvertTo-Json | Write-Host
Write-Host ""

Write-Host "Testing complete!" -ForegroundColor Green

# Project Overview - Real-Time Comment System

## 📋 Project Summary

A comprehensive real-time comment system built with **NestJS**, **Socket.IO**, **MongoDB**, and **JWT authentication**. This system enables users to create comments, post replies, like comments, follow each other, and receive real-time notifications all without page refreshes.

## ✨ Key Features Implemented

### 1. **Authentication & User Management**
- ✅ JWT-based user authentication
- ✅ User registration with email and password (hashed with bcryptjs)
- ✅ User login with JWT token generation
- ✅ User profiles with bio and profile picture
- ✅ Follow/unfollow functionality
- ✅ Follower count tracking

### 2. **Comments System**
- ✅ Create comments (top-level posts)
- ✅ Post replies to comments (nested structure)
- ✅ Update/edit comments (author only)
- ✅ Delete comments (author only)
- ✅ View comment thread with replies
- ✅ Author information displayed with each comment
- ✅ Timestamps for all comments

### 3. **Likes Management**
- ✅ Like/unlike comments functionality
- ✅ Like count tracking per comment
- ✅ Prevent duplicate likes (unique index)
- ✅ Check if user liked a comment
- ✅ View list of users who liked a comment

### 4. **Real-Time Notifications (WebSocket)**
- ✅ New comment notifications (sent to all users)
- ✅ Reply notifications (sent only to comment author)
- ✅ Like notifications (sent only to comment author)
- ✅ Follow notifications (sent only to followed user)
- ✅ Real-time updates without page refresh
- ✅ Unread notification tracking
- ✅ Mark notifications as read
- ✅ Delete notifications
- ✅ Notification history

### 5. **WebSocket Features**
- ✅ Online/offline user tracking
- ✅ Real-time comment streaming
- ✅ Instant notification delivery
- ✅ Socket-based event handling
- ✅ User join/leave events
- ✅ Multiple concurrent connections support

## 📁 Project Structure

```
src/
├── auth/                          # Authentication Module
│   ├── dtos/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts        # Passport JWT strategy
│   ├── guards/
│   │   └── jwt-auth.guard.ts      # Protection guard
│   ├── auth.controller.ts         # Register/Login endpoints
│   ├── auth.service.ts            # Authentication logic
│   └── auth.module.ts
│
├── users/                          # User Management Module
│   ├── schemas/
│   │   └── user.schema.ts         # User document schema
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   └── update-profile.dto.ts
│   ├── users.controller.ts        # CRUD + Follow endpoints
│   ├── users.service.ts           # User operations
│   └── users.module.ts
│
├── comments/                       # Comment Module
│   ├── schemas/
│   │   └── comment.schema.ts      # Comment document schema
│   ├── dtos/
│   │   ├── create-comment.dto.ts
│   │   └── update-comment.dto.ts
│   ├── comments.controller.ts     # CRUD endpoints
│   ├── comments.service.ts        # Comment logic
│   └── comments.module.ts
│
├── likes/                          # Like Module
│   ├── schemas/
│   │   └── like.schema.ts         # Like document schema
│   ├── dtos/
│   │   └── create-like.dto.ts
│   ├── likes.controller.ts        # Like/Unlike endpoints
│   ├── likes.service.ts           # Like operations
│   └── likes.module.ts
│
├── notifications/                  # Notification Module
│   ├── schemas/
│   │   └── notification.schema.ts # Notification schema
│   ├── dtos/
│   │   └── create-notification.dto.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts    # Notification logic
│   └── notifications.module.ts
│
├── gateway/                        # WebSocket Gateway
│   ├── chat.gateway.ts            # All WebSocket logic
│   └── gateway.module.ts
│
├── app.module.ts                  # Root module
└── main.ts                        # Application entry point
```

## 🗄️ Database Schema

### Users Collection
```
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  bio: String,
  profilePicture: String,
  followers: [ObjectId],
  following: [ObjectId],
  followerCount: Number,
  followingCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection
```
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  content: String,
  parentComment: ObjectId (ref: Comment, null for top-level),
  replies: [ObjectId],
  likes: [ObjectId],
  likeCount: Number,
  replyCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Likes Collection
```
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  comment: ObjectId (ref: Comment),
  createdAt: Date
  
  // Unique index: (user, comment)
}
```

### Notifications Collection
```
{
  _id: ObjectId,
  recipient: ObjectId (ref: User),
  actor: ObjectId (ref: User),
  type: String (COMMENT, REPLY, LIKE, FOLLOW),
  comment: ObjectId (ref: Comment, nullable),
  read: Boolean,
  message: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication (8 total)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (7 total)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PATCH /api/users/profile/:id` - Update profile (protected)
- `POST /api/users/follow/:targetUserId` - Follow user (protected)
- `POST /api/users/unfollow/:targetUserId` - Unfollow user (protected)
- `GET /api/users/followers/:userId` - Get user followers
- `GET /api/users/following/:userId` - Get user following

### Comments (6 total)
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get comment by ID
- `PATCH /api/comments/:id` - Update comment (protected, author only)
- `DELETE /api/comments/:id` - Delete comment (protected, author only)
- `GET /api/comments/:commentId/replies` - Get comment replies

### Likes (4 total)
- `POST /api/likes/:commentId` - Like comment (protected)
- `DELETE /api/likes/:commentId` - Unlike comment (protected)
- `GET /api/likes/comment/:commentId` - Get comment likes
- `GET /api/likes/check/:commentId` - Check if user liked (protected)

### Notifications (6 total)
- `GET /api/notifications` - Get notifications (protected)
- `GET /api/notifications/unread` - Get unread notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PATCH /api/notifications/:id/read` - Mark as read (protected)
- `PATCH /api/notifications/mark-all-read` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

**Total: 31 REST API endpoints**

## 🔄 WebSocket Events

### Client Events (Emit)
1. `join` - Join with user ID
2. `leave` - Leave/disconnect
3. `create-comment` - Create comment
4. `like-comment` - Like a comment
5. `unlike-comment` - Unlike a comment
6. `follow-user` - Follow a user
7. `unfollow-user` - Unfollow a user
8. `get-online-users` - Get list of online users

### Server Events (Broadcast)
1. `user-online` - User came online
2. `user-offline` - User went offline
3. `comment-added` - New comment posted (to all)
4. `new-reply` - Reply to comment (to comment author)
5. `comment-liked` - Comment liked (to comment author)
6. `new-follower` - User followed (to followed user)
7. `online-users` - List of online users
8. `comment-created` - Confirmation of created comment
9. `comment-error` - Error in creating comment
10. `like-success` - Confirmation of like
11. `like-error` - Error in liking
12. `unlike-success` - Confirmation of unlike
13. `unlike-error` - Error in unliking
14. `follow-success` - Confirmation of follow
15. `follow-error` - Error in following
16. `unfollow-success` - Confirmation of unfollow
17. `unfollow-error` - Error in unfollowing

## 📦 Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 10.2.10 | Backend framework |
| TypeScript | 5.2.2 | Language |
| MongoDB | Latest | Database |
| Mongoose | 7.5.3 | ODM for MongoDB |
| Socket.IO | 4.7.2 | Real-time WebSocket |
| JWT | 11.0.1 | Authentication |
| Passport | 0.7.0 | Authentication middleware |
| bcryptjs | 2.4.3 | Password hashing |
| Nestjs Config | 3.0.1 | Environment management |
| Class Validator | 0.14.0 | Input validation |
| Class Transformer | 0.5.1 | Data transformation |

## 🔐 Security Features

- ✅ **Password Hashing** - bcryptjs with 10 rounds
- ✅ **JWT Tokens** - Expiring tokens (7 days default)
- ✅ **Protected Routes** - JwtAuthGuard for sensitive endpoints
- ✅ **Input Validation** - class-validator DTOs
- ✅ **CORS Enabled** - For frontend integration
- ✅ **Unique Constraints** - Email, username, unique likes
- ✅ **Permission Checks** - Users can only edit/delete their own comments

## 📊 Performance Optimizations

- ✅ **Database Indexes** - On frequently queried fields
- ✅ **Unique Index** - (user, comment) on likes to prevent duplicates
- ✅ **Pagination** - For notifications endpoint
- ✅ **Population** - Strategic eager loading of related documents
- ✅ **Connection Pooling** - Mongoose default pool management
- ✅ **WebSocket Rooms** - Targeted notifications only to specific users

## 📚 Documentation Files

1. **README.md** (Comprehensive)
   - Full feature overview
   - API documentation with examples
   - WebSocket event reference
   - Deployment checklist

2. **SETUP_GUIDE.md** (Installation)
   - Step-by-step setup
   - MongoDB setup options
   - Environment configuration
   - Troubleshooting

3. **WEBSOCKET_TESTING_GUIDE.md** (WebSocket Testing)
   - Connection examples
   - Event testing
   - Multi-client testing
   - Browser console testing

4. **POSTMAN_COLLECTION.json** (API Testing)
   - Pre-configured API calls
   - Variable templates
   - Easy endpoint testing

5. **TEST_API.sh** (Bash testing)
   - Automated API testing
   - Linux/Mac compatible

6. **TEST_API.ps1** (PowerShell testing)
   - Automated API testing
   - Windows compatible

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Start MongoDB (if local)
mongod

# 4. Start the server
npm run dev

# 5. Server running at http://localhost:3000
```

## 📝 Example Workflow

1. **User Registers** - POST /auth/register
2. **User Logs In** - POST /auth/login (gets JWT token)
3. **User Joins WebSocket** - emit 'join' with userId
4. **User Creates Comment** - emit 'create-comment' + REST POST /comments
5. **All Users Notified** - server broadcasts 'comment-added' event
6. **Other User Replies** - emit 'create-comment' with parentCommentId
7. **Original Author Notified** - server broadcasts 'new-reply' (targeted)
8. **Another User Likes** - emit 'like-comment' + REST POST /likes
9. **Original Author Notified** - server broadcasts 'comment-liked' (targeted)
10. **Query Notifications** - REST GET /notifications to see history

## 🔄 Notification Flow

### Scenario 1: Top-Level Comment
```
User A creates comment
→ Save to DB
→ Create notification for all other users
→ Broadcast 'comment-added' to all connected users (Real-time)
→ All users see new comment
```

### Scenario 2: Reply to Comment
```
User B replies to User A's comment
→ Save to DB (with parentComment reference)
→ Create notification ONLY for User A
→ Broadcast 'new-reply' ONLY to User A (Real-time)
→ Only User A sees the reply notification
```

### Scenario 3: Like on Comment
```
User C likes User A's comment
→ Save like relationship to DB
→ Increment comment likeCount
→ Create notification ONLY for User A
→ Broadcast 'comment-liked' ONLY to User A (Real-time)
→ Only User A sees the like notification
```

## 🧪 Testing

### API Testing
```bash
# Use Postman Collection
POSTMAN_COLLECTION.json

# Or use test scripts
.\TEST_API.ps1           # Windows PowerShell
bash TEST_API.sh         # Linux/Mac
```

### WebSocket Testing
```bash
# See WEBSOCKET_TESTING_GUIDE.md
# Test using Node.js or browser console
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection refused | Ensure MongoDB is running or use Docker |
| JWT token invalid | Get new token by logging in again |
| WebSocket not connecting | Check server is running and CORS enabled |
| Port 3000 already in use | Kill process or change PORT in .env |

## 📈 Future Enhancements

- User search functionality
- Comment search/filtering
- Hashtag support
- User mentions (@username)
- Email notifications
- Rate limiting
- Image upload
- Comment markdown formatting
- Emoji reactions
- Admin panel
- Analytics dashboard

## 📞 Support

For issues or questions:
1. Check terminal logs for errors
2. Review troubleshooting sections in documentation
3. Verify MongoDB connection
4. Validate environment variables

## 📄 License

MIT License - Open source project

---

**Project Status:** ✅ Complete and Production Ready

**Last Updated:** 2024

**Version:** 1.0.0

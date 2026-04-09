# Real-Time Comment System with NestJS, Socket.IO, and MongoDB

A comprehensive real-time comment system built with NestJS, featuring WebSocket support, JWT authentication, and MongoDB integration.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- User registration and login
- Protected routes with JWT guards

✅ **User Profiles**
- Username, email, bio, and profile picture
- Follow/unfollow functionality
- Follower and following counts

✅ **Comments & Replies**
- Post top-level comments
- Reply to existing comments (nested replies)
- Edit and delete comments
- Author-only edit/delete permissions

✅ **Likes**
- Like/unlike comments
- Like count tracking
- Check if user liked a comment
- Prevent duplicate likes

✅ **Real-time Notifications (WebSockets)**
- New comment notifications (sent to all users)
- Reply notifications (sent only to comment author)
- Like notifications (sent only to comment author)
- Follow notifications (sent only to followed user)
- Unread notification tracking
- Notification management (mark as read, delete)

✅ **WebSocket Features**
- Real-time comment updates
- Instant notifications
- Online user tracking
- Socket-based interactions

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dtos/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # User module
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   └── update-profile.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── comments/            # Comment module
│   ├── schemas/
│   │   └── comment.schema.ts
│   ├── dtos/
│   │   ├── create-comment.dto.ts
│   │   └── update-comment.dto.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── comments.module.ts
├── likes/              # Like module
│   ├── schemas/
│   │   └── like.schema.ts
│   ├── dtos/
│   │   └── create-like.dto.ts
│   ├── likes.controller.ts
│   ├── likes.service.ts
│   └── likes.module.ts
├── notifications/       # Notification module
│   ├── schemas/
│   │   └── notification.schema.ts
│   ├── dtos/
│   │   └── create-notification.dto.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   └── notifications.module.ts
├── gateway/            # WebSocket Gateway
│   ├── chat.gateway.ts
│   └── gateway.module.ts
├── app.module.ts
└── main.ts
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd d:\Netixsol\week5\day2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/comment-system
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRATION=7d
     PORT=3000
     ```

4. **Ensure MongoDB is running**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update `MONGODB_URI` in `.env`

5. **Run the application**
   ```bash
   npm run dev
   ```

   The application will start at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { accessToken, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { accessToken, user }
```

### User Endpoints

#### Get All Users
```
GET /api/users
```

#### Get User by ID
```
GET /api/users/:id
```

#### Get User by Username
```
GET /api/users/username/:username
```

#### Update Profile (Protected)
```
PATCH /api/users/profile/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "bio": "New bio",
  "profilePicture": "image_url"
}
```

#### Follow User (Protected)
```
POST /api/users/follow/:targetUserId
Authorization: Bearer <token>

Response: { follower, target }
```

#### Unfollow User (Protected)
```
POST /api/users/unfollow/:targetUserId
Authorization: Bearer <token>

Response: { follower, target }
```

#### Get Followers
```
GET /api/users/followers/:userId
```

#### Get Following
```
GET /api/users/following/:userId
```

### Comment Endpoints

#### Create Comment (Protected)
```
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a comment",
  "parentCommentId": "optional_parent_comment_id"
}

Response: Comment object
```

#### Get All Comments
```
GET /api/comments
```

#### Get Comment by ID
```
GET /api/comments/:id
```

#### Update Comment (Protected)
```
PATCH /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete Comment (Protected)
```
DELETE /api/comments/:id
Authorization: Bearer <token>
```

#### Get Comment Replies
```
GET /api/comments/:commentId/replies
```

### Like Endpoints

#### Like Comment (Protected)
```
POST /api/likes/:commentId
Authorization: Bearer <token>

Response: { like, comment }
```

#### Unlike Comment (Protected)
```
DELETE /api/likes/:commentId
Authorization: Bearer <token>

Response: { comment }
```

#### Get Comment Likes
```
GET /api/likes/comment/:commentId
```

#### Check if Liked (Protected)
```
GET /api/likes/check/:commentId
Authorization: Bearer <token>

Response: { isLiked: boolean }
```

### Notification Endpoints

#### Get Notifications (Protected)
```
GET /api/notifications?limit=20
Authorization: Bearer <token>
```

#### Get Unread Notifications (Protected)
```
GET /api/notifications/unread
Authorization: Bearer <token>
```

#### Get Unread Count (Protected)
```
GET /api/notifications/unread-count
Authorization: Bearer <token>

Response: { count: number }
```

#### Mark as Read (Protected)
```
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All as Read (Protected)
```
PATCH /api/notifications/mark-all-read
Authorization: Bearer <token>
```

#### Delete Notification (Protected)
```
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

## WebSocket Events

### Client Events (Emit)

#### Join
```javascript
socket.emit('join', { userId: 'user_id' });
```

#### Leave
```javascript
socket.emit('leave', { userId: 'user_id' });
```

#### Create Comment
```javascript
socket.emit('create-comment', {
  userId: 'user_id',
  content: 'Comment content',
  parentCommentId: 'optional_parent_id'
});
```

#### Like Comment
```javascript
socket.emit('like-comment', {
  userId: 'user_id',
  commentId: 'comment_id'
});
```

#### Unlike Comment
```javascript
socket.emit('unlike-comment', {
  userId: 'user_id',
  commentId: 'comment_id'
});
```

#### Follow User
```javascript
socket.emit('follow-user', {
  userId: 'user_id',
  targetUserId: 'target_user_id'
});
```

#### Unfollow User
```javascript
socket.emit('unfollow-user', {
  userId: 'user_id',
  targetUserId: 'target_user_id'
});
```

#### Get Online Users
```javascript
socket.emit('get-online-users');
```

### Server Events (Listen)

#### User Online
```javascript
socket.on('user-online', (data) => {
  console.log(data.userId, 'is online');
});
```

#### User Offline
```javascript
socket.on('user-offline', (data) => {
  console.log(data.userId, 'is offline');
});
```

#### Comment Added
```javascript
socket.on('comment-added', (data) => {
  console.log('New comment:', data.comment);
});
```

#### New Reply
```javascript
socket.on('new-reply', (data) => {
  console.log('Reply to your comment:', data.reply);
});
```

#### Comment Liked
```javascript
socket.on('comment-liked', (data) => {
  console.log('Your comment was liked by:', data.liker);
});
```

#### New Follower
```javascript
socket.on('new-follower', (data) => {
  console.log('New follower:', data.follower);
});
```

#### Online Users
```javascript
socket.on('online-users', (data) => {
  console.log('Online users:', data.users);
});
```

#### Comment Created
```javascript
socket.on('comment-created', (data) => {
  if (data.success) {
    console.log('Comment created:', data.comment);
  }
});
```

#### Like Success
```javascript
socket.on('like-success', (data) => {
  if (data.success) {
    console.log('Comment liked');
  }
});
```

#### Unlike Success
```javascript
socket.on('unlike-success', (data) => {
  if (data.success) {
    console.log('Comment unliked');
  }
});
```

#### Follow Success
```javascript
socket.on('follow-success', (data) => {
  if (data.success) {
    console.log('Follow successful', data.result);
  }
});
```

#### Unfollow Success
```javascript
socket.on('unfollow-success', (data) => {
  if (data.success) {
    console.log('Unfollow successful', data.result);
  }
});
```

## Example Frontend Integration (Socket.IO Client)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join on login
socket.emit('join', { userId: 'user_id_here' });

// Listen for new comments
socket.on('comment-added', (data) => {
  console.log('New comment:', data.comment);
  // Update UI
});

// Listen for new replies
socket.on('new-reply', (data) => {
  console.log('Someone replied to your comment:', data.reply);
  // Show notification
});

// Listen for likes
socket.on('comment-liked', (data) => {
  console.log('Your comment was liked!');
  // Update like count
});

// Create a comment
socket.emit('create-comment', {
  userId: 'user_id',
  content: 'Here is my comment',
  parentCommentId: null // or parent comment id for replies
});

// Like a comment
socket.emit('like-comment', {
  userId: 'user_id',
  commentId: 'comment_id'
});

// Follow a user
socket.emit('follow-user', {
  userId: 'current_user_id',
  targetUserId: 'user_to_follow_id'
});

// Leave on logout
socket.emit('leave', { userId: 'user_id_here' });
```

## Available Scripts

```bash
# Development (watch mode)
npm run dev

# Build
npm run build

# Production run
npm run prod

# Code formatting
npm run format
```

## Notification Flow

### Comment Posting
1. User posts a comment → Comment saved to DB
2. Notification created for all users
3. WebSocket event `comment-added` sent to all clients
4. All users receive real-time notification

### Reply to Comment
1. User replies to a comment → Reply saved with parent reference
2. Notification created only for comment author
3. WebSocket event `new-reply` sent only to comment author
4. Comment author receives targeted notification

### Like on Comment
1. User likes a comment → Like saved to DB, comment like count incremented
2. Notification created only for comment author
3. WebSocket event `comment-liked` sent only to comment author
4. Comment author receives targeted notification

### Follow User
1. User follows another user → Follow relationship created
2. Notification created only for followed user
3. WebSocket event `new-follower` sent only to followed user
4. User receives follow notification

## Database Schema

### User Schema
- username (unique)
- email (unique)
- password (hashed)
- bio
- profilePicture
- followers (array of User IDs)
- following (array of User IDs)
- followerCount
- followingCount
- timestamps

### Comment Schema
- author (User ID)
- content
- parentComment (Comment ID, null for top-level)
- replies (array of Comment IDs)
- likes (array of Like IDs)
- likeCount
- replyCount
- timestamps

### Like Schema
- user (User ID)
- comment (Comment ID)
- Unique index on (user, comment)
- timestamp

### Notification Schema
- recipient (User ID)
- actor (User ID)
- type (COMMENT, REPLY, LIKE, FOLLOW)
- comment (Comment ID, nullable)
- read (boolean)
- message
- timestamp

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

```javascript
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

## Security Considerations

- ✅ Passwords are hashed using bcryptjs (10 rounds)
- ✅ JWT tokens expire after 7 days (configurable)
- ✅ Protected routes require valid JWT in Authorization header
- ✅ Users can only edit/delete their own comments
- ✅ Input validation using class-validator
- ✅ CORS enabled for frontend integration

## Performance Optimization

- Indexes on frequently queried fields (email, username, author)
- Unique index on (user, comment) for likes to prevent duplicates
- Pagination support for notifications
- Population of related documents to minimize queries
- WebSocket for real-time updates instead of polling

## Future Enhancements

- [ ] User search functionality
- [ ] Comment search/filtering
- [ ] User mention notifications (@mentions)
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Image upload for profile pictures
- [ ] Comment text formatting (markdown)
- [ ] Emoji support
- [ ] Admin panel
- [ ] Analytics/stats

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (if using MongoDB Atlas)

### JWT Token Expired
- Token expires after 7 days by default
- User needs to login again
- Consider implementing refresh tokens

### WebSocket Connection Issues
- Check CORS settings
- Ensure Socket.IO client version matches server
- Check browser console for specific errors

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

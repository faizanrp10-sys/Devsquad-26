# WebSocket Testing Guide

This guide shows how to test WebSocket events using Socket.IO client.

## Prerequisites

- Node.js installed
- Running NestJS server on `http://localhost:3000`
- Socket.IO client library

## Basic WebSocket Connection

### Using Browser Console

```javascript
// Include Socket.IO client
<script src="https://cdn.socket.io/4.5.4/socket.io.js"></script>

// Create connection
const socket = io('http://localhost:3000');

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
});

// Listen for disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

### Using Node.js

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

## Event Examples

### 1. Join a User

```javascript
// Emit join event
socket.emit('join', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3'
});

// Listen for user online event
socket.on('user-online', (data) => {
  console.log(`User ${data.userId} is online`);
});
```

### 2. Create a Comment

```javascript
socket.emit('create-comment', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3',
  content: 'This is my first comment!'
});

// Listen for successful comment creation
socket.on('comment-created', (data) => {
  if (data.success) {
    console.log('Comment created:', data.comment);
  }
});

// Other clients will receive
socket.on('comment-added', (data) => {
  console.log('New comment from', data.author.username);
  console.log('Content:', data.comment.content);
});
```

### 3. Reply to a Comment

```javascript
socket.emit('create-comment', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3',
  content: 'Thanks for the comment!',
  parentCommentId: '60f7b3b3b3b3b3b3b3b3b3b4'  // Parent comment ID
});

// Original comment author will receive
socket.on('new-reply', (data) => {
  console.log('Someone replied to your comment');
  console.log('Reply:', data.reply.content);
});
```

### 4. Like a Comment

```javascript
socket.emit('like-comment', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3',
  commentId: '60f7b3b3b3b3b3b3b3b3b3b4'
});

// Listen for success
socket.on('like-success', (data) => {
  if (data.success) {
    console.log('Comment liked!');
    console.log('New like count:', data.comment.likeCount);
  }
});

// Comment author will receive
socket.on('comment-liked', (data) => {
  console.log(`${data.liker.username} liked your comment`);
});
```

### 5. Unlike a Comment

```javascript
socket.emit('unlike-comment', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3',
  commentId: '60f7b3b3b3b3b3b3b3b3b3b4'
});

// Listen for success
socket.on('unlike-success', (data) => {
  if (data.success) {
    console.log('Comment unliked');
  }
});
```

### 6. Follow a User

```javascript
socket.emit('follow-user', {
  userId: 'current_user_id',
  targetUserId: 'user_to_follow_id'
});

// Listen for success
socket.on('follow-success', (data) => {
  if (data.success) {
    console.log('Successfully followed user');
  }
});

// Followed user will receive
socket.on('new-follower', (data) => {
  console.log(`${data.follower.username} started following you`);
});
```

### 7. Get Online Users

```javascript
socket.emit('get-online-users');

// Listen for online users
socket.on('online-users', (data) => {
  console.log('Online users:', data.users);
});
```

### 8. Leave (Disconnect)

```javascript
socket.emit('leave', {
  userId: '60f7b3b3b3b3b3b3b3b3b3b3'
});

// Other clients will receive
socket.on('user-offline', (data) => {
  console.log(`User ${data.userId} went offline`);
});
```

## Complete Example Script

Save this as `test-websocket.js` and run with `node test-websocket.js`

```javascript
const io = require('socket.io-client');

// Connect to server
const socket = io('http://localhost:3000');

let userId = 'test_user_' + Date.now();

socket.on('connect', () => {
  console.log('✓ Connected to WebSocket server\n');
  
  // Join with user ID
  socket.emit('join', { userId });
  console.log(`→ Joined as user: ${userId}\n`);
});

// Listen for all events
socket.on('user-online', (data) => {
  console.log(`✓ User online: ${data.userId}`);
});

socket.on('user-offline', (data) => {
  console.log(`✓ User offline: ${data.userId}`);
});

socket.on('comment-added', (data) => {
  console.log(`✓ New comment from ${data.author.username}: "${data.comment.content}"`);
});

socket.on('new-reply', (data) => {
  console.log(`✓ New reply: "${data.reply.content}"`);
});

socket.on('comment-liked', (data) => {
  console.log(`✓ ${data.liker.username} liked a comment`);
});

socket.on('new-follower', (data) => {
  console.log(`✓ ${data.follower.username} started following you`);
});

socket.on('comment-created', (data) => {
  if (data.success) {
    console.log(`✓ Comment created: "${data.comment.content}"`);
  } else {
    console.log(`✗ Failed to create comment: ${data.message}`);
  }
});

socket.on('like-success', (data) => {
  if (data.success) {
    console.log(`✓ Like success! New count: ${data.comment.likeCount}`);
  }
});

socket.on('unlike-success', (data) => {
  if (data.success) {
    console.log(`✓ Unlike success!`);
  }
});

socket.on('follow-success', (data) => {
  if (data.success) {
    console.log(`✓ Follow success!`);
  }
});

socket.on('follow-error', (data) => {
  console.log(`✗ Follow error: ${data.message}`);
});

socket.on('disconnect', () => {
  console.log('✗ Disconnected from server');
});

// Test events after connection
setTimeout(() => {
  console.log('\n--- Testing Events ---\n');
  
  // Test create comment
  socket.emit('create-comment', {
    userId: userId,
    content: 'This is a test comment from WebSocket!'
  });
}, 1000);

// Keep connection open
setTimeout(() => {
  console.log('\n--- Leaving ---\n');
  socket.emit('leave', { userId });
  socket.disconnect();
  process.exit(0);
}, 3000);
```

## Testing Multiple Clients

Create a file `multi-client-test.js`:

```javascript
const io = require('socket.io-client');

// Create multiple clients
const clients = [];
const userIds = ['user_1', 'user_2', 'user_3'];

function createClient(username) {
  const socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    console.log(`[${username}] Connected`);
    socket.emit('join', { userId: username });
  });

  socket.on('comment-added', (data) => {
    console.log(`[${username}] New comment: ${data.comment.content}`);
  });

  socket.on('new-reply', (data) => {
    console.log(`[${username}] New reply: ${data.reply.content}`);
  });

  socket.on('comment-liked', (data) => {
    console.log(`[${username}] ${data.liker.username} liked a comment`);
  });

  return { socket, username };
}

// Create 3 clients
userIds.forEach(userId => {
  clients.push(createClient(userId));
});

// Test interactions
setTimeout(() => {
  // Client 1 creates a comment
  clients[0].socket.emit('create-comment', {
    userId: 'user_1',
    content: 'Hello from client 1!'
  });
}, 1500);

setTimeout(() => {
  // Client 2 likes the comment (you need the comment ID from previous step)
  // Replace with actual comment ID
  clients[1].socket.emit('like-comment', {
    userId: 'user_2',
    commentId: 'ACTUAL_COMMENT_ID'
  });
}, 2500);

setTimeout(() => {
  // Disconnect all
  clients.forEach(client => {
    client.socket.disconnect();
  });
  process.exit(0);
}, 5000);
```

## Browser Testing with Chrome DevTools

1. Open your application in Chrome
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this code:

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('%cConnected', 'color: green; font-size: 16px;');
  socket.emit('join', { userId: 'browser_user_' + Date.now() });
});

socket.on('comment-added', (data) => {
  console.log('%cNew Comment', 'color: blue; font-size: 14px;', data);
});

// Helper function
window.createComment = function(content, parentId = null) {
  socket.emit('create-comment', {
    userId: 'browser_user',
    content: content,
    parentCommentId: parentId
  });
};

console.log('Ready! Use createComment("text") to send');
```

## Debugging Tips

1. **Monitor all events:**
   ```javascript
   socket.onAny((eventName, ...args) => {
     console.log('Event:', eventName, args);
   });
   ```

2. **Check socket connection state:**
   ```javascript
   console.log(socket.connected); // true or false
   ```

3. **Monitor server logs:**
   - Backend logs will show when clients connect/disconnect
   - Check terminal where NestJS is running

4. **Network tab in DevTools:**
   - Go to Network tab
   - Filter for WS (WebSocket)
   - See all WebSocket messages

## Common Issues

**Issue:** "Connection refused"
- Solution: Ensure server is running on port 3000

**Issue:** "Socket not connecting"
- Solution: Check CORS settings in WebSocket gateway

**Issue:** "Events not received"
- Solution: Ensure you emit 'join' event first to register user

**Issue:** "Notifications not working"
- Solution: Check that users are connected and joined

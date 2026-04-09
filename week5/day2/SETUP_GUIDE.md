# Setup and Installation Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd d:\Netixsol\week5\day2
npm install
```

### Step 2: Configure MongoDB

#### Option A: Local MongoDB Installation

1. **Download MongoDB from:** https://www.mongodb.com/try/download/community

2. **Install and start MongoDB:**
   - Windows: Run the installer and follow the wizard
   - After installation, MongoDB runs as a service

3. **Verify MongoDB is running:**
   ```bash
   mongod --version
   ```

#### Option B: Using Docker Compose (Recommended)

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# MongoDB will be available at: mongodb://localhost:27017
# Mongo Express UI: http://localhost:8081
```

#### Option C: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get the connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comment-system?retryWrites=true&w=majority
   ```

### Step 3: Configure Environment Variables

The `.env` file is already created with default values. Edit if needed:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/comment-system

# JWT Configuration
JWT_SECRET=super-secret-key-change-in-production
JWT_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000
```

### Step 4: Start the Application

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm run prod
```

#### With Console Debug
```bash
npm run debug
```

You should see:
```
[Nest] 12345   - 01/12/2024, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345   - 01/12/2024, 10:30:01 AM     LOG [InstanceLoader] MongooseModule dependencies initialized +45ms
...
Application is running on: http://localhost:3000
```

## Verify Installation

### 1. Test API Endpoint

```bash
# In PowerShell or Terminal
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

You should get a response with `accessToken` and `user` data.

### 2. Test MongoDB Connection

```bash
# If using local MongoDB
mongosh
use comment-system
db.users.findOne()

# Should return user you just created
```

### 3. Check Logs

The terminal where you ran `npm run dev` should show:
- Connection messages
- Database operations
- Any errors

## Project Structure

```
d:\Netixsol\week5\day2/
├── src/
│   ├── auth/                  # Authentication & JWT
│   ├── users/                 # User management & profiles
│   ├── comments/              # Comment CRUD operations
│   ├── likes/                 # Like functionality
│   ├── notifications/         # Notification system
│   ├── gateway/               # WebSocket gateway
│   ├── app.module.ts          # Main application module
│   └── main.ts                # Application entry point
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # NestJS CLI config
├── .env                       # Environment variables
├── .env.example               # Environment template
├── docker-compose.yml         # Docker MongoDB setup
├── README.md                  # Full documentation
├── WEBSOCKET_TESTING_GUIDE.md # WebSocket testing
├── POSTMAN_COLLECTION.json    # API endpoints
├── SETUP_GUIDE.md             # This file
└── dist/                      # Compiled output (created after build)
```

## Common Commands

```bash
# Development
npm run dev              # Start in watch mode
npm run build           # Compile TypeScript
npm run prod            # Run compiled code
npm run format          # Format code with Prettier
npm run debug           # Start with debugger

# Database
mongosh                 # Connect to MongoDB
mongodump              # Backup database
mongorestore           # Restore database
```

## Database Setup

### Create Initial Collections

MongoDB automatically creates collections when you insert data, but you can pre-create them:

```javascript
// Using mongosh
use comment-system

// Create collections
db.createCollection("users")
db.createCollection("comments")
db.createCollection("likes")
db.createCollection("notifications")

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.likes.createIndex({ user: 1, comment: 1 }, { unique: true })
```

## Troubleshooting

### Issue: "Cannot find module '@nestjs/common'"

**Solution:**
```bash
npm install
# Then restart the application
npm run dev
```

### Issue: "MongoDB connection refused"

**Solution:**
1. Ensure MongoDB is running: `mongod` (Windows) or `mongo` check
2. Check connection string in `.env`
3. If using MongoDB Atlas, whitelist your IP
4. Use Docker Compose to start MongoDB: `docker-compose up -d`

### Issue: "EADDRINUSE: port 3000 already in use"

**Solution:**
```bash
# Change port in .env file
PORT=3001

# Or kill the process using the port
# Windows (PowerShell - Admin)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: "JWT token invalid or expired"

**Solution:**
- Login again to get a new token
- Tokens expire after 7 days (configurable in .env)
- Check that `JWT_SECRET` matches between client and server

### Issue: "WebSocket not connecting"

**Solution:**
1. Ensure server is running
2. Check browser console for errors
3. Verify CORS settings are enabled
4. Try: `socket.disconnect(); socket.connect();`

## Performance Optimization

### Database Indexes

```javascript
// These are created automatically by schemas
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.comments.createIndex({ author: 1 })
db.comments.createIndex({ createdAt: -1 })
db.likes.createIndex({ user: 1, comment: 1 }, { unique: true })
db.notifications.createIndex({ recipient: 1, read: 1 })
```

### Connection Pooling

Mongoose automatically manages connection pooling. If you need to adjust:

```typescript
// In app.module.ts
MongooseModule.forRoot(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
})
```

## Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a long random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or production MongoDB instance
- [ ] Set CORS to specific domain
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure logging
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Backup database regularly
- [ ] Use environment-specific configs

## Environment Variables Reference

```bash
# MongoDB
MONGODB_URI              # Connection string
# Default: mongodb://localhost:27017/comment-system

# JWT
JWT_SECRET              # Secret key for token signing
# Default: super-secret-key-change-in-production

JWT_EXPIRATION          # Token expiration time
# Default: 7d (format: 7d, 24h, 3600, etc.)

# Application
NODE_ENV                # Environment (development/production)
# Default: development

PORT                    # Server port
# Default: 3000
```

## Next Steps

1. **Test the API:** See [README.md](README.md) for API documentation
2. **Test WebSockets:** See [WEBSOCKET_TESTING_GUIDE.md](WEBSOCKET_TESTING_GUIDE.md)
3. **Explore Features:** Use [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json) to test endpoints
4. **Build Frontend:** Create a React/Vue/Angular app to consume the APIs

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Socket.IO Documentation](https://socket.io/docs/)
- [JWT.io](https://jwt.io)

## Support

For issues, check:
1. Terminal logs for error messages
2. MongoDB connection status
3. Environment variables
4. Port availability
5. Firewall settings

## Next: Testing the Application

Once setup is complete, test with:

```bash
# Terminal 1: Start the backend
npm run dev

# Terminal 2: Test API (PowerShell)
$headers = @{"Content-Type" = "application/json"}
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "Password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

You're all set! Start developing! 🚀

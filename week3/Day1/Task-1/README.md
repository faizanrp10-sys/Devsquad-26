# Task Manager API

A simple In-Memory CRUD REST API to manage tasks, built with Node.js and Express.js.

## Overview

This API allows you to:
- **Get all tasks** (with optional title search)
- **Get a single task by ID**
- **Create new tasks**
- **Update existing tasks**
- **Delete tasks**
- **View API Statistics**

The API uses standard HTTP methods and standardizes responses. UUIDs are used for task IDs. Data is stored in memory and will be reset upon server restart. Error handling middleware ensures consistent error messages.

## Prerequisites

- Node.js installed on your machine.

## Setup & Run

1. **Install dependencies:**  
   \`\`\`bash
   npm install
   \`\`\`

2. **Run in development mode:**  
   \`\`\`bash
   npm run dev
   \`\`\`
   *(Uses nodemon for auto-reloading)*

3. **General Server Setup:**  
   \`\`\`bash
   node server.js
   \`\`\`
   The server will start at `http://localhost:3000`.

## Swagger Documentation
Once the server is running, you can access the Swagger API documentation through your browser:
**URL:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Postman Testing
A Postman collection is included in the root directory: `TaskManagerAPI.postman_collection.json`.  
Import this file into Postman to test all routes easily.

## General Response Structure

Consistent Response Base Format:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Dynamic message here"
}
\`\`\`

## Sample Endpoints

### 1. Create a Task (\`POST /api/tasks\`)
**Request Body:**
\`\`\`json
{
  "title": "Learn Express",
  "completed": false
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Learn Express",
    "completed": false
  },
  "message": "Task created successfully"
}
\`\`\`

### 2. Get All Tasks (\`GET /api/tasks\`)
**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Learn Express",
      "completed": false
    }
  ],
  "message": "Tasks retrieved successfully"
}
\`\`\`
*(Optional Query: \`GET /api/tasks?title=Express\` filters tasks)*

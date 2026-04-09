@echo off
echo Starting Bidding Platform Servers...

cd backend
start cmd /k "npm run start"

cd ../frontend
start cmd /k "npm run dev"

echo Backend API is running on http://localhost:3001
echo Frontend Next.js is running on http://localhost:3000

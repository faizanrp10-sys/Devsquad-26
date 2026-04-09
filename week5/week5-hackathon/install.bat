@echo off
cd frontend
call npm install react-hook-form yup @hookform/resolvers @reduxjs/toolkit react-redux swiper socket.io-client axios lucide-react
cd ..

cd backend
call npm install @nestjs/mongoose mongoose @nestjs/jwt @nestjs/config bcrypt @nestjs/websockets @nestjs/platform-socket.io socket.io @types/bcrypt
cd ..

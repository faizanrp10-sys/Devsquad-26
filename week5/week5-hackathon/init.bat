@echo off
if exist frontend rmdir /s /q frontend
if exist backend rmdir /s /q backend
call npm run init:frontend
call npm run init:backend

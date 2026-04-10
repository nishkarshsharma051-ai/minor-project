#!/bin/bash

# EduSetu Monorepo Runner
# This script starts both the Flask backend and the Vite frontend.

# 1. Kill any existing processes on ports 5001 and 5173 (optional but helpful)
# lsof -ti:5001 | xargs kill -9 2>/dev/null
# lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "🚀 Starting EduSetu Services..."

# 2. Start Backend
echo "📡 Starting Backend (Flask) on port 5001..."
cd backend
source ../.venv/bin/activate
python3 app.py &
BACKEND_PID=$!
cd ..

# 3. Start Frontend
echo "💻 Starting Frontend (Vite) on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 4. Handle Shutdown
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

echo "✅ Both services are running!"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5001"
echo "Press Ctrl+C to stop both."

wait

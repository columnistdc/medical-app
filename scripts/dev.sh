#!/bin/bash

echo "🚀 Starting Medical App development environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down development environment..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start server in background
echo "🔧 Starting NestJS server..."
cd server
npm run start:dev &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Generate OpenAPI and types
echo "📝 Generating OpenAPI specification and types..."
npm run generate:types

# Start client in background
echo "⚛️  Starting React client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "✅ Development environment started!"
echo "📚 API Documentation: http://localhost:4000/api"
echo "🌐 Frontend: http://localhost:5173"
echo "📁 OpenAPI: http://localhost:4000/api-json"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait

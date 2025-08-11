#!/bin/bash

echo "🔍 Checking code..."

# Check client
echo "📱 Checking client..."
cd client
npm run lint:check
if [ $? -ne 0 ]; then
  echo "❌ Linting errors in client"
  exit 1
fi

npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Formatting errors in client"
  exit 1
fi
cd ..

# Check server
echo "🖥️  Checking server..."
cd server
npm run lint:check
if [ $? -ne 0 ]; then
  echo "❌ Linting errors in server"
  exit 1
fi

npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Formatting errors in server"
  exit 1
fi
cd ..

echo "✅ All checks passed successfully!"

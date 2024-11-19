#!/bin/sh

# Start the frontend
echo "Starting Frontend..."
cd /app/frontend && npm run dev &

# Start the backend
echo "Starting Backend..."
cd /app/backend && npm run start &

# Start the WebSocket
echo "Starting WebSocket..."
cd /app/websocket && npm run start &

# Wait for all background processes to complete
wait

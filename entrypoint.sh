#!/bin/bash

set -e

echo "================================"
echo "Match Three Game - Starting"
echo "================================"

# Wait for PostgreSQL to be ready
echo ""
echo "Waiting for PostgreSQL to be ready at ${DB_HOST}:${DB_PORT}..."
for i in {1..30}; do
  if pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" > /dev/null 2>&1; then
    echo "✓ PostgreSQL is ready!"
    break
  fi
  echo "  Attempt $i/30 - PostgreSQL not ready yet, waiting..."
  sleep 2
done

# Additional wait to ensure the database is fully initialized
echo "Giving database time to fully initialize..."
sleep 3

# Build TypeScript
echo ""
echo "Building TypeScript..."
npm run build
echo "✓ TypeScript build complete"

# Start the application
echo ""
echo "Starting application on port ${PORT}..."
echo "================================"
npm start

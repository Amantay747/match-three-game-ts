#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Additional wait to ensure the database is fully initialized
sleep 2

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Start the application
echo "Starting application..."
npm start

#!/bin/sh
set -e

echo "Running prisma db push..."
npx prisma db push

echo "Starting API on port 7860..."
exec node dist/main

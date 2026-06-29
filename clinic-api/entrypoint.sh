#!/bin/sh

echo "=== DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo YES || echo NO) ==="

echo "Running prisma db push in background..."
(npx prisma db push --url "$DATABASE_URL" 2>&1 && echo "=== DB push SUCCESS ===") &

echo "Starting API on port 7860..."
exec node dist/main

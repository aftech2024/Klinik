#!/bin/sh

echo "=== DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo YES || echo NO) ==="

echo "Running prisma db push..."
npx prisma db push --url "$DATABASE_URL"
PUSH_EXIT=$?
if [ $PUSH_EXIT -ne 0 ]; then
  echo "WARNING: prisma db push failed with exit $PUSH_EXIT — continuing anyway"
fi

echo "Starting API on port 7860..."
exec node dist/main

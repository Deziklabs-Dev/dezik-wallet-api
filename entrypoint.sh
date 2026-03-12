set -e

echo "Running Prisma migrations..."
bun x prisma migrate deploy

echo "Running database seed (idempotent)..."
bun x prisma db seed || echo "Seed skipped or already applied."

echo "Starting application..."
exec bun dist/src/main.js

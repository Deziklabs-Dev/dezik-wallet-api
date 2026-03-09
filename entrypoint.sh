#!/bin/sh
set -e

echo "Running Prisma migrations..."
bun x prisma migrate deploy

echo "Starting application..."
exec bun dist/main.js

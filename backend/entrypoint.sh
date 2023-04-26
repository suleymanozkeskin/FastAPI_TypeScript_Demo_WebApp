#!/bin/sh
set -e

# Use the environment variable PORT or default to 8000
PORT="${PORT:-8000}"

# Start the server
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"

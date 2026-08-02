#!/bin/bash
set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN is not set. Cannot clone the repository."
  exit 1
fi

if [ -z "$GROQ_API_KEY" ]; then
  echo "ERROR: GROQ_API_KEY is not set."
  exit 1
fi

echo "Cloning repository..."
git clone https://${GITHUB_TOKEN}@github.com/DogusTech/togetlink-ui.git /app/repo

cd /app/repo

echo "Installing dependencies..."
npm install

echo "Starting Next.js server in the background..."
npm run dev &
NEXT_PID=$!

echo "Starting IdeaAI Daemon..."
node scripts/daemon.js

# If daemon exits, kill next.js
kill $NEXT_PID

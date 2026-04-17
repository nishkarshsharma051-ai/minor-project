#!/bin/bash

# Configuration
RENDER_DEPLOY_HOOK="https://api.render.com/deploy/srv-d7giagtckfvc73e6u4qg?key=1Y7xtEMKJyQ"
BRANCH="main"

echo "🚀 Starting Deployment Process..."

# 1. Ensure we are on the correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "❌ Error: Not on $BRANCH branch. Current branch is $CURRENT_BRANCH."
    exit 1
fi

# 2. Sync with remote
echo "📥 Pulling latest changes..."
git pull origin $BRANCH

# 3. Push changes
echo "📤 Pushing latest changes to origin/$BRANCH..."
git push origin $BRANCH

# 4. Trigger Render Deploy Hook
if [[ "$RENDER_DEPLOY_HOOK" == "REPLACE_WITH_"* ]]; then
    echo "⚠️  Skip: Render Deploy Hook URL not configured."
else
    echo "📡 Triggering Render Deployment..."
    curl -X POST "$RENDER_DEPLOY_HOOK"
    echo "✅ Deployment triggered successfully!"
fi

echo "✨ Done."

#!/bin/bash

echo "🚀 Starting AI Evals Tutorial Web App"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "📁 Navigating to web-app directory..."
    cd /Users/dmukunthu/Documents/PersonalProjects/EvalTutorial/web-app
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "❌ Please add your ANTHROPIC_API_KEY to web-app/.env"
    echo ""
    echo "Open .env and add:"
    echo "ANTHROPIC_API_KEY=your_actual_key_here"
    echo ""
    exit 1
fi

# Check if API key is set
if ! grep -q "sk-ant-" .env 2>/dev/null; then
    echo "⚠️  ANTHROPIC_API_KEY not configured in .env"
    echo ""
    echo "Please edit web-app/.env and add your API key:"
    echo "ANTHROPIC_API_KEY=sk-ant-your_actual_key_here"
    echo ""
    echo "Get your key from: https://console.anthropic.com/"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Environment configured!"
echo ""
echo "🌐 Starting development server..."
echo "   URL: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

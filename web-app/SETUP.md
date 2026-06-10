# Web App Setup Guide

## Prerequisites

- Node.js 18+ installed
- Valid Anthropic API key

## Quick Setup

### 1. Install Dependencies

```bash
cd web-app
npm install
```

### 2. Configure API Key

**Important:** The app requires a valid Anthropic API key to run evaluations.

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - Sign in or create an account
   - Navigate to "API Keys"
   - Create a new key or copy an existing one

2. Create `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
# Replace the placeholder with your actual key
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx...
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### "API key is required" Error

This means the `.env` file is missing or the API key is invalid:

1. Check that `web-app/.env` exists
2. Verify the API key starts with `sk-ant-api03-`
3. Test your key at [Anthropic Console](https://console.anthropic.com/)
4. Restart the dev server after updating `.env`

### Monaco Editor Not Loading

If you see "ChunkLoadError" for Monaco Editor:

1. Clear the build cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Restart dev server: `npm run dev`

### Port Already in Use

If port 3000 is busy:

```bash
# Kill the existing process
pkill -f "next dev"

# Or use a different port
PORT=3001 npm run dev
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for running evaluations (server-side only)

## Features

- **Interactive Tutorial** - 3 modules with 9 sections
- **Live Playground** - Code editor with real-time eval execution
- **Example Browser** - 4 complete examples
- **Documentation** - Comprehensive guides
- **Dark Mode** - Beautiful UI
- **Personalization** - Adapts to your use case

## Security

- API keys are stored server-side only (in `.env`)
- Never exposed to the browser
- Requests go through Next.js API routes

## Need Help?

- [Project README](../README.md)
- [Quick Start Guide](../QUICK_START.md)
- [API Documentation](https://docs.anthropic.com/)

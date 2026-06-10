#!/bin/bash
# Pre-commit security check script
# This checks for common security issues before committing

echo "🔒 Running security checks..."

# Check for API keys
if git diff --cached | grep -iE "(sk-ant-|ANTHROPIC_API_KEY=sk|sk-[a-zA-Z0-9]{48})"; then
    echo "❌ ERROR: Anthropic API key detected in staged files!"
    echo "Please remove the API key before committing."
    exit 1
fi

if git diff --cached | grep -iE "(sk-[a-zA-Z0-9]{48,})"; then
    echo "❌ ERROR: Potential API key detected in staged files!"
    echo "Please remove the API key before committing."
    exit 1
fi

# Check if .env is being committed
if git diff --cached --name-only | grep -E "^\.env$"; then
    echo "❌ ERROR: .env file is being committed!"
    echo "Run: git rm --cached .env"
    exit 1
fi

# Check for common secret patterns
if git diff --cached | grep -iE "(password|secret|token|key).*=.*['\"][^'\"]{20,}['\"]"; then
    echo "⚠️  WARNING: Possible secret detected. Please review carefully."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Security checks passed!"
exit 0

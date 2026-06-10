# Publishing to GitHub

This guide walks you through safely publishing this project to your personal GitHub.

## Pre-Publish Checklist

### ✅ Security Check

```bash
# 1. Verify no .env file is tracked
git ls-files | grep "\.env$"
# Should return nothing

# 2. Check for API keys in all files
grep -r "sk-ant-" . --exclude-dir=node_modules --exclude-dir=.git
# Should return nothing except .env.example

# 3. Review staged files
git status

# 4. Run security check script
./.pre-commit-check.sh
```

### ✅ Remove Personal Info

Review and remove any:
- [ ] Personal email addresses (except in git config)
- [ ] Salesforce-specific references
- [ ] Internal URLs or endpoints
- [ ] Company-specific data

### ✅ Clean Build Artifacts

```bash
# Remove build files
rm -rf node_modules dist .next coverage

# Remove any test results
rm -rf test-results/
```

## Step-by-Step Publishing

### 1. Create GitHub Repository

```bash
# Go to https://github.com/new
# Create a new repository (public or private)
# Do NOT initialize with README (we already have one)
```

### 2. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: AI Evals Tutorial"
```

### 3. Connect to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ai-evals-tutorial.git

# Verify remote
git remote -v
```

### 4. Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Post-Publish Setup

### Add Repository Secrets (for GitHub Actions)

If you want to enable CI/CD with GitHub Actions:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add repository secrets:
   - `ANTHROPIC_API_KEY` (for running tests)

### Update Repository Settings

1. **Description**: "Interactive tutorial for building AI evaluations and evals"
2. **Topics**: Add tags like:
   - `ai`
   - `evals`
   - `llm`
   - `tutorial`
   - `typescript`
   - `nextjs`
   - `anthropic`
   - `claude`
3. **Enable Issues**: ✓
4. **Enable Discussions**: ✓ (optional)

### Add Repository Website

In Settings → General → Website:
- If deployed: Add your Vercel/deployed URL
- Otherwise: Leave blank

### License

The project uses MIT License. It's already included in `LICENSE` file.

## Setting Up Git Hooks (Optional)

To automatically check for secrets before every commit:

```bash
# Install the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
exec ./.pre-commit-check.sh
EOF

chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed"
```

Now git will automatically check for secrets before each commit.

## Deployment Options

### Option 1: Vercel (Recommended for Web App)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web-app directory
cd web-app
vercel

# Follow prompts to connect to GitHub
```

Add environment variable in Vercel dashboard:
- `ANTHROPIC_API_KEY`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd web-app
netlify deploy
```

### Option 3: GitHub Pages (Static Only)

```bash
cd web-app
npm run build
npm run export  # If configured

# Deploy to gh-pages branch
npx gh-pages -d out
```

## Continuous Updates

### Making Changes

```bash
# Make your changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### Collaborative Development

```bash
# Create a new branch for features
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request on GitHub
```

## Security Reminders

### If You Accidentally Commit a Secret

```bash
# 1. Remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push (WARNING: This rewrites history)
git push origin --force --all

# 3. Rotate the exposed API key immediately
# Go to https://console.anthropic.com/ and regenerate
```

### Regular Security Checks

```bash
# Check for accidentally committed secrets
git log -p | grep -i "sk-ant-"

# Verify .gitignore is working
git check-ignore .env
# Should output: .env
```

## Common Issues

### Issue: .env file is in git

```bash
git rm --cached .env
git commit -m "Remove .env from git"
git push
```

### Issue: Large node_modules committed

```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

### Issue: Sensitive data in history

Use `git filter-branch` or [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

## Example README Badge

Add to your README.md:

```markdown
## Status

![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/ai-evals-tutorial)
![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/ai-evals-tutorial)
![GitHub Issues](https://img.shields.io/github/issues/YOUR_USERNAME/ai-evals-tutorial)
```

## Questions?

- Review `SECURITY.md` for security best practices
- Check `.gitignore` to see what's excluded
- Run `.pre-commit-check.sh` before pushing

---

**Ready to publish? Follow the steps above and you're good to go!** 🚀

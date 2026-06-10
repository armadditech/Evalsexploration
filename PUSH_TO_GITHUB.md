# Push to GitHub

## Quick Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `ai-evals-tutorial` (or your choice)
   - Description: "Interactive learning platform for building AI evaluations"
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license (we have these)
   - Click "Create repository"

2. **Push your code:**

```bash
# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-evals-tutorial.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Use SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/ai-evals-tutorial.git
git branch -M main
git push -u origin main
```

## Verify

After pushing, check:
- ✅ No `.env` files in the repository
- ✅ Only `.env.example` with placeholder values
- ✅ All your code is there
- ✅ You are listed as the sole contributor

## Repository Settings (Optional)

On GitHub, you can:
1. Add topics: `ai`, `evals`, `llm`, `claude`, `anthropic`, `tutorial`, `typescript`
2. Add a description
3. Update the website field (if you deploy it)
4. Enable GitHub Pages (if you want to host docs)

## After Publishing

Share your project:
- Twitter/X: "Just published my AI Evals Tutorial Platform 🎓"
- LinkedIn: Share with the AI/ML community
- Reddit: r/MachineLearning, r/artificial
- Hacker News: Show HN

## Keeping it Updated

To push future changes:

```bash
git add -A
git commit -m "Your commit message"
git push
```

Always run the security check first:
```bash
./.pre-commit-check.sh
```

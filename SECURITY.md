# Security & Privacy

## API Keys

This project requires API keys to run evals. **NEVER commit API keys to git!**

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```
   ANTHROPIC_API_KEY=your_actual_key_here
   ```

3. The `.env` file is in `.gitignore` and will not be committed.

### Protected Files

The following are automatically excluded from git:

- `.env` - Your actual API keys
- `.env.local` - Local environment overrides
- `.env*.local` - Any local environment files
- Any file matching `**/apikey*`
- Any file matching `**/secrets*`
- Any file matching `**/credentials*`

## Before Publishing to GitHub

### ✅ Checklist

- [ ] No API keys in code
- [ ] `.env` file is not committed
- [ ] `.env.example` has placeholder values only
- [ ] No personal information in commits
- [ ] No Salesforce-specific information
- [ ] All sensitive files in `.gitignore`

### Verify Before Push

```bash
# Check what files will be committed
git status

# Search for potential API keys in staged files
git diff --cached | grep -i "sk-ant-"
git diff --cached | grep -i "api.*key"

# Make sure .env is not tracked
git ls-files | grep "\.env$"
```

If `.env` appears, remove it:
```bash
git rm --cached .env
```

## Getting API Keys

### Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy to your `.env` file

### OpenAI API Key (Optional)

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy to your `.env` file

## Security Best Practices

1. **Never share API keys** in issues, pull requests, or discussions
2. **Rotate keys** if accidentally exposed
3. **Use environment variables** for all secrets
4. **Review commits** before pushing to ensure no secrets included
5. **Set up API key usage limits** in provider consoles

## Reporting Security Issues

If you find a security vulnerability, please email the maintainer directly rather than opening a public issue.

## For Contributors

When contributing:

1. Never include real API keys in code or tests
2. Use mock/fake keys in test files: `ANTHROPIC_API_KEY=test-key-12345`
3. Add any new sensitive files to `.gitignore`
4. Review your commits before submitting PRs

## License Keys

This project uses MIT license. No license keys required.

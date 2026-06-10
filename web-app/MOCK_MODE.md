# Mock Mode

Mock mode allows you to test the web app UI without making actual API calls to Anthropic. This is useful when:

- Testing the UI/UX without API credits
- Developing new features
- Running demos without incurring costs
- Your API key has insufficient credits

## How It Works

When `MOCK_MODE=true` is set in `.env`, the app:

1. ✅ Simulates realistic AI evaluation results
2. ✅ Shows processing delays (1-2 seconds)
3. ✅ Generates contextual responses based on your code
4. ✅ Displays varied scores and pass/fail results
5. ⚠️ Shows a yellow banner indicating demo mode

## Enabling Mock Mode

Edit `web-app/.env`:

```bash
# Enable mock mode
MOCK_MODE=true
```

Restart the dev server:

```bash
npm run dev
```

## Disabling Mock Mode

To use the real Claude API:

1. Ensure you have API credits at https://console.anthropic.com/
2. Edit `web-app/.env`:

```bash
# Disable mock mode (or remove the line)
MOCK_MODE=false
```

3. Restart the dev server

## Mock Behavior

The mock system intelligently generates results based on:

- **Classification tasks**: 80% pass rate with exact matches
- **LLM-as-judge**: Scores between 0.65-1.0 with detailed explanations
- **Customer support Q&A**: Context-aware responses for refunds, shipping, etc.
- **Processing time**: Realistic 800-1200ms delays per test case

## Limitations

Mock mode does NOT:

- Actually call the Claude API
- Test your real prompts end-to-end
- Validate API key functionality
- Count toward API usage/billing

## When to Use Real API

Use real API mode when you need to:

- Validate actual model responses
- Test specific prompt engineering
- Measure real latency/performance
- Build production evals
- Generate training data

## Troubleshooting

**Banner doesn't show:**
- Check that MOCK_MODE=true in .env
- Restart the dev server
- Clear browser cache

**Still getting API errors:**
- Verify .env file location (should be in web-app/)
- Check no typos: `MOCK_MODE=true` (not True or TRUE)
- Restart server after changes

## Cost Comparison

| Mode | Cost | Speed | Accuracy |
|------|------|-------|----------|
| Mock | $0 | Fast (~1s) | Simulated |
| Real API | ~$0.015/request | Variable | Real Claude |

For a typical 3-test-case eval:
- Mock: $0
- Real API: ~$0.05

## Switching Back and Forth

You can toggle between modes anytime:

```bash
# Use mock
echo "MOCK_MODE=true" >> web-app/.env

# Use real API
echo "MOCK_MODE=false" >> web-app/.env

# Always restart after changes
npm run dev
```

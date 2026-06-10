# Start Learning Right Now! 🚀

You have 5 minutes? Let's get you evaluating AI systems!

## Ultra Quick Start

```bash
# 1. Install (1 minute)
npm install

# 2. Add API key (30 seconds)
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# 3. Run! (30 seconds)
npm start
```

That's it! You're now running the interactive tutorial.

## What to Do First

### Path 1: Interactive Tutorial (Recommended for beginners)

```bash
npm start
```

Select "Tutorial 1" to learn the fundamentals in 10 minutes.

### Path 2: See Working Code (Recommended for experienced devs)

```bash
npm run eval:examples
```

Watch 4 complete evals run in real-time with explanations.

### Path 3: Build Your Own (Recommended for hands-on learners)

```bash
cp src/run-evals.ts my-first-eval.ts
# Edit my-first-eval.ts
# Add your test cases
tsx my-first-eval.ts
```

## Example: Your First Eval in 2 Minutes

Create `simple-eval.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from './src/framework/runner.js';
import { exactMatch } from './src/framework/scorers.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Your AI system
async function isPositive(text) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: `Is this positive or negative? Answer only "positive" or "negative"\n\n${text}`
    }]
  });
  
  return {
    output: response.content[0].type === 'text' 
      ? response.content[0].text.toLowerCase().trim() 
      : ''
  };
}

// Test cases
const tests = [
  { id: '1', input: 'I love this!', expectedOutput: 'positive' },
  { id: '2', input: 'This is awful', expectedOutput: 'negative' },
  { id: '3', input: 'Amazing!', expectedOutput: 'positive' }
];

// Run it!
const runner = new EvalRunner({
  name: 'Positivity Detector',
  description: 'Tests if we can detect positive sentiment',
  scoringFunction: exactMatch,
  threshold: 1.0
});

runner.runEval(tests, isPositive);
```

Run it:
```bash
tsx simple-eval.ts
```

## What You Just Learned

In 2 minutes, you:
1. ✅ Created test cases with expected outputs
2. ✅ Wrapped your AI system in a standard format
3. ✅ Chose a scoring function (exactMatch)
4. ✅ Ran an automated evaluation
5. ✅ Got actionable results

This is the foundation of all AI evaluation!

## Common First Questions

**Q: What scorer should I use?**

Start with `exactMatch` for discrete outputs (classifications). 
Upgrade to `llmJudge` for subjective tasks (writing quality).

**Q: How many test cases?**

Start with 5-10 obvious cases. Expand to 20-50 as you find edge cases.

**Q: What threshold?**

- 1.0 for exact matches (classifications)
- 0.7-0.8 for quality evaluation (summaries, creative)

**Q: My eval is failing everything!**

Check:
1. Is your expected output format correct?
2. Is your AI system returning the right format?
3. Add `console.log()` to see actual outputs

**Q: This seems expensive (API calls)**

True! Tips:
- Start with small datasets (5-10 cases)
- Use cheaper models for development (Haiku)
- Cache results for unchanged cases
- Use `contains` instead of `llmJudge` when possible

## Next Steps By Time Available

### 5 More Minutes
- Read [CHEATSHEET.md](CHEATSHEET.md) for quick reference

### 10 More Minutes  
- Run each example individually:
  ```bash
  tsx src/examples/01-basic-classification.ts
  ```

### 30 Minutes
- Read [docs/01-getting-started.md](docs/01-getting-started.md)
- Try modifying an example

### 1 Hour
- Complete Exercise 1 in [docs/05-exercises.md](docs/05-exercises.md)
- Build an eval for your own AI task

### 2 Hours
- Read all documentation
- Build comprehensive eval for production system
- Set up CI/CD integration

## Stuck? Look Here

1. **CHEATSHEET.md** - Quick syntax reference
2. **QUICK_START.md** - 5-minute guide
3. **docs/01-getting-started.md** - Detailed fundamentals
4. **src/examples/** - Working code to copy from

## The One Thing to Remember

> An eval = Test cases + AI system + Scoring function

That's it. Everything else is details.

Now go build something! 🚀

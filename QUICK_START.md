# Quick Start Guide

Get started with AI Evals in 5 minutes.

## Step 1: Setup (1 minute)

```bash
# Clone or navigate to the tutorial
cd EvalTutorial

# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

## Step 2: Run Interactive Tutorial (2 minutes)

```bash
npm start
```

This launches an interactive menu where you can:
- 📚 Read tutorials about evals
- 🎯 Run example evaluations
- 📖 View documentation

Try: Select "Example 1: Basic Classification" to see your first eval in action!

## Step 3: Run All Examples (2 minutes)

```bash
npm run eval:examples
```

This runs 4 complete examples:
1. **Classification** - Sentiment analysis with exact match
2. **Extraction** - JSON extraction with structure validation
3. **LLM-as-Judge** - Summarization quality evaluation
4. **Regression** - Comparing model versions

## What You'll See

```
🧪 Running eval: Sentiment Classification
📝 Description: Evaluates accuracy of sentiment classification
🔢 Test cases: 6

✅ Case pos-1: PASSED (score: 1.00)
✅ Case neg-1: PASSED (score: 1.00)
✅ Case neu-1: PASSED (score: 1.00)
...

==================================================
📊 EVAL SUMMARY
==================================================
Total Cases: 6
✅ Passed: 6 (100.0%)
❌ Failed: 0 (0.0%)
📈 Average Score: 1.000
⏱️  Duration: 3.45s
==================================================
```

## Next Steps

### Option 1: Build Your Own Eval

```bash
# Copy the template
cp src/run-evals.ts evals/my-first-eval.ts

# Edit the file and:
# 1. Implement your AI system
# 2. Add test cases
# 3. Choose a scorer
# 4. Run it!

tsx evals/my-first-eval.ts
```

### Option 2: Explore the Examples

```bash
# Run individual examples
tsx src/examples/01-basic-classification.ts
tsx src/examples/02-json-extraction.ts
tsx src/examples/03-llm-as-judge.ts
tsx src/examples/04-regression-testing.ts
```

### Option 3: Deep Dive into Docs

```bash
# Read comprehensive guides
cat docs/01-getting-started.md
cat docs/02-scoring-strategies.md
cat docs/03-best-practices.md
```

## Core Concepts (30 seconds)

An eval has 4 parts:

```typescript
// 1. Test cases (input + expected output)
const testCases = [
  { id: '1', input: 'I love it!', expectedOutput: 'positive' }
];

// 2. Your AI system
async function mySystem(input) {
  return { output: '...' };
}

// 3. Scoring function (how to measure correctness)
const scorer = exactMatch;

// 4. Run the eval
const runner = new EvalRunner({ 
  name: 'My Eval',
  scoringFunction: scorer 
});
const results = await runner.runEval(testCases, mySystem);
```

## Common Tasks

### Create a Classification Eval

```typescript
import { exactMatch } from './framework/scorers.js';

const scorer = exactMatch; // Perfect for discrete categories
const threshold = 1.0; // Must be exact
```

### Create a Generation Eval

```typescript
import { llmJudge } from './framework/scorers.js';

const scorer = llmJudge('Evaluate for clarity and accuracy');
const threshold = 0.7; // Allow some variation
```

### Create a Structured Output Eval

```typescript
import { jsonStructure } from './framework/scorers.js';

const scorer = jsonStructure(['name', 'email', 'phone']);
const threshold = 1.0; // Structure must be correct
```

## Troubleshooting

**"API key not found"**
```bash
# Make sure .env file exists with:
ANTHROPIC_API_KEY=your_key_here
```

**"Module not found"**
```bash
npm install
```

**"Permission denied"**
```bash
chmod +x src/app.ts
```

## Learning Path

1. ✅ **You are here** - Quick Start
2. 📖 Read `docs/01-getting-started.md`
3. 🎯 Run all examples: `npm run eval:examples`
4. 💪 Try exercises in `docs/05-exercises.md`
5. 🚀 Build evals for your production systems

## Resources

- **Examples**: `src/examples/` - 4 complete working examples
- **Docs**: `docs/` - Comprehensive guides
- **Exercises**: `docs/05-exercises.md` - Hands-on practice
- **Framework**: `src/framework/` - Core utilities
- **Datasets**: `datasets/` - Sample test data

## Getting Help

- Review the examples - they're heavily commented
- Check the docs for detailed explanations
- Look at the framework code - it's designed to be readable

## What's Next?

**For Beginners:**
1. Run `npm start` and go through Tutorial 1
2. Run each example individually
3. Try Exercise 1 (Email Classifier)

**For Experienced Practitioners:**
1. Jump to `docs/03-best-practices.md`
2. Check out `docs/04-advanced-topics.md`
3. Build evals for your production systems

---

**Happy Eval Building! 🎓**

Remember: Start simple (exact match), then add complexity (LLM-as-judge) only when needed.

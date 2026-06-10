# Examples

Complete, runnable examples showing how to build evaluations for different AI use cases.

## Quick Start

```bash
# Install dependencies
npm install

# Set up your API key
export ANTHROPIC_API_KEY=your_key_here

# Run an example
npx tsx examples/01-sentiment-analysis.ts
```

## Available Examples

### 1. Sentiment Analysis (`01-sentiment-analysis.ts`)

**What it does:** Evaluates a sentiment classifier's accuracy on positive, negative, and neutral text.

**Key concepts:**
- Exact match scoring
- Classification evaluation
- 100% accuracy threshold

**Run it:**
```bash
npx tsx examples/01-sentiment-analysis.ts
```

**Expected output:**
```
✅ Evaluation PASSED - All cases correct!
Accuracy: 100% (6/6)
Duration: 3.4s
```

---

### 2. Customer Support Q&A (`02-customer-support-qa.ts`)

**What it does:** Evaluates customer support responses across accuracy, helpfulness, and tone.

**Key concepts:**
- LLM-as-judge evaluation
- Multi-dimensional scoring
- Quality thresholds

**Run it:**
```bash
npx tsx examples/02-customer-support-qa.ts
```

**Expected output:**
```
✅ Evaluation PASSED - Quality threshold met!
Average Score: 0.778
Passed: 4/5 (80%)
Duration: 18.5s
```

---

## Example Structure

Each example follows this pattern:

```typescript
// 1. Define your AI system
async function mySystem(input: string) {
  // Your AI logic here
  return { output: result };
}

// 2. Create test cases
const testCases = [
  { id: '1', input: 'test input', expectedOutput: 'expected' }
];

// 3. Choose scoring function
const scoringFunction = exactMatch; // or llmJudge, contains, etc.

// 4. Run evaluation
const runner = new EvalRunner({
  name: 'My Eval',
  scoringFunction,
  threshold: 0.8
});

const results = await runner.runEval(testCases, mySystem);

// 5. Handle results
if (results.averageScore >= 0.8) {
  console.log('✅ PASSED');
} else {
  console.log('❌ FAILED');
  process.exit(1);
}
```

## Customize for Your Use Case

### Example: Email Classifier

```typescript
import { EvalRunner, exactMatch } from '../src/framework';

async function classifyEmail(email: string) {
  // Your email classification logic
  const category = await yourAI.classify(email);
  return { output: category };
}

const testCases = [
  {
    id: '1',
    input: 'Invoice #12345 for $499.99',
    expectedOutput: 'billing'
  },
  {
    id: '2',
    input: 'Product shipment delayed',
    expectedOutput: 'shipping'
  }
];

const runner = new EvalRunner({
  name: 'Email Classifier',
  scoringFunction: exactMatch
});

const results = await runner.runEval(testCases, classifyEmail);
```

### Example: Code Review Bot

```typescript
import { EvalRunner, llmJudge } from '../src/framework';

const criteria = `
Evaluate the code review comment:
1. Identifies real issues (0-0.5)
2. Provides actionable feedback (0-0.3)
3. Tone is constructive (0-0.2)
Score: 0.0 to 1.0
`;

async function reviewCode(code: string) {
  const review = await yourAI.review(code);
  return { output: review };
}

const testCases = [
  {
    id: '1',
    input: 'function foo() { var x = 1; }',
    expectedOutput: 'Should mention: use const/let, naming'
  }
];

const runner = new EvalRunner({
  name: 'Code Reviewer',
  scoringFunction: llmJudge(criteria),
  threshold: 0.7
});
```

## Tips

### Writing Good Test Cases

✅ **Do:**
- Cover edge cases
- Include failure scenarios
- Use real-world examples
- Keep inputs representative

❌ **Don't:**
- Use only happy path tests
- Make tests too easy
- Ignore error cases
- Use synthetic data exclusively

### Choosing Scoring Functions

| Use Case | Recommended Scorer |
|----------|-------------------|
| Classification | `exactMatch` |
| Structured output | `jsonStructure` |
| Content validation | `contains` |
| Quality evaluation | `llmJudge` |
| Semantic matching | `semanticSimilarity` |
| Pattern matching | `regexMatch` |

### Setting Thresholds

- **100% (1.0)** - Critical systems (medical, legal)
- **90% (0.9)** - High accuracy needed (financial)
- **80% (0.8)** - Production ready (general use)
- **70% (0.7)** - Acceptable quality (drafts, suggestions)
- **60% (0.6)** - Minimum viable (beta testing)

## Running in CI/CD

Add to your `.github/workflows/eval.yml`:

```yaml
name: Run Evals

on: [push, pull_request]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx tsx examples/01-sentiment-analysis.ts
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Contributing Examples

Have a great example? We'd love to include it!

**Requirements:**
- Self-contained (single file)
- Well-commented
- Includes expected output
- Follows the pattern above

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Need Help?

- 📖 [Main Documentation](../docs/)
- 💬 [Discussions](https://github.com/deepak-mukunthu/AIEvalsTutor/discussions)
- 🐛 [Issues](https://github.com/deepak-mukunthu/AIEvalsTutor/issues)

## License

MIT - see [LICENSE](../LICENSE)

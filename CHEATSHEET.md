# AI Evals Cheatsheet

Quick reference for building evals.

## Basic Structure

```typescript
import { EvalRunner, exactMatch } from './framework';

// 1. Define test cases
const testCases = [
  { id: '1', input: 'your input', expectedOutput: 'expected result' }
];

// 2. Create your AI system
async function mySystem(input: any) {
  return { output: 'ai response' };
}

// 3. Run the eval
const runner = new EvalRunner({
  name: 'My Eval',
  scoringFunction: exactMatch,
  threshold: 0.8
});

const results = await runner.runEval(testCases, mySystem);
```

## Choosing a Scorer

| Task Type | Scorer | Threshold |
|-----------|--------|-----------|
| Classification | `exactMatch` | 1.0 |
| Contains key info | `contains` | 1.0 |
| Pattern validation | `regexMatch(pattern)` | 1.0 |
| JSON structure | `jsonStructure(['key1', 'key2'])` | 1.0 |
| Quality evaluation | `llmJudge('criteria')` | 0.7-0.8 |
| Semantic meaning | `semanticSimilarity(0.8)` | 0.7-0.9 |

## Common Patterns

### Classification

```typescript
import { exactMatch } from './framework/scorers';

const testCases = [
  { id: 'pos', input: 'I love this', expectedOutput: 'positive' },
  { id: 'neg', input: 'I hate this', expectedOutput: 'negative' }
];

const scorer = exactMatch;
const threshold = 1.0;
```

### JSON Extraction

```typescript
import { jsonStructure } from './framework/scorers';

const testCases = [
  {
    id: 'extract1',
    input: 'John at john@example.com',
    expectedOutput: { name: 'John', email: 'john@example.com' }
  }
];

const scorer = jsonStructure(['name', 'email']);
const threshold = 1.0;
```

### Quality Evaluation

```typescript
import { llmJudge } from './framework/scorers';

const criteria = 'Evaluate for accuracy, clarity, and completeness';
const scorer = llmJudge(criteria);
const threshold = 0.7;
```

### Regression Testing

```typescript
// Baseline
const baseline = await runner.runEval(cases, oldSystem);

// New version
const current = await runner.runEval(cases, newSystem);

// Compare
if (current.averageScore < baseline.averageScore) {
  console.warn('Regression detected!');
}
```

## Custom Scorer

```typescript
import { ScoringFunction } from './framework/types';

const myScorer: ScoringFunction = async (actual, expected, input) => {
  // Your logic here
  const score = /* calculate 0-1 */;
  
  return {
    score,
    explanation: 'Why this score'
  };
};
```

## Test Case Structure

```typescript
interface EvalCase {
  id: string;                          // Unique identifier
  input: string | object;              // What AI receives
  expectedOutput?: string | object;    // What it should return
  metadata?: {                         // Optional extras
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    // ... any other metadata
  };
}
```

## Commands

```bash
npm start              # Interactive tutorial
npm run eval:examples  # Run all examples
npm run eval:custom    # Run your evals
npm run build          # Compile TypeScript
```

## Import Patterns

```typescript
// Framework
import { EvalRunner } from './framework/runner';
import { EvalCase, ModelResponse } from './framework/types';

// Scorers
import {
  exactMatch,
  contains,
  regexMatch,
  jsonStructure,
  llmJudge,
  semanticSimilarity
} from './framework/scorers';

// All at once
import { EvalRunner, exactMatch, EvalCase } from './framework';
```

## Model Response Format

```typescript
interface ModelResponse {
  output: string | object;
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
  };
}
```

## Example: Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function mySystem(input: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    messages: [{ role: 'user', content: input }]
  });

  const content = response.content[0];
  const output = content.type === 'text' ? content.text : '';

  return {
    output,
    metadata: {
      model: response.model,
      tokens: response.usage.input_tokens + response.usage.output_tokens
    }
  };
}
```

## Result Analysis

```typescript
const results = await runner.runEval(testCases, mySystem);

// Overall metrics
console.log(`Pass rate: ${results.passed}/${results.totalCases}`);
console.log(`Average score: ${results.averageScore.toFixed(3)}`);

// Failed cases
const failures = results.results.filter(r => !r.passed);
failures.forEach(f => {
  console.log(`Failed: ${f.caseId}`);
  console.log(`  Expected: ${f.expectedOutput}`);
  console.log(`  Actual: ${f.actualOutput}`);
});

// By category
const byCategory = groupBy(results.results, r => r.metadata?.category);
```

## Tips

**Start Simple**
```typescript
// Good: Start here
const scorer = exactMatch;

// Then upgrade if needed
const scorer = llmJudge('detailed criteria');
```

**Test Coverage**
```typescript
const testCases = [
  // Happy paths
  { id: 'happy1', input: 'normal case', expectedOutput: 'result' },
  
  // Edge cases
  { id: 'edge1', input: '', expectedOutput: 'empty' },
  
  // Error cases
  { id: 'error1', input: 'invalid', expectedOutput: 'error' }
];
```

**Threshold Selection**
- 1.0 = Perfect match required
- 0.8-0.9 = Good with minor variations
- 0.6-0.7 = Acceptable quality
- < 0.5 = Too lenient

**Cost Optimization**
```typescript
// Expensive: LLM judge on all cases
const scorer = llmJudge('criteria');

// Cheaper: Use cheaper scorer first, LLM only on failures
const firstPass = await runner.runEval(cases, system, contains);
const failures = firstPass.results.filter(r => !r.passed);
const secondPass = await runner.runEval(failures, system, llmJudge('criteria'));
```

## Quick Wins

1. **Copy an example** and modify for your task
2. **Start with 5 test cases** then expand
3. **Use exactMatch first** then upgrade
4. **Run locally** before CI/CD
5. **Track one metric** before adding more

## Anti-Patterns

❌ Testing only happy paths
❌ Ignoring failing tests
❌ Over-engineering from day 1
❌ No threshold tuning
❌ Not versioning datasets

✅ Cover edge cases and errors
✅ Fix or document failures
✅ Start simple, add complexity
✅ Tune threshold based on requirements
✅ Version everything

## File Organization

```
my-project/
  evals/
    sentiment-eval.ts
    extraction-eval.ts
  datasets/
    sentiment-cases.json
    extraction-cases.json
  results/
    sentiment-2024-05-31.json
```

## Next Steps

1. Pick a scorer from the table above
2. Write 5 test cases
3. Run your eval
4. Analyze failures
5. Iterate and expand

Remember: **The best eval is one that actually runs!**

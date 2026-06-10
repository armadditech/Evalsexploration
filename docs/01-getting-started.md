# Getting Started with AI Evals

## Introduction

Evaluations (evals) are systematic tests that measure how well your AI system performs. Just like unit tests verify code correctness, evals verify AI behavior.

## Why Evals Matter

### The Problem

AI systems are:
- **Non-deterministic**: Same input can produce different outputs
- **Opaque**: Hard to debug when things go wrong
- **Sensitive to changes**: Small prompt tweaks can break functionality
- **Expensive to test manually**: Human evaluation doesn't scale

### The Solution

Automated evals provide:
- **Confidence**: Know your system works before deploying
- **Regression detection**: Catch when changes break things
- **Performance tracking**: Measure improvements over time
- **Faster iteration**: Test quickly without manual review

## Core Concepts

### 1. Test Cases

A test case consists of:
```typescript
{
  id: 'unique-identifier',
  input: 'What the AI receives',
  expectedOutput: 'What it should produce',
  metadata: { category: 'classification' }
}
```

### 2. Scoring Functions

Scoring functions measure how well the output matches expectations:

- **Deterministic scorers**: Rule-based (exact match, regex)
- **AI scorers**: LLM-as-judge, semantic similarity
- **Custom scorers**: Domain-specific logic

### 3. Thresholds

The minimum score required to pass:
- **1.0**: Perfect match required (classification)
- **0.7-0.9**: Good but flexible (generation tasks)
- **0.5-0.7**: Acceptable with variations

### 4. Eval Runner

Orchestrates running all test cases and aggregating results.

## Your First Eval

### Step 1: Define Test Cases

```typescript
const testCases: EvalCase[] = [
  {
    id: 'easy-case',
    input: 'Is this positive or negative: I love it!',
    expectedOutput: 'positive'
  },
  {
    id: 'hard-case',
    input: 'Is this positive or negative: Not bad.',
    expectedOutput: 'positive'
  }
];
```

### Step 2: Create Model Function

```typescript
async function sentimentClassifier(input: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    messages: [{ role: 'user', content: input }]
  });
  
  return {
    output: response.content[0].text
  };
}
```

### Step 3: Choose Scoring Function

```typescript
import { exactMatch } from './framework/scorers.js';

// For discrete classifications, exact match is appropriate
const scoringFunction = exactMatch;
```

### Step 4: Run the Eval

```typescript
const evalRunner = new EvalRunner({
  name: 'Sentiment Classification',
  description: 'Tests positive/negative classification',
  scoringFunction: exactMatch,
  threshold: 1.0
});

const results = await evalRunner.runEval(testCases, sentimentClassifier);
```

## Understanding Results

```
🧪 Running eval: Sentiment Classification
📝 Description: Tests positive/negative classification
🔢 Test cases: 2

✅ Case easy-case: PASSED (score: 1.00)
❌ Case hard-case: FAILED (score: 0.00)

==================================================
📊 EVAL SUMMARY
==================================================
Total Cases: 2
✅ Passed: 1 (50.0%)
❌ Failed: 1 (50.0%)
📈 Average Score: 0.500
⏱️  Duration: 2.34s
==================================================
```

## Next Steps

1. **Start simple**: Use exact match for well-defined tasks
2. **Add complexity**: Graduate to LLM-as-judge for subjective tasks
3. **Build coverage**: Add edge cases, error cases, adversarial examples
4. **Track over time**: Run evals in CI/CD to catch regressions
5. **Iterate**: Use failures to improve your system

## Common Pitfalls

❌ **Testing only happy paths**: Edge cases reveal real issues
❌ **Too few test cases**: 3 examples won't catch problems
❌ **Ignoring failures**: Failing tests mean something is wrong
❌ **Over-engineering**: Start simple, add complexity as needed
❌ **No regression tests**: Track that improvements don't break things

✅ **Do this instead**:
- Test diverse inputs (edge cases, errors, adversarial)
- Aim for 20+ test cases per category
- Investigate and fix failures
- Use simple scorers first
- Maintain a golden test set for regressions

## Examples to Explore

1. **Basic Classification** - Start here for discrete outputs
2. **JSON Extraction** - Learn structured output validation
3. **LLM-as-Judge** - For subjective quality evaluation
4. **Regression Testing** - Prevent breaking changes

Run `npm start` to explore interactive examples!

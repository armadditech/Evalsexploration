# Best Practices for AI Evals

## Dataset Design

### Coverage Principles

Your test dataset should cover:

1. **Happy paths** - Typical, expected inputs
2. **Edge cases** - Boundary conditions, unusual inputs
3. **Error cases** - Invalid or malformed inputs
4. **Adversarial cases** - Deliberately challenging inputs

### Example: Sentiment Classification

```typescript
const testCases = [
  // Happy paths
  { input: 'I love this!', expected: 'positive' },
  { input: 'This is terrible.', expected: 'negative' },
  
  // Edge cases
  { input: 'Not bad.', expected: 'positive' }, // Double negative
  { input: 'It\'s okay, I guess.', expected: 'neutral' }, // Uncertain
  
  // Error cases
  { input: '', expected: 'neutral' }, // Empty input
  { input: '12345', expected: 'neutral' }, // No sentiment
  
  // Adversarial
  { input: 'I love how terrible this is!', expected: 'negative' }, // Sarcasm
];
```

### Dataset Size Guidelines

| Task Complexity | Minimum Cases | Recommended |
|----------------|---------------|-------------|
| Simple classification | 10-20 | 50+ |
| Extraction/parsing | 20-30 | 100+ |
| Generation/reasoning | 30-50 | 200+ |
| Multi-step tasks | 50-100 | 500+ |

### Data Quality Checklist

- [ ] Diverse inputs representing real usage
- [ ] Balanced across categories/types
- [ ] Includes edge cases and errors
- [ ] Ground truth labels are correct
- [ ] No duplicate or near-duplicate cases
- [ ] Documented assumptions and edge cases

## Eval Development Workflow

### 1. Start Small

```typescript
// Begin with 5-10 cases
const initialCases = [
  { id: '1', input: 'clear case 1', expectedOutput: 'A' },
  { id: '2', input: 'clear case 2', expectedOutput: 'B' },
  // ... 3-8 more obvious cases
];
```

### 2. Run and Analyze

```bash
npm run eval:custom
```

Look for:
- Which cases pass/fail?
- Are failures legitimate bugs or bad test cases?
- What patterns do failures have?

### 3. Iterate

Based on failures:
- Fix your AI system (prompt, model, logic)
- OR fix test cases (bad expected output)
- OR adjust scorer/threshold

### 4. Expand Coverage

Add cases that:
- Cover failure patterns
- Test edge cases
- Represent real user inputs

### 5. Establish Baseline

Once stable:
```typescript
// Save passing results as regression baseline
const BASELINE_SCORE = 0.85;
const BASELINE_PASS_RATE = 0.90;

assert(summary.averageScore >= BASELINE_SCORE);
assert(summary.passed / summary.totalCases >= BASELINE_PASS_RATE);
```

## Integration with Development

### CI/CD Integration

```yaml
# .github/workflows/eval.yml
name: Run Evals

on: [pull_request]

jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run eval:all
      - name: Check regression
        run: |
          if [ $PASS_RATE -lt 0.90 ]; then
            echo "Eval pass rate below threshold"
            exit 1
          fi
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run eval:smoke"
    }
  }
}
```

### Smoke Tests vs Full Suite

**Smoke tests** (fast, run often):
- 5-10 critical test cases
- Run on every commit
- Fast scorers only (no LLM-as-judge)
- Must all pass

**Full suite** (comprehensive, run less often):
- All test cases
- All scoring methods
- Run on PR / before deploy
- Can have lower threshold

## Monitoring Production

### Online Evals

Run evals on production data:

```typescript
// Sample production traffic
const productionSample = await sampleRecentRequests(100);

// Run eval on sample
const prodEvalResults = await evalRunner.runEval(
  productionSample,
  productionSystem
);

// Alert if degradation
if (prodEvalResults.averageScore < THRESHOLD) {
  await sendAlert('Production eval score dropped!');
}
```

### A/B Testing

Compare two versions:

```typescript
const controlResults = await evalRunner.runEval(cases, controlSystem);
const treatmentResults = await evalRunner.runEval(cases, treatmentSystem);

console.log(`Control: ${controlResults.averageScore}`);
console.log(`Treatment: ${treatmentResults.averageScore}`);

// Deploy treatment if better
if (treatmentResults.averageScore > controlResults.averageScore) {
  deploy(treatmentSystem);
}
```

## Cost Optimization

### Strategies

1. **Tiered evaluation**
   - First pass: cheap scorers (exactMatch)
   - Second pass: expensive scorers (llmJudge) only on failures

2. **Sampling**
   - Run full eval on subset
   - Extrapolate results

3. **Caching**
   - Cache LLM judge responses
   - Use same test cases across runs

4. **Batch processing**
   - Group similar evaluations
   - Use batch APIs when available

### Example: Tiered Evaluation

```typescript
// First pass: cheap exact match
const firstPass = await evalRunner.runEval(cases, mySystem, exactMatch);

// Second pass: expensive LLM judge only on failures
const failures = firstPass.results.filter(r => !r.passed);
const secondPass = await evalRunner.runEval(
  failures.map(f => findCase(f.caseId)),
  mySystem,
  llmJudge('Detailed criteria')
);
```

## Common Mistakes

### ❌ Testing Only Happy Paths

```typescript
// Bad: Only obvious cases
const cases = [
  { input: 'I love it!', expected: 'positive' },
  { input: 'I hate it!', expected: 'negative' },
];
```

```typescript
// Good: Include edge cases
const cases = [
  { input: 'I love it!', expected: 'positive' },
  { input: 'I hate it!', expected: 'negative' },
  { input: 'Not bad', expected: 'positive' }, // Tricky!
  { input: 'Could be worse', expected: 'neutral' }, // Ambiguous
  { input: '', expected: 'neutral' }, // Empty
];
```

### ❌ Ignoring Failing Tests

```typescript
// Bad: Commenting out failures
// { input: 'tricky case', expected: 'X' }, // TODO: fix later
```

```typescript
// Good: Track and fix failures
const knownIssues = [
  { input: 'tricky case', expected: 'X', status: 'investigating' }
];
// Keep them visible, track progress
```

### ❌ Over-engineering Early

```typescript
// Bad: Complex multi-stage eval from day 1
async function ultraComplexScorer() {
  const stage1 = await llmJudge(...);
  const stage2 = await semanticSimilarity(...);
  const stage3 = await customML(...);
  return weightedAverage([stage1, stage2, stage3]);
}
```

```typescript
// Good: Start simple
const scorer = exactMatch;
// Add complexity only when needed
```

### ❌ No Versioning

```typescript
// Bad: Overwriting test results
const results = await runEval();
// Lost history of past runs
```

```typescript
// Good: Version everything
const results = await runEval();
await saveResults(`results-${version}-${date}.json`, results);
```

## Versioning Strategy

Track changes to:
- **Model versions** (gpt-4, claude-3.5-sonnet, etc.)
- **Prompt versions** (v1, v2, v3)
- **Test dataset versions** (added cases, fixed labels)
- **Scoring function versions** (changed criteria)

Example structure:
```
evals/
  sentiment-v1/
    model: claude-3.5-sonnet
    dataset: v1.0
    results: 0.85
  sentiment-v2/
    model: claude-3.5-sonnet
    dataset: v1.1  # Fixed 5 bad labels
    results: 0.89
  sentiment-v3/
    model: claude-sonnet-4-5
    dataset: v1.1
    results: 0.92
```

## Documentation

Document each eval:

```typescript
/**
 * Sentiment Classification Eval
 * 
 * Purpose: Validate sentiment classification accuracy
 * 
 * Coverage:
 * - Positive sentiment (15 cases)
 * - Negative sentiment (15 cases)
 * - Neutral sentiment (10 cases)
 * 
 * Scoring: Exact match (must be one of: positive, negative, neutral)
 * Threshold: 1.0 (must be exact)
 * 
 * Baseline: 0.85 average score (34/40 pass)
 * 
 * Known issues:
 * - Struggles with sarcasm (3 cases)
 * - Mixed sentiment ambiguous (2 cases)
 */
```

## Summary Checklist

Before deploying an eval:

- [ ] Test cases cover happy paths, edge cases, errors
- [ ] Dataset size appropriate for task complexity
- [ ] Scoring function matches task requirements
- [ ] Threshold tuned based on requirements
- [ ] Baseline established for regression detection
- [ ] Integrated into CI/CD pipeline
- [ ] Production monitoring planned
- [ ] Cost optimization considered
- [ ] Everything versioned and documented

# Advanced Eval Topics

## Multi-Metric Evaluation

Beyond simple pass/fail, track multiple metrics:

### Classification Metrics

```typescript
interface ClassificationMetrics {
  accuracy: number;      // Overall correctness
  precision: number;     // True positives / (True positives + False positives)
  recall: number;        // True positives / (True positives + False negatives)
  f1Score: number;       // Harmonic mean of precision and recall
}

function computeClassificationMetrics(
  results: EvalResult[],
  positiveLabel: string
): ClassificationMetrics {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  
  for (const result of results) {
    const actual = result.actualOutput === positiveLabel;
    const expected = result.expectedOutput === positiveLabel;
    
    if (actual && expected) tp++;
    else if (actual && !expected) fp++;
    else if (!actual && expected) fn++;
    else tn++;
  }
  
  const accuracy = (tp + tn) / results.length;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  return { accuracy, precision, recall, f1Score };
}
```

### When to Use Each Metric

- **Accuracy**: Balanced datasets, equal cost for errors
- **Precision**: False positives are costly (spam detection)
- **Recall**: False negatives are costly (disease detection)
- **F1 Score**: Balance between precision and recall

## Error Analysis

Systematic analysis of failures reveals patterns:

```typescript
function analyzeFailures(results: EvalResult[]) {
  const failures = results.filter(r => !r.passed);
  
  // Group by metadata categories
  const byCategory = groupBy(failures, f => f.metadata?.category);
  
  console.log('\n📊 FAILURE ANALYSIS\n');
  
  for (const [category, cases] of Object.entries(byCategory)) {
    console.log(`${category}: ${cases.length} failures`);
    
    // Show examples
    cases.slice(0, 3).forEach(c => {
      console.log(`  - ${c.caseId}: expected "${c.expectedOutput}", got "${c.actualOutput}"`);
    });
  }
  
  // Find common patterns
  const patterns = findPatterns(failures);
  console.log('\n🔍 COMMON PATTERNS:');
  patterns.forEach(p => console.log(`  - ${p.description}: ${p.count} cases`));
}
```

## Continuous Evaluation

### Tracking Over Time

```typescript
interface EvalHistory {
  timestamp: Date;
  version: string;
  results: EvalSummary;
  metadata: {
    model: string;
    promptVersion: string;
    datasetVersion: string;
  };
}

class EvalTracker {
  private history: EvalHistory[] = [];
  
  async track(version: string, results: EvalSummary, metadata: any) {
    this.history.push({
      timestamp: new Date(),
      version,
      results,
      metadata
    });
    
    await this.saveHistory();
    this.detectRegressions();
  }
  
  private detectRegressions() {
    if (this.history.length < 2) return;
    
    const current = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];
    
    const currentScore = current.results.averageScore;
    const previousScore = previous.results.averageScore;
    
    if (currentScore < previousScore - 0.05) { // 5% threshold
      console.warn('⚠️  REGRESSION DETECTED!');
      console.warn(`  Previous: ${previousScore.toFixed(3)}`);
      console.warn(`  Current: ${currentScore.toFixed(3)}`);
      console.warn(`  Change: ${((currentScore - previousScore) * 100).toFixed(1)}%`);
    }
  }
  
  getTrend(metric: keyof EvalSummary): number[] {
    return this.history.map(h => h.results[metric] as number);
  }
}
```

### Visualization

```typescript
function visualizeTrend(tracker: EvalTracker) {
  const scores = tracker.getTrend('averageScore');
  const versions = tracker.history.map(h => h.version);
  
  console.log('\n📈 SCORE TREND\n');
  
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  
  for (let i = 0; i < scores.length; i++) {
    const normalized = (scores[i] - min) / (max - min);
    const bar = '█'.repeat(Math.round(normalized * 20));
    console.log(`${versions[i]}: ${bar} ${scores[i].toFixed(3)}`);
  }
}
```

## A/B Testing Framework

```typescript
interface ABTestConfig {
  controlSystem: (input: any) => Promise<ModelResponse>;
  treatmentSystem: (input: any) => Promise<ModelResponse>;
  testCases: EvalCase[];
  scoringFunction: ScoringFunction;
}

async function runABTest(config: ABTestConfig) {
  console.log('\n🧪 A/B TEST\n');
  
  // Run both systems
  const [controlResults, treatmentResults] = await Promise.all([
    runEval('Control', config.controlSystem, config.testCases, config.scoringFunction),
    runEval('Treatment', config.treatmentSystem, config.testCases, config.scoringFunction),
  ]);
  
  // Statistical comparison
  const comparison = {
    controlScore: controlResults.averageScore,
    treatmentScore: treatmentResults.averageScore,
    improvement: treatmentResults.averageScore - controlResults.averageScore,
    percentImprovement: ((treatmentResults.averageScore / controlResults.averageScore - 1) * 100),
  };
  
  console.log('\n📊 COMPARISON');
  console.log(`Control:    ${comparison.controlScore.toFixed(3)}`);
  console.log(`Treatment:  ${comparison.treatmentScore.toFixed(3)}`);
  console.log(`Improvement: ${comparison.improvement >= 0 ? '+' : ''}${comparison.improvement.toFixed(3)} (${comparison.percentImprovement.toFixed(1)}%)`);
  
  // Statistical significance (simplified)
  const isSignificant = Math.abs(comparison.improvement) > 0.05 && config.testCases.length >= 30;
  
  console.log(`Significant: ${isSignificant ? '✅ Yes' : '❌ No'}`);
  
  if (isSignificant && comparison.improvement > 0) {
    console.log('\n✅ RECOMMENDATION: Deploy treatment');
  } else if (isSignificant && comparison.improvement < 0) {
    console.log('\n⚠️  RECOMMENDATION: Keep control');
  } else {
    console.log('\n⚪ RECOMMENDATION: Inconclusive, need more data');
  }
  
  return comparison;
}
```

## Prompt Optimization with Evals

```typescript
const PROMPTS = {
  v1: 'Classify the sentiment: {input}',
  v2: 'Analyze the sentiment of this text and respond with exactly one of: positive, negative, neutral\n\nText: {input}',
  v3: 'You are a sentiment analysis expert. Classify this text as positive, negative, or neutral. Be precise.\n\nText: {input}\n\nSentiment:',
};

async function optimizePrompt(testCases: EvalCase[]) {
  const results = new Map();
  
  for (const [version, promptTemplate] of Object.entries(PROMPTS)) {
    const system = createSystemWithPrompt(promptTemplate);
    const summary = await runEval(version, system, testCases, exactMatch);
    results.set(version, summary);
  }
  
  // Find best prompt
  let best = { version: '', score: 0 };
  for (const [version, summary] of results) {
    if (summary.averageScore > best.score) {
      best = { version, score: summary.averageScore };
    }
  }
  
  console.log(`\n🏆 BEST PROMPT: ${best.version} (${best.score.toFixed(3)})`);
  return best.version;
}
```

## Human-in-the-Loop Evaluation

For cases where automated scoring is uncertain:

```typescript
async function hybridEval(
  cases: EvalCase[],
  system: (input: any) => Promise<ModelResponse>,
  autoScorer: ScoringFunction,
  humanReviewThreshold = 0.5
) {
  const results: EvalResult[] = [];
  const needsHumanReview: EvalResult[] = [];
  
  for (const testCase of cases) {
    const response = await system(testCase.input);
    const { score, explanation } = await autoScorer(
      response.output,
      testCase.expectedOutput,
      testCase.input
    );
    
    const result: EvalResult = {
      caseId: testCase.id,
      passed: score >= 0.7,
      score,
      actualOutput: response.output,
      expectedOutput: testCase.expectedOutput,
      explanation,
      duration: 0,
    };
    
    // Flag uncertain cases for human review
    if (score > humanReviewThreshold && score < 0.9) {
      needsHumanReview.push(result);
    }
    
    results.push(result);
  }
  
  if (needsHumanReview.length > 0) {
    console.log(`\n👤 ${needsHumanReview.length} cases need human review`);
    
    for (const result of needsHumanReview) {
      const humanScore = await requestHumanReview(result);
      result.score = humanScore;
      result.passed = humanScore >= 0.7;
    }
  }
  
  return { results, humanReviewCount: needsHumanReview.length };
}

async function requestHumanReview(result: EvalResult): Promise<number> {
  console.log(`\nReview case ${result.caseId}:`);
  console.log(`Expected: ${result.expectedOutput}`);
  console.log(`Actual: ${result.actualOutput}`);
  console.log(`Auto score: ${result.score.toFixed(2)}`);
  
  const { score } = await inquirer.prompt([{
    type: 'number',
    name: 'score',
    message: 'Human score (0-1):',
    default: result.score
  }]);
  
  return score;
}
```

## Dataset Augmentation

Generate more test cases programmatically:

```typescript
// Paraphrase existing cases
async function augmentDataset(
  cases: EvalCase[],
  augmentationFactor = 3
): Promise<EvalCase[]> {
  const augmented: EvalCase[] = [...cases];
  
  for (const testCase of cases) {
    for (let i = 0; i < augmentationFactor; i++) {
      const paraphrase = await generateParaphrase(testCase.input);
      augmented.push({
        id: `${testCase.id}-aug-${i}`,
        input: paraphrase,
        expectedOutput: testCase.expectedOutput,
        metadata: {
          ...testCase.metadata,
          augmented: true,
          originalId: testCase.id,
        },
      });
    }
  }
  
  return augmented;
}

// Generate adversarial examples
async function generateAdversarialCases(
  cases: EvalCase[]
): Promise<EvalCase[]> {
  const adversarial: EvalCase[] = [];
  
  for (const testCase of cases) {
    // Add noise
    adversarial.push({
      id: `${testCase.id}-typos`,
      input: addTypos(testCase.input as string),
      expectedOutput: testCase.expectedOutput,
      metadata: { ...testCase.metadata, adversarial: 'typos' },
    });
    
    // Change casing
    adversarial.push({
      id: `${testCase.id}-case`,
      input: randomCase(testCase.input as string),
      expectedOutput: testCase.expectedOutput,
      metadata: { ...testCase.metadata, adversarial: 'case' },
    });
  }
  
  return adversarial;
}
```

## Caching for Cost Reduction

```typescript
class CachedEvalRunner extends EvalRunner {
  private cache = new Map<string, any>();
  
  private getCacheKey(input: any, scorerName: string): string {
    return JSON.stringify({ input, scorer: scorerName });
  }
  
  async runCase(
    testCase: EvalCase,
    modelFunction: (input: any) => Promise<ModelResponse>
  ): Promise<EvalResult> {
    const cacheKey = this.getCacheKey(testCase.input, this.config.name);
    
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Cache hit for ${testCase.id}`);
      return this.cache.get(cacheKey);
    }
    
    const result = await super.runCase(testCase, modelFunction);
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  async saveCache(path: string) {
    await writeFile(path, JSON.stringify([...this.cache.entries()]));
  }
  
  async loadCache(path: string) {
    const data = JSON.parse(await readFile(path, 'utf-8'));
    this.cache = new Map(data);
  }
}
```

## Summary

Advanced techniques to master:

1. **Multi-metric evaluation** - Track precision, recall, F1
2. **Error analysis** - Find systematic failure patterns
3. **Continuous evaluation** - Track performance over time
4. **A/B testing** - Compare systems rigorously
5. **Prompt optimization** - Use evals to find best prompts
6. **Human-in-the-loop** - Combine automated + human judgment
7. **Dataset augmentation** - Generate more test cases
8. **Caching** - Reduce costs with smart caching

These techniques help you build production-grade evaluation systems.

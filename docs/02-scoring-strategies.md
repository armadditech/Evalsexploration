# Scoring Strategies for AI Evals

Choosing the right scoring function is critical for effective evals. This guide helps you pick the right approach.

## Scoring Function Decision Tree

```
Is the output deterministic (same input → same output)?
├─ YES: Is it a discrete category?
│  ├─ YES → Use exactMatch
│  └─ NO → Use contains or regexMatch
│
└─ NO: Is there one correct answer?
   ├─ YES → Use semanticSimilarity
   └─ NO → Use llmJudge with criteria
```

## 1. Exact Match

**When to use:**
- Discrete classifications (sentiment, categories)
- Structured data with specific values
- Boolean yes/no outputs

**Example:**
```typescript
import { exactMatch } from './framework/scorers.js';

const scorer = exactMatch;
// Input: "Classify: I love this"
// Expected: "positive"
// Actual: "positive"
// Score: 1.0 ✅
```

**Pros:**
- Fast and deterministic
- No API costs
- Clear pass/fail

**Cons:**
- Too strict for generative tasks
- Doesn't handle paraphrasing
- Sensitive to formatting

## 2. Contains

**When to use:**
- Key information must appear in output
- Exact wording doesn't matter
- Checking for presence of facts

**Example:**
```typescript
import { contains } from './framework/scorers.js';

const scorer = contains;
// Expected: "Paris"
// Actual: "The capital of France is Paris."
// Score: 1.0 ✅
```

**Pros:**
- Flexible on formatting
- Good for fact-checking
- Fast

**Cons:**
- May miss semantic equivalents
- Can give false positives
- Doesn't validate quality

## 3. Regex Match

**When to use:**
- Outputs follow specific patterns
- Format validation (dates, emails, IDs)
- Extracting structured data

**Example:**
```typescript
import { regexMatch } from './framework/scorers.js';

const emailScorer = regexMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
// Actual: "Contact: user@example.com"
// Score: 1.0 ✅ (contains valid email)
```

**Pros:**
- Precise pattern matching
- Fast and deterministic
- Good for validation

**Cons:**
- Requires regex expertise
- Brittle if patterns change
- Doesn't check semantics

## 4. JSON Structure Validation

**When to use:**
- Outputs must have specific fields
- Structured data extraction
- API response validation

**Example:**
```typescript
import { jsonStructure } from './framework/scorers.js';

const scorer = jsonStructure(['name', 'email', 'age']);
// Actual: { name: 'John', email: 'j@example.com', age: 30 }
// Score: 1.0 ✅ (has all required keys)
```

**Pros:**
- Validates structure
- Catches missing fields
- Fast

**Cons:**
- Doesn't validate content
- Requires valid JSON
- Doesn't check data types

## 5. LLM-as-Judge

**When to use:**
- Subjective quality evaluation
- Creative or open-ended generation
- Multiple valid answers
- Complex criteria

**Example:**
```typescript
import { llmJudge } from './framework/scorers.js';

const criteria = `
Evaluate based on:
1. Accuracy - factually correct
2. Clarity - easy to understand
3. Completeness - covers key points
`;

const scorer = llmJudge(criteria);
// Uses Claude to score the output
// Score: 0.85 (good but not perfect)
```

**Pros:**
- Handles nuance
- Multiple criteria
- Human-like evaluation

**Cons:**
- Slower (extra API call)
- Costs more
- Can be inconsistent
- May have biases

**Best Practices:**
- Define clear criteria
- Use specific examples
- Validate against human evals
- Consider caching judge responses

## 6. Semantic Similarity

**When to use:**
- Multiple valid phrasings
- Meaning matters more than wording
- Paraphrase detection

**Example:**
```typescript
import { semanticSimilarity } from './framework/scorers.js';

const scorer = semanticSimilarity(0.8);
// Expected: "The cat sat on the mat"
// Actual: "A feline was resting on the rug"
// Score: 0.85 ✅ (semantically similar)
```

**Pros:**
- Handles paraphrasing
- Semantic understanding
- Flexible

**Cons:**
- Slower (API call)
- More expensive
- May miss subtle differences

## Combining Multiple Scorers

For complex tasks, use multiple scorers:

```typescript
async function compositeScorer(actualOutput, expectedOutput, input) {
  // Check structure first
  const structureResult = await jsonStructure(['answer', 'confidence'])(actualOutput);
  if (structureResult.score === 0) {
    return structureResult;
  }
  
  // Then check content quality
  const qualityResult = await llmJudge('Is the answer correct and well-explained?')(
    actualOutput,
    expectedOutput,
    input
  );
  
  // Combined score: both must pass
  return {
    score: Math.min(structureResult.score, qualityResult.score),
    explanation: `Structure: ${structureResult.explanation}, Quality: ${qualityResult.explanation}`
  };
}
```

## Choosing Thresholds

Different tasks need different thresholds:

| Task Type | Threshold | Reasoning |
|-----------|-----------|-----------|
| Classification | 1.0 | Must be exact category |
| Structured extraction | 1.0 | Structure must be correct |
| Fact verification | 0.9 | Allow minor formatting |
| Summarization | 0.7-0.8 | Multiple valid summaries |
| Creative writing | 0.6-0.7 | Highly subjective |

## Custom Scorers

Build your own for domain-specific needs:

```typescript
const customScorer: ScoringFunction = async (actualOutput, expectedOutput) => {
  // Your custom logic here
  const score = computeScore(actualOutput, expectedOutput);
  
  return {
    score,
    explanation: 'Why this score was given'
  };
};
```

## Performance Considerations

| Scorer | Speed | Cost | Accuracy |
|--------|-------|------|----------|
| exactMatch | ⚡⚡⚡ | 💰 Free | ✓ High (for discrete) |
| contains | ⚡⚡⚡ | 💰 Free | ✓ Medium |
| regexMatch | ⚡⚡⚡ | 💰 Free | ✓ High (for patterns) |
| jsonStructure | ⚡⚡⚡ | 💰 Free | ✓ Medium |
| llmJudge | ⚡ Slow | 💰💰💰 High | ✓✓ Very High |
| semanticSimilarity | ⚡ Slow | 💰💰💰 High | ✓✓ Very High |

**Rule of thumb:** Start with fast, cheap scorers. Graduate to AI scorers when needed.

## Summary

1. **Start simple**: Use exactMatch or contains first
2. **Add complexity**: Graduate to LLM-as-judge when needed
3. **Consider costs**: AI scorers are slower and more expensive
4. **Validate**: Check scorer accuracy against human judgments
5. **Combine**: Use multiple scorers for comprehensive evaluation

# Contributing to AI Evals Tutorial

Thank you for your interest in improving this tutorial!

## Ways to Contribute

### 1. Add New Examples

Create examples in `src/examples/`:

```typescript
/**
 * Example N: [Title]
 *
 * [Description of what this demonstrates]
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from '../framework/runner.js';
import { /* scorer */ } from '../framework/scorers.js';

// Your example implementation

export async function runYourExample() {
  // Implementation
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runYourExample();
}
```

**Good example topics:**
- Code generation evaluation
- Math problem solving
- Creative writing assessment
- Question answering systems
- Translation quality
- Content moderation

### 2. Add New Scoring Functions

Add to `src/framework/scorers.ts`:

```typescript
/**
 * [Scorer name] - [brief description]
 */
export const yourScorer: ScoringFunction = async (
  actualOutput,
  expectedOutput,
  input
) => {
  // Scoring logic
  
  return {
    score: /* 0-1 */,
    explanation: /* why */
  };
};
```

**Useful scorers to add:**
- F1 score calculator
- BLEU score for translation
- Custom domain metrics
- Multi-criteria weighted scorer

### 3. Improve Documentation

Documentation lives in `docs/`:

- Clarify existing explanations
- Add more examples
- Create visual diagrams
- Add troubleshooting tips
- Expand exercises

### 4. Add Datasets

Add sample datasets in `datasets/`:

```json
[
  {
    "id": "unique-id",
    "input": "input text or object",
    "expectedOutput": "expected output",
    "metadata": {
      "category": "classification",
      "difficulty": "medium"
    }
  }
]
```

**Useful datasets:**
- Common benchmarks (MMLU, HellaSwag questions)
- Real-world examples
- Edge cases and adversarial examples
- Multi-lingual examples

### 5. Report Issues

Found a bug or unclear explanation?

1. Check existing issues
2. Create new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, OS)

## Code Style

- Use TypeScript
- Follow existing patterns
- Add JSDoc comments for public APIs
- Use Prettier for formatting: `npm run format`
- Use clear, descriptive names

## Documentation Style

- Use markdown
- Include code examples
- Explain the "why" not just the "what"
- Keep it practical and actionable
- Include expected output for examples

## Testing

Before submitting:

```bash
# Run all examples
npm run eval:examples

# Build TypeScript
npm run build

# Format code
npm run format
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear message
6. Push and create PR
7. Describe what and why in PR description

## Example Contribution: New Scorer

```typescript
// In src/framework/scorers.ts

/**
 * Fuzzy match scorer - allows for small differences
 */
export const fuzzyMatch = (maxDistance = 2): ScoringFunction => {
  return async (actualOutput, expectedOutput) => {
    if (!expectedOutput) {
      return { score: 0, explanation: 'No expected output' };
    }
    
    const distance = levenshteinDistance(
      String(actualOutput), 
      String(expectedOutput)
    );
    
    const matches = distance <= maxDistance;
    
    return {
      score: matches ? 1.0 : 0.0,
      explanation: matches 
        ? `Fuzzy match (distance: ${distance})`
        : `Too different (distance: ${distance})`
    };
  };
};

function levenshteinDistance(a: string, b: string): number {
  // Implementation
}
```

## Questions?

Open an issue with the "question" label.

## License

By contributing, you agree your contributions will be licensed under the MIT License.

Thank you for helping make AI evals more accessible!

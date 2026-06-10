# AI Evals Tutorial - Project Summary

## What This Project Provides

A complete, production-ready learning platform for AI practitioners to master building evaluations (evals) for AI systems.

## Structure

```
EvalTutorial/
├── src/
│   ├── framework/          # Core eval framework
│   │   ├── types.ts        # Type definitions
│   │   ├── runner.ts       # Eval execution engine
│   │   ├── scorers.ts      # Scoring functions library
│   │   └── index.ts        # Main exports
│   ├── examples/           # 4 complete working examples
│   │   ├── 01-basic-classification.ts
│   │   ├── 02-json-extraction.ts
│   │   ├── 03-llm-as-judge.ts
│   │   ├── 04-regression-testing.ts
│   │   └── run-all.ts      # Run all examples
│   ├── app.ts              # Interactive tutorial app
│   └── run-evals.ts        # Template for custom evals
├── docs/                   # Comprehensive documentation
│   ├── 01-getting-started.md
│   ├── 02-scoring-strategies.md
│   ├── 03-best-practices.md
│   ├── 04-advanced-topics.md
│   └── 05-exercises.md
├── datasets/               # Sample test datasets
│   ├── sentiment-examples.json
│   └── extraction-examples.json
├── README.md               # Main project readme
├── QUICK_START.md          # 5-minute quick start
└── package.json            # Dependencies and scripts
```

## Key Features

### 1. Framework (`src/framework/`)

**EvalRunner** - Orchestrates test execution
- Runs test cases through your AI system
- Applies scoring functions
- Aggregates results
- Provides formatted output

**Scorers** - 6 built-in scoring functions:
- `exactMatch` - For discrete classifications
- `contains` - For key information presence
- `regexMatch` - For pattern validation
- `jsonStructure` - For structured output validation
- `llmJudge` - For subjective quality evaluation
- `semanticSimilarity` - For meaning-based comparison

### 2. Examples (`src/examples/`)

Four complete, runnable examples:

1. **Classification** - Sentiment analysis
   - Demonstrates exact match scoring
   - Shows how to structure test cases
   - Perfect for beginners

2. **JSON Extraction** - Contact information
   - Structure validation
   - Handling missing data
   - Structured output patterns

3. **LLM-as-Judge** - Article summarization
   - Quality evaluation
   - Subjective criteria
   - Cost considerations

4. **Regression Testing** - Math solver
   - Comparing model versions
   - Preventing regressions
   - Baseline tracking

### 3. Documentation (`docs/`)

**Getting Started** - Fundamentals
- What are evals and why they matter
- Core concepts and components
- Your first eval walkthrough

**Scoring Strategies** - Choosing the right approach
- Decision tree for scorer selection
- Detailed guide for each scorer type
- Performance and cost comparison

**Best Practices** - Production-ready patterns
- Dataset design principles
- Development workflow
- CI/CD integration
- Production monitoring

**Advanced Topics** - Expert techniques
- Multi-metric evaluation
- Error analysis
- A/B testing
- Human-in-the-loop
- Dataset augmentation

**Exercises** - Hands-on practice
- 5 guided exercises with starter code
- Challenge exercise template
- Evaluation rubric

### 4. Interactive App (`src/app.ts`)

Terminal-based learning interface:
- Tutorial modules
- Run examples directly
- Browse documentation
- Guided learning path

## Usage Patterns

### Quick Evaluation

```typescript
import { EvalRunner, exactMatch } from './framework';

const testCases = [
  { id: '1', input: 'test', expectedOutput: 'expected' }
];

const runner = new EvalRunner({
  name: 'My Eval',
  scoringFunction: exactMatch
});

const results = await runner.runEval(testCases, myAISystem);
```

### Custom Scorer

```typescript
const customScorer: ScoringFunction = async (actual, expected) => {
  // Your scoring logic
  return { score: 0.85, explanation: 'Good match' };
};
```

### Regression Testing

```typescript
const baseline = await runEval(cases, oldSystem);
const current = await runEval(cases, newSystem);

if (current.averageScore < baseline.averageScore) {
  console.warn('Regression detected!');
}
```

## Commands

```bash
npm start              # Interactive tutorial
npm run eval:examples  # Run all examples
npm run eval:custom    # Run custom evals
npm run build          # Build TypeScript
npm test               # Run tests
```

## Learning Path

1. **Quick Start** (5 min)
   - Run `npm start`
   - Go through Tutorial 1
   - Run first example

2. **Foundation** (30 min)
   - Read `docs/01-getting-started.md`
   - Run all examples
   - Understand each scorer type

3. **Practice** (1-2 hours)
   - Complete Exercise 1-2
   - Build simple eval for your own task
   - Experiment with different scorers

4. **Advanced** (2-4 hours)
   - Read best practices and advanced topics
   - Complete remaining exercises
   - Implement production-grade evals

## Design Principles

1. **Educational First** - Clear explanations at every step
2. **Practical Focus** - Real-world examples, not toy problems
3. **Progressive Complexity** - Simple to advanced
4. **Production Ready** - Patterns you can actually use
5. **Framework Agnostic** - Principles apply to any AI system

## Extension Points

Easy to customize:

- **Add Scorers**: Implement `ScoringFunction` interface
- **New Examples**: Follow existing example pattern
- **Custom Runners**: Extend `EvalRunner` class
- **Additional Metrics**: Add to result aggregation
- **Integration**: Plug into existing CI/CD

## Technology Stack

- **TypeScript** - Type safety
- **Node.js** - Runtime
- **Anthropic SDK** - Claude API access
- **Inquirer** - Interactive CLI
- **Chalk** - Colored output
- **Zod** - Schema validation

## Best For

- AI engineers learning eval fundamentals
- Teams implementing AI quality assurance
- Organizations building production AI systems
- Researchers standardizing evaluation methods
- Engineering managers establishing best practices

## Not Included (By Design)

- Web UI (CLI-first for simplicity)
- Database (filesystem-based)
- Multi-language support (focus on patterns)
- Model training (evaluation only)
- Production deployment (patterns provided)

## Future Enhancements

Potential additions:
- More example domains (code, math, creative)
- Statistical significance testing
- Visualization dashboard
- Dataset generation tools
- Integration with eval tracking platforms

## Contributing

Easy to add:
- New examples in `src/examples/`
- New scorers in `src/framework/scorers.ts`
- New exercises in `docs/05-exercises.md`
- Improved documentation

## Success Metrics

You've mastered evals when you can:
- [ ] Choose the right scorer for any task
- [ ] Build comprehensive test datasets
- [ ] Run evals in CI/CD automatically
- [ ] Track eval metrics over time
- [ ] Debug AI systems systematically
- [ ] Ship AI features with confidence

## Philosophy

> "Test-driven development for AI systems. Don't deploy what you haven't evaluated."

This project teaches the mindset and tools to build AI systems you can trust.

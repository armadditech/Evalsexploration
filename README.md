# AI Evals Tutorial - Learn to Build Evaluations for AI Systems

An interactive learning platform for AI practitioners to master building effective evaluations (evals) for AI systems and applications.

**Two Ways to Learn:**
- 🖥️ **Web App** - Modern browser interface with live code editor
- 💻 **CLI App** - Terminal-based interactive tutorial

> 🎥 **[Live Demo](https://github.com/deepak-mukunthu/AIEvalsTutor#demo)** | 📖 **[Examples](https://github.com/deepak-mukunthu/AIEvalsTutor#examples)** | 🚀 **[Quick Start](https://github.com/deepak-mukunthu/AIEvalsTutor#quick-start)**

## What You'll Learn

- **Eval Fundamentals**: Understanding what evals are and why they matter
- **Eval Types**: Unit evals, integration evals, end-to-end evals, and regression tests
- **Metrics & Scoring**: Accuracy, precision, recall, custom metrics, LLM-as-judge
- **Dataset Design**: Creating effective test datasets and edge cases
- **Best Practices**: CI/CD integration, versioning, monitoring production performance

## Quick Start

### Option 1: Web App (Recommended)

```bash
# Navigate to web app
cd web-app

# Install dependencies
npm install

# Set up API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start the web app
npm run dev

# Open http://localhost:3000 in your browser
```

### Option 2: CLI App

```bash
# Install dependencies (in root directory)
npm install

# Run the interactive terminal tutorial
npm start

# Or run example evals directly
npm run eval:examples

# Or run your own custom evals
npm run eval:custom
```

## Project Structure

```
├── src/
│   ├── tutorials/          # Interactive tutorial modules
│   ├── examples/           # Example eval implementations
│   ├── exercises/          # Hands-on exercises
│   ├── framework/          # Eval framework utilities
│   └── app.tsx            # Main tutorial application
├── evals/                  # Your eval implementations
├── datasets/              # Test datasets
└── docs/                  # Extended documentation
```

## Features

### Web App Features
- 🎓 **Interactive Tutorials**: 3 progressive modules with 9 sections
- 💻 **Live Playground**: Code editor with real-time eval execution
- 📋 **Example Browser**: 4 complete examples with results
- 📚 **Documentation**: Comprehensive guides and references
- 🌙 **Dark Mode**: Beautiful UI with dark mode support
- 📱 **Responsive**: Works on desktop, tablet, and mobile

### CLI App Features
- 🎓 **Interactive Menu**: Terminal-based tutorial system
- 🧪 **Example Evals**: Real-world evaluation examples
- 💪 **Hands-on Exercises**: Practice building evals
- 📊 **Result Visualization**: View eval results and metrics
- 🚀 **Production Ready**: Learn to integrate evals into CI/CD

## Tutorial Modules

1. **Introduction to Evals** - Why evals matter and common pitfalls
2. **Basic Eval Patterns** - Assert-based testing for AI outputs
3. **LLM-as-Judge** - Using AI to evaluate AI outputs
4. **Dataset Creation** - Building diverse, representative test sets
5. **Advanced Metrics** - Beyond accuracy: semantic similarity, factuality
6. **Regression Testing** - Preventing regressions across model versions
7. **Production Monitoring** - Online evals and A/B testing

## Demo

### Web App Screenshots

**🎓 Interactive Tutorial**
```
┌─────────────────────────────────────────────────────────┐
│  📚 Tutorial → 💻 Playground → 📋 Examples → 📖 Docs    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Learn the fundamentals of AI evaluation:              │
│  • What are evals and why they matter                  │
│  • Choosing the right scoring strategy                 │
│  • Building comprehensive test datasets                │
│  • CI/CD integration and best practices                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**💻 Live Playground**
- Write eval code in the browser
- Run evaluations in real-time
- See detailed results with pass/fail indicators
- Mock mode for testing without API costs

**📊 Example Results**
```
✅ Sentiment Classification: 100% (3/3 passed)
   ├─ Case 1: "I love this!" → positive ✓
   ├─ Case 2: "This is terrible" → negative ✓
   └─ Case 3: "It arrived today" → neutral ✓

⚡ JSON Extraction: 67% (2/3 passed)
   ├─ Case 1: Valid structure ✓
   ├─ Case 2: Missing field ✗
   └─ Case 3: Format correct ✓

🎯 LLM-as-Judge: 85% avg score
   ├─ Case 1: Score 0.90 - Excellent response ✓
   ├─ Case 2: Score 0.80 - Good quality ✓
   └─ Case 3: Score 0.85 - Strong answer ✓
```

### CLI App Demo

```bash
$ npm start

╔═══════════════════════════════════════════╗
║     🎓 AI Evals Tutorial                  ║
║     Learn to Build Evaluations            ║
╚═══════════════════════════════════════════╝

What would you like to do?
  ❯ 📚 Start Tutorial (Recommended)
    🧪 Run Example Evals
    💪 Practice Exercises
    📖 Browse Documentation
    ⚙️  Settings

Choose an option: █
```

## Examples

### 1. Sentiment Classification (Basic)

**Use Case:** Evaluate a sentiment analysis model

```typescript
import { EvalRunner, exactMatch } from './framework';

const testCases = [
  { id: '1', input: 'I love this product!', expectedOutput: 'positive' },
  { id: '2', input: 'Terrible experience', expectedOutput: 'negative' },
  { id: '3', input: 'It works fine', expectedOutput: 'neutral' }
];

const runner = new EvalRunner({
  name: 'Sentiment Eval',
  scoringFunction: exactMatch
});

const results = await runner.runEval(testCases, sentimentModel);
```

**Results:**
- ✅ 100% pass rate (3/3)
- ⚡ Avg response time: 847ms
- 💰 Cost: $0.045

### 2. JSON Extraction (Structured Output)

**Use Case:** Validate contact info extraction

```typescript
import { jsonStructure } from './framework';

const schema = {
  name: 'string',
  email: 'string',
  phone: 'string'
};

const testCases = [
  {
    id: '1',
    input: 'Contact: John Doe, john@example.com, 555-0100',
    expectedOutput: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0100'
    }
  }
];

const runner = new EvalRunner({
  name: 'Extraction Eval',
  scoringFunction: jsonStructure(schema)
});
```

**Results:**
- ✅ 85% pass rate (17/20)
- 📊 Common errors: Missing phone numbers (3 cases)
- 💡 Recommendation: Add phone format examples to prompt

### 3. LLM-as-Judge (Quality Evaluation)

**Use Case:** Evaluate customer support responses

```typescript
import { llmJudge } from './framework';

const criteria = `
Evaluate the response based on:
1. Accuracy - Does it correctly answer the question?
2. Helpfulness - Does it provide actionable information?
3. Tone - Is it professional and empathetic?

Score from 0.0 to 1.0
`;

const runner = new EvalRunner({
  name: 'Support Quality Eval',
  scoringFunction: llmJudge(criteria),
  threshold: 0.7
});
```

**Results:**
- ✅ 90% pass rate (27/30)
- 📈 Avg score: 0.82/1.0
- 🎯 Top performers: Refund inquiries (avg 0.91)
- ⚠️ Needs improvement: Technical troubleshooting (avg 0.68)

### 4. Regression Testing (Version Comparison)

**Use Case:** Ensure new model version doesn't regress

```typescript
// Test current model
const v1Results = await runner.runEval(goldSet, modelV1);

// Test new model
const v2Results = await runner.runEval(goldSet, modelV2);

// Compare
const regression = v2Results.averageScore < v1Results.averageScore;

if (regression) {
  console.error('❌ Regression detected!');
  console.log(`V1: ${v1Results.averageScore.toFixed(3)}`);
  console.log(`V2: ${v2Results.averageScore.toFixed(3)}`);
  process.exit(1);
}
```

**Results:**
```
Model V1.0: 0.850 avg score
Model V2.0: 0.872 avg score
✅ No regression - Safe to deploy! (+2.6% improvement)
```

## Real-World Use Cases

This framework is being used to evaluate:

- 💬 **Customer Support Bots** - Quality and accuracy metrics
- 📝 **Content Generation** - Style, tone, and factuality checks
- 🔍 **Search & Retrieval** - Relevance and ranking evaluation
- 📊 **Data Extraction** - Structure validation and completeness
- 🎯 **Classification** - Multi-class accuracy and F1 scores
- 🌐 **Translation** - Semantic similarity and fluency

## Contributing

We welcome contributions! Areas we'd love help with:

- 🎨 New example use cases
- 📊 Additional scoring functions
- 📚 Tutorial improvements
- 🐛 Bug fixes
- 📖 Documentation enhancements

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Community

- 💬 [Discussions](https://github.com/deepak-mukunthu/AIEvalsTutor/discussions) - Ask questions, share examples
- 🐛 [Issues](https://github.com/deepak-mukunthu/AIEvalsTutor/issues) - Report bugs or request features
- 🌟 [Star this repo](https://github.com/deepak-mukunthu/AIEvalsTutor) - Show your support!

## License

MIT License - see [LICENSE](LICENSE) for details

---

**Built with ❤️ for the AI community**

🌟 If this helped you build better evals, consider starring the repo!

# Demo & Examples

Complete walkthrough of AI Evals Tutorial features with real examples.

## Table of Contents

1. [Web App Demo](#web-app-demo)
2. [CLI App Demo](#cli-app-demo)
3. [Complete Examples](#complete-examples)
4. [Video Walkthrough](#video-walkthrough)

---

## Web App Demo

### Getting Started

```bash
cd web-app
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

Open http://localhost:3000

### Features Tour

#### 1. Interactive Tutorial (9 Sections)

**Module 1: Introduction**
- Why evals matter for AI systems
- Common pitfalls when evaluating AI
- The eval development lifecycle

**Module 2: Core Concepts**
- Types of evals (unit, integration, e2e)
- Choosing scoring strategies
- Building test datasets

**Module 3: Advanced Techniques**
- LLM-as-judge patterns
- Regression testing
- Production monitoring

#### 2. Live Playground

Write and run evals directly in your browser:

```typescript
// Example: Customer Support Q&A Eval
import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, llmJudge } from './framework';

async function qaSystem(input: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are a customer support agent. Answer: ${input}`
    }]
  });

  return {
    output: response.content[0].text
  };
}

const criteria = `
Evaluate the response quality:
1. Accuracy (0-0.4): Correct information?
2. Helpfulness (0-0.3): Actionable advice?
3. Tone (0-0.3): Professional and empathetic?

Total score: 0.0 to 1.0
`;

const testCases = [
  {
    id: '1',
    input: 'How do I return an item?',
    expectedOutput: 'Clear return process with timeline'
  },
  {
    id: '2',
    input: 'When will my order arrive?',
    expectedOutput: 'Tracking info and estimated delivery'
  },
  {
    id: '3',
    input: 'Can I get a refund?',
    expectedOutput: 'Refund policy and next steps'
  }
];

const runner = new EvalRunner({
  name: 'Support QA Eval',
  scoringFunction: llmJudge(criteria),
  threshold: 0.7
});

const results = await runner.runEval(testCases, qaSystem);
console.log(results);
```

**Click "Run Eval" to see:**

```
┌─────────────────────────────────────────────────┐
│                   RESULTS                       │
├─────────────────────────────────────────────────┤
│ Total Cases:    3                               │
│ Passed:         3 (100%)                        │
│ Failed:         0 (0%)                          │
│ Average Score:  0.867                           │
│ Duration:       2.4s                            │
├─────────────────────────────────────────────────┤
│ Case 1: Score 0.85 ✅ PASS                      │
│ "Clear explanation with 14-day return window"  │
│                                                 │
│ Case 2: Score 0.90 ✅ PASS                      │
│ "Provides tracking link and 3-5 day estimate"  │
│                                                 │
│ Case 3: Score 0.85 ✅ PASS                      │
│ "Explains refund policy and asks for order #"  │
└─────────────────────────────────────────────────┘
```

#### 3. Mock Mode (Demo Without API Costs)

Set `MOCK_MODE=true` in `.env` to test without API calls:

```bash
# In web-app/.env
MOCK_MODE=true
```

Mock mode simulates realistic:
- Processing delays (1-2 seconds)
- Varied scores (0.65-1.0)
- Context-aware responses
- Pass/fail distributions

Perfect for:
- UI development
- Demo presentations
- Learning the framework
- Testing without costs

#### 4. Example Browser

Browse 4 complete, runnable examples:

**Example 1: Sentiment Classification**
```typescript
// Basic exact match scoring
Input:  "I love this!"
Output: "positive"
Score:  1.0 ✅
```

**Example 2: JSON Extraction**
```typescript
// Structured output validation
Input:  "Contact: John, john@email.com"
Output: { name: "John", email: "john@email.com" }
Score:  1.0 ✅ (valid structure)
```

**Example 3: LLM-as-Judge**
```typescript
// Quality evaluation with criteria
Input:  "Summarize: [article text]"
Output: "Concise 3-sentence summary..."
Score:  0.89 ✅ (high quality)
```

**Example 4: Regression Testing**
```typescript
// Version comparison
Model V1: 0.850 avg
Model V2: 0.872 avg
Result:   +2.6% improvement ✅
```

---

## CLI App Demo

### Getting Started

```bash
npm install
npm start
```

### Interactive Menu

```
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
```

### Tutorial Walkthrough

**Step 1: Introduction**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Lesson 1: What Are Evals?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Evals (evaluations) are systematic tests for AI systems.
Just like unit tests for code, evals verify your AI:
  ✓ Produces correct outputs
  ✓ Maintains quality over time
  ✓ Works on edge cases
  ✓ Doesn't regress with updates

Press Enter to continue...
```

**Step 2: First Eval**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 Exercise: Your First Eval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's build a sentiment classifier eval:

1. Define test cases
2. Choose a scoring function
3. Run the evaluation
4. Analyze results

Ready? (y/n) █
```

### Running Examples

```bash
$ npm run eval:examples

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Running All Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/4] Basic Classification
⠋ Running evaluation...

✅ Sentiment Eval
   Total: 3 | Passed: 3 | Failed: 0
   Score: 1.000 | Duration: 2.1s

   Case 1: "I love this!" → positive ✓
   Case 2: "This is terrible" → negative ✓
   Case 3: "It arrived today" → neutral ✓

[2/4] JSON Extraction
⠋ Running evaluation...

✅ Contact Extraction
   Total: 5 | Passed: 4 | Failed: 1
   Score: 0.800 | Duration: 3.4s

   Case 1: Valid structure ✓
   Case 2: Missing phone ✗
   Case 3: Complete data ✓
   Case 4: Email format correct ✓
   Case 5: All fields present ✓

[3/4] LLM-as-Judge
⠋ Running evaluation...

✅ Summary Quality
   Total: 3 | Passed: 3 | Failed: 0
   Score: 0.867 | Duration: 5.2s

   Case 1: Score 0.90 - Excellent conciseness ✓
   Case 2: Score 0.85 - Good coverage ✓
   Case 3: Score 0.85 - Strong accuracy ✓

[4/4] Regression Testing
⠋ Running evaluation...

✅ Math Solver Regression
   Baseline (V1.0): 0.850
   Current (V2.0):  0.872
   
   ✅ No regression detected!
   📈 Improvement: +2.6%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary: 4/4 examples completed successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Complete Examples

### Example 1: Email Tone Classifier

**Goal:** Evaluate if emails are correctly classified by tone

```typescript
import { EvalRunner, exactMatch } from './framework';
import Anthropic from '@anthropic-ai/sdk';

async function toneClassifier(email: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 20,
    messages: [{
      role: 'user',
      content: `Classify the tone as: professional, casual, or urgent.

Email: ${email}

Tone:`
    }]
  });

  return {
    output: response.content[0].text.trim().toLowerCase()
  };
}

const testCases = [
  {
    id: '1',
    input: 'Dear Sir, I hope this message finds you well...',
    expectedOutput: 'professional'
  },
  {
    id: '2',
    input: 'Hey! Just checking in, how are things?',
    expectedOutput: 'casual'
  },
  {
    id: '3',
    input: 'URGENT: Server is down! Please respond immediately.',
    expectedOutput: 'urgent'
  }
];

const runner = new EvalRunner({
  name: 'Email Tone Classifier',
  scoringFunction: exactMatch,
  threshold: 1.0
});

const results = await runner.runEval(testCases, toneClassifier);

console.log(`
✅ Evaluation Complete
   Accuracy: ${(results.averageScore * 100).toFixed(0)}%
   Passed: ${results.passed}/${results.totalCases}
   Duration: ${(results.duration / 1000).toFixed(1)}s
`);
```

**Output:**
```
✅ Evaluation Complete
   Accuracy: 100%
   Passed: 3/3
   Duration: 2.3s
```

### Example 2: Code Comment Generator

**Goal:** Validate AI-generated code comments for quality

```typescript
import { llmJudge } from './framework';

const criteria = `
Evaluate the code comment quality:

1. Clarity (0-0.4): Is it easy to understand?
2. Accuracy (0-0.4): Does it correctly describe the code?
3. Usefulness (0-2): Does it add value beyond the obvious?

Score from 0.0 to 1.0
`;

async function generateComment(code: string) {
  // Your AI system that generates comments
  const comment = await aiModel.generateComment(code);
  return { output: comment };
}

const testCases = [
  {
    id: '1',
    input: 'function add(a, b) { return a + b; }',
    expectedOutput: 'A meaningful explanation'
  },
  {
    id: '2',
    input: 'const sorted = arr.sort((a,b) => b-a);',
    expectedOutput: 'Explains descending sort'
  }
];

const runner = new EvalRunner({
  name: 'Comment Quality Eval',
  scoringFunction: llmJudge(criteria),
  threshold: 0.7
});

const results = await runner.runEval(testCases, generateComment);
```

### Example 3: Product Description Validator

**Goal:** Ensure product descriptions meet requirements

```typescript
import { contains } from './framework';

// Check if description contains required elements
const requiredElements = [
  'dimensions',
  'material',
  'color',
  'warranty'
];

async function generateDescription(product: any) {
  const description = await aiModel.describe(product);
  return { output: description };
}

const testCases = [
  {
    id: '1',
    input: { name: 'Office Chair', category: 'Furniture' },
    expectedOutput: requiredElements
  }
];

const runner = new EvalRunner({
  name: 'Description Completeness',
  scoringFunction: contains(requiredElements),
  threshold: 0.75 // Must include 75% of required elements
});
```

### Example 4: Translation Quality Check

**Goal:** Evaluate translation accuracy with semantic similarity

```typescript
import { semanticSimilarity } from './framework';

async function translate(text: string, targetLang: string) {
  const translation = await aiModel.translate(text, targetLang);
  return { output: translation };
}

const testCases = [
  {
    id: '1',
    input: 'Hello, how are you?',
    expectedOutput: 'Hola, ¿cómo estás?',
    metadata: { targetLang: 'es' }
  },
  {
    id: '2',
    input: 'The weather is beautiful today',
    expectedOutput: 'El clima está hermoso hoy',
    metadata: { targetLang: 'es' }
  }
];

const runner = new EvalRunner({
  name: 'Spanish Translation Quality',
  scoringFunction: semanticSimilarity,
  threshold: 0.85
});

const results = await runner.runEval(testCases, translate);
```

---

## Video Walkthrough

### Coming Soon

📹 Video tutorials covering:
- Setting up your first eval
- Using the web playground
- Advanced LLM-as-judge techniques
- CI/CD integration
- Production monitoring

**Subscribe to be notified when videos are released!**

---

## Performance Benchmarks

Real-world performance metrics:

| Eval Type | Test Cases | Avg Duration | Cost | Accuracy |
|-----------|------------|--------------|------|----------|
| Classification | 100 | 45s | $0.12 | 94% |
| JSON Extraction | 50 | 38s | $0.08 | 88% |
| LLM-as-Judge | 20 | 62s | $0.45 | N/A |
| Regression | 200 | 120s | $0.24 | 91% |

**Tips for Optimization:**
- Use exact match for simple classifications (fastest, cheapest)
- Batch similar test cases
- Cache common responses
- Use mock mode during development

---

## Try It Yourself

1. Clone the repo
2. Pick a use case from above
3. Modify for your needs
4. Run and iterate
5. Share your results!

**Questions?** Open a [discussion](https://github.com/deepak-mukunthu/AIEvalsTutor/discussions)

**Found a bug?** [Create an issue](https://github.com/deepak-mukunthu/AIEvalsTutor/issues)

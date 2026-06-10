# Hands-On Exercises

Practice building evals with these exercises.

## Exercise 1: Email Classifier

**Task**: Build an eval for an email spam classifier.

**Requirements:**
- Binary classification: spam or not_spam
- At least 20 test cases
- Use appropriate scorer
- Achieve >90% accuracy

**Starter Code:**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from './framework/runner.js';
import { exactMatch } from './framework/scorers.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function spamClassifier(input: string): Promise<ModelResponse> {
  // TODO: Implement your spam classifier
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 50,
    messages: [{
      role: 'user',
      content: `Is this email spam or not spam? Respond with exactly: spam or not_spam\n\nEmail: ${input}`
    }]
  });
  
  // Extract response
  const content = response.content[0];
  const output = content.type === 'text' ? content.text.trim().toLowerCase() : '';
  
  return { output };
}

const testCases: EvalCase[] = [
  // TODO: Add your test cases here
  { id: 'spam-1', input: 'URGENT!!! Claim your prize NOW!!!', expectedOutput: 'spam' },
  { id: 'not-spam-1', input: 'Hi, are we still meeting tomorrow at 3pm?', expectedOutput: 'not_spam' },
  // Add 18+ more...
];

// TODO: Run the eval
```

**Hints:**
- Include various spam indicators: urgency, money, prizes
- Include legitimate emails: personal, work, newsletters
- Test edge cases: all caps, lots of punctuation
- Consider false positives vs false negatives

**Success Criteria:**
- [ ] 20+ test cases covering diverse emails
- [ ] Clear spam vs not_spam distinction
- [ ] Pass rate ≥ 90%
- [ ] No more than 1 false positive in legitimate emails

---

## Exercise 2: FAQ Answerer

**Task**: Build an eval for an FAQ answering system.

**Requirements:**
- Answers common questions about a product
- 15+ test cases
- Use semantic similarity scoring
- Answers should be accurate and helpful

**Starter Code:**

```typescript
import { semanticSimilarity } from './framework/scorers.js';

async function faqAnswerer(question: string): Promise<ModelResponse> {
  // TODO: Implement FAQ system
  // Tip: Include a knowledge base in the prompt
  
  const knowledgeBase = `
  Product FAQ:
  - Shipping: We offer free shipping on orders over $50
  - Returns: 30-day money-back guarantee
  - Warranty: 1-year manufacturer warranty
  - Payment: We accept all major credit cards and PayPal
  `;
  
  // Use the knowledge base to answer questions
}

const testCases: EvalCase[] = [
  {
    id: 'faq-1',
    input: 'How much does shipping cost?',
    expectedOutput: 'Free shipping on orders over $50, standard rates apply otherwise'
  },
  // Add more...
];
```

**Hints:**
- Test different phrasings of same question
- Include questions not in FAQ (should say "I don't know")
- Check for hallucination (making up information)
- Use semanticSimilarity with threshold 0.8

**Success Criteria:**
- [ ] Correctly answers questions from FAQ
- [ ] Doesn't make up information
- [ ] Handles rephrased questions
- [ ] Average score ≥ 0.8

---

## Exercise 3: Code Comment Generator

**Task**: Evaluate a system that generates code comments.

**Requirements:**
- Input: code snippet
- Output: descriptive comment
- Use LLM-as-judge scoring
- Focus on clarity, accuracy, conciseness

**Starter Code:**

```typescript
import { llmJudge } from './framework/scorers.js';

async function commentGenerator(code: string): Promise<ModelResponse> {
  // TODO: Implement comment generator
}

const criteria = `
Evaluate the code comment based on:
1. Accuracy: Does it correctly describe what the code does?
2. Clarity: Is it easy to understand?
3. Conciseness: Is it brief but complete?
4. Usefulness: Does it add value beyond what's obvious from the code?

Rate from 0 to 1.
`;

const testCases: EvalCase[] = [
  {
    id: 'code-1',
    input: 'function sum(a, b) { return a + b; }',
    expectedOutput: 'Returns the sum of two numbers',
  },
  // Add more examples...
];
```

**Hints:**
- Test simple and complex code
- Include edge cases (empty functions, async, etc.)
- Good comments explain WHY, not just WHAT
- Bad comments just restate the code

**Success Criteria:**
- [ ] 10+ diverse code examples
- [ ] Comments are accurate and helpful
- [ ] Average score ≥ 0.75
- [ ] Handles different languages/patterns

---

## Exercise 4: Structured Data Extractor

**Task**: Extract meeting information from text.

**Requirements:**
- Input: Text mentioning a meeting
- Output: JSON with date, time, location, attendees
- Validate JSON structure
- Handle missing information gracefully

**Starter Code:**

```typescript
import { jsonStructure } from './framework/scorers.js';

interface MeetingInfo {
  date: string | null;
  time: string | null;
  location: string | null;
  attendees: string[] | null;
}

async function meetingExtractor(text: string): Promise<ModelResponse> {
  // TODO: Implement extractor
  // Output should be JSON matching MeetingInfo interface
}

// First validate structure
const structureScorer = jsonStructure(['date', 'time', 'location', 'attendees']);

// Then validate content quality
const contentScorer = llmJudge(`
Check if extracted information is accurate and complete.
All fields present in the text should be captured.
`);

const testCases: EvalCase[] = [
  {
    id: 'meeting-1',
    input: 'Team sync tomorrow at 2pm in Conference Room A with Alice, Bob, and Charlie',
    expectedOutput: {
      date: 'tomorrow',
      time: '2pm',
      location: 'Conference Room A',
      attendees: ['Alice', 'Bob', 'Charlie']
    }
  },
  // Add more...
];
```

**Hints:**
- Test various date formats (tomorrow, next Monday, 12/25)
- Test with missing information
- Test with multiple meetings in one text
- Consider time zones

**Success Criteria:**
- [ ] Valid JSON structure for all outputs
- [ ] Correctly extracts all present information
- [ ] Null for missing information (not made up)
- [ ] 15+ test cases

---

## Exercise 5: Regression Test Suite

**Task**: Create a regression test suite for a translation system.

**Requirements:**
- Test English to Spanish translation
- Compare two model versions
- Identify any regressions
- Document findings

**Starter Code:**

```typescript
async function translate(text: string, modelVersion: string): Promise<ModelResponse> {
  // TODO: Implement with two different models
}

const goldenTests: EvalCase[] = [
  {
    id: 'trans-1',
    input: 'Hello, how are you?',
    expectedOutput: 'Hola, ¿cómo estás?',
    metadata: { category: 'greetings' }
  },
  // Add more...
];

async function regressionTest() {
  // Test baseline model
  const baseline = await runEval(goldenTests, (input) => 
    translate(input, 'claude-haiku-4-5-20251001')
  );
  
  // Test new model
  const newModel = await runEval(goldenTests, (input) =>
    translate(input, 'claude-sonnet-4-5-20250929')
  );
  
  // TODO: Compare results
  // TODO: Identify regressions
  // TODO: Generate report
}
```

**Hints:**
- Include various sentence types
- Test idioms and cultural expressions
- Compare word-for-word (exact) vs semantic similarity
- Track which cases regressed

**Success Criteria:**
- [ ] 25+ translation pairs (golden tests)
- [ ] Clear comparison between models
- [ ] Report showing improvements and regressions
- [ ] Recommendation on which model to use

---

## Challenge Exercise: Build Your Own

**Task**: Design and implement an eval for your own AI system.

**Steps:**

1. **Choose a task** - What does your AI system do?
2. **Define success** - What makes a good output?
3. **Create test cases** - Cover diverse inputs
4. **Choose scorer** - What type of scoring fits?
5. **Set threshold** - What pass rate is acceptable?
6. **Run and iterate** - Improve based on results

**Template:**

```typescript
// 1. Task description
const TASK_DESCRIPTION = `
My AI system: [Describe what it does]
Input format: [What goes in]
Output format: [What comes out]
Success criteria: [What makes a good output]
`;

// 2. System implementation
async function mySystem(input: any): Promise<ModelResponse> {
  // Your implementation
}

// 3. Test cases
const testCases: EvalCase[] = [
  // Your test cases
];

// 4. Scorer selection
const scorer = /* choose appropriate scorer */;

// 5. Run eval
const runner = new EvalRunner({
  name: 'My System Eval',
  description: TASK_DESCRIPTION,
  scoringFunction: scorer,
  threshold: 0.8,
});

const results = await runner.runEval(testCases, mySystem);

// 6. Analyze and iterate
analyzeResults(results);
```

---

## Evaluation Rubric

For each exercise, evaluate yourself:

**Test Coverage** (0-3 points)
- 3: Comprehensive (happy, edge, error, adversarial cases)
- 2: Good (happy and some edge cases)
- 1: Basic (mostly happy paths)
- 0: Minimal

**Scorer Selection** (0-3 points)
- 3: Optimal scorer for task with good threshold
- 2: Appropriate scorer, threshold could be better
- 1: Suboptimal scorer choice
- 0: Wrong scorer

**Results Analysis** (0-2 points)
- 2: Detailed analysis of failures, improvement plan
- 1: Basic analysis
- 0: No analysis

**Documentation** (0-2 points)
- 2: Well documented with rationale
- 1: Some documentation
- 0: No documentation

**Total: 10 points per exercise**

## Solutions

Solutions are provided in `src/exercises/solutions/` directory.
Only peek after attempting on your own!

## Next Steps

After completing exercises:
1. Review [Best Practices](./03-best-practices.md)
2. Explore [Advanced Topics](./04-advanced-topics.md)
3. Build evals for your production systems
4. Share your learnings with the community

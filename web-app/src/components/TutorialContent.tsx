'use client';

import { useState } from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';

const tutorials = [
  {
    id: 1,
    title: 'Introduction to Evals',
    duration: '10 min',
    sections: [
      {
        title: 'What are Evals?',
        content: `Evals (evaluations) are systematic tests that measure how well your AI system performs. Think of them like unit tests, but for AI.

**Why Evals Matter:**
• Measure Performance - Know if your AI actually works
• Catch Regressions - Detect when changes break things
• Guide Improvements - Understand where to optimize
• Build Confidence - Deploy with evidence, not hope`,
      },
      {
        title: 'Core Components',
        content: `Every eval has 4 essential parts:

1. **Test Cases** - Input + expected output pairs
2. **Model Function** - Your AI system being tested
3. **Scoring Function** - How to measure correctness
4. **Threshold** - Minimum score to pass

Example test case:
\`\`\`json
{
  "id": "test-1",
  "input": "I love this product!",
  "expectedOutput": "positive"
}
\`\`\``,
      },
      {
        title: 'Types of Scorers',
        content: `Choose the right scorer for your task:

**Exact Match** - Output must match exactly
→ Use for: Classifications, discrete categories

**Contains** - Output must contain expected text
→ Use for: Key information presence

**Regex Match** - Output must match a pattern
→ Use for: Format validation (emails, dates)

**JSON Structure** - Output must have required fields
→ Use for: Structured data extraction

**LLM-as-Judge** - Use AI to evaluate outputs
→ Use for: Quality, summarization, creative tasks

**Semantic Similarity** - Meaning-based comparison
→ Use for: Paraphrasing, flexible wording`,
      },
    ],
  },
  {
    id: 2,
    title: 'Your First Eval',
    duration: '15 min',
    sections: [
      {
        title: 'Step 1: Define Test Cases',
        content: `Start with clear inputs and expected outputs.

\`\`\`typescript
const testCases = [
  {
    id: 'pos-1',
    input: 'I love this!',
    expectedOutput: 'positive'
  },
  {
    id: 'neg-1',
    input: 'This is terrible',
    expectedOutput: 'negative'
  },
  {
    id: 'neu-1',
    input: 'The package arrived',
    expectedOutput: 'neutral'
  }
];
\`\`\`

**Best Practices:**
• Start with 5-10 obvious cases
• Add edge cases as you find them
• Include error cases (empty input, etc.)`,
      },
      {
        title: 'Step 2: Create Model Function',
        content: `Wrap your AI system in a standard format.

\`\`\`typescript
async function sentimentClassifier(input: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    messages: [{
      role: 'user',
      content: \`Classify sentiment as positive, negative, or neutral: \${input}\`
    }]
  });

  return {
    output: response.content[0].text.trim()
  };
}
\`\`\``,
      },
      {
        title: 'Step 3: Choose Scorer & Run',
        content: `Pick a scoring function and run your eval.

\`\`\`typescript
import { EvalRunner, exactMatch } from './framework';

const runner = new EvalRunner({
  name: 'Sentiment Classification',
  scoringFunction: exactMatch,
  threshold: 1.0  // Must be exact
});

const results = await runner.runEval(
  testCases,
  sentimentClassifier
);
\`\`\`

You'll get:
• Pass/fail for each test case
• Overall accuracy score
• Detailed explanations for failures`,
      },
    ],
  },
  {
    id: 3,
    title: 'Advanced Patterns',
    duration: '20 min',
    sections: [
      {
        title: 'LLM-as-Judge',
        content: `For subjective tasks, use AI to evaluate AI.

\`\`\`typescript
import { llmJudge } from './framework/scorers';

const criteria = \`
Evaluate based on:
1. Accuracy - factually correct
2. Clarity - easy to understand
3. Completeness - covers key points
\`;

const scorer = llmJudge(criteria);
\`\`\`

**When to use:**
• Summarization quality
• Creative writing
• Explanation clarity
• Multiple valid answers

**Tradeoffs:**
• ✅ Handles nuance well
• ✅ Multiple criteria
• ❌ Slower (extra API call)
• ❌ More expensive`,
      },
      {
        title: 'Regression Testing',
        content: `Prevent breaking changes across versions.

\`\`\`typescript
// Test baseline
const baseline = await runner.runEval(
  goldenTests,
  oldSystem
);

// Test new version
const current = await runner.runEval(
  goldenTests,
  newSystem
);

// Compare
if (current.averageScore < baseline.averageScore) {
  console.warn('Regression detected!');
}
\`\`\`

**Best Practices:**
• Maintain golden test set
• Run before deployments
• Track metrics over time
• Integrate with CI/CD`,
      },
      {
        title: 'Production Deployment',
        content: `Take evals to production.

**CI/CD Integration:**
\`\`\`yaml
# .github/workflows/eval.yml
- run: npm run eval:all
- run: |
    if [ $PASS_RATE -lt 0.90 ]; then
      exit 1
    fi
\`\`\`

**Online Evaluation:**
• Sample production traffic
• Run evals on real data
• Alert on degradation
• A/B test new versions

**Cost Optimization:**
• Use cheap scorers first
• Cache results
• Sample large datasets
• Batch API calls`,
      },
    ],
  },
];

export default function TutorialContent() {
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const tutorial = tutorials[currentTutorial];
  const section = tutorial.sections[currentSection];

  const markComplete = () => {
    const key = `${currentTutorial}-${currentSection}`;
    setCompletedSections(new Set([...completedSections, key]));

    // Auto-advance to next section
    if (currentSection < tutorial.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const isComplete = (tutorialIdx: number, sectionIdx: number) => {
    return completedSections.has(`${tutorialIdx}-${sectionIdx}`);
  };

  return (
    <div className="flex h-full">
      {/* Tutorial Navigation */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Tutorials
          </h2>

          {tutorials.map((t, tIdx) => (
            <div key={t.id} className="mb-6">
              <button
                onClick={() => {
                  setCurrentTutorial(tIdx);
                  setCurrentSection(0);
                }}
                className={`
                  w-full text-left p-3 rounded-lg mb-2
                  ${currentTutorial === tIdx
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent'
                  }
                `}
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {t.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.duration}
                </div>
              </button>

              {currentTutorial === tIdx && (
                <div className="ml-4 space-y-1">
                  {t.sections.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setCurrentSection(sIdx)}
                      className={`
                        w-full text-left px-3 py-2 rounded flex items-center gap-2
                        ${currentSection === sIdx
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {isComplete(tIdx, sIdx) ? (
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      ) : (
                        <FaCircle className="text-gray-300 text-xs flex-shrink-0" />
                      )}
                      <span className="text-sm">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Tutorial {currentTutorial + 1} • Section {currentSection + 1} of {tutorial.sections.length}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {section.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>📚 {tutorial.title}</span>
              <span>⏱️ {tutorial.duration}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {section.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (currentSection > 0) {
                  setCurrentSection(currentSection - 1);
                } else if (currentTutorial > 0) {
                  setCurrentTutorial(currentTutorial - 1);
                  setCurrentSection(tutorials[currentTutorial - 1].sections.length - 1);
                }
              }}
              disabled={currentTutorial === 0 && currentSection === 0}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              ← Previous
            </button>

            <button
              onClick={markComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              {isComplete(currentTutorial, currentSection) ? '✓ Completed' : 'Mark Complete'}
            </button>

            <button
              onClick={() => {
                if (currentSection < tutorial.sections.length - 1) {
                  setCurrentSection(currentSection + 1);
                } else if (currentTutorial < tutorials.length - 1) {
                  setCurrentTutorial(currentTutorial + 1);
                  setCurrentSection(0);
                }
              }}
              disabled={
                currentTutorial === tutorials.length - 1 &&
                currentSection === tutorial.sections.length - 1
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

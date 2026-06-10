'use client';

import { useState } from 'react';

const docs = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    sections: [
      {
        title: 'What are Evals?',
        content: `Evaluations (evals) are systematic tests that measure how well your AI system performs on specific tasks. They're like unit tests, but for AI.

**Why Evals Matter:**
- Know if your AI actually works
- Catch regressions when making changes
- Understand where to improve
- Deploy with confidence, not hope`,
      },
      {
        title: 'Quick Start',
        content: `Get started in 3 steps:

1. **Define test cases**
\`\`\`typescript
const testCases = [
  { id: '1', input: 'test input', expectedOutput: 'expected' }
];
\`\`\`

2. **Wrap your AI system**
\`\`\`typescript
async function mySystem(input) {
  return { output: 'ai response' };
}
\`\`\`

3. **Run the eval**
\`\`\`typescript
const runner = new EvalRunner({
  name: 'My Eval',
  scoringFunction: exactMatch
});
await runner.runEval(testCases, mySystem);
\`\`\``,
      },
    ],
  },
  {
    id: 'scorers',
    title: 'Scoring Functions',
    sections: [
      {
        title: 'Exact Match',
        content: `Perfect for discrete classifications.

**When to use:**
- Sentiment classification (positive/negative/neutral)
- Category tagging
- Boolean yes/no outputs

**Example:**
\`\`\`typescript
import { exactMatch } from './framework/scorers';

const scorer = exactMatch;
const threshold = 1.0; // Must be exact
\`\`\``,
      },
      {
        title: 'LLM-as-Judge',
        content: `Use AI to evaluate AI outputs.

**When to use:**
- Summarization quality
- Creative writing
- Explanation clarity
- Multiple valid answers

**Example:**
\`\`\`typescript
import { llmJudge } from './framework/scorers';

const criteria = 'Evaluate for accuracy and clarity';
const scorer = llmJudge(criteria);
const threshold = 0.7;
\`\`\`

**Tradeoffs:**
- ✅ Handles nuance
- ✅ Multiple criteria
- ❌ Slower (extra API call)
- ❌ More expensive`,
      },
      {
        title: 'JSON Structure',
        content: `Validate structured outputs.

**When to use:**
- Data extraction
- API responses
- Structured generation

**Example:**
\`\`\`typescript
import { jsonStructure } from './framework/scorers';

const scorer = jsonStructure(['name', 'email', 'phone']);
const threshold = 1.0;
\`\`\``,
      },
    ],
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    sections: [
      {
        title: 'Dataset Design',
        content: `Build comprehensive test sets:

**Coverage:**
- Happy paths - typical inputs
- Edge cases - boundary conditions
- Error cases - invalid inputs
- Adversarial - deliberately tricky

**Size Guidelines:**
- Simple classification: 20+ cases
- Extraction/parsing: 50+ cases
- Generation tasks: 100+ cases

**Quality:**
- Diverse inputs representing real usage
- Balanced across categories
- Correct ground truth labels
- No duplicates`,
      },
      {
        title: 'CI/CD Integration',
        content: `Automate your evals:

**GitHub Actions:**
\`\`\`yaml
- run: npm run eval:all
- run: |
    if [ $PASS_RATE -lt 0.90 ]; then
      exit 1
    fi
\`\`\`

**Best Practices:**
- Run smoke tests on every commit (5-10 cases)
- Run full suite on PRs (all cases)
- Block deploys if evals fail
- Track metrics over time`,
      },
      {
        title: 'Cost Optimization',
        content: `Reduce API costs:

**Strategies:**
1. Tiered evaluation - cheap scorers first
2. Sampling - run on subset
3. Caching - reuse judge responses
4. Batch processing - group similar evals

**Example:**
\`\`\`typescript
// First pass: cheap exact match
const pass1 = await runEval(cases, exactMatch);

// Second pass: expensive LLM judge only on failures
const failures = pass1.results.filter(r => !r.passed);
const pass2 = await runEval(failures, llmJudge('criteria'));
\`\`\``,
      },
    ],
  },
];

export default function Docs() {
  const [selectedDoc, setSelectedDoc] = useState(docs[0]);
  const [selectedSection, setSelectedSection] = useState(0);

  const section = selectedDoc.sections[selectedSection];

  return (
    <div className="h-full flex">
      {/* Docs Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Documentation
          </h2>
          {docs.map((doc) => (
            <div key={doc.id} className="mb-4">
              <button
                onClick={() => {
                  setSelectedDoc(doc);
                  setSelectedSection(0);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded-lg font-medium
                  ${selectedDoc.id === doc.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {doc.title}
              </button>
              {selectedDoc.id === doc.id && (
                <div className="ml-4 mt-2 space-y-1">
                  {doc.sections.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSection(idx)}
                      className={`
                        w-full text-left px-3 py-1.5 rounded text-sm
                        ${selectedSection === idx
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Doc Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {section.title}
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {selectedDoc.title}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {section.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (selectedSection > 0) {
                  setSelectedSection(selectedSection - 1);
                }
              }}
              disabled={selectedSection === 0}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              ← Previous
            </button>

            <button
              onClick={() => {
                if (selectedSection < selectedDoc.sections.length - 1) {
                  setSelectedSection(selectedSection + 1);
                }
              }}
              disabled={selectedSection === selectedDoc.sections.length - 1}
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

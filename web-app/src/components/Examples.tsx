'use client';

import { useState, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChartLine, FaStar } from 'react-icons/fa';
import { useContextStore } from '@/lib/contextStore';

const examples = [
  {
    id: 1,
    title: 'Basic Classification',
    description: 'Sentiment analysis using exact match scoring',
    systemType: 'classification',
    difficulty: 'Beginner',
    duration: '5 min',
    code: `import { EvalRunner, exactMatch } from './framework';

const testCases = [
  { id: '1', input: 'I love this!', expectedOutput: 'positive' },
  { id: '2', input: 'Terrible experience', expectedOutput: 'negative' },
  { id: '3', input: 'It arrived today', expectedOutput: 'neutral' }
];

const runner = new EvalRunner({
  name: 'Sentiment Classification',
  scoringFunction: exactMatch,
  threshold: 1.0
});`,
    results: {
      totalCases: 6,
      passed: 6,
      failed: 0,
      averageScore: 1.0,
    },
    learnings: [
      'Exact match is perfect for discrete classifications',
      'Clear ground truth labels are essential',
      'Test all categories in your classification',
    ],
  },
  {
    id: 2,
    title: 'JSON Extraction',
    description: 'Extract structured contact information with validation',
    systemType: 'extraction',
    difficulty: 'Intermediate',
    duration: '10 min',
    code: `import { EvalRunner, jsonStructure } from './framework';

const testCases = [
  {
    id: '1',
    input: 'John at john@example.com, works at Acme Corp',
    expectedOutput: {
      name: 'John',
      email: 'john@example.com',
      company: 'Acme Corp'
    }
  }
];

const runner = new EvalRunner({
  name: 'Contact Extraction',
  scoringFunction: jsonStructure(['name', 'email', 'company']),
  threshold: 1.0
});`,
    results: {
      totalCases: 6,
      passed: 5,
      failed: 1,
      averageScore: 0.833,
    },
    learnings: [
      'Validate structure first, content second',
      'Handle missing fields gracefully with null',
      'Use JSON schema for complex structures',
    ],
  },
  {
    id: 3,
    title: 'LLM-as-Judge',
    description: 'Quality evaluation for summarization tasks',
    systemType: 'generation',
    difficulty: 'Advanced',
    duration: '15 min',
    code: `import { EvalRunner, llmJudge } from './framework';

const criteria = \`
Evaluate based on:
1. Accuracy - captures key facts
2. Conciseness - appropriately brief
3. Clarity - easy to understand
\`;

const runner = new EvalRunner({
  name: 'Summarization Quality',
  scoringFunction: llmJudge(criteria),
  threshold: 0.7
});`,
    results: {
      totalCases: 4,
      passed: 3,
      failed: 1,
      averageScore: 0.775,
    },
    learnings: [
      'LLM-as-judge handles subjective evaluation',
      'Define clear criteria for consistent scoring',
      'More expensive but flexible for quality tasks',
    ],
  },
  {
    id: 4,
    title: 'Regression Testing',
    description: 'Compare model versions to catch regressions',
    systemType: 'other',
    difficulty: 'Advanced',
    duration: '15 min',
    code: `import { EvalRunner, contains } from './framework';

// Test baseline model
const baseline = await runner.runEval(
  goldenTests,
  (input) => mathSolver(input, 'claude-haiku-4-5')
);

// Test new model
const current = await runner.runEval(
  goldenTests,
  (input) => mathSolver(input, 'claude-sonnet-4-5')
);

// Compare
if (current.averageScore < baseline.averageScore) {
  console.warn('Regression detected!');
}`,
    results: {
      totalCases: 10,
      passed: 10,
      failed: 0,
      averageScore: 1.0,
    },
    learnings: [
      'Maintain golden test sets for critical functionality',
      'Run regression tests before deployments',
      'Track metrics over time',
    ],
  },
];

export default function Examples() {
  const { context, hasCompletedOnboarding } = useContextStore();
  const [selectedExample, setSelectedExample] = useState(examples[0]);

  // Filter and sort examples based on user context
  const sortedExamples = useMemo(() => {
    if (!hasCompletedOnboarding || !context.aiSystemType) {
      return examples;
    }

    // Sort so matching examples appear first
    return [...examples].sort((a, b) => {
      const aMatches = a.systemType === context.aiSystemType || a.systemType === 'other';
      const bMatches = b.systemType === context.aiSystemType || b.systemType === 'other';

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [context.aiSystemType, hasCompletedOnboarding]);

  return (
    <div className="h-full flex">
      {/* Examples List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Examples
          </h2>
          {hasCompletedOnboarding && context.aiSystemType && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1">
                <FaStar size={12} />
                Showing {context.aiSystemType} examples first
              </p>
            </div>
          )}
          <div className="space-y-3">
            {sortedExamples.map((example) => {
              const isRecommended = hasCompletedOnboarding &&
                                    (example.systemType === context.aiSystemType ||
                                     (example.systemType === 'other' && context.aiSystemType));

              return (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(example)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition relative
                    ${selectedExample.id === example.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }
                  `}
                >
                  {isRecommended && (
                    <div className="absolute top-2 right-2">
                      <FaStar className="text-yellow-500" size={14} />
                    </div>
                  )}
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {example.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {example.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`
                        px-2 py-1 rounded
                        ${example.difficulty === 'Beginner'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : example.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }
                      `}
                    >
                      {example.difficulty}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ⏱️ {example.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Example Detail */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${selectedExample.difficulty === 'Beginner'
                    ? 'bg-green-100 text-green-700'
                    : selectedExample.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }
                `}
              >
                {selectedExample.difficulty}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ⏱️ {selectedExample.duration}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedExample.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {selectedExample.description}
            </p>
          </div>

          {/* Code */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Code
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code>{selectedExample.code}</code>
            </pre>
          </div>

          {/* Results */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaChartLine />
              Results
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Cases
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedExample.results.totalCases}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    Passed
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedExample.results.passed}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <FaTimesCircle className="text-red-500" />
                    Failed
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {selectedExample.results.failed}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Avg Score
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedExample.results.averageScore.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Learnings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              💡 Key Learnings
            </h2>
            <ul className="space-y-2">
              {selectedExample.learnings.map((learning, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { FaPlay, FaSpinner, FaMagic } from 'react-icons/fa';
import { useContextStore } from '@/lib/contextStore';
import { generateCustomEvalCode } from '@/lib/codeGenerator';
import CodeEditor from './CodeEditor';

const DEFAULT_CODE = `import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, exactMatch } from '../framework';

// Your AI system
async function mySystem(input: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 50,
    messages: [{
      role: 'user',
      content: \`Classify sentiment as positive, negative, or neutral: \${input}\`
    }]
  });

  return {
    output: response.content[0].text.trim().toLowerCase()
  };
}

// Test cases
const testCases = [
  { id: '1', input: 'I love this!', expectedOutput: 'positive' },
  { id: '2', input: 'This is terrible', expectedOutput: 'negative' },
  { id: '3', input: 'It arrived today', expectedOutput: 'neutral' }
];

// Run eval
const runner = new EvalRunner({
  name: 'Sentiment Eval',
  scoringFunction: exactMatch,
  threshold: 1.0
});

const results = await runner.runEval(testCases, mySystem);
console.log(results);
`;

export default function Playground() {
  const { context, hasCompletedOnboarding } = useContextStore();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);

  // Load personalized code on mount if user has completed onboarding
  useEffect(() => {
    if (hasCompletedOnboarding && context.aiSystemType) {
      const customCode = generateCustomEvalCode(context);
      setCode(customCode);
    }
  }, [hasCompletedOnboarding, context.aiSystemType]);

  const handleGenerateCustomCode = () => {
    const customCode = generateCustomEvalCode(context);
    setCode(customCode);
  };

  const runEval = async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      // Call the API to execute the eval
      const response = await fetch('/api/run-eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run eval');
      }

      const data = await response.json();
      setResults(data.results);
      setMockMode(data.mockMode || false);
    } catch (err: any) {
      setError(err.message || 'Error running eval');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Mock Mode Banner */}
      {mockMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Demo Mode:</strong> Using simulated results. Set MOCK_MODE=false in .env and add API credits to use real Claude API.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Playground
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {hasCompletedOnboarding && context.systemDescription
                ? `Build evals for: ${context.systemDescription}`
                : 'Build and test your evals in real-time'
              }
            </p>
          </div>
          <div className="flex gap-3">
            {hasCompletedOnboarding && context.aiSystemType && (
              <button
                onClick={handleGenerateCustomCode}
                className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <FaMagic />
                Generate My Code
              </button>
            )}
            <button
              onClick={runEval}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <FaPlay />
                  Run Eval
                </>
              )}
            </button>
          </div>
        </div>

        {hasCompletedOnboarding && context.aiSystemType && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {context.aiSystemType}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              {context.domain}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Recommended scorer: <span className="font-medium">{context.aiSystemType === 'classification' ? 'exactMatch' : context.aiSystemType === 'generation' ? 'llmJudge' : 'semanticSimilarity'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Editor and Results */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              eval.ts
            </span>
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
          />
        </div>

        {/* Results Panel */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Results
            </h2>

            {!results && !error && !isRunning && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Click "Run Eval" to see results</p>
              </div>
            )}

            {isRunning && (
              <div className="text-center py-12">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Running evaluation...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Cases</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {results.totalCases}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Passed</span>
                      <span className="font-medium text-green-600">
                        {results.passed} ({((results.passed / results.totalCases) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Failed</span>
                      <span className="font-medium text-red-600">
                        {results.failed} ({((results.failed / results.totalCases) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {results.averageScore.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(results.duration / 1000).toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Individual Results */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Test Cases
                  </h3>
                  <div className="space-y-2">
                    {results.results.map((result: any) => (
                      <div
                        key={result.caseId}
                        className={`
                          p-4 rounded-lg border
                          ${result.passed
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            Case {result.caseId}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Score: {result.score.toFixed(3)}
                            </span>
                            <span
                              className={`
                                text-xs font-semibold px-2 py-1 rounded
                                ${result.passed
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                }
                              `}
                            >
                              {result.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                        </div>

                        {/* LLM Judge Explanation */}
                        <div className="mb-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-xs">
                          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                            📝 Evaluation:
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 italic">
                            "{result.explanation}"
                          </p>
                        </div>

                        {/* Show actual output for context */}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            View output
                          </summary>
                          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                            <div className="font-medium mb-1">Actual:</div>
                            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {result.actualOutput}
                            </div>
                            {result.expectedOutput && (
                              <>
                                <div className="font-medium mt-2 mb-1">Expected:</div>
                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {result.expectedOutput}
                                </div>
                              </>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

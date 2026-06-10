/**
 * Example 4: Regression Testing
 *
 * Regression evals ensure that changes don't break existing functionality.
 * This is critical when updating prompts, models, or system components.
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from '../framework/runner.js';
import { contains, exactMatch } from '../framework/scorers.js';
import { EvalCase, ModelResponse } from '../framework/types.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Example: Math word problem solver
async function mathSolver(input: string, modelVersion: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: modelVersion,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Solve this math word problem and provide the final numerical answer:

${input}

Show your work, then state the final answer clearly.`,
      },
    ],
  });

  const content = response.content[0];
  const output = content.type === 'text' ? content.text : '';

  return { output, metadata: { model: modelVersion } };
}

// Golden test set - these should always pass
const regressionTests: EvalCase[] = [
  {
    id: 'math-1',
    input: 'If a train travels at 60 mph for 2.5 hours, how far does it travel?',
    expectedOutput: '150',
    metadata: { category: 'distance-rate-time' },
  },
  {
    id: 'math-2',
    input: 'A store sells apples for $0.50 each. If you buy 24 apples, how much do you pay?',
    expectedOutput: '12',
    metadata: { category: 'multiplication' },
  },
  {
    id: 'math-3',
    input: 'There are 30 students. If 60% passed the test, how many students passed?',
    expectedOutput: '18',
    metadata: { category: 'percentages' },
  },
  {
    id: 'math-4',
    input: 'A rectangle is 8 meters long and 5 meters wide. What is its area?',
    expectedOutput: '40',
    metadata: { category: 'area' },
  },
];

export async function runRegressionEval() {
  console.log('\n🔄 REGRESSION TESTING EXAMPLE');
  console.log('Testing across model versions to catch regressions\n');

  const baselineModel = 'claude-haiku-4-5-20251001';
  const newModel = 'claude-sonnet-4-5-20250929';

  // Run baseline
  console.log(`\n📊 Testing BASELINE model: ${baselineModel}`);
  const baselineRunner = new EvalRunner({
    name: 'Math Solver (Baseline)',
    description: 'Baseline regression test suite',
    scoringFunction: contains,
    threshold: 1.0,
  });

  const baselineResults = await baselineRunner.runEval(regressionTests, (input) =>
    mathSolver(input as string, baselineModel)
  );

  // Run new version
  console.log(`\n📊 Testing NEW model: ${newModel}`);
  const newRunner = new EvalRunner({
    name: 'Math Solver (New)',
    description: 'New version regression test suite',
    scoringFunction: contains,
    threshold: 1.0,
  });

  const newResults = await newRunner.runEval(regressionTests, (input) =>
    mathSolver(input as string, newModel)
  );

  // Compare results
  console.log('\n📈 REGRESSION ANALYSIS');
  console.log('='.repeat(50));

  const baselinePassed = baselineResults.passed;
  const newPassed = newResults.passed;

  if (newPassed >= baselinePassed) {
    console.log(`✅ No regression detected`);
    console.log(`   Baseline: ${baselinePassed}/${baselineResults.totalCases} passed`);
    console.log(`   New:      ${newPassed}/${newResults.totalCases} passed`);
  } else {
    console.log(`⚠️  REGRESSION DETECTED!`);
    console.log(`   Baseline: ${baselinePassed}/${baselineResults.totalCases} passed`);
    console.log(`   New:      ${newPassed}/${newResults.totalCases} passed`);
    console.log(`   Lost:     ${baselinePassed - newPassed} test(s)`);
  }

  console.log('\n💡 KEY LEARNINGS:');
  console.log('- Run regression tests before deploying changes');
  console.log('- Maintain a golden test set of critical cases');
  console.log('- Compare old vs new versions side-by-side');
  console.log('- Track pass rate over time');
  console.log('- Consider running regressions in CI/CD pipeline\n');

  return { baselineResults, newResults };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRegressionEval();
}

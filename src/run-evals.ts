/**
 * Template for running custom evals
 *
 * Copy this file to create your own eval implementations
 */

import { EvalRunner } from './framework/runner.js';
import { exactMatch, contains, llmJudge } from './framework/scorers.js';
import { EvalCase, ModelResponse } from './framework/types.js';

// TODO: Implement your AI system here
async function myAISystem(input: any): Promise<ModelResponse> {
  // Replace this with your actual AI system
  return {
    output: 'placeholder output',
  };
}

// TODO: Define your test cases
const testCases: EvalCase[] = [
  {
    id: 'test-1',
    input: 'example input',
    expectedOutput: 'expected output',
  },
  // Add more test cases...
];

async function runMyEval() {
  const evalRunner = new EvalRunner({
    name: 'My Custom Eval',
    description: 'Description of what this eval tests',
    scoringFunction: exactMatch, // Choose appropriate scorer
    threshold: 0.8, // Set appropriate threshold
  });

  const summary = await evalRunner.runEval(testCases, myAISystem);

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMyEval();
}

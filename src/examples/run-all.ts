/**
 * Run all example evals
 */

import { runBasicClassificationEval } from './01-basic-classification.js';
import { runJsonExtractionEval } from './02-json-extraction.js';
import { runLlmAsJudgeEval } from './03-llm-as-judge.js';
import { runRegressionEval } from './04-regression-testing.js';

async function runAllExamples() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 RUNNING ALL EVAL EXAMPLES');
  console.log('='.repeat(60));

  try {
    await runBasicClassificationEval();
    console.log('\n' + '─'.repeat(60) + '\n');

    await runJsonExtractionEval();
    console.log('\n' + '─'.repeat(60) + '\n');

    await runLlmAsJudgeEval();
    console.log('\n' + '─'.repeat(60) + '\n');

    await runRegressionEval();
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL EXAMPLES COMPLETED');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
    process.exit(1);
  }
}

runAllExamples();

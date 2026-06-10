/**
 * Example 1: Sentiment Analysis Evaluation
 *
 * Use Case: Validate that a sentiment classifier correctly identifies
 * positive, negative, and neutral sentiments in customer reviews.
 *
 * Scoring: Exact match (output must exactly match expected)
 * Threshold: 100% accuracy required
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, exactMatch } from '../src/framework';

// Your AI system under test
async function sentimentClassifier(text: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 50,
    messages: [{
      role: 'user',
      content: `Classify the sentiment of this text as exactly one word: positive, negative, or neutral.

Text: ${text}

Sentiment:`
    }]
  });

  const output = response.content[0].type === 'text'
    ? response.content[0].text.trim().toLowerCase()
    : '';

  return { output };
}

// Test cases covering different sentiment types
const testCases = [
  // Positive sentiments
  {
    id: '1',
    input: 'I absolutely love this product! Best purchase ever!',
    expectedOutput: 'positive'
  },
  {
    id: '2',
    input: 'Amazing service, highly recommend!',
    expectedOutput: 'positive'
  },

  // Negative sentiments
  {
    id: '3',
    input: 'Terrible quality, very disappointed.',
    expectedOutput: 'negative'
  },
  {
    id: '4',
    input: 'Worst experience ever, do not buy.',
    expectedOutput: 'negative'
  },

  // Neutral sentiments
  {
    id: '5',
    input: 'The item arrived on Tuesday.',
    expectedOutput: 'neutral'
  },
  {
    id: '6',
    input: 'It works as described.',
    expectedOutput: 'neutral'
  }
];

// Run the evaluation
async function main() {
  console.log('🧪 Running Sentiment Analysis Evaluation\n');

  const runner = new EvalRunner({
    name: 'Sentiment Classifier Eval',
    scoringFunction: exactMatch,
    threshold: 1.0  // Require 100% accuracy
  });

  const results = await runner.runEval(testCases, sentimentClassifier);

  // Display results
  console.log('\n📊 Results Summary:');
  console.log(`   Total Cases: ${results.totalCases}`);
  console.log(`   Passed: ${results.passed} (${(results.passed/results.totalCases*100).toFixed(0)}%)`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Average Score: ${results.averageScore.toFixed(3)}`);
  console.log(`   Duration: ${(results.duration/1000).toFixed(2)}s`);

  // Show individual results
  console.log('\n📝 Individual Results:');
  results.results.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`   ${status} Case ${result.caseId}: "${result.actualOutput}" (expected: "${result.expectedOutput}")`);
  });

  // Pass/fail based on threshold
  if (results.averageScore >= 1.0) {
    console.log('\n✅ Evaluation PASSED - All cases correct!');
  } else {
    console.log('\n❌ Evaluation FAILED - Some cases incorrect');
    process.exit(1);
  }
}

main().catch(console.error);

/**
 * Expected Output:
 *
 * 🧪 Running Sentiment Analysis Evaluation
 *
 * 📊 Results Summary:
 *    Total Cases: 6
 *    Passed: 6 (100%)
 *    Failed: 0
 *    Average Score: 1.000
 *    Duration: 3.42s
 *
 * 📝 Individual Results:
 *    ✅ Case 1: "positive" (expected: "positive")
 *    ✅ Case 2: "positive" (expected: "positive")
 *    ✅ Case 3: "negative" (expected: "negative")
 *    ✅ Case 4: "negative" (expected: "negative")
 *    ✅ Case 5: "neutral" (expected: "neutral")
 *    ✅ Case 6: "neutral" (expected: "neutral")
 *
 * ✅ Evaluation PASSED - All cases correct!
 */

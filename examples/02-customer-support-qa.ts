/**
 * Example 2: Customer Support Q&A Evaluation
 *
 * Use Case: Evaluate a customer support AI agent's response quality
 * across multiple dimensions: accuracy, helpfulness, and tone.
 *
 * Scoring: LLM-as-judge with custom criteria
 * Threshold: 70% minimum quality score
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, llmJudge } from '../src/framework';

// Your customer support AI system
async function supportAgent(question: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are a helpful customer support agent. Answer this question professionally:

Question: ${question}

Answer:`
    }]
  });

  const output = response.content[0].type === 'text'
    ? response.content[0].text
    : '';

  return { output };
}

// Evaluation criteria for LLM judge
const evaluationCriteria = `
Evaluate the customer support response on these dimensions:

1. Accuracy (0-0.4 points):
   - Does it provide correct information?
   - Are there any factual errors?

2. Helpfulness (0-0.3 points):
   - Does it give actionable next steps?
   - Does it address the customer's actual question?

3. Tone (0-0.3 points):
   - Is it professional and empathetic?
   - Does it maintain a helpful demeanor?

Provide a total score from 0.0 to 1.0
A score of 0.7 or higher indicates good quality.
`;

// Test cases covering different support scenarios
const testCases = [
  {
    id: '1',
    input: 'How do I return an item I purchased last week?',
    expectedOutput: 'Should explain return policy with clear steps'
  },
  {
    id: '2',
    input: 'My order hasnt arrived yet. When will it get here?',
    expectedOutput: 'Should ask for order number and provide tracking guidance'
  },
  {
    id: '3',
    input: 'Can I get a refund for this defective product?',
    expectedOutput: 'Should acknowledge issue and explain refund process'
  },
  {
    id: '4',
    input: 'How do I change my shipping address?',
    expectedOutput: 'Should provide account settings instructions'
  },
  {
    id: '5',
    input: 'Is this product available in blue?',
    expectedOutput: 'Should check availability or offer to help find alternatives'
  }
];

async function main() {
  console.log('🧪 Running Customer Support Q&A Evaluation\n');

  const runner = new EvalRunner({
    name: 'Support Agent Quality Eval',
    scoringFunction: llmJudge(evaluationCriteria),
    threshold: 0.7  // Require 70% minimum quality
  });

  const results = await runner.runEval(testCases, supportAgent);

  // Display summary
  console.log('\n📊 Results Summary:');
  console.log(`   Total Cases: ${results.totalCases}`);
  console.log(`   Passed (≥0.7): ${results.passed} (${(results.passed/results.totalCases*100).toFixed(0)}%)`);
  console.log(`   Failed (<0.7): ${results.failed}`);
  console.log(`   Average Score: ${results.averageScore.toFixed(3)}`);
  console.log(`   Duration: ${(results.duration/1000).toFixed(2)}s`);

  // Show detailed results
  console.log('\n📝 Detailed Results:');
  results.results.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    const scorePercent = (result.score * 100).toFixed(0);
    console.log(`\n   ${status} Case ${result.caseId}: Score ${result.score.toFixed(2)} (${scorePercent}%)`);
    console.log(`      Question: "${testCases.find(tc => tc.id === result.caseId)?.input}"`);
    console.log(`      Judge: ${result.explanation}`);
  });

  // Overall assessment
  if (results.averageScore >= 0.7) {
    console.log('\n✅ Evaluation PASSED - Quality threshold met!');
    console.log('   Your support agent is performing well.');
  } else {
    console.log('\n❌ Evaluation FAILED - Quality below threshold');
    console.log('   Review failed cases and improve responses.');
    process.exit(1);
  }
}

main().catch(console.error);

/**
 * Expected Output:
 *
 * 🧪 Running Customer Support Q&A Evaluation
 *
 * 📊 Results Summary:
 *    Total Cases: 5
 *    Passed (≥0.7): 4 (80%)
 *    Failed (<0.7): 1
 *    Average Score: 0.778
 *    Duration: 18.53s
 *
 * 📝 Detailed Results:
 *
 *    ✅ Case 1: Score 0.85 (85%)
 *       Question: "How do I return an item I purchased last week?"
 *       Judge: Excellent response. Provides clear 14-day return policy
 *              with step-by-step instructions and timeline.
 *
 *    ✅ Case 2: Score 0.80 (80%)
 *       Question: "My order hasn't arrived yet. When will it get here?"
 *       Judge: Good response. Asks for order number and explains how
 *              to track shipment. Could mention typical delivery times.
 *
 *    ✅ Case 3: Score 0.75 (75%)
 *       Question: "Can I get a refund for this defective product?"
 *       Judge: Solid response. Shows empathy, acknowledges issue, and
 *              outlines refund process. Professional tone maintained.
 *
 *    ❌ Case 4: Score 0.65 (65%)
 *       Question: "How do I change my shipping address?"
 *       Judge: Response is helpful but lacks specific steps. Should
 *              provide direct link or exact menu path in account settings.
 *
 *    ✅ Case 5: Score 0.84 (84%)
 *       Question: "Is this product available in blue?"
 *       Judge: Great response. Offers to check availability and suggests
 *              alternative products. Very helpful and proactive.
 *
 * ✅ Evaluation PASSED - Quality threshold met!
 *    Your support agent is performing well.
 */

/**
 * Example 1: Basic Classification Eval
 *
 * This example shows how to evaluate a sentiment classification AI system.
 * We use exact match scoring since sentiment is a discrete category.
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from '../framework/runner.js';
import { exactMatch } from '../framework/scorers.js';
import { EvalCase, ModelResponse } from '../framework/types.js';

// Our AI system: sentiment classifier
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function sentimentClassifier(input: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `Classify the sentiment of this text as exactly one of: positive, negative, neutral

Text: ${input}

Respond with only the sentiment label, nothing else.`,
      },
    ],
  });

  const content = response.content[0];
  const output = content.type === 'text' ? content.text.trim().toLowerCase() : '';

  return {
    output,
    metadata: {
      model: response.model,
      tokens: response.usage.input_tokens + response.usage.output_tokens,
    },
  };
}

// Test cases with ground truth labels
const testCases: EvalCase[] = [
  {
    id: 'pos-1',
    input: 'I absolutely love this product! Best purchase ever.',
    expectedOutput: 'positive',
  },
  {
    id: 'neg-1',
    input: 'This is terrible. Completely disappointed.',
    expectedOutput: 'negative',
  },
  {
    id: 'neu-1',
    input: 'The package arrived on Tuesday.',
    expectedOutput: 'neutral',
  },
  {
    id: 'pos-2',
    input: 'Amazing experience! Highly recommend to everyone.',
    expectedOutput: 'positive',
  },
  {
    id: 'neg-2',
    input: 'Worst customer service I have ever experienced.',
    expectedOutput: 'negative',
  },
  {
    id: 'neu-2',
    input: 'It is available in three colors: red, blue, and green.',
    expectedOutput: 'neutral',
  },
];

export async function runBasicClassificationEval() {
  const evalRunner = new EvalRunner({
    name: 'Sentiment Classification',
    description: 'Evaluates accuracy of sentiment classification (positive/negative/neutral)',
    scoringFunction: exactMatch,
    threshold: 1.0, // Must be exact match
  });

  const summary = await evalRunner.runEval(testCases, sentimentClassifier);

  console.log('\n💡 KEY LEARNINGS:');
  console.log('- Exact match is appropriate for discrete classification tasks');
  console.log('- Clear ground truth labels are essential');
  console.log('- Test all categories (positive, negative, neutral)');
  console.log('- Edge cases matter (sarcasm, mixed sentiment, etc.)\n');

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBasicClassificationEval();
}

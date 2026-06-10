/**
 * Example 3: LLM-as-Judge Eval
 *
 * For tasks where exact matching is too strict (like summarization),
 * use another LLM to evaluate the quality of outputs.
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from '../framework/runner.js';
import { llmJudge } from '../framework/scorers.js';
import { EvalCase, ModelResponse } from '../framework/types.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// AI system that summarizes articles
async function articleSummarizer(input: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Summarize this article in 2-3 sentences:

${input}`,
      },
    ],
  });

  const content = response.content[0];
  const output = content.type === 'text' ? content.text.trim() : '';

  return { output };
}

const testCases: EvalCase[] = [
  {
    id: 'sum-1',
    input: `Scientists have discovered a new species of frog in the Amazon rainforest.
    The bright blue amphibian was found during a biodiversity survey in a remote region.
    Researchers believe the species has existed for millions of years but remained undiscovered
    due to its isolated habitat. The team plans to study the frog's unique characteristics
    and assess its conservation status.`,
    expectedOutput:
      'A new blue frog species was discovered in the Amazon during a biodiversity survey. The species likely existed for millions of years in isolation. Researchers will study its characteristics and conservation needs.',
  },
  {
    id: 'sum-2',
    input: `A major tech company announced plans to invest $10 billion in renewable energy
    infrastructure over the next five years. The initiative will include solar farms, wind turbines,
    and battery storage facilities across multiple countries. The company aims to power all its
    data centers with 100% renewable energy by 2030, citing both environmental and economic benefits.`,
    expectedOutput:
      'Tech company to invest $10B in renewable energy infrastructure including solar and wind. Goal is 100% renewable energy for data centers by 2030. Initiative driven by environmental and economic factors.',
  },
];

export async function runLlmAsJudgeEval() {
  const criteria = `
  Evaluate the summary based on:
  1. Accuracy: Does it capture the key facts from the original?
  2. Conciseness: Is it appropriately brief (2-3 sentences)?
  3. Clarity: Is it easy to understand?
  4. Completeness: Are important details included?
  `;

  const evalRunner = new EvalRunner({
    name: 'Article Summarization Quality',
    description: 'Uses LLM judge to evaluate summary quality',
    scoringFunction: llmJudge(criteria),
    threshold: 0.7, // Allow some flexibility
  });

  const summary = await evalRunner.runEval(testCases, articleSummarizer);

  console.log('\n💡 KEY LEARNINGS:');
  console.log('- LLM-as-judge is great for subjective tasks (summarization, writing)');
  console.log('- Define clear evaluation criteria for the judge');
  console.log('- Lower threshold (0.7) allows for stylistic variations');
  console.log('- More expensive than rule-based scoring (uses extra API calls)');
  console.log('- Judge can be biased - validate against human evaluations\n');

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLlmAsJudgeEval();
}

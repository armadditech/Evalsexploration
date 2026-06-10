/**
 * Example 2: Structured Output Eval
 *
 * This example evaluates an AI system that extracts structured data.
 * We validate that the output has the correct JSON structure.
 */

import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner } from '../framework/runner.js';
import { jsonStructure } from '../framework/scorers.js';
import { EvalCase, ModelResponse } from '../framework/types.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// AI system that extracts contact info from text
async function contactExtractor(input: string): Promise<ModelResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Extract contact information from this text and return as JSON with these fields:
- name (string)
- email (string or null)
- phone (string or null)
- company (string or null)

Text: ${input}

Return only the JSON, no other text.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    return { output: {} };
  }

  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    return { output: parsed };
  } catch {
    return { output: {} };
  }
}

const testCases: EvalCase[] = [
  {
    id: 'contact-1',
    input: 'John Smith from Acme Corp can be reached at john@acme.com or 555-0123.',
    expectedOutput: {
      name: 'John Smith',
      email: 'john@acme.com',
      phone: '555-0123',
      company: 'Acme Corp',
    },
  },
  {
    id: 'contact-2',
    input: 'Email Sarah Johnson at sarah.j@example.org for more information.',
    expectedOutput: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.org',
      phone: null,
      company: null,
    },
  },
  {
    id: 'contact-3',
    input: 'Contact the support team at 1-800-SUPPORT.',
    expectedOutput: {
      name: null,
      email: null,
      phone: '1-800-SUPPORT',
      company: null,
    },
  },
];

export async function runJsonExtractionEval() {
  const evalRunner = new EvalRunner({
    name: 'Contact Information Extraction',
    description: 'Validates structured output contains required fields',
    scoringFunction: jsonStructure(['name', 'email', 'phone', 'company']),
    threshold: 1.0,
  });

  const summary = await evalRunner.runEval(testCases, contactExtractor);

  console.log('\n💡 KEY LEARNINGS:');
  console.log('- Validate structure first, then validate content');
  console.log('- Use JSON schema validation for complex structures');
  console.log('- Test cases with missing fields (null values)');
  console.log('- Consider using tools/function calling for structured output\n');

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runJsonExtractionEval();
}

/**
 * Common scoring functions for evals
 */

import Anthropic from '@anthropic-ai/sdk';
import { ScoringFunction } from './types.js';

/**
 * Exact match scorer - checks if outputs match exactly
 */
export const exactMatch: ScoringFunction = async (actualOutput, expectedOutput) => {
  if (!expectedOutput) {
    return { score: 0, explanation: 'No expected output provided' };
  }

  const actual = String(actualOutput).trim().toLowerCase();
  const expected = String(expectedOutput).trim().toLowerCase();
  const matches = actual === expected;

  return {
    score: matches ? 1.0 : 0.0,
    explanation: matches ? 'Exact match' : `Expected "${expected}", got "${actual}"`,
  };
};

/**
 * Contains scorer - checks if expected text is contained in output
 */
export const contains: ScoringFunction = async (actualOutput, expectedOutput) => {
  if (!expectedOutput) {
    return { score: 0, explanation: 'No expected output provided' };
  }

  const actual = String(actualOutput).toLowerCase();
  const expected = String(expectedOutput).toLowerCase();
  const contained = actual.includes(expected);

  return {
    score: contained ? 1.0 : 0.0,
    explanation: contained ? 'Contains expected text' : 'Does not contain expected text',
  };
};

/**
 * Regex match scorer - checks if output matches a pattern
 */
export const regexMatch = (pattern: RegExp): ScoringFunction => {
  return async (actualOutput) => {
    const actual = String(actualOutput);
    const matches = pattern.test(actual);

    return {
      score: matches ? 1.0 : 0.0,
      explanation: matches ? `Matches pattern ${pattern}` : `Does not match pattern ${pattern}`,
    };
  };
};

/**
 * JSON structure scorer - validates JSON output has expected structure
 */
export const jsonStructure = (expectedKeys: string[]): ScoringFunction => {
  return async (actualOutput) => {
    try {
      const parsed = typeof actualOutput === 'string' ? JSON.parse(actualOutput) : actualOutput;
      const actualKeys = Object.keys(parsed);
      const hasAllKeys = expectedKeys.every((key) => actualKeys.includes(key));

      return {
        score: hasAllKeys ? 1.0 : 0.0,
        explanation: hasAllKeys
          ? 'Has all expected keys'
          : `Missing keys: ${expectedKeys.filter((k) => !actualKeys.includes(k)).join(', ')}`,
      };
    } catch (error) {
      return {
        score: 0,
        explanation: 'Invalid JSON output',
      };
    }
  };
};

/**
 * LLM-as-judge scorer - uses Claude to evaluate the output
 */
export const llmJudge = (criteria: string, apiKey?: string): ScoringFunction => {
  const client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });

  return async (actualOutput, expectedOutput, input) => {
    const prompt = `You are evaluating an AI system's output.

Input: ${JSON.stringify(input, null, 2)}
Expected Output: ${expectedOutput ? JSON.stringify(expectedOutput, null, 2) : 'Not specified'}
Actual Output: ${JSON.stringify(actualOutput, null, 2)}

Evaluation Criteria: ${criteria}

Rate the actual output on a scale from 0.0 to 1.0, where:
- 1.0 = Perfect, meets all criteria
- 0.7-0.9 = Good, minor issues
- 0.4-0.6 = Acceptable, some issues
- 0.0-0.3 = Poor, major issues

Respond with JSON:
{
  "score": <number between 0 and 1>,
  "explanation": "<brief explanation>"
}`;

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      const result = JSON.parse(content.text);
      return {
        score: Math.max(0, Math.min(1, result.score)),
        explanation: result.explanation,
      };
    } catch (error) {
      console.error('LLM judge error:', error);
      return {
        score: 0,
        explanation: `Judge error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  };
};

/**
 * Semantic similarity scorer - checks if outputs are semantically similar
 */
export const semanticSimilarity = (threshold = 0.8, apiKey?: string): ScoringFunction => {
  const client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });

  return async (actualOutput, expectedOutput) => {
    if (!expectedOutput) {
      return { score: 0, explanation: 'No expected output provided' };
    }

    const prompt = `Compare these two texts for semantic similarity:

Text 1: ${expectedOutput}
Text 2: ${actualOutput}

Rate their semantic similarity from 0.0 to 1.0, where:
- 1.0 = Identical meaning, different wording OK
- 0.7-0.9 = Similar core meaning, some differences
- 0.4-0.6 = Somewhat related
- 0.0-0.3 = Different meanings

Respond with JSON:
{
  "score": <number between 0 and 1>,
  "explanation": "<brief explanation>"
}`;

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      const result = JSON.parse(content.text);
      return {
        score: Math.max(0, Math.min(1, result.score)),
        explanation: result.explanation,
      };
    } catch (error) {
      return {
        score: 0,
        explanation: `Similarity check error: ${error instanceof Error ? error.message : 'Unknown'}`,
      };
    }
  };
};

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Simple in-memory eval runner
// In production, you'd want a more robust execution environment

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Check if mock mode is enabled
    const mockMode = process.env.MOCK_MODE === 'true';

    if (mockMode) {
      console.log('Running in MOCK MODE - simulating API responses');
      const results = await executeMockEval(code);
      return NextResponse.json({ results, mockMode: true });
    }

    // Get API key from server-side environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey.includes('your_key_here') || apiKey.includes('your_api_key_here')) {
      return NextResponse.json(
        { error: 'Please configure a valid Anthropic API key in web-app/.env file. Get your key from: https://console.anthropic.com/' },
        { status: 500 }
      );
    }

    // Parse the code to extract what we need
    // This is a simplified version - in production you'd use a sandbox
    const results = await executeEval(code, apiKey);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Eval execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute eval' },
      { status: 500 }
    );
  }
}

async function executeEval(code: string, apiKey: string) {
  const client = new Anthropic({ apiKey });

  // Extract test cases from code
  const testCases = extractTestCases(code);
  const systemPrompt = extractSystemPrompt(code);
  const criteria = extractCriteria(code);
  const isLLMJudge = code.includes('llmJudge');

  const results = [];

  for (const testCase of testCases) {
    const startTime = Date.now();

    try {
      // Execute the AI system
      const systemResponse = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: systemPrompt.replace('${input}', testCase.input)
        }]
      });

      const actualOutput = systemResponse.content[0].type === 'text'
        ? systemResponse.content[0].text.trim()
        : '';

      // Score the output
      let score = 0;
      let explanation = '';
      let passed = false;

      if (isLLMJudge && criteria) {
        // Use LLM-as-judge
        const judgeResult = await evaluateWithLLMJudge(
          client,
          testCase.input,
          actualOutput,
          testCase.expectedOutput || '',
          criteria
        );
        score = judgeResult.score;
        explanation = judgeResult.explanation;
        passed = score >= 0.7; // Default threshold for LLM judge
      } else {
        // Simple exact match for non-LLM-judge cases
        const actual = actualOutput.toLowerCase().trim();
        const expected = (testCase.expectedOutput || '').toLowerCase().trim();
        passed = actual === expected || actual.includes(expected);
        score = passed ? 1.0 : 0.0;
        explanation = passed ? 'Exact match' : `Expected "${expected}", got "${actual}"`;
      }

      results.push({
        caseId: testCase.id,
        passed,
        score,
        actualOutput,
        expectedOutput: testCase.expectedOutput,
        explanation,
        duration: Date.now() - startTime,
        metadata: testCase.metadata,
      });
    } catch (error: any) {
      results.push({
        caseId: testCase.id,
        passed: false,
        score: 0,
        actualOutput: `Error: ${error.message}`,
        expectedOutput: testCase.expectedOutput,
        explanation: `Execution error: ${error.message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  return {
    totalCases: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
    duration: results.reduce((sum, r) => sum + r.duration, 0),
    results,
  };
}

async function evaluateWithLLMJudge(
  client: Anthropic,
  input: string,
  actualOutput: string,
  expectedOutput: string,
  criteria: string
): Promise<{ score: number; explanation: string }> {
  const judgePrompt = `You are evaluating an AI system's output.

Input: ${input}
Expected Output: ${expectedOutput}
Actual Output: ${actualOutput}

Evaluation Criteria:
${criteria}

Please evaluate the actual output and provide:
1. A score from 0.0 to 1.0
2. A brief explanation of your score

Respond with JSON in this format:
{
  "score": <number between 0 and 1>,
  "explanation": "<brief explanation>"
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: judgePrompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse judge response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(0, Math.min(1, result.score)),
      explanation: result.explanation || 'No explanation provided',
    };
  } catch (error: any) {
    console.error('LLM judge error:', error);
    return {
      score: 0,
      explanation: `Judge error: ${error.message}`,
    };
  }
}

function extractTestCases(code: string): any[] {
  // Simple regex-based extraction
  // In production, use a proper parser
  const testCasesMatch = code.match(/const testCases = \[([\s\S]*?)\];/);
  if (!testCasesMatch) return [];

  try {
    // Parse the test cases array
    const testCasesStr = '[' + testCasesMatch[1] + ']';
    // Use eval carefully - in production use a proper parser
    const testCases = eval(`(${testCasesStr})`);
    return testCases;
  } catch (error) {
    console.error('Failed to parse test cases:', error);
    return [];
  }
}

function extractSystemPrompt(code: string): string {
  // Extract the prompt template from the code
  const promptMatch = code.match(/content: `([^`]*)\$\{input\}/);
  if (promptMatch) {
    return promptMatch[1] + '${input}';
  }
  return '${input}'; // Fallback
}

function extractCriteria(code: string): string | null {
  // Extract LLM judge criteria
  const criteriaMatch = code.match(/const criteria = `([^`]*)`/);
  if (criteriaMatch) {
    return criteriaMatch[1];
  }
  return null;
}

// Mock mode - simulates API responses for testing
async function executeMockEval(code: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  const testCases = extractTestCases(code);
  const isLLMJudge = code.includes('llmJudge');
  const isQA = code.includes('customer-support') || code.includes('customer support');

  const results = [];

  // Simulate realistic eval results based on code context
  for (const testCase of testCases) {
    const startTime = Date.now();

    // Simulate some variance in results
    const random = Math.random();
    let score: number;
    let passed: boolean;
    let actualOutput: string;
    let explanation: string;

    if (isQA) {
      // Customer support Q&A simulation
      if (testCase.input.toLowerCase().includes('return') || testCase.input.toLowerCase().includes('refund')) {
        score = 0.85;
        passed = true;
        actualOutput = "To process a refund, please provide your order number. Refunds typically take 5-7 business days to appear in your account once approved.";
        explanation = "Good response - addresses the refund question with clear next steps and timeline.";
      } else if (testCase.input.toLowerCase().includes('delivery') || testCase.input.toLowerCase().includes('shipping')) {
        score = 0.9;
        passed = true;
        actualOutput = "Standard shipping takes 3-5 business days. You can track your order using the tracking number sent to your email.";
        explanation = "Excellent - provides delivery timeframe and tracking information.";
      } else {
        score = random > 0.3 ? 0.75 : 0.55;
        passed = score >= 0.7;
        actualOutput = "Thank you for contacting us. Let me help you with that inquiry.";
        explanation = passed ? "Acceptable response but could be more specific." : "Response is too generic and doesn't address the specific question.";
      }
    } else if (isLLMJudge) {
      // LLM-as-judge simulation
      score = 0.65 + (random * 0.35); // Random score between 0.65 and 1.0
      passed = score >= 0.7;
      actualOutput = `Generated output for: ${testCase.input.substring(0, 50)}...`;
      explanation = passed
        ? `High quality output. Relevance: ${(score * 100).toFixed(0)}%. The response addresses the key points effectively.`
        : `Output needs improvement. Score: ${(score * 100).toFixed(0)}%. Missing some key criteria.`;
    } else {
      // Classification or exact match simulation
      const shouldPass = random > 0.2; // 80% pass rate
      score = shouldPass ? 1.0 : 0.0;
      passed = shouldPass;

      if (testCase.expectedOutput) {
        actualOutput = shouldPass ? testCase.expectedOutput : 'incorrect_classification';
        explanation = shouldPass
          ? 'Exact match - classification is correct.'
          : `Expected "${testCase.expectedOutput}", got "${actualOutput}".`;
      } else {
        actualOutput = 'positive';
        explanation = 'Classification completed successfully.';
      }
    }

    // Simulate variable processing time
    const duration = 800 + Math.random() * 400;

    results.push({
      caseId: testCase.id,
      passed,
      score,
      actualOutput,
      expectedOutput: testCase.expectedOutput,
      explanation,
      duration: Math.round(duration),
      metadata: testCase.metadata,
    });
  }

  return {
    totalCases: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
    duration: results.reduce((sum, r) => sum + r.duration, 0),
    results,
  };
}

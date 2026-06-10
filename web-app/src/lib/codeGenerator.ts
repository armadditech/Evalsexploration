/**
 * Custom Code Generator
 * Generates personalized eval code based on user context
 */

import { UserContext, SYSTEM_TYPE_INFO } from './userContext';

export function generateCustomEvalCode(context: UserContext): string {
  const { aiSystemType, domain, systemDescription, inputFormat, outputFormat } = context;

  if (!aiSystemType) {
    return generateDefaultCode();
  }

  const typeInfo = SYSTEM_TYPE_INFO[aiSystemType];
  const scorer = typeInfo.recommendedScorers[0];

  // Use LLM-as-judge for subjective tasks
  const useLLMJudge = ['generation', 'qa', 'chat'].includes(aiSystemType);

  if (useLLMJudge) {
    return generateLLMJudgeCode(aiSystemType, domain, systemDescription);
  }

  return `import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, ${scorer} } from '../framework';

// Your AI System: ${systemDescription || 'Custom AI system'}
// Type: ${aiSystemType}
// Domain: ${domain}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function ${getCamelCase(aiSystemType)}System(input: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: ${getMaxTokens(aiSystemType)},
    messages: [{
      role: 'user',
      content: \`${getPromptTemplate(aiSystemType, domain, systemDescription)}\${input}\`
    }]
  });

  const content = response.content[0];
  ${getOutputExtraction(aiSystemType, outputFormat)}

  return { output };
}

// Test cases for ${domain} domain
const testCases = [
  ${generateTestCases(aiSystemType, domain).join(',\n  ')}
];

// Run the eval
const runner = new EvalRunner({
  name: '${systemDescription || aiSystemType} Eval',
  description: 'Evaluates ${systemDescription || 'AI system'} performance',
  scoringFunction: ${scorer},
  threshold: ${getThreshold(aiSystemType)}
});

const results = await runner.runEval(testCases, ${getCamelCase(aiSystemType)}System);
console.log(results);
`;
}

function getCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function getMaxTokens(systemType: string): number {
  switch (systemType) {
    case 'classification': return 50;
    case 'extraction': return 200;
    case 'generation': return 500;
    case 'qa': return 300;
    case 'chat': return 500;
    default: return 300;
  }
}

function getPromptTemplate(systemType: string, domain: string, description?: string): string {
  const domainContext = domain !== 'general' ? ` in the ${domain} domain` : '';

  switch (systemType) {
    case 'classification':
      return `Classify this text${domainContext}. Respond with only the category label.\\n\\nText: `;
    case 'generation':
      return `Generate ${description || 'content'}${domainContext} based on:\\n\\n`;
    case 'extraction':
      return `Extract structured information from this text${domainContext}. Return as JSON.\\n\\nText: `;
    case 'qa':
      return `Answer this question${domainContext}:\\n\\n`;
    case 'chat':
      return `You are a helpful assistant${domainContext}. Respond to:\\n\\n`;
    default:
      return `Process this input${domainContext}:\\n\\n`;
  }
}

function getOutputExtraction(systemType: string, outputFormat: string | null): string {
  if (systemType === 'extraction' || outputFormat === 'json') {
    return `const jsonMatch = content.type === 'text' ? content.text.match(/\\{[\\s\\S]*\\}/) : null;
  const output = jsonMatch ? JSON.parse(jsonMatch[0]) : {};`;
  }

  return `const output = content.type === 'text' ? content.text.trim() : '';`;
}

function getThreshold(systemType: string): number {
  switch (systemType) {
    case 'classification': return 1.0;
    case 'extraction': return 1.0;
    case 'generation': return 0.7;
    case 'qa': return 0.8;
    case 'chat': return 0.7;
    default: return 0.8;
  }
}

function generateTestCases(systemType: string, domain: string): string[] {
  const cases: string[] = [];

  switch (systemType) {
    case 'classification':
      cases.push(
        `{ id: '1', input: '${getExampleInput(domain, 'positive')}', expectedOutput: 'positive' }`,
        `{ id: '2', input: '${getExampleInput(domain, 'negative')}', expectedOutput: 'negative' }`,
        `{ id: '3', input: '${getExampleInput(domain, 'neutral')}', expectedOutput: 'neutral' }`
      );
      break;

    case 'extraction':
      cases.push(
        `{ id: '1', input: '${getExampleInput(domain, 'extract1')}', expectedOutput: { /* Add expected structure */ } }`,
        `{ id: '2', input: '${getExampleInput(domain, 'extract2')}', expectedOutput: { /* Add expected structure */ } }`
      );
      break;

    case 'qa':
      cases.push(
        `{ id: '1', input: '${getExampleInput(domain, 'question1')}', expectedOutput: '${getExampleOutput(domain, 'answer1')}' }`,
        `{ id: '2', input: '${getExampleInput(domain, 'question2')}', expectedOutput: '${getExampleOutput(domain, 'answer2')}' }`
      );
      break;

    default:
      cases.push(
        `{ id: '1', input: 'Example input 1', expectedOutput: 'Example output 1' }`,
        `{ id: '2', input: 'Example input 2', expectedOutput: 'Example output 2' }`
      );
  }

  return cases;
}

function getExampleInput(domain: string, type: string): string {
  const examples: Record<string, Record<string, string>> = {
    'customer-support': {
      'positive': 'Your support team was incredibly helpful!',
      'negative': 'I waited 2 hours and never got help',
      'neutral': 'I submitted a ticket yesterday',
      'question1': 'How do I reset my password?',
      'question2': 'What are your business hours?',
    },
    'healthcare': {
      'positive': 'The treatment has been very effective',
      'negative': 'Experiencing severe side effects',
      'neutral': 'Appointment scheduled for next week',
      'question1': 'What are the symptoms of condition X?',
      'question2': 'How should I take this medication?',
    },
    'e-commerce': {
      'positive': 'Great product, fast shipping!',
      'negative': 'Item arrived damaged',
      'neutral': 'Order placed on Monday',
      'question1': 'When will my order ship?',
      'question2': 'What is your return policy?',
    },
  };

  return examples[domain]?.[type] || 'Example input';
}

function getExampleOutput(domain: string, type: string): string {
  const outputs: Record<string, Record<string, string>> = {
    'customer-support': {
      'answer1': 'Click the "Forgot Password" link on the login page',
      'answer2': 'We are open Monday-Friday, 9AM-5PM EST',
    },
    'healthcare': {
      'answer1': 'Common symptoms include...',
      'answer2': 'Take one tablet daily with food',
    },
    'e-commerce': {
      'answer1': 'Orders typically ship within 1-2 business days',
      'answer2': 'We offer 30-day returns on most items',
    },
  };

  return outputs[domain]?.[type] || 'Example output';
}

function generateLLMJudgeCode(systemType: string, domain: string, description?: string): string {
  const criteria = getLLMJudgeCriteria(systemType, domain);
  const testCases = generateLLMJudgeTestCases(systemType, domain);

  return `import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, llmJudge } from '../framework';

// Your AI System: ${description || 'Custom AI system'}
// Type: ${systemType} (uses LLM-as-judge for quality evaluation)
// Domain: ${domain}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function ${getCamelCase(systemType)}System(input: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: ${getMaxTokens(systemType)},
    messages: [{
      role: 'user',
      content: \`${getPromptTemplate(systemType, domain, description)}\${input}\`
    }]
  });

  const content = response.content[0];
  const output = content.type === 'text' ? content.text.trim() : '';

  return { output };
}

// Test cases for ${domain} domain
// Note: LLM-as-judge evaluates quality, not exact matches
const testCases = [
  ${testCases.join(',\n  ')}
];

// LLM-as-Judge Evaluation Criteria
const criteria = \`${criteria}\`;

// Run the eval with LLM-as-judge
const runner = new EvalRunner({
  name: '${description || systemType} Quality Eval',
  description: 'Uses LLM-as-judge to evaluate ${systemType} quality',
  scoringFunction: llmJudge(criteria),
  threshold: ${getThreshold(systemType)} // More lenient for subjective tasks
});

const results = await runner.runEval(testCases, ${getCamelCase(systemType)}System);

// Review results
console.log(\`Pass Rate: \${results.passed}/\${results.totalCases}\`);
console.log(\`Average Score: \${results.averageScore.toFixed(3)}\`);

// Check individual explanations from LLM judge
results.results.forEach(r => {
  if (!r.passed) {
    console.log(\`Failed: \${r.caseId} - \${r.explanation}\`);
  }
});
`;
}

function getLLMJudgeCriteria(systemType: string, domain: string): string {
  const domainContext = domain !== 'general' ? ` in the ${domain} domain` : '';

  switch (systemType) {
    case 'generation':
      return `Evaluate the generated content${domainContext} based on:

1. **Relevance** - Does it address the input appropriately?
2. **Quality** - Is it well-written, clear, and coherent?
3. **Completeness** - Does it cover the necessary points?
4. **Accuracy** - Is the information correct${domainContext}?
5. **Tone** - Is the tone appropriate for the context?

Rate from 0.0 (poor) to 1.0 (excellent).`;

    case 'qa':
      return `Evaluate the answer${domainContext} based on:

1. **Correctness** - Is the answer factually accurate?
2. **Completeness** - Does it fully answer the question?
3. **Clarity** - Is it easy to understand?
4. **Conciseness** - Is it appropriately brief without losing detail?
5. **Relevance** - Does it stay on topic?

Rate from 0.0 (poor) to 1.0 (excellent).`;

    case 'chat':
      return `Evaluate the chat response${domainContext} based on:

1. **Helpfulness** - Does it help the user effectively?
2. **Accuracy** - Is the information provided correct?
3. **Tone** - Is it friendly, professional, and appropriate?
4. **Completeness** - Does it address all aspects of the user's message?
5. **Natural** - Does it sound conversational and human-like?

Rate from 0.0 (poor) to 1.0 (excellent).`;

    default:
      return `Evaluate the output quality based on accuracy, clarity, completeness, and appropriateness.`;
  }
}

function generateLLMJudgeTestCases(systemType: string, domain: string): string[] {
  const cases: string[] = [];

  switch (systemType) {
    case 'generation':
      cases.push(
        `{
    id: '1',
    input: '${getLLMJudgeInput(domain, systemType, 1)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 1)}',
    metadata: { category: 'standard' }
  }`,
        `{
    id: '2',
    input: '${getLLMJudgeInput(domain, systemType, 2)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 2)}',
    metadata: { category: 'complex' }
  }`
      );
      break;

    case 'qa':
      cases.push(
        `{
    id: '1',
    input: '${getLLMJudgeInput(domain, systemType, 1)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 1)}',
    metadata: { category: 'factual' }
  }`,
        `{
    id: '2',
    input: '${getLLMJudgeInput(domain, systemType, 2)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 2)}',
    metadata: { category: 'explanatory' }
  }`
      );
      break;

    case 'chat':
      cases.push(
        `{
    id: '1',
    input: '${getLLMJudgeInput(domain, systemType, 1)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 1)}',
    metadata: { category: 'help_request' }
  }`,
        `{
    id: '2',
    input: '${getLLMJudgeInput(domain, systemType, 2)}',
    expectedOutput: '${getLLMJudgeExpectedOutput(domain, systemType, 2)}',
    metadata: { category: 'follow_up' }
  }`
      );
      break;
  }

  return cases;
}

function getLLMJudgeInput(domain: string, systemType: string, caseNum: number): string {
  const inputs: Record<string, Record<string, string[]>> = {
    'customer-support': {
      generation: [
        'Write a response apologizing for a delayed shipment',
        'Draft an email explaining a product feature to a confused customer'
      ],
      qa: [
        'How do I reset my password?',
        'What is your refund policy for defective items?'
      ],
      chat: [
        'I need help with my account',
        'The app keeps crashing on my phone'
      ],
    },
    'healthcare': {
      generation: [
        'Summarize this patient visit note',
        'Write discharge instructions for a patient'
      ],
      qa: [
        'What are the side effects of this medication?',
        'When should I seek emergency care for these symptoms?'
      ],
      chat: [
        'I have questions about my prescription',
        'Can you explain my test results?'
      ],
    },
    'e-commerce': {
      generation: [
        'Write a product description for wireless headphones',
        'Create a promotional email for a sale'
      ],
      qa: [
        'When will my order arrive?',
        'How do I return an item?'
      ],
      chat: [
        'Help me find a gift for my friend',
        'I have a question about sizing'
      ],
    },
  };

  return inputs[domain]?.[systemType]?.[caseNum - 1] || `Example input ${caseNum} for ${systemType}`;
}

function getLLMJudgeExpectedOutput(domain: string, systemType: string, caseNum: number): string {
  // For LLM-as-judge, expected output is more of a guideline than exact match
  const outputs: Record<string, Record<string, string[]>> = {
    'customer-support': {
      generation: [
        'A sincere apology acknowledging the delay, explaining the situation, and offering compensation',
        'Clear step-by-step explanation of the feature with helpful examples'
      ],
      qa: [
        'Click "Forgot Password" on the login page, enter your email, and follow the reset link',
        'Full refunds for defective items within 30 days, with prepaid return shipping'
      ],
      chat: [
        'Helpful response asking what specific account issue they need help with',
        'Troubleshooting steps: restart app, check for updates, clear cache'
      ],
    },
    'healthcare': {
      generation: [
        'Concise summary of chief complaint, diagnosis, treatment plan, and follow-up',
        'Clear instructions on medications, activity restrictions, warning signs, and follow-up appointments'
      ],
      qa: [
        'Common side effects listed, when to call doctor, and precautions',
        'Red flag symptoms requiring immediate ER visit'
      ],
      chat: [
        'Empathetic response asking about specific prescription questions',
        'Professional explanation of test results in understandable terms'
      ],
    },
    'e-commerce': {
      generation: [
        'Engaging description highlighting key features, benefits, and specifications',
        'Compelling email with clear value proposition and strong call-to-action'
      ],
      qa: [
        'Estimated delivery date based on order and shipping details',
        'Return process: 30-day window, original packaging, refund timeline'
      ],
      chat: [
        'Helpful questions about recipient preferences and budget',
        'Size guide explanation with measurement instructions'
      ],
    },
  };

  return outputs[domain]?.[systemType]?.[caseNum - 1] || `High-quality ${systemType} output`;
}

function generateDefaultCode(): string {
  return `import Anthropic from '@anthropic-ai/sdk';
import { EvalRunner, exactMatch } from '../framework';

// Complete the onboarding to get personalized code!
// This will generate custom code for YOUR AI system

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function mySystem(input: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: input
    }]
  });

  return {
    output: response.content[0].text.trim()
  };
}

const testCases = [
  { id: '1', input: 'test input', expectedOutput: 'expected output' }
];

const runner = new EvalRunner({
  name: 'My Eval',
  scoringFunction: exactMatch,
  threshold: 0.8
});

const results = await runner.runEval(testCases, mySystem);
`;
}

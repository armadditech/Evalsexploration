/**
 * User Context System
 * Stores information about the user's AI system and scenario
 */

export type AISystemType = 'classification' | 'generation' | 'extraction' | 'qa' | 'chat' | 'other';
export type InputFormat = 'text' | 'json' | 'structured' | 'mixed';
export type OutputFormat = 'category' | 'text' | 'json' | 'boolean' | 'score';

export interface UserContext {
  // Core system info
  systemName?: string;
  systemDescription?: string;
  aiSystemType: AISystemType | null;
  domain: string; // "healthcare", "customer-support", "e-commerce", etc.

  // Input/Output
  inputFormat: InputFormat | null;
  outputFormat: OutputFormat | null;

  // Success criteria
  successCriteria: string[];

  // Example data
  exampleInput?: string;
  exampleOutput?: string;

  // Preferences
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: 'learning' | 'building' | 'debugging';

  // Generated content
  customTestCases?: any[];
  customCode?: string;

  // Metadata
  createdAt: string;
  lastUpdated: string;
}

export const defaultContext: UserContext = {
  systemName: undefined,
  systemDescription: undefined,
  aiSystemType: null,
  domain: 'general',
  inputFormat: null,
  outputFormat: null,
  successCriteria: [],
  experienceLevel: 'beginner',
  primaryGoal: 'learning',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

// Domain-specific examples
export const DOMAIN_EXAMPLES: Record<string, { description: string; icon: string }> = {
  'customer-support': { description: 'Chatbots, ticket classification, FAQ', icon: '💬' },
  'healthcare': { description: 'Medical summaries, diagnosis support', icon: '🏥' },
  'e-commerce': { description: 'Product reviews, recommendations', icon: '🛍️' },
  'finance': { description: 'Fraud detection, risk assessment', icon: '💰' },
  'legal': { description: 'Contract analysis, case summarization', icon: '⚖️' },
  'education': { description: 'Essay grading, tutoring systems', icon: '📚' },
  'content': { description: 'Article writing, social media', icon: '✍️' },
  'code': { description: 'Code generation, bug detection', icon: '💻' },
  'general': { description: 'Generic AI applications', icon: '🤖' },
};

// System type descriptions
export const SYSTEM_TYPE_INFO: Record<AISystemType, {
  description: string;
  examples: string[];
  recommendedScorers: string[];
}> = {
  classification: {
    description: 'Assigns inputs to predefined categories',
    examples: ['Sentiment analysis', 'Spam detection', 'Topic classification'],
    recommendedScorers: ['exactMatch', 'contains'],
  },
  generation: {
    description: 'Creates new text, code, or content',
    examples: ['Article writing', 'Code generation', 'Email composition'],
    recommendedScorers: ['llmJudge', 'semanticSimilarity'],
  },
  extraction: {
    description: 'Pulls structured data from unstructured input',
    examples: ['Named entity recognition', 'Contact info extraction', 'Data parsing'],
    recommendedScorers: ['jsonStructure', 'exactMatch'],
  },
  qa: {
    description: 'Answers questions based on context',
    examples: ['FAQ bot', 'Document Q&A', 'Knowledge base search'],
    recommendedScorers: ['semanticSimilarity', 'llmJudge', 'contains'],
  },
  chat: {
    description: 'Conversational multi-turn interactions',
    examples: ['Customer support bot', 'Assistant', 'Tutor'],
    recommendedScorers: ['llmJudge', 'semanticSimilarity'],
  },
  other: {
    description: 'Custom or specialized AI system',
    examples: ['Custom workflow', 'Specialized domain'],
    recommendedScorers: ['llmJudge'],
  },
};

// Helper functions
export function getRecommendedScorer(systemType: AISystemType | null): string {
  if (!systemType) return 'exactMatch';
  return SYSTEM_TYPE_INFO[systemType].recommendedScorers[0];
}

export function getRelevantExamples(systemType: AISystemType | null): string[] {
  if (!systemType) return [];
  return SYSTEM_TYPE_INFO[systemType].examples;
}

export function getDomainSpecificPrompt(context: UserContext): string {
  const { domain, systemDescription, aiSystemType } = context;

  let prompt = '';

  if (systemDescription) {
    prompt += `System: ${systemDescription}\n`;
  }

  if (domain && domain !== 'general') {
    const domainInfo = DOMAIN_EXAMPLES[domain];
    prompt += `Domain: ${domain} (${domainInfo.description})\n`;
  }

  if (aiSystemType) {
    const typeInfo = SYSTEM_TYPE_INFO[aiSystemType];
    prompt += `Type: ${aiSystemType} - ${typeInfo.description}\n`;
  }

  return prompt;
}

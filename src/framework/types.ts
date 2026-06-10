/**
 * Core types for the eval framework
 */

export interface EvalCase {
  id: string;
  input: string | Record<string, any>;
  expectedOutput?: string | Record<string, any>;
  metadata?: Record<string, any>;
}

export interface EvalResult {
  caseId: string;
  passed: boolean;
  score: number;
  actualOutput: string | Record<string, any>;
  expectedOutput?: string | Record<string, any>;
  explanation?: string;
  metadata?: Record<string, any>;
  duration: number;
}

export interface EvalSummary {
  totalCases: number;
  passed: number;
  failed: number;
  averageScore: number;
  duration: number;
  results: EvalResult[];
}

export type ScoringFunction = (
  actualOutput: any,
  expectedOutput?: any,
  input?: any
) => Promise<{ score: number; explanation?: string }>;

export interface EvalConfig {
  name: string;
  description: string;
  scoringFunction: ScoringFunction;
  threshold?: number; // Minimum score to pass
}

export interface ModelResponse {
  output: string | Record<string, any>;
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
  };
}

/**
 * Eval runner framework
 */

import { EvalCase, EvalConfig, EvalResult, EvalSummary, ModelResponse } from './types.js';

export class EvalRunner {
  constructor(private config: EvalConfig) {}

  async runEval(
    cases: EvalCase[],
    modelFunction: (input: any) => Promise<ModelResponse>
  ): Promise<EvalSummary> {
    const startTime = Date.now();
    const results: EvalResult[] = [];

    console.log(`\n🧪 Running eval: ${this.config.name}`);
    console.log(`📝 Description: ${this.config.description}`);
    console.log(`🔢 Test cases: ${cases.length}\n`);

    for (const testCase of cases) {
      const result = await this.runCase(testCase, modelFunction);
      results.push(result);

      const icon = result.passed ? '✅' : '❌';
      console.log(
        `${icon} Case ${result.caseId}: ${result.passed ? 'PASSED' : 'FAILED'} (score: ${result.score.toFixed(2)})`
      );
    }

    const summary = this.summarize(results, Date.now() - startTime);
    this.printSummary(summary);

    return summary;
  }

  private async runCase(
    testCase: EvalCase,
    modelFunction: (input: any) => Promise<ModelResponse>
  ): Promise<EvalResult> {
    const startTime = Date.now();

    try {
      const response = await modelFunction(testCase.input);
      const { score, explanation } = await this.config.scoringFunction(
        response.output,
        testCase.expectedOutput,
        testCase.input
      );

      const threshold = this.config.threshold ?? 0.7;
      const passed = score >= threshold;

      return {
        caseId: testCase.id,
        passed,
        score,
        actualOutput: response.output,
        expectedOutput: testCase.expectedOutput,
        explanation,
        metadata: {
          ...testCase.metadata,
          ...response.metadata,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        caseId: testCase.id,
        passed: false,
        score: 0,
        actualOutput: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        expectedOutput: testCase.expectedOutput,
        explanation: 'Test case failed with error',
        duration: Date.now() - startTime,
      };
    }
  }

  private summarize(results: EvalResult[], duration: number): EvalSummary {
    const passed = results.filter((r) => r.passed).length;
    const failed = results.length - passed;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    return {
      totalCases: results.length,
      passed,
      failed,
      averageScore,
      duration,
      results,
    };
  }

  private printSummary(summary: EvalSummary): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 EVAL SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Cases: ${summary.totalCases}`);
    console.log(`✅ Passed: ${summary.passed} (${((summary.passed / summary.totalCases) * 100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${summary.failed} (${((summary.failed / summary.totalCases) * 100).toFixed(1)}%)`);
    console.log(`📈 Average Score: ${summary.averageScore.toFixed(3)}`);
    console.log(`⏱️  Duration: ${(summary.duration / 1000).toFixed(2)}s`);
    console.log('='.repeat(50) + '\n');
  }
}

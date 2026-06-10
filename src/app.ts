/**
 * Interactive Evals Tutorial Application
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { runBasicClassificationEval } from './examples/01-basic-classification.js';
import { runJsonExtractionEval } from './examples/02-json-extraction.js';
import { runLlmAsJudgeEval } from './examples/03-llm-as-judge.js';
import { runRegressionEval } from './examples/04-regression-testing.js';

interface MenuItem {
  name: string;
  value: string;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: '📚 Tutorial 1: Introduction to Evals',
    value: 'tutorial1',
    description: 'Learn what evals are and why they matter',
  },
  {
    name: '🎯 Example 1: Basic Classification',
    value: 'example1',
    description: 'Sentiment classification with exact match scoring',
  },
  {
    name: '📋 Example 2: JSON Extraction',
    value: 'example2',
    description: 'Structured output validation',
  },
  {
    name: '⚖️  Example 3: LLM-as-Judge',
    value: 'example3',
    description: 'Using AI to evaluate AI outputs',
  },
  {
    name: '🔄 Example 4: Regression Testing',
    value: 'example4',
    description: 'Prevent regressions across model versions',
  },
  {
    name: '📖 View Documentation',
    value: 'docs',
    description: 'Read detailed guides and best practices',
  },
  {
    name: '🚪 Exit',
    value: 'exit',
    description: 'Exit the tutorial',
  },
];

function printWelcome() {
  console.clear();
  console.log(chalk.bold.cyan('\n' + '='.repeat(60)));
  console.log(chalk.bold.cyan('         🎓 AI EVALS TUTORIAL'));
  console.log(chalk.bold.cyan('         Learn to Build Better AI Evaluations'));
  console.log(chalk.bold.cyan('='.repeat(60) + '\n'));
  console.log(chalk.gray('Welcome to the interactive evals learning platform!'));
  console.log(chalk.gray('Learn how to test and evaluate AI systems effectively.\n'));
}

function printTutorial1() {
  console.clear();
  console.log(chalk.bold.yellow('\n📚 TUTORIAL 1: INTRODUCTION TO EVALS\n'));

  console.log(chalk.bold('What are Evals?'));
  console.log(
    `Evals (evaluations) are systematic tests that measure how well your AI
system performs on specific tasks. They're like unit tests, but for AI.

`
  );

  console.log(chalk.bold('Why are Evals Important?'));
  console.log(`
1. ${chalk.green('Measure Performance')}: Know if your AI actually works
2. ${chalk.green('Catch Regressions')}: Detect when changes break things
3. ${chalk.green('Guide Improvements')}: Understand where to optimize
4. ${chalk.green('Build Confidence')}: Deploy with evidence, not hope
`);

  console.log(chalk.bold('Core Components of an Eval:'));
  console.log(`
1. ${chalk.cyan('Test Cases')}: Input + expected output pairs
2. ${chalk.cyan('Model Function')}: Your AI system being tested
3. ${chalk.cyan('Scoring Function')}: How to measure correctness
4. ${chalk.cyan('Threshold')}: Minimum score to pass
`);

  console.log(chalk.bold('Types of Scoring Functions:'));
  console.log(`
- ${chalk.magenta('Exact Match')}: Output must match exactly
- ${chalk.magenta('Contains')}: Output must contain expected text
- ${chalk.magenta('Regex Match')}: Output must match a pattern
- ${chalk.magenta('JSON Structure')}: Output must have required fields
- ${chalk.magenta('LLM-as-Judge')}: Use AI to evaluate outputs
- ${chalk.magenta('Semantic Similarity')}: Meaning-based comparison
`);

  console.log(chalk.bold('\nBest Practices:'));
  console.log(`
✓ Start simple (exact match) then add complexity
✓ Test edge cases, not just happy paths
✓ Run evals in CI/CD before deploying
✓ Track metrics over time
✓ Balance cost vs coverage
✗ Don't over-engineer early
✗ Don't ignore failing tests
✗ Don't test only obvious cases
`);

  console.log(chalk.gray('\nPress Enter to continue...'));
}

function printDocumentation() {
  console.clear();
  console.log(chalk.bold.cyan('\n📖 DOCUMENTATION\n'));

  console.log(chalk.bold('Quick Start Guide:'));
  console.log(`
1. Define your test cases with inputs and expected outputs
2. Create a scoring function that measures correctness
3. Use EvalRunner to execute tests and get results
4. Iterate: add more cases, improve scoring, tune threshold
`);

  console.log(chalk.bold('\nCommon Eval Patterns:'));
  console.log(`
${chalk.yellow('Classification Tasks')}
  - Use: exactMatch scorer
  - Example: Sentiment analysis, category tagging
  - Threshold: 1.0 (must be exact)

${chalk.yellow('Structured Extraction')}
  - Use: jsonStructure or custom validator
  - Example: Contact info, named entities
  - Threshold: 1.0 for structure, lower for content

${chalk.yellow('Open-Ended Generation')}
  - Use: llmJudge or semanticSimilarity
  - Example: Summaries, explanations, creative writing
  - Threshold: 0.7-0.8 (allow variation)

${chalk.yellow('Regression Testing')}
  - Use: Any appropriate scorer
  - Example: Baseline vs new version comparison
  - Threshold: Must match or exceed baseline
`);

  console.log(chalk.bold('\nAdvanced Topics:'));
  console.log(`
- Dataset curation and balancing
- Multi-metric evaluation (precision, recall, F1)
- Continuous evaluation in production
- A/B testing different prompts/models
- Human evaluation integration
- Cost optimization strategies
`);

  console.log(chalk.bold('\nUseful Resources:'));
  console.log(`
- Framework code: ${chalk.cyan('src/framework/')}
- Example evals: ${chalk.cyan('src/examples/')}
- Your evals: ${chalk.cyan('evals/')}
- Test datasets: ${chalk.cyan('datasets/')}
`);

  console.log(chalk.gray('\nPress Enter to continue...'));
}

async function runExample(example: string) {
  console.log(chalk.yellow('\n⏳ Running example...\n'));

  try {
    switch (example) {
      case 'example1':
        await runBasicClassificationEval();
        break;
      case 'example2':
        await runJsonExtractionEval();
        break;
      case 'example3':
        await runLlmAsJudgeEval();
        break;
      case 'example4':
        await runRegressionEval();
        break;
    }
    console.log(chalk.green('\n✅ Example completed!\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Error running example:'), error);
  }

  console.log(chalk.gray('Press Enter to return to menu...'));
  await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
}

async function main() {
  let running = true;

  while (running) {
    printWelcome();

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: MENU_ITEMS.map((item) => ({
          name: item.name,
          value: item.value,
        })),
        pageSize: 10,
      },
    ]);

    switch (choice) {
      case 'tutorial1':
        printTutorial1();
        await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
        break;

      case 'example1':
      case 'example2':
      case 'example3':
      case 'example4':
        await runExample(choice);
        break;

      case 'docs':
        printDocumentation();
        await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
        break;

      case 'exit':
        console.log(chalk.green('\n👋 Happy eval building!\n'));
        running = false;
        break;
    }
  }
}

main().catch((error) => {
  console.error(chalk.red('Application error:'), error);
  process.exit(1);
});

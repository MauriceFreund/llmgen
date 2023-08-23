import { runEvaluation } from './eval/runEvaluation';
import { runGenerator } from './runGenerator';

const mode: string = process.argv[2];

if (mode === 'generate') {
    runGenerator(process.argv[3]).then(() => console.log('Done.'));
} else if (mode === 'eval') {
    runEvaluation();
} else {
    console.error(`Invalid mode ${mode}. Must be either "generate" or "eval".`);
}

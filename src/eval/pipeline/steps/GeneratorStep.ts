import path from 'path';
import { runGenerator } from '../../../runGenerator';

export function generatorStep() {
    runGenerator(path.resolve('./src/eval/test-cases/simple-api/js/configuration.json'));
}

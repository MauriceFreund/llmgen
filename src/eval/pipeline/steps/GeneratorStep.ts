import path from 'path';
import { runGenerator } from '../../../runGenerator';

export function generatorStep() {
    const start = performance.now();
    runGenerator(path.resolve('./src/eval/test-cases/simple-api/js/configuration.json'))
        .then(() => {
            const end = performance.now();
            console.log(`Generating process took ${end - start}ms.`);
        });
}

import GeneratorConfiguration from './GeneratorConfiguration';
import path from 'path';
import * as fs from 'fs';
import { GeneratorConfigurationContent } from './GeneratorConfigurationContent';

class GeneratorConfigurationReader {
    readConfiguration(pathToConfigurationFile: string): GeneratorConfiguration {
        const fileContent = fs.readFileSync(path.resolve(pathToConfigurationFile));
        const parsedConfiguration = JSON.parse(
            fileContent.toString(),
        ) as GeneratorConfigurationContent;
        return new GeneratorConfiguration(parsedConfiguration);
    }
}

export default GeneratorConfigurationReader;

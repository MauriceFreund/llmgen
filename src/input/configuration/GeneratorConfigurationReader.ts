import GeneratorConfiguration from './GeneratorConfiguration';
import path from 'path';
import { promises as fs } from 'fs';
import { GeneratorConfigurationContent } from './GeneratorConfigurationContent';

class GeneratorConfigurationReader {
    async readConfiguration(
        pathToConfigurationFile: string,
    ): Promise<GeneratorConfiguration> {
        const fileContent = await fs.readFile(
            path.resolve(pathToConfigurationFile),
        );
        const parsedConfiguration = JSON.parse(
            fileContent.toString(),
        ) as GeneratorConfigurationContent;
        return new GeneratorConfiguration(parsedConfiguration);
    }
}

export default GeneratorConfigurationReader;

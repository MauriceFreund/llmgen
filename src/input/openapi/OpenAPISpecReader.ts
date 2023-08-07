import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import OpenApiSpec from './OpenApiSpec';
import { OpenApiSpecContent } from './OpenApiSpecContent';

class OpenApiSpecReader {
    async readSpec(pathToSpecFile: string): Promise<OpenApiSpec> {
        const fileExtension = path.extname(pathToSpecFile);
        switch (fileExtension) {
            case '.yaml':
                return this.readSpecYaml(pathToSpecFile);
            case '.json':
                return this.readSpecJson(pathToSpecFile);
            default:
                throw Error(
                    `Expected format of OpenApi specification to be either '.yaml' or '.json' but found ${fileExtension}`,
                );
        }
    }

    private async readSpecYaml(pathToSpecFile: string): Promise<OpenApiSpec> {
        const yamlContent = await fs.readFile(path.resolve(pathToSpecFile));
        const content = yaml.load(yamlContent.toString()) as OpenApiSpecContent;
        return new OpenApiSpec(content);
    }

    private async readSpecJson(pathToSpecFile: string): Promise<OpenApiSpec> {
        const yamlContent = await fs.readFile(path.resolve(pathToSpecFile));
        const content = yaml.load(yamlContent.toString()) as OpenApiSpecContent;
        return new OpenApiSpec(content);
    }
}

export default OpenApiSpecReader;

import path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import OpenApiSpec from './OpenApiSpec';
import { OpenApiSpecContent } from './OpenApiSpecContent';

class OpenApiSpecReader {
    readSpec(pathToSpecFile: string): OpenApiSpec {
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

    private readSpecYaml(pathToSpecFile: string): OpenApiSpec {
        const yamlContent = fs.readFileSync(path.resolve(pathToSpecFile));
        const content = yaml.load(yamlContent.toString()) as OpenApiSpecContent;
        return new OpenApiSpec(content);
    }

    private readSpecJson(pathToSpecFile: string): OpenApiSpec {
        const yamlContent = fs.readFileSync(path.resolve(pathToSpecFile));
        const content = yaml.load(yamlContent.toString()) as OpenApiSpecContent;
        return new OpenApiSpec(content);
    }
}

export default OpenApiSpecReader;

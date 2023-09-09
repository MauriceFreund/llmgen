import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import GeneratorMemory from '../memory/GeneratorMemory';
import * as fs from 'fs';
import path from 'path';
import { withBasePath } from '../util/Utility';
import { randomUUID } from 'crypto';
import Mustache from 'mustache';

class OutputWriter {
    private _config: GeneratorConfiguration;
    private _outDir: string;
    private _fileExtension: string;

    constructor(config: GeneratorConfiguration) {
        this._config = config;
        this._outDir = path.resolve(config.content.meta.outputDir);
        switch (config.content.generator.targetLanguage) {
            case 'Python':
                this._fileExtension = '.py';
                break;
            case 'Java':
                this._fileExtension = '.java';
                break;
            case 'JavaScript':
                this._fileExtension = '.js';
                break;
        }
    }

    writeOutput(memory: GeneratorMemory) {
        const schemaAnswers = memory
            .getCompleteSchemaEntries()
            .map((entry) => entry.answer)
            .filter((answer) => answer !== undefined) as string[];

        const pathAnswers = memory
            .getCompletePathEntries()
            .map((entry) => entry.answer)
            .filter((answer) => answer !== undefined) as string[];

        const modelDir = this._outDir + '/model/';
        const apiDir = this._outDir + '/api/';
        try {
            fs.mkdirSync(modelDir, { recursive: true });
        } catch { }
        try {
            fs.mkdirSync(apiDir, { recursive: true });
        } catch { }

        schemaAnswers.forEach((schemaAnswer) => {
            const fileName =
                modelDir + this.getFileNameFromAnswer(schemaAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, schemaAnswer);
        });

        pathAnswers.forEach((pathAnswer) => {
            const fileName = apiDir + this.getFileNameFromAnswer(pathAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, pathAnswer);
        });
        this.writeApiException();
    }

    private writeApiException() {
        const templateDir = this._fileExtension.replace('.', '')
        const templateFilePath = withBasePath('src/output/exception-templates/') + templateDir + '/ApiException.mustache';
        const template = fs.readFileSync(templateFilePath).toString();

        const view = {
            javaPackagePrefix: this._config.content.generator.javaPackagePrefix,
        }

        const output = Mustache.render(template, view);
        fs.mkdirSync(this._outDir + '/exception', { recursive: true, });
        const outFile = this._outDir + '/exception/ApiException' + this._fileExtension; 
        console.log('Write exception file to ' + outFile);
        fs.writeFileSync(outFile, output)
    }

    private getFileNameFromAnswer(answer: string): string {
        const match = answer.match(/class (\w+)/);

        if (match && match[1]) {
            return match[1];
        } else {
            throw Error('Could not extract file name from: ' + answer);
        }
    }
}

export default OutputWriter;

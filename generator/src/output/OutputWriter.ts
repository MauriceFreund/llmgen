import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import GeneratorMemory from '../memory/GeneratorMemory';
import * as fs from 'fs';
import path from 'path';
import { prettyFormat, withBasePath } from '../util/Utility';
import { randomUUID } from 'crypto';
import Mustache from 'mustache';
import { GeneratorMemoryEntry } from '../memory/GeneratorMemoryEntry';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import { EvalResults } from './EvalResults';
import ChatPrompt from '../prompting/ChatPrompt';

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
        console.log(`Writing generated code to ${this._outDir}`);
        const schemaEntries = memory
            .getCompleteSchemaEntries()
            .filter(
                (entry) => entry.answer !== undefined && entry.generatedClassName !== undefined,
            );

        const pathEntries = memory
            .getCompletePathEntries()
            .filter(
                (entry) => entry.answer !== undefined && entry.generatedClassName !== undefined,
            );

        const modelDir = this._outDir + '/model/';
        const apiDir = this._outDir + '/api/';
        try {
            fs.mkdirSync(modelDir, { recursive: true });
        } catch {}
        try {
            fs.mkdirSync(apiDir, { recursive: true });
        } catch {}

        schemaEntries.forEach((schemaAnswer) => {
            const fileName =
                modelDir + this.getFileNameFromSnippet(schemaAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, schemaAnswer.answer!);
        });

        pathEntries.forEach((pathAnswer) => {
            const fileName = apiDir + this.getFileNameFromSnippet(pathAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, pathAnswer.answer!);
        });
        this.writeApiException();
    }

    writeEvalResults(results: EvalResults) {
        try {
            fs.writeFileSync('./evalResults.json', JSON.stringify(results));
        } catch (e) {
            console.error('Could not write evaluation results. Reason: ' + e);
        }
    }

    savePrompt(prompt: ChatPrompt, fileName: string) {
        try {
            fs.writeFileSync(`./${fileName}.prompt.json`, prettyFormat(prompt));
        } catch (e) {
            console.error('Could not write evaluation results. Reason: ' + e);
        }
    }

    private writeApiException() {
        const templateDir = this._fileExtension.replace('.', '');
        const templateFilePath =
            withBasePath('src/output/exception-templates/') +
            templateDir +
            '/ApiException.mustache';
        const template = fs.readFileSync(templateFilePath).toString();

        const view = {
            javaPackagePrefix: this._config.content.generator.javaPackagePrefix,
        };

        const output = Mustache.render(template, view);
        fs.mkdirSync(this._outDir + '/exception', { recursive: true });
        const outFile = this._outDir + '/exception/ApiException' + this._fileExtension;
        console.log('Write exception file to ' + outFile);
        fs.writeFileSync(outFile, output);
    }

    private getFileNameFromSnippet(snippet: GeneratorMemoryEntry<OpenApiSnippet>): string {
        if (snippet.generatedClassName) {
            return snippet.generatedClassName;
        } else {
            throw Error('Could not extract file name from: ' + snippet.answer);
        }
    }
}

export default OutputWriter;

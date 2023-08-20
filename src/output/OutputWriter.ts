import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import GeneratorMemory from '../memory/GeneratorMemory';
import * as fs from 'fs';
import path from 'path';

class OutputWriter {
    private _outDir: string;
    private _fileExtension: string;

    constructor(config: GeneratorConfiguration) {
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
            fs.mkdirSync(this._outDir);
        } catch {}
        try {
            fs.mkdirSync(modelDir);
        } catch {}
        try {
            fs.mkdirSync(apiDir);
        } catch {}

        schemaAnswers.forEach((schemaAnswer) => {
            const fileName =
                modelDir + this.getFileNameFromAnswer(schemaAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, schemaAnswer);
        });

        pathAnswers.forEach((pathAnswer) => {
            const fileName = apiDir + this.getFileNameFromAnswer(pathAnswer) + this._fileExtension;
            fs.writeFileSync(fileName, pathAnswer);
        });
    }

    private getFileNameFromAnswer(answer: string): string {
        const match = answer.match(/@file (\w+)/);

        if (match && match[1]) {
            return match[1];
        } else {
            throw Error('Model answer did not specify filename.' + answer);
        }
    }
}

export default OutputWriter;

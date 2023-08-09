import { ChatCompletionRequestMessage } from 'openai';
import * as fs from 'fs';
import path from 'path';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';

class SystemMessageGenerator {
    private readonly _configuration: GeneratorConfiguration;
    private readonly _template: string;

    constructor(configuration: GeneratorConfiguration) {
        this._configuration = configuration;
        const templatePath = this._configuration.content.meta.inputPaths.systemMessageTemplate;
        this._template = fs.readFileSync(path.resolve(templatePath)).toString();
    }

    getMessage(): ChatCompletionRequestMessage {
        return {
            role: 'system',
            content: this._template,
        };
    }
}

export default SystemMessageGenerator;

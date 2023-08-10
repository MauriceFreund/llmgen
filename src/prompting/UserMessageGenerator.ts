import { OpenApiSpecMetadata, SchemaSnippet } from '../input/openapi/SpecSplittingOutput';
import { OpenApiSpecPath } from '../input/openapi/OpenApiSpecContent';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';
import * as fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

class UserMessageGenerator {
    private readonly _configuration: GeneratorConfiguration;
    private readonly _template: String;

    constructor(configuration: GeneratorConfiguration) {
        this._configuration = configuration;
        const templateFilePath = this._configuration.content.meta.inputPaths.userMessageTemplate;
        this._template = fs.readFileSync(path.resolve(templateFilePath)).toString();
    }

    generateMessage(
        openApiSnippet: SchemaSnippet | OpenApiSpecPath,
        metadata: OpenApiSpecMetadata,
    ): ChatCompletionRequestMessage {
        const view = {
            config: prettyFormat(this._configuration.content.generator),
            metadata: prettyFormat(metadata),
            openApiSnippet: prettyFormat(openApiSnippet),
        };
        const messageContent = Mustache.render(this._template.toString(), view);
        return {
            role: 'user',
            content: messageContent,
        };
    }
}

export default UserMessageGenerator;

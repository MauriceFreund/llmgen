import { OpenApiSpecMetadata, SchemaSnippet } from '../input/openapi/SpecSplittingOutput';
import { OpenApiSpecPath } from '../input/openapi/OpenApiSpecContent';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';
import Mustache from 'mustache';
import { getUserMessageTemplate } from './templating/TemplateSelector';

class UserMessageGenerator {
    private readonly _configuration: GeneratorConfiguration;

    constructor(configuration: GeneratorConfiguration) {
        this._configuration = configuration;
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
        const template = getUserMessageTemplate();
        const messageContent = Mustache.render(template, view);
        return {
            role: 'user',
            content: messageContent,
        };
    }
}

export default UserMessageGenerator;

import { OpenApiSpecMetadata, SchemaSnippet } from '../input/openapi/SpecSplittingOutput';
import { OpenApiSpecPath } from '../input/openapi/OpenApiSpecContent';
import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';
import Mustache from 'mustache';
import { getUserMessageTemplate } from './templating/TemplateSelector';
import { TargetConfiguration } from '../input/configuration/GeneratorConfigurationContent';

class UserMessageGenerator {
    generateMessage(
        openApiSnippet: SchemaSnippet | OpenApiSpecPath,
        configuration: TargetConfiguration,
        metadata: OpenApiSpecMetadata,
    ): ChatCompletionRequestMessage {
        const view = {
            config: prettyFormat(configuration),
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

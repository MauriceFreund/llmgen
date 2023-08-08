import { OpenApiSpecMetadata, SplitSchema } from '../input/openapi/SpecSplittingOutput';
import { OpenApiSpecPath } from '../input/openapi/OpenApiSpecContent';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';
import { promises as fs } from 'fs';
import path from 'path';
import Mustache from 'mustache';

class UserMessageGenerator {
    private readonly _templatePath: string;

    constructor(templateFilePath: string) {
        this._templatePath = templateFilePath;
    }

    async generateMessage(
        openApiSnippet: SplitSchema | OpenApiSpecPath,
        metadata: OpenApiSpecMetadata,
        config: GeneratorConfiguration,
    ): Promise<ChatCompletionRequestMessage> {
        const view = {
            config: prettyFormat(config.content.generator),
            metadata: prettyFormat(metadata),
            openApiSnippet: prettyFormat(openApiSnippet),
        };
        const template = await fs.readFile(path.resolve(this._templatePath));
        const messageContent = Mustache.render(template.toString(), view);
        return Promise.resolve({
            role: 'user',
            content: messageContent,
        });
    }
}

export default UserMessageGenerator;

import OpenApiSpec from '../input/openapi/OpenApiSpec';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import SystemMessageGenerator from './SystemMessageGenerator';
import ChatPrompt from './ChatPrompt';
import UserMessageGenerator from './UserMessageGenerator';

class PromptGenerator {
    async generatePrompts(
        openApiSpec: OpenApiSpec,
        configuration: GeneratorConfiguration,
    ): Promise<ChatPrompt[]> {
        const smg = new SystemMessageGenerator(
            configuration.content.meta.inputPaths.systemMessageTemplate,
        );
        const systemMessage = await smg.getMessage();

        const splitSpec = openApiSpec.splitSpec();
        const umg = new UserMessageGenerator(
            configuration.content.meta.inputPaths.userMessageTemplate,
        );

        const schemaMessages = await Promise.all(
            splitSpec.schemas.map(
                async (schema) =>
                    await umg.generateMessage(schema, splitSpec.metadata, configuration),
            ),
        );
        const pathMessages = await Promise.all(
            splitSpec.paths.map(
                async (path) => await umg.generateMessage(path, splitSpec.metadata, configuration),
            ),
        );

        return [...schemaMessages, ...pathMessages].map(
            (message) => new ChatPrompt([systemMessage, message]),
        );
    }
}

export default PromptGenerator;

import OpenApiSpec from '../input/openapi/OpenApiSpec';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';

class PromptGenerator {
    generatePrompt(
        openApiSpec: OpenApiSpec,
        configuration: GeneratorConfiguration,
    ): string {
        return (
            `Generate an api client in ${configuration.content.generator.targetLanguage} for this OpenAPI specification. Return only the code without explanations.\n` +
            `'''\n${JSON.stringify(openApiSpec.content)}\n'''`
        );
    }
}

export default PromptGenerator;

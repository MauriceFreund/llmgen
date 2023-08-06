import OpenApiSpec from '../input/OpenApiSpec';

class PromptGenerator {
    generatePrompt(openApiSpec: OpenApiSpec): string {
        return (
            'Generate an api client in Python for this OpenAPI specification. Return only the code without explanations.\n' +
            `'''\n${JSON.stringify(openApiSpec.content)}\n'''`
        );
    }
}

export default PromptGenerator;

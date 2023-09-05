import 'dotenv/config';
import OpenAPISpecReader from './input/openapi/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';
import GeneratorConfigurationReader from './input/configuration/GeneratorConfigurationReader';
import GeneratorMemory from './memory/GeneratorMemory';
import { GeneratorMemoryEntry } from './memory/GeneratorMemoryEntry';
import GeneratorConfiguration from './input/configuration/GeneratorConfiguration';
import { OpenApiSnippet } from './input/openapi/OpenApiSpecContent';
import ExampleReader from './example/selection/ExampleReader';
import OutputWriter from './output/OutputWriter';
import { CompletionResult } from './model/CompletionResult';

async function promptModel<T extends OpenApiSnippet>(
    entry: GeneratorMemoryEntry<T>,
    completedEntries: GeneratorMemoryEntry<T>[],
    memory: GeneratorMemory,
    config: GeneratorConfiguration,
): Promise<CompletionResult> {
    const promptGenerator = new PromptGenerator(config);
    const prompt = promptGenerator.generatePrompt(entry, completedEntries);

    const model = new ChatModel(config.content.meta.model);

    try {
        const completionResult = await model.complete(prompt);
        memory.completeEntry(entry.id, completionResult.answer);
        return completionResult;
    } catch (err) {
        console.error(err);
        return {
            answer: '',
            requestInfo: {
                totalTokens: 0,
                totalCost: 0,
            },
        }
    }
}

export async function runGenerator(configPath: string) {
    const specReader = new OpenAPISpecReader();
    const configReader = new GeneratorConfigurationReader();

    const config = configReader.readConfiguration(configPath);
    const spec = specReader.readSpec(config.content.meta.inputPaths.openApi);

    const memory = new GeneratorMemory(spec, config);

    const outputWriter = new OutputWriter(config);

    const exampleReader = new ExampleReader(config);
    const examples = exampleReader.readExamples();

    console.info(`Initialized memory with ${memory.getIncompleteEntries().length} entries.`);

    var totalCost = 0;
    var totalTokens = 0;

    for (const entry of memory.getIncompleteSchemaEntries()) {
        const schemaExampleEntries = examples
            .filter((ex) => ex.entry.entryType === 'schema')
            .map((ex) => ex.entry);
        const completedEntries = memory.getCompleteSchemaEntries();
        console.info('Prompting model with schema snippet.');
        const result = await promptModel(entry, [...schemaExampleEntries, ...completedEntries], memory, config);
        totalCost += result.requestInfo.totalCost;
        totalTokens += result.requestInfo.totalTokens;
    }
    for (const entry of memory.getIncompletePathEntries()) {
        const pathExampleEntries = examples
            .filter((ex) => ex.entry.entryType === 'path')
            .map((ex) => ex.entry);
        const completedEntries = memory.getCompletePathEntries();
        console.info('Prompting model with path snippet.');
        const result = await promptModel(entry, [...pathExampleEntries, ...completedEntries], memory, config);
        totalCost += result.requestInfo.totalCost;
        totalTokens += result.requestInfo.totalTokens;
    }

    console.log(`Cost: ${totalCost}`);
    console.log(`Token: ${totalTokens}`);
    outputWriter.writeOutput(memory);
}

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
    outputWriter: OutputWriter,
    isInEvalMode: boolean,
): Promise<CompletionResult> {
    const MAX_RETRIES = 10;
    let current_try = 1;

    const promptGenerator = new PromptGenerator();
    const prompt = promptGenerator.generatePrompt(entry, completedEntries);

    if (isInEvalMode) {
        console.log(prompt.toString());
    }

    const model = new ChatModel(config, isInEvalMode);

    while (current_try <= MAX_RETRIES) {
        try {
            const completionResult = await model.complete(prompt);
            const completedEntry = memory.completeEntry(entry.id, completionResult.answer);

            if (isInEvalMode && completedEntry.generatedClassName) {
                prompt.addAssistantMessage(completionResult.answer);
                outputWriter.savePrompt(prompt, completedEntry.generatedClassName);
            }

            return completionResult;
        } catch (err) {
            console.log(`Model completion failed in try ${current_try}/${MAX_RETRIES}`);
            console.log('Encountered error during model completion.', err);
            current_try++;
        }
    }
    return {
        answer: '',
        requestInfo: {
            inTokens: 0,
            outTokens: 0,
            totalCost: 0,
        },
        modelConfig: {
            model: 'error',
            temperature: -1,
            topP: 1,
        },
        encounteredError: 'Reached maximum number of retries for model completion',
    };
}

export async function runGenerator(configPath: string, isInEvalMode: boolean) {
    const specReader = new OpenAPISpecReader();
    const configReader = new GeneratorConfigurationReader();

    const config = configReader.readConfiguration(configPath);
    const spec = specReader.readSpec(config.content.meta.inputPaths.openApi);

    const memory = new GeneratorMemory(spec, config);

    const outputWriter = new OutputWriter(config);

    const exampleReader = new ExampleReader(config);

    console.info(`Initialized memory with ${memory.getIncompleteEntries().length} entries.`);

    var totalCost = 0;
    var totalInTokens = 0;
    var totalOutTokens = 0;
    var model = 'undefined';
    var temperature = -1;
    var topP = -1;
    const errors = [];

    for (const entry of memory.getIncompleteSchemaEntries()) {
        const examples = exampleReader.readExamples(entry.snippet);
        const schemaExampleEntries = examples
            .filter((ex) => ex.entry.entryType === 'schema')
            .map((ex) => ex.entry);
        const completedEntries = memory.getCompleteEntriesRelevantForSchemaPrompt();
        console.info('Prompting model with schema snippet.');
        const result = await promptModel(
            entry,
            [...schemaExampleEntries, ...completedEntries],
            memory,
            config,
            outputWriter,
            isInEvalMode,
        );
        totalCost += result.requestInfo.totalCost;
        totalInTokens += result.requestInfo.inTokens;
        totalOutTokens += result.requestInfo.outTokens;
        model = result.modelConfig.model;
        temperature = result.modelConfig.temperature;
        topP = result.modelConfig.topP;
        if (result.encounteredError) errors.push(result.encounteredError);
    }
    for (const entry of memory.getIncompletePathEntries()) {
        const examples = exampleReader.readExamples(entry.snippet);
        const pathExampleEntries = examples
            .filter((ex) => ex.entry.entryType === 'path')
            .map((ex) => ex.entry);
        const completedEntries = memory.getCompleteEntriesRelevantForPathPrompt(entry);
        console.info('Prompting model with path snippet.');
        const result = await promptModel(
            entry,
            [...pathExampleEntries, ...completedEntries],
            memory,
            config,
            outputWriter,
            isInEvalMode,
        );
        totalCost += result.requestInfo.totalCost;
        totalInTokens += result.requestInfo.inTokens;
        totalOutTokens += result.requestInfo.outTokens;
    }

    if (isInEvalMode) {
        outputWriter.writeEvalResults({
            totalInTokens,
            totalOutTokens,
            model,
            temperature,
            topP,
            errors,
        });
    }
    outputWriter.writeOutput(memory);
}

import 'dotenv/config';
import OpenAPISpecReader from './input/openapi/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';
import GeneratorConfigurationReader from './input/configuration/GeneratorConfigurationReader';
import { prettyFormat } from './util/Utility';
import GeneratorMemory from './memory/GeneratorMemory';
import { GeneratorMemoryEntry } from './memory/GeneratorMemoryEntry';
import GeneratorConfiguration from './input/configuration/GeneratorConfiguration';
import { OpenApiSnippet } from './input/openapi/OpenApiSpecContent';

async function promptModel<T extends OpenApiSnippet>(
    entry: GeneratorMemoryEntry<T>,
    completedEntries: GeneratorMemoryEntry<T>[],
    memory: GeneratorMemory,
    config: GeneratorConfiguration,
) {
    const promptGenerator = new PromptGenerator(config);
    const prompt = promptGenerator.generatePrompt(entry, completedEntries);
    console.log(`Prompt: \n """${prettyFormat(prompt.messages)}"""\n\n`);

    const model = new ChatModel(config.content.meta.model);

    try {
        const answer = await model.complete(prompt);
        memory.completeEntry(entry.id, answer);
    } catch (err) {
        console.error(err);
    }
}

async function run() {
    const specReader = new OpenAPISpecReader();
    const configReader = new GeneratorConfigurationReader();

    const configPath = './resources/configuration.json';

    const config = configReader.readConfiguration(configPath);
    const spec = specReader.readSpec(config.content.meta.inputPaths.openApi);

    const memory = new GeneratorMemory(spec, config);

    for (const entry of memory.getIncompleteSchemaEntries()) {
        const completedEntries = memory.getCompleteSchemaEntries();
        await promptModel(entry, completedEntries, memory, config);
    }

    for (const entry of memory.getCompletePathEntries()) {
        const completedEntries = memory.getCompletePathEntries();
        await promptModel(entry, completedEntries, memory, config);
    }

    memory.log();
}

run().then(() => console.log('Done.'));

import 'dotenv/config';
import OpenAPISpecReader from './input/openapi/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';
import GeneratorConfigurationReader from './input/configuration/GeneratorConfigurationReader';
import { prettyFormat } from './util/Utility';
import GeneratorMemory from './memory/GeneratorMemory';

async function run() {
    const specReader = new OpenAPISpecReader();
    const configReader = new GeneratorConfigurationReader();

    const configPath = './resources/configuration.json';

    const config = configReader.readConfiguration(configPath);
    const spec = specReader.readSpec(config.content.meta.inputPaths.openApi);

    const memory = new GeneratorMemory(spec, config);

    const promptGenerator = new PromptGenerator(config);

    for (const entry of memory.getIncompleteEntries()) {
        const prompt = promptGenerator.generatePrompt(entry);
        console.log(`Prompt: \n """${prettyFormat(prompt.messages)}"""\n\n`);

        const model = new ChatModel(config.content.meta.model);

        try {
            const answer = await model.complete(prompt);
            memory.completeEntry(entry.id, answer);
        } catch (err) {
            console.error(err);
        }
    }

    memory.log();
}

run().then(() => console.log('Done.'));

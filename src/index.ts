import 'dotenv/config';
import OpenAPISpecReader from './input/openapi/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';
import GeneratorConfigurationReader from './input/configuration/GeneratorConfigurationReader';
import { prettyFormat } from './util/Utility';

async function run() {
    const specReader = new OpenAPISpecReader();
    const configReader = new GeneratorConfigurationReader();

    const configPath = './resources/configuration.json';

    const config = await configReader.readConfiguration(configPath);
    const spec = await specReader.readSpec(config.content.meta.inputPaths.openApi);

    const prompts = await new PromptGenerator().generatePrompts(spec, config);

    for (const prompt of prompts) {
        console.log(`Prompt: \n """${prettyFormat(prompt.messages)}"""\n\n`);

        const model = new ChatModel(config.content.meta.model);

        try {
            const answer = await model.complete(prompt);
            console.log(`Answer: \n """${answer}"""\n\n`);
            console.log(
                `############################################################################################`,
            );
        } catch (err) {
            console.error(err);
        }
    }
}

run().then(() => console.log('Done.'));

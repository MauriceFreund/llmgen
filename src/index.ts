import 'dotenv/config';
import OpenAPISpecReader from './input/openapi/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';
import GeneratorConfigurationReader from './input/configuration/GeneratorConfigurationReader';

const specReader = new OpenAPISpecReader();
const configReader = new GeneratorConfigurationReader();
const jsonPath = './resources/reference-api.json';
const configPath = './resources/configuration.json';

specReader.readSpec(jsonPath).then((spec) => {
    console.log(JSON.stringify(spec.splitSpec()));

    configReader.readConfiguration(configPath).then((configuration) => {
        const prompt = new PromptGenerator().generatePrompt(
            spec,
            configuration,
        );

        console.log(`Prompt: \n """${prompt}"""\n\n`);

        const model = new ChatModel(configuration.content.meta.model);

        model
            .complete(prompt)
            .then((answer) => console.log(`Answer: \n """${answer}"""\n\n`))
            .catch((err) => console.error(err));
    });
});

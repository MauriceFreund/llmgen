import 'dotenv/config';
import OpenAPISpecReader from './input/OpenAPISpecReader';
import PromptGenerator from './prompting/PromptGenerator';
import ChatModel from './model/ChatModel';

const specReader = new OpenAPISpecReader();
const jsonPath = './resources/reference-api.json';
specReader.readSpec(jsonPath).then((spec) => {
    const prompt = new PromptGenerator().generatePrompt(spec);

    console.log(`Prompt: \n """${prompt}"""\n\n`);

    const model = new ChatModel();

    model
        .complete(prompt)
        .then((answer) => console.log(`Answer: \n """${answer}"""\n\n`))
        .catch((err) => console.error(err));
});

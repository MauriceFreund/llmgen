import {
    ChatCompletionRequestMessageRoleEnum,
    Configuration,
    OpenAIApi,
} from 'openai';

class ChatModel {
    configuration: Configuration;
    openai: OpenAIApi;

    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);
    }

    async complete(prompt: string): Promise<string> {
        let answer: string | undefined;
        try {
            const messages = [
                {
                    role: 'user' as ChatCompletionRequestMessageRoleEnum,
                    content: prompt,
                },
            ];
            const completionParameters = {
                model: 'gpt-3.5-turbo',
                messages,
            };
            const completion = await this.openai.createChatCompletion(
                completionParameters,
            );
            answer = completion.data.choices[0].message?.content;
        } catch (e) {
            return Promise.reject(e);
        }
        if (answer === undefined) {
            return Promise.reject(
                'Error in ChatModel.complete: Answer from model was undefined.',
            );
        }
        return Promise.resolve(answer);
    }
}

export default ChatModel;

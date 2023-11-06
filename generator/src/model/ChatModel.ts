import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import ChatPrompt from '../prompting/ChatPrompt';
import { CompletionRequestInfo, CompletionResult } from './CompletionResult';
import { calculateRequestCost } from './RequestCostCalculator';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';

class ChatModel {
    generatorConfiguration: GeneratorConfiguration;
    apiConfiguration: Configuration;
    openai: OpenAIApi;

    constructor(generatorConfiguration: GeneratorConfiguration) {
        this.generatorConfiguration = generatorConfiguration;
        this.apiConfiguration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.apiConfiguration);
    }

    async complete(prompt: ChatPrompt): Promise<CompletionResult> {
        let answer: string | undefined;
        let requestInfo: CompletionRequestInfo | undefined;
        try {
            const completionParameters = {
                model: this.generatorConfiguration.content.meta.model,
                messages: prompt.messages,
                temperature: this.generatorConfiguration.content.meta.temperature,
                top_p: this.generatorConfiguration.content.meta.topP,
            };
            const completion = await this.openai.createChatCompletion(completionParameters);
            requestInfo = this.buildRequestInfo(completion.data);
            answer = completion.data.choices[0].message?.content;
        } catch (e) {
            return Promise.reject(e);
        }
        if (answer === undefined) {
            return Promise.reject('Error in ChatModel.complete: Answer from model was undefined.');
        }
        return Promise.resolve({
            answer,
            requestInfo: requestInfo,
            modelConfig: {
                model: this.generatorConfiguration.content.meta.model,
                temperature: this.generatorConfiguration.content.meta.temperature ?? 1,
                topP: this.generatorConfiguration.content.meta.topP ?? 1,
            },
        });
    }

    private buildRequestInfo(response: CreateChatCompletionResponse): CompletionRequestInfo {
        const inTokens = response.usage?.prompt_tokens ?? -1;
        const outTokens = response.usage?.completion_tokens ?? -1;

        let cost: number = -1;
        try {
            cost = calculateRequestCost(
                this.generatorConfiguration.content.meta.model,
                inTokens,
                outTokens,
            );
        } catch {
            console.log('Could not calculate request cost.');
        }
        return {
            inTokens,
            outTokens,
            totalCost: cost,
        };
    }
}

export default ChatModel;

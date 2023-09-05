import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import ChatPrompt from '../prompting/ChatPrompt';
import { CompletionRequestInfo, CompletionResult } from './CompletionResult';
import { calculateRequestCost } from './RequestCostCalculator';

class ChatModel {
    configuration: Configuration;
    openai: OpenAIApi;
    modelName: string;

    constructor(modelName: string) {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);
        this.modelName = modelName;
    }

    async complete(prompt: ChatPrompt): Promise<CompletionResult> {
        let answer: string | undefined;
        let requestInfo: CompletionRequestInfo | undefined;
        try {
            const completionParameters = {
                model: this.modelName,
                messages: prompt.messages,
                temperature: 0,
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
        });
    }

    private buildRequestInfo(response: CreateChatCompletionResponse): CompletionRequestInfo {
        const inTokens = response.usage?.prompt_tokens;
        const outTokens = response.usage?.prompt_tokens;

        if (inTokens === undefined || outTokens === undefined) {
            return {
                totalTokens: 0,
                totalCost: 0,
            };
        }

        const cost = calculateRequestCost(
            this.modelName,
            inTokens,
            outTokens,
        )
        return {
            totalTokens: inTokens + outTokens,
            totalCost: cost,
        }
    }
}

export default ChatModel;

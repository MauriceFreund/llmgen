import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import ChatPrompt from '../prompting/ChatPrompt';
import { CompletionRequestInfo, CompletionResult } from './CompletionResult';
import { calculateRequestCost } from './RequestCostCalculator';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';

class ChatModel {
    generatorConfiguration: GeneratorConfiguration;
    apiConfiguration: Configuration;
    openai: OpenAIApi;
    timeoutId: NodeJS.Timeout | undefined = undefined;
    isInEvalMode: boolean;

    constructor(generatorConfiguration: GeneratorConfiguration, isInEvalMode: boolean) {
        this.generatorConfiguration = generatorConfiguration;
        this.apiConfiguration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.apiConfiguration);
        this.isInEvalMode = isInEvalMode;
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
            const timeoutPromise = new Promise((_, reject) => {
                this.timeoutId = setTimeout(
                    () => {
                        reject(new Error('Reached timeout when requesting openai.'));
                    },
                    2 * 60 * 1000,
                );
            });

            console.log('Sending completion request.');
            console.time('request');
            const completionPromise = this.openai.createChatCompletion(completionParameters);
            const completion = (await Promise.race([completionPromise, timeoutPromise])) as {
                data: CreateChatCompletionResponse;
            };
            if (this.isInEvalMode) {
                console.log(completion);
            }
            if (this.timeoutId !== undefined) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
            console.log('Received completion response.');
            console.timeEnd('request');

            requestInfo = this.buildRequestInfo(completion.data);
            answer = completion.data.choices[0].message?.content;
            console.log('Model answer: ', answer);
        } catch (e) {
            if (this.timeoutId !== undefined) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
            console.error('Encountered error.', e);
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

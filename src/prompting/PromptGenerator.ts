import SystemMessageGenerator from './SystemMessageGenerator';
import ChatPrompt from './ChatPrompt';
import UserMessageGenerator from './UserMessageGenerator';
import GeneratorMemory from '../memory/GeneratorMemory';
import { GeneratorMemoryEntry } from '../memory/GeneratorMemoryEntry';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import { ChatCompletionRequestMessage } from 'openai';

class PromptGenerator {
    private _config: GeneratorConfiguration;
    private _systemMessageGenerator: SystemMessageGenerator;
    private _userMessageGenerator: UserMessageGenerator;

    constructor(config: GeneratorConfiguration) {
        this._config = config;
        this._systemMessageGenerator = new SystemMessageGenerator(config);
        this._userMessageGenerator = new UserMessageGenerator(config);
    }

    generatePrompts(memory: GeneratorMemory): ChatPrompt[] {
        const systemMessage = this._systemMessageGenerator.getMessage();

        const messages = memory.getIncompleteEntries().map((entry) => {
            return this._userMessageGenerator.generateMessage(entry.snippet, entry.metadata);
        });

        return messages.map((message) => new ChatPrompt([systemMessage, message]));
    }

    generatePrompt<T extends OpenApiSnippet>(
        memoryEntry: GeneratorMemoryEntry<T>,
        completedEntries: GeneratorMemoryEntry<T>[] = [],
    ): ChatPrompt {
        const systemMessage = this._systemMessageGenerator.getMessage();
        const previousMessages = completedEntries.flatMap((entry) =>
            this.getMessagesFromCompletedMemoryEntry(entry),
        );
        const message = this._userMessageGenerator.generateMessage(
            memoryEntry.snippet,
            memoryEntry.metadata,
        );
        return new ChatPrompt([systemMessage, ...previousMessages, message]);
    }

    private getMessagesFromCompletedMemoryEntry(
        entry: GeneratorMemoryEntry<OpenApiSnippet>,
    ): ChatCompletionRequestMessage[] {
        const request = this._userMessageGenerator.generateMessage(entry.snippet, entry.metadata);
        const answer: ChatCompletionRequestMessage = {
            role: 'assistant',
            content: entry.answer,
        };
        return [request, answer];
    }
}

export default PromptGenerator;

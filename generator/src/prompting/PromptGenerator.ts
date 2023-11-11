import SystemMessageGenerator from './SystemMessageGenerator';
import ChatPrompt from './ChatPrompt';
import UserMessageGenerator from './UserMessageGenerator';
import GeneratorMemory from '../memory/GeneratorMemory';
import { GeneratorMemoryEntry } from '../memory/GeneratorMemoryEntry';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import { ChatCompletionRequestMessage } from 'openai';

class PromptGenerator {
    private _systemMessageGenerator: SystemMessageGenerator;
    private _userMessageGenerator: UserMessageGenerator;

    constructor() {
        this._systemMessageGenerator = new SystemMessageGenerator();
        this._userMessageGenerator = new UserMessageGenerator();
    }

    generatePrompts(memory: GeneratorMemory): ChatPrompt[] {
        return memory.getIncompleteEntries().map((entry) => {
            const systemMessage = this._systemMessageGenerator.getMessage(entry.entryType);
            const message = this._userMessageGenerator.generateMessage(
                entry.snippet,
                entry.configuration,
                entry.metadata,
            );
            return new ChatPrompt([systemMessage, message]);
        });
    }

    generatePrompt<T extends OpenApiSnippet>(
        memoryEntry: GeneratorMemoryEntry<T>,
        completedEntries: GeneratorMemoryEntry<T>[] = [],
    ): ChatPrompt {
        const systemMessage = this._systemMessageGenerator.getMessage(memoryEntry.entryType);
        const previousMessages = completedEntries.flatMap((entry) =>
            this.getMessagesFromCompletedMemoryEntry(entry),
        );
        const message = this._userMessageGenerator.generateMessage(
            memoryEntry.snippet,
            memoryEntry.configuration,
            memoryEntry.metadata,
        );
        return new ChatPrompt([systemMessage, ...previousMessages, message]);
    }

    private getMessagesFromCompletedMemoryEntry(
        entry: GeneratorMemoryEntry<OpenApiSnippet>,
    ): ChatCompletionRequestMessage[] {
        const request = this._userMessageGenerator.generateMessage(
            entry.snippet,
            entry.configuration,
            entry.metadata,
        );
        const answer: ChatCompletionRequestMessage = {
            role: 'assistant',
            content: entry.answer,
        };
        return [request, answer];
    }
}

export default PromptGenerator;

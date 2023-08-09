import SystemMessageGenerator from './SystemMessageGenerator';
import ChatPrompt from './ChatPrompt';
import UserMessageGenerator from './UserMessageGenerator';
import GeneratorMemory from '../memory/GeneratorMemory';
import { GeneratorMemoryEntry } from '../memory/GeneratorMemoryEntry';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';

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

    generatePrompt(memoryEntry: GeneratorMemoryEntry): ChatPrompt {
        const systemMessage = this._systemMessageGenerator.getMessage();
        const message = this._userMessageGenerator.generateMessage(
            memoryEntry.snippet,
            memoryEntry.metadata,
        );
        return new ChatPrompt([systemMessage, message]);
    }
}

export default PromptGenerator;

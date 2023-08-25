import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';

class ChatPrompt {
    private _messages: ChatCompletionRequestMessage[];

    constructor(messages: ChatCompletionRequestMessage[] | undefined) {
        this._messages = messages ?? [];
    }

    get messages() {
        return this._messages;
    }

    addMessage(message: ChatCompletionRequestMessage) {
        this._messages = [...this.messages, message];
    }

    addSystemMessage(content: string) {
        this.addMessage({ role: 'system', content });
    }

    addAssistantMessage(content: string) {
        this.addMessage({ role: 'assistant', content });
    }

    addUserMessage(content: string) {
        this.addMessage({ role: 'user', content });
    }

    log() {
        const messageStrings = this._messages.map((msg) => {
            const msgString = `${msg.role}: ${msg.content ?? ""}`;
            return msgString
                .replace(/&quot;/g, '"')
                .replace(/&#x2F;/g, '/');
        });
        const promptString = messageStrings.join('\n\n');
        console.log(promptString);
    }
}

export default ChatPrompt;

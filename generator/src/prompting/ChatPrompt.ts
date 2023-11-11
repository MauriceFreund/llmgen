import { ChatCompletionRequestMessage } from 'openai';
import { prettyFormat } from '../util/Utility';

class ChatPrompt {
    private _messages: ChatCompletionRequestMessage[];

    constructor(messages: ChatCompletionRequestMessage[] | undefined) {
        this._messages = messages ?? [];
    }

    get messages() {
        return this._messages.map((msg) => ({ ...msg, content: this.cleanMessage(msg.content) }));
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

    private cleanMessage(msg: string | undefined) {
        return msg?.replace(/&quot;/g, '"').replace(/&#x2F;/g, '/');
    }

    toString() {
        const messageStrings = this._messages.map((msg) => {
            const msgString = `[${msg.role}]:\n${msg.content ?? ''}`;
            return this.cleanMessage(msgString);
        });
        return messageStrings.join(
            '\n------------------------------------------------------------------\n',
        );
    }
}

export default ChatPrompt;

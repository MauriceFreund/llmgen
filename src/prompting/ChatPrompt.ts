import { ChatCompletionRequestMessage } from 'openai';

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
}

export default ChatPrompt;

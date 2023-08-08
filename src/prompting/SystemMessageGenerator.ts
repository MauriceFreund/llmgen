import { ChatCompletionRequestMessage } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

class SystemMessageGenerator {
    private readonly _templatePath: string;

    constructor(templatePath: string) {
        this._templatePath = templatePath;
    }

    async getMessage(): Promise<ChatCompletionRequestMessage> {
        const content = await fs.readFile(path.resolve(this._templatePath));
        return {
            role: 'system',
            content: content.toString(),
        };
    }
}

export default SystemMessageGenerator;

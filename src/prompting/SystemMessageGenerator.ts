import { ChatCompletionRequestMessage } from 'openai';
import * as fs from 'fs';
import path from 'path';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { MemoryEntryType } from '../memory/GeneratorMemoryEntry';
import { getSystemMessageTemplate } from './templating/TemplateSelector';

class SystemMessageGenerator {
    constructor() {}

    getMessage(entryType: MemoryEntryType): ChatCompletionRequestMessage {
        const template = getSystemMessageTemplate(entryType);
        return {
            role: 'system',
            content: template,
        };
    }
}

export default SystemMessageGenerator;

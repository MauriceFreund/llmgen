import { ChatCompletionRequestMessage } from 'openai';
import { MemoryEntryType } from '../memory/GeneratorMemoryEntry';
import { getSystemMessageTemplate } from './templating/TemplateSelector';

class SystemMessageGenerator {
    getMessage(entryType: MemoryEntryType): ChatCompletionRequestMessage {
        return {
            role: 'system',
            content: getSystemMessageTemplate(entryType),
        };
    }
}

export default SystemMessageGenerator;

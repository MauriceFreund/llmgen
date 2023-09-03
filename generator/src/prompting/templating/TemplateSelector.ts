import * as fs from 'fs';
import { MemoryEntryType } from '../../memory/GeneratorMemoryEntry';
import { withBasePath } from '../../util/Utility';

export function getUserMessageTemplate(): string {
    return loadTemplate('/templates/userMessage.mustache');
}

export function getSystemMessageTemplate(entryType: MemoryEntryType): string {
    if (entryType === 'path')
        return loadTemplate('/templates/pathSystemMessage.mustache');

    return loadTemplate('/templates/schemaSystemMessage.mustache');
}

function loadTemplate(templatePath: string): string {
    return fs.readFileSync(withBasePath(templatePath)).toString();
}

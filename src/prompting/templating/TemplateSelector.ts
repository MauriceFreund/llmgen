import * as fs from 'fs';
import path from 'path';
import { MemoryEntryType } from '../../memory/GeneratorMemoryEntry';

export function getUserMessageTemplate(): string {
    return loadTemplate('./src/prompting/templating/templates/userMessage.mustache');
}

export function getSystemMessageTemplate(entryType: MemoryEntryType): string {
    if (entryType === 'path')
        return loadTemplate('./src/prompting/templating/templates/pathSystemMessage.mustache');

    return loadTemplate('./src/prompting/templating/templates/schemaSystemMessage.mustache');
}

function loadTemplate(templatePath: string): string {
    return fs.readFileSync(path.resolve(templatePath)).toString();
}

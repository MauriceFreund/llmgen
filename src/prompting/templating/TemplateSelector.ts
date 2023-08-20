import path from 'path';
import { MemoryEntryType } from '../../memory/GeneratorMemoryEntry';
import * as fs from 'fs';

export function getSystemMessageTemplate(type: MemoryEntryType) {
    if (type == 'path')
        return loadTemplate('./src/prompting/templating/templates/pathSystemTemplate.mustache');
    return loadTemplate('./src/prompting/templating/templates/schemaSystemTemplate.mustache');
}

export function getUserMessageTemplate() {
    return loadTemplate('./src/prompting/templating/templates/userMessage.mustache');
}

function loadTemplate(templatePath: string): string {
    return fs.readFileSync(path.resolve(templatePath)).toString();
}

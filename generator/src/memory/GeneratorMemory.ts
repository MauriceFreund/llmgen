import { GeneratorMemoryEntry, MemoryEntryType } from './GeneratorMemoryEntry';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import {
    OpenApiSpecMetadata,
    PathSnippet,
    SchemaSnippet,
} from '../input/openapi/SpecSplittingOutput';
import OpenApiSpec from '../input/openapi/OpenApiSpec';
import { randomUUID } from 'crypto';
import { prettyFormat } from '../util/Utility';
import * as fs from 'fs';
import path from 'path';

class GeneratorMemory {
    private _entries: Map<string, GeneratorMemoryEntry<OpenApiSnippet>>;
    private readonly _configuration: GeneratorConfiguration;

    constructor(spec: OpenApiSpec, config: GeneratorConfiguration) {
        this._entries = new Map();
        this._configuration = config;
        this.initializeMemory(spec);
    }

    get configuration(): GeneratorConfiguration {
        return this._configuration;
    }

    private initializeMemory(spec: OpenApiSpec) {
        const splitSpec = spec.splitSpec();

        splitSpec.schemas.map((snippet: OpenApiSnippet) => {
            this.saveIncompleteEntry(snippet, 'schema', splitSpec.metadata);
        });
        splitSpec.paths.map((snippet: OpenApiSnippet) => {
            this.saveIncompleteEntry(snippet, 'path', splitSpec.metadata);
        });
    }

    saveIncompleteEntry(
        snippet: OpenApiSnippet,
        entryType: MemoryEntryType,
        metadata: OpenApiSpecMetadata,
    ) {
        const id = randomUUID();
        const newEntry: GeneratorMemoryEntry<OpenApiSnippet> = {
            id,
            snippet,
            metadata,
            entryType,
        };
        this._entries.set(id, newEntry);
    }

    completeEntry(id: string, answer: string): GeneratorMemoryEntry<OpenApiSnippet> {
        const entry = this._entries.get(id);
        if (entry === undefined) {
            throw Error(
                'Error in GeneratorMemory.completeEntry: Could not find entry for completion.',
            );
        }
        const generatedClassName = this.getFileNameFromAnswer(answer);
        const completedEntry = { ...entry, answer, generatedClassName };
        this._entries.set(id, completedEntry);
        return completedEntry;
    }

    getIncompleteEntries(): GeneratorMemoryEntry<OpenApiSnippet>[] {
        return Array.from(this._entries.values()).filter((entry) => entry.answer === undefined);
    }

    getIncompleteSchemaEntries(): GeneratorMemoryEntry<SchemaSnippet>[] {
        return this.getIncompleteEntries()
            .filter((entry) => entry.entryType === 'schema')
            .map((entry) => entry as GeneratorMemoryEntry<SchemaSnippet>);
    }

    getIncompletePathEntries(): GeneratorMemoryEntry<PathSnippet>[] {
        return this.getIncompleteEntries()
            .filter((entry) => entry.entryType === 'path')
            .map((entry) => entry as GeneratorMemoryEntry<PathSnippet>);
    }

    getCompleteEntries(): GeneratorMemoryEntry<OpenApiSnippet>[] {
        return Array.from(this._entries.values()).filter((entry) => entry.answer !== undefined);
    }

    getCompleteSchemaEntries(): GeneratorMemoryEntry<SchemaSnippet>[] {
        return this.getCompleteEntries()
            .filter((entry) => entry.entryType === 'schema')
            .map((entry) => entry as GeneratorMemoryEntry<SchemaSnippet>);
    }

    getCompletePathEntries(): GeneratorMemoryEntry<PathSnippet>[] {
        return this.getCompleteEntries()
            .filter((entry) => entry.entryType === 'path')
            .map((entry) => entry as GeneratorMemoryEntry<PathSnippet>);
    }

    getCompleteEntriesRelevantForSchemaPrompt(): GeneratorMemoryEntry<OpenApiSnippet>[] {
        const schemaSnippets = this.getCompleteSchemaEntries();

        if (schemaSnippets.length > 0) return [schemaSnippets[0]];
        return [];
    }

    getCompleteEntriesRelevantForPathPrompt(
        entry: GeneratorMemoryEntry<PathSnippet>,
    ): GeneratorMemoryEntry<OpenApiSnippet>[] {
        const pathEntries = this.getCompletePathEntries();
        const relevantEntries: GeneratorMemoryEntry<OpenApiSnippet>[] =
            this.getSchemaSnippetsReferencedByPath(entry.snippet);
        if (pathEntries.length > 0) {
            relevantEntries.push(pathEntries[0]);
        }
        return relevantEntries;
    }

    private getSchemaSnippetsReferencedByPath(
        pathSnippet: PathSnippet,
    ): GeneratorMemoryEntry<OpenApiSnippet>[] {
        const completedSchemas = this.getCompleteSchemaEntries();

        return completedSchemas.filter((schema) => {
            if (schema.generatedClassName) {
                return JSON.stringify(pathSnippet).includes(schema.generatedClassName);
            }
            return false;
        });
    }

    private getFileNameFromAnswer(answer: string): string | undefined {
        const match = answer.match(/class (\w+)/);

        if (match && match[1]) {
            return match[1];
        } else {
            return undefined;
        }
    }

    log() {
        const incomplete = this.getIncompleteEntries();
        const complete = this.getCompleteEntries();

        console.log(`**Incomplete Entries (${incomplete.length})**\n`);
        console.log(incomplete.map((entry) => prettyFormat(entry)));

        console.log(`**Complete Entries (${complete.length})**\n`);
        console.log(complete.map((entry) => prettyFormat(entry)));
    }

    dump(targetPath: string) {
        fs.writeFileSync(path.resolve(targetPath), prettyFormat(this.getCompleteEntries()));
    }
}

export default GeneratorMemory;

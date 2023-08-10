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

    completeEntry(id: string, answer: string) {
        const entry = this._entries.get(id);
        if (entry === undefined) {
            throw Error(
                'Error in GeneratorMemory.completeEntry: Could not find entry for completion.',
            );
        }
        this._entries.set(id, { ...entry, answer });
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

    log() {
        const incomplete = this.getIncompleteEntries();
        const complete = this.getCompleteEntries();

        console.log(`**Incomplete Entries (${incomplete.length})**\n`);
        console.log(incomplete.map((entry) => prettyFormat(entry)));

        console.log(`**Complete Entries (${complete.length})**\n`);
        console.log(complete.map((entry) => prettyFormat(entry)));
    }
}

export default GeneratorMemory;

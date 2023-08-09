import { GeneratorMemoryEntry } from './GeneratorMemoryEntry';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import GeneratorConfiguration from '../input/configuration/GeneratorConfiguration';
import { OpenApiSpecMetadata } from '../input/openapi/SpecSplittingOutput';
import OpenApiSpec from '../input/openapi/OpenApiSpec';
import { randomUUID } from 'crypto';
import { prettyFormat } from '../util/Utility';

class GeneratorMemory {
    private _entries: Map<string, GeneratorMemoryEntry>;
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

        const snippets = [...splitSpec.schemas, ...splitSpec.paths];

        snippets.map((snippet: OpenApiSnippet) => {
            this.saveIncompleteEntry(snippet, splitSpec.metadata);
        });
    }

    saveIncompleteEntry(snippet: OpenApiSnippet, metadata: OpenApiSpecMetadata) {
        const id = randomUUID();
        const newEntry: GeneratorMemoryEntry = {
            id,
            snippet,
            metadata,
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

    getIncompleteEntries(): GeneratorMemoryEntry[] {
        return Array.from(this._entries.values()).filter((entry) => entry.answer === undefined);
    }

    getCompleteEntries(): GeneratorMemoryEntry[] {
        return Array.from(this._entries.values()).filter((entry) => entry.answer !== undefined);
    }

    log() {
        console.log('**Incomplete Entries**\n');
        console.log(this.getIncompleteEntries().map((entry) => prettyFormat(entry)));

        console.log('**Complete Entries**');
        console.log(this.getCompleteEntries().map((entry) => prettyFormat(entry)));
    }
}

export default GeneratorMemory;

import { TargetConfiguration } from '../input/configuration/GeneratorConfigurationContent';
import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import {
    OpenApiSpecMetadata,
    PathSnippet,
    SchemaSnippet,
} from '../input/openapi/SpecSplittingOutput';

export type MemoryEntryType = 'schema' | 'path';

export interface GeneratorMemoryEntry<T extends OpenApiSnippet> {
    id: string;
    snippet: T;
    configuration: TargetConfiguration;
    metadata: OpenApiSpecMetadata;
    entryType: MemoryEntryType;
    answer?: string;
    generatedClassName?: string;
}

export interface SchemaEntry extends GeneratorMemoryEntry<SchemaSnippet> {
    snippet: SchemaSnippet;
    entryType: 'schema';
}

export interface PathEntry extends GeneratorMemoryEntry<PathSnippet> {
    snippet: PathSnippet;
    entryType: 'path';
}

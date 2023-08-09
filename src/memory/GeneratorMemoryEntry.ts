import { OpenApiSnippet } from '../input/openapi/OpenApiSpecContent';
import { OpenApiSpecMetadata } from '../input/openapi/SpecSplittingOutput';

export interface GeneratorMemoryEntry {
    id: string;
    snippet: OpenApiSnippet;
    metadata: OpenApiSpecMetadata;
    answer?: string;
}

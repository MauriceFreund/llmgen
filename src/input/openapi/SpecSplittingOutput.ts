import { OpenApiSpecPath, OpenApiSpecSchema } from './OpenApiSpecContent';

export type SchemaSnippet = { [name: string]: OpenApiSpecSchema };
export type PathSnippet = OpenApiSpecPath;

export interface SpecSplittingOutput {
    metadata: OpenApiSpecMetadata;
    schemas: SchemaSnippet[];
    paths: PathSnippet[];
}

export interface OpenApiSpecMetadata {
    baseUrl: string;
}

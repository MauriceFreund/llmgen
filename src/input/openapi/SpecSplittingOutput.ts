import { OpenApiSpecPath, OpenApiSpecSchema } from './OpenApiSpecContent';

export type SplitSchema = { [name: string]: OpenApiSpecSchema };

export interface SpecSplittingOutput {
    metadata: OpenApiSpecMetadata;
    schemas: SplitSchema[];
    paths: OpenApiSpecPath[];
}

export interface OpenApiSpecMetadata {
    baseUrl: string;
}

export interface OpenApiSpecContent {
    openapi: string;
    info: OpenApiSpecInfo;
    components: OpenApiSpecComponents;
    paths: {
        [path: string]: {
            [httpMethod: string]: OpenApiSpecPath;
        };
    };
}

export interface OpenApiSpecInfo {
    title: string;
    version: string;
}

export interface OpenApiSpecComponents {
    schemas: {
        [name: string]: OpenApiSpecSchema;
    };
}

export interface OpenApiSpecSchema {
    type: string;
    properties: {
        [property: string]: OpenApiSpecProperty;
    };
}

export interface OpenApiSpecProperty {
    type: string;
}

export interface OpenApiSpecPath {
    operationId: string;
    tags: string[];
}

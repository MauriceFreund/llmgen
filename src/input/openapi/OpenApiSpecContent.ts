export interface OpenApiSpecContent {
    openapi: string;
    info: OpenApiSpecInfo;
    components: OpenApiSpecComponents;
    paths: {
        [path: string]: {
            [httpMethod: string]: OpenApiSpecPathAttributes;
        };
    };
    servers?: OpenApiSpecServer[];
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

export type OpenApiSpecPath = {
    [path: string]: {
        [httpMethod: string]: OpenApiSpecPathAttributes;
    };
};

export interface OpenApiSpecPathAttributes {
    operationId: string;
    tags: string[];
}

export interface OpenApiSpecServer {
    url: string;
}

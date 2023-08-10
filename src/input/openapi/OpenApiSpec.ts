import { OpenApiSpecContent, OpenApiSpecPath } from './OpenApiSpecContent';
import { OpenApiSpecMetadata, SchemaSnippet, SpecSplittingOutput } from './SpecSplittingOutput';

class OpenApiSpec {
    content: OpenApiSpecContent;

    constructor(openApiSpecContent: OpenApiSpecContent) {
        this.content = openApiSpecContent;
    }

    splitSpec(): SpecSplittingOutput {
        return {
            metadata: this.getMetadata(),
            schemas: this.getSplitSchemas(),
            paths: this.getSplitPaths(),
        };
    }

    private getMetadata(): OpenApiSpecMetadata {
        return {
            baseUrl: this.content.servers?.at(0)?.url ?? '',
        };
    }

    private getSplitSchemas(): SchemaSnippet[] {
        const schemas = this.content.components.schemas;
        return Object.keys(schemas).map((key) => ({ [key]: schemas[key] }));
    }

    private getSplitPaths(): OpenApiSpecPath[] {
        const paths = this.content.paths;
        return Object.keys(paths).flatMap((pathUrl) => {
            const httpMethods = Object.keys(this.content.paths[pathUrl]);
            return httpMethods.map((method) => ({
                [pathUrl]: {
                    [method]: this.content.paths[pathUrl][method],
                },
            }));
        });
    }
}

export default OpenApiSpec;

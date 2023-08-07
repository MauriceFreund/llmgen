import { OpenApiSpecContent } from './OpenApiSpecContent';

class OpenApiSpec {
    content: OpenApiSpecContent;

    constructor(openApiSpecContent: OpenApiSpecContent) {
        this.content = openApiSpecContent;
    }
}

export default OpenApiSpec;

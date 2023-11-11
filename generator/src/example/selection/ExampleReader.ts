import path from 'path';
import * as fs from 'fs';
import { TargetConfiguration } from '../../input/configuration/GeneratorConfigurationContent';
import {
    OpenApiSpecMetadata,
    PathSnippet,
    SchemaSnippet,
} from '../../input/openapi/SpecSplittingOutput';
import { OpenApiSnippet } from '../../input/openapi/OpenApiSpecContent';
import { Example } from './Example';
import { randomUUID } from 'crypto';
import { GeneratorMemoryEntry } from '../../memory/GeneratorMemoryEntry';
import GeneratorConfiguration from '../../input/configuration/GeneratorConfiguration';
import { withBasePath } from '../../util/Utility';

class ExampleReader {
    private _config: GeneratorConfiguration;
    private _examplePoolPath: string;
    private _exampleFileExtension: '.js' | '.py' | '.java';

    constructor(config: GeneratorConfiguration) {
        this._config = config;
        switch (config.content.generator.targetLanguage) {
            case 'Java':
                this._exampleFileExtension = '.java';
                this._examplePoolPath = withBasePath('example_pool/java');
                break;
            case 'Python':
                this._exampleFileExtension = '.py';
                this._examplePoolPath = withBasePath('example_pool/python');
                break;
            case 'JavaScript':
                this._exampleFileExtension = '.js';
                this._examplePoolPath = withBasePath('example_pool/js');
                break;
        }
    }

    readExamples(nextInputSnippet: OpenApiSnippet): Example<OpenApiSnippet>[] {
        const nextInputRequiresInheritance =
            this.openApiSnippetRequiresInheritance(nextInputSnippet);
        const examples = [...this.readSchemas(), ...this.readPaths()].filter(
            (ex) =>
                this.openApiSnippetRequiresInheritance(ex.entry.snippet) ===
                nextInputRequiresInheritance,
        );
        const maxMatchScore = Math.max(...examples.map((ex) => this.exampleMatchScore(ex.config)));

        if (maxMatchScore === 0) return [];

        const bestMatches = examples.filter(
            (ex) => this.exampleMatchScore(ex.config) === maxMatchScore,
        );

        console.info(
            `Found ${bestMatches.length} examples with matching configuration score of ${maxMatchScore}.`,
        );

        return bestMatches;
    }

    private exampleMatchScore(exampleConfig: TargetConfiguration): number {
        if (exampleConfig.targetLanguage !== this._config.content.generator.targetLanguage) {
            return 0;
        }

        const exampleKeys = Object.keys(exampleConfig) as (keyof TargetConfiguration)[];
        const configKeys = Object.keys(
            this._config.content.generator,
        ) as (keyof TargetConfiguration)[];

        return exampleKeys.filter(
            (key) =>
                configKeys.includes(key) &&
                exampleConfig[key] === this._config.content.generator[key],
        ).length;
    }

    private openApiSnippetRequiresInheritance(snippet: OpenApiSnippet): boolean {
        const snippetContent = JSON.stringify(snippet);
        return snippetContent.includes('allOf') || snippetContent.includes('oneOf');
    }

    readSchemas(): Example<SchemaSnippet>[] {
        const schemaPath = path.resolve(this._examplePoolPath + '/schemas');
        const schemaLocations = fs.readdirSync(schemaPath);
        return schemaLocations
            .filter((schemaFileName) => schemaFileName.startsWith('s'))
            .map((schemaFileName) => {
                const config = this.readConfig(this.configFilePath(schemaPath, schemaFileName));
                const metadata = this.readMetadata(
                    this.metadataFilePath(schemaPath, schemaFileName),
                );
                const snippet = this.readSnippet(
                    this.snippetFilePath(schemaPath, schemaFileName),
                ) as SchemaSnippet;
                const answer = this.readAnswer(schemaPath, schemaFileName);

                const entry: GeneratorMemoryEntry<SchemaSnippet> = {
                    id: randomUUID(),
                    configuration: config,
                    metadata,
                    snippet,
                    answer,
                    entryType: 'schema',
                };

                return {
                    config,
                    entry,
                };
            });
    }

    private configFilePath(exampleLocationPath: string, exampleId: string): string {
        return exampleLocationPath + `/${exampleId}/${exampleId}_config.json`;
    }

    private metadataFilePath(exampleLocationPath: string, exampleId: string): string {
        return exampleLocationPath + `/${exampleId}/${exampleId}_metadata.json`;
    }

    private snippetFilePath(exampleLocationPath: string, exampleId: string): string {
        return exampleLocationPath + `/${exampleId}/${exampleId}_openapi.json`;
    }

    readPaths(): Example<PathSnippet>[] {
        const pathsPath = path.resolve(this._examplePoolPath + '/paths');
        const pathLocations = fs.readdirSync(this._examplePoolPath + '/paths');
        return pathLocations
            .filter((pathFileName) => pathFileName.startsWith('p'))
            .map((pathFileName) => {
                const config = this.readConfig(this.configFilePath(pathsPath, pathFileName));
                const metadata = this.readMetadata(this.metadataFilePath(pathsPath, pathFileName));
                const snippet = this.readSnippet(
                    this.snippetFilePath(pathsPath, pathFileName),
                ) as PathSnippet;
                const answer = this.readAnswer(pathsPath, pathFileName);

                const entry: GeneratorMemoryEntry<PathSnippet> = {
                    id: randomUUID(),
                    configuration: config,
                    metadata,
                    snippet,
                    answer,
                    entryType: 'path',
                };

                return {
                    config,
                    entry,
                };
            });
    }

    readConfig(configPath: string): TargetConfiguration {
        const configContent = fs.readFileSync(configPath).toString();
        return JSON.parse(configContent) as TargetConfiguration;
    }

    readMetadata(metadataPath: string): OpenApiSpecMetadata {
        const metadataContent = fs.readFileSync(metadataPath).toString();
        return JSON.parse(metadataContent) as OpenApiSpecMetadata;
    }

    readSnippet(snippetPath: string): OpenApiSnippet {
        const snippetContent = fs.readFileSync(snippetPath).toString();
        return JSON.parse(snippetContent) as OpenApiSnippet;
    }

    readAnswer(exampleLocationPath: string, exampleId: string): string {
        const answerFileName = exampleLocationPath + `/${exampleId}/${exampleId}_output`;
        return fs.readFileSync(answerFileName + this._exampleFileExtension).toString();
    }
}

export default ExampleReader;

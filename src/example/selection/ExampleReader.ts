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

class ExampleReader {
    private _examplePoolPath = path.resolve('src/example/pool/');
    private _validAnswerFileExtensions = ['.js', '.py', '.java'];

    readExamples(): Example<OpenApiSnippet>[] {
        return [...this.readSchemas(), ...this.readPaths()];
    }

    readSchemas(): Example<SchemaSnippet>[] {
        const schemaPath = path.resolve(this._examplePoolPath + '/schemas');
        const schemaLocations = fs.readdirSync(schemaPath);
        return schemaLocations.map((schemaFileName) => {
            const config = this.readConfig(this.configFilePath(schemaPath, schemaFileName));
            const metadata = this.readMetadata(this.metadataFilePath(schemaPath, schemaFileName));
            const snippet = this.readSnippet(
                this.snippetFilePath(schemaPath, schemaFileName),
            ) as SchemaSnippet;
            const answer = this.readAnswer(schemaPath, schemaFileName);

            const entry: GeneratorMemoryEntry<SchemaSnippet> = {
                id: randomUUID(),
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
        return pathLocations.map((pathFileName) => {
            const config = this.readConfig(this.configFilePath(pathsPath, pathFileName));
            const metadata = this.readMetadata(this.metadataFilePath(pathsPath, pathFileName));
            const snippet = this.readSnippet(
                this.snippetFilePath(pathsPath, pathFileName),
            ) as PathSnippet;
            const answer = this.readAnswer(pathsPath, pathFileName);

            const entry: GeneratorMemoryEntry<PathSnippet> = {
                id: randomUUID(),
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
        let content: string | undefined;
        for (const extensionCandidate of this._validAnswerFileExtensions) {
            try {
                content = fs.readFileSync(answerFileName + extensionCandidate).toString();
            } catch (e) {}
        }
        if (content === undefined) {
            throw Error(
                `Error in ExampleReader.readAnswer: No output file with name ${answerFileName} and valid` +
                    `file extension was found. Valid extensions are ${this._validAnswerFileExtensions}`,
            );
        }
        return content;
    }
}

export default ExampleReader;

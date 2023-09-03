import { OpenApiSnippet } from '../../input/openapi/OpenApiSpecContent';
import { TargetConfiguration } from '../../input/configuration/GeneratorConfigurationContent';
import { GeneratorMemoryEntry } from '../../memory/GeneratorMemoryEntry';

export interface Example<T extends OpenApiSnippet> {
    config: TargetConfiguration;
    entry: GeneratorMemoryEntry<T>;
}

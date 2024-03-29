export interface GeneratorConfigurationContent {
    meta: MetaConfiguration;
    generator: TargetConfiguration;
}

export interface MetaConfiguration {
    model: string;
    temperature?: number;
    topP?: number;
    inputPaths: MetaConfigurationInputPaths;
    outputDir: string;
}

export interface TargetConfiguration {
    targetLanguage: 'Python' | 'JavaScript' | 'Java';
    comments: boolean;
    javaPackagePrefix?: string;
}

export interface MetaConfigurationInputPaths {
    openApi: string;
}

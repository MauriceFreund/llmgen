export interface GeneratorConfigurationContent {
    meta: MetaConfiguration;
    generator: TargetConfiguration;
}

export interface MetaConfiguration {
    model: string;
    inputPaths: MetaConfigurationInputPaths;
    outputDir: string;
}

export interface TargetConfiguration {
    targetLanguage: 'Python' | 'JavaScript' | 'Java';
    comments: boolean;
}

export interface MetaConfigurationInputPaths {
    openApi: string;
}

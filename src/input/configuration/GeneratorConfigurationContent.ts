export interface GeneratorConfigurationContent {
    meta: MetaConfiguration;
    generator: TargetConfiguration;
}

export interface MetaConfiguration {
    model: string;
    inputPaths: MetaConfigurationInputPaths;
}

export interface TargetConfiguration {
    targetLanguage: 'Python' | 'JavaScript' | 'Java';
}

export interface MetaConfigurationInputPaths {
    openApi: string;
    systemMessageTemplate: string;
    userMessageTemplate: string;
}

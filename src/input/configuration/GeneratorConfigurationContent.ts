export interface GeneratorConfigurationContent {
    meta: MetaConfiguration;
    generator: TargetConfiguration;
}

export interface MetaConfiguration {
    model: string;
}

export interface TargetConfiguration {
    targetLanguage: 'Python' | 'JavaScript' | 'Java';
}

export interface CompletionResult {
    answer: string;
    requestInfo: CompletionRequestInfo;
    modelConfig: CompletionModelConfig;
}

export interface CompletionModelConfig {
    model: string;
    temperature: number;
    topP: number;
}

export interface CompletionRequestInfo {
    totalCost: number;
    inTokens: number;
    outTokens: number;
}

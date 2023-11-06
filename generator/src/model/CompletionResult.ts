export interface CompletionResult {
    answer: string;
    requestInfo: CompletionRequestInfo;
}

export interface CompletionRequestInfo {
    totalCost: number;
    inTokens: number;
    outTokens: number;
}

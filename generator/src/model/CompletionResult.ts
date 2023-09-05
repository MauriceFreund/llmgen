export interface CompletionResult {
    answer: string,
    requestInfo: CompletionRequestInfo,
}

export interface CompletionRequestInfo {
    totalTokens: number,
    totalCost: number,
}

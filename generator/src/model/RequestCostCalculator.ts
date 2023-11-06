interface ModelPrices {
    inTokenPrice: number;
    outTokenPrice: number;
}

const modelToPrices = new Map<string, ModelPrices>()
    .set('gpt-3.5-turbo', { inTokenPrice: 0.0015, outTokenPrice: 0.002 })
    .set('gpt-3.5-turbo-16k', { inTokenPrice: 0.003, outTokenPrice: 0.004 })
    .set('gpt-4', { inTokenPrice: 0.03, outTokenPrice: 0.06 });

export function calculateRequestCost(modelName: string, inTokens: number, outTokens: number) {
    const prices = modelToPrices.get(modelName);

    if (prices === undefined) {
        throw Error(
            `calculateRequestCost: Could not calculate prices for request since prices for model ${modelName} are unknown.`,
        );
    }

    return (inTokens / 1000) * prices.inTokenPrice + (outTokens / 1000) * prices.outTokenPrice;
}

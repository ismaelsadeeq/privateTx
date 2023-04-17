export interface PeelingTransactionResponse {
    status: boolean;
    index: number;
    error?: string;
}
export declare const peelingTransaction: (psbtBase64: string) => PeelingTransactionResponse;

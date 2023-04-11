export interface peelingTransactionResponse {
    status: boolean;
    index: number;
}
export declare const peelingTransaction: (psbtBase64: string) => peelingTransactionResponse;

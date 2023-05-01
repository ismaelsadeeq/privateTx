import * as bitcoin from 'bitcoinjs-lib';
export interface Input {
    txid: string;
    n: number;
    script: string;
    sequence: number;
    witness: string[];
}
export interface GetTransactionInputResponse {
    status: boolean;
    data?: Input[];
    error?: string;
}
export declare const getTransactionInputs: (transaction: bitcoin.Transaction) => GetTransactionInputResponse;

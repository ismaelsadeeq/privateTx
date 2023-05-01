import * as bitcoin from 'bitcoinjs-lib';
export interface DecodeRawTransactionResponse {
    status: boolean;
    error?: any;
    transaction?: bitcoin.Transaction;
}
export declare const decodeRawTransaction: (rawTransaction: string) => DecodeRawTransactionResponse;

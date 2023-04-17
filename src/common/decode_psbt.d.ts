import * as bitcoin from 'bitcoinjs-lib';
interface DecodePSBTResponse {
    status: boolean;
    data?: bitcoin.Psbt;
    error?: string;
}
export declare const decodePsbt: (psbtBase64: string) => DecodePSBTResponse;
export {};

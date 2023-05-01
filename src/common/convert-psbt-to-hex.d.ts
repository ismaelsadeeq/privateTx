export interface ConvertPsbtToHexResponse {
    status: boolean;
    error?: string;
    transactionHex?: string;
}
export declare const convertPsbtToHex: (psbtBase64: string) => ConvertPsbtToHexResponse;

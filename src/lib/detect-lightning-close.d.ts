export interface DetectLightningChannelCloseResponse {
    status: boolean;
    inputs?: number[];
    error?: string;
}
export declare const detectLightningChannelClose: (transactionHex: string) => DetectLightningChannelCloseResponse;
export declare const detectLightningChannelClosePsbt: (psbtBase64: string) => DetectLightningChannelCloseResponse;

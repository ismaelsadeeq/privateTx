export declare const SATOSHI = 100000000;
interface DetectChangeResponse {
    status: boolean;
    heuristic: string;
    changeOutputIndices: number[];
}
export declare const detectChange: (psbtBase64: string) => DetectChangeResponse;
export declare const getChangeFromReusedAddresses: (psbtBase64: string) => DetectChangeResponse;
export {};

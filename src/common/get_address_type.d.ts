interface GetAddressTypeResponse {
    status: boolean;
    error?: string;
    data?: string;
}
export declare const getAddressType: (address: string) => GetAddressTypeResponse;
export {};

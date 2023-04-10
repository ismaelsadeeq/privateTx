export interface AddressReuseResponse {
    status: boolean;
    data: reusedInsAndOuts[];
}
export interface reusedInsAndOuts {
    vin: number;
    vout: number;
}
export declare const checkAddressReuse: (psbtBase64: string) => AddressReuseResponse;

export interface AddressReuseResponse {
    status: boolean;
    data: ReusedInputsAndOutPuts[];
    error?: string;
}
export interface ReusedInputsAndOutPuts {
    vin: number;
    vout: number;
}
export declare const checkAddressReuse: (psbtBase64: string) => AddressReuseResponse;

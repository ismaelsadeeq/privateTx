import * as bitcoin from 'bitcoinjs-lib';
interface GetAddressTypeResponse {
  status: boolean,
  error?: string,
  data?: string
}

export const getAddressType = (address: string): GetAddressTypeResponse => {
  try {
    const decodedAddress = bitcoin.address.fromBase58Check(address);
    return {
      status: true,
      data: decodedAddress.version.toString(),
    };
  } catch {
    return tryBech32Decode(address);
  }
};

const tryBech32Decode = (address: string): GetAddressTypeResponse => {
  try {
    const decodedAddress = bitcoin.address.fromBech32(address);
    return {
      status: true,
      data: `${decodedAddress.prefix}${decodedAddress.version}`,
    };
  } catch {
    return {
      status: false,
      data:"",
      error: 'Invalid address string',
    };
  }
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressType = void 0;
const bitcoin = require("bitcoinjs-lib");
const getAddressType = (address) => {
    try {
        const decodedAddress = bitcoin.address.fromBase58Check(address);
        return {
            status: true,
            data: decodedAddress.version.toString(),
        };
    }
    catch {
        return tryBech32Decode(address);
    }
};
exports.getAddressType = getAddressType;
const tryBech32Decode = (address) => {
    try {
        const decodedAddress = bitcoin.address.fromBech32(address);
        return {
            status: true,
            data: `${decodedAddress.prefix}${decodedAddress.version}`,
        };
    }
    catch {
        return {
            status: false,
            data: "",
            error: 'Invalid address string',
        };
    }
};

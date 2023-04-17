"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePsbt = void 0;
const bitcoin = require("bitcoinjs-lib");
const decodePsbt = (psbtBase64) => {
    try {
        const psbtBuffer = Buffer.from(psbtBase64, 'base64');
        const psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);
        return {
            status: true,
            data: psbt,
        };
    }
    catch (error) {
        return {
            status: false,
            error: 'Invalid PSBT string'
        };
    }
};
exports.decodePsbt = decodePsbt;

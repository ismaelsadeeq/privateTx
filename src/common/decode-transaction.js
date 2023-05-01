"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRawTransaction = void 0;
const bitcoin = require("bitcoinjs-lib");
// Define the decodeRawTransaction which decodes a raw transaction hex to a standard Transaction
const decodeRawTransaction = (rawTransaction) => {
    try {
        // Decode the raw transaction
        const tx = bitcoin.Transaction.fromHex(rawTransaction);
        // Return the decoded transaction object
        return {
            status: true,
            transaction: tx
        };
    }
    catch (err) {
        // If an error occurred, return an error response with the error message
        return {
            status: false,
            error: err
        };
    }
};
exports.decodeRawTransaction = decodeRawTransaction;

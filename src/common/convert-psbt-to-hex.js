"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPsbtToHex = void 0;
const decode_psbt_1 = require("../common/decode_psbt");
// Define the function to convert a base64-encoded PSBT to transaction hex
const convertPsbtToHex = (psbtBase64) => {
    try {
        // Decode the base64-encoded PSBT
        const decodedPsbt = (0, decode_psbt_1.decodePsbt)(psbtBase64);
        // Check for errors in decoding the PSBT
        if (!decodedPsbt.status || !decodedPsbt.data) {
            return {
                status: false,
                error: decodedPsbt.error,
            };
        }
        // Get the PSBT object from the decoded PSBT data
        const psbt = decodedPsbt.data;
        // Extract the transaction hex from the PSBT object
        const transactionHex = psbt.extractTransaction(true).toHex();
        // Return the transaction hex in the response
        return {
            status: true,
            transactionHex: transactionHex
        };
    }
    catch (err) {
        // Return error if any exception occurs
        return {
            status: false,
            error: JSON.stringify(err)
        };
    }
};
exports.convertPsbtToHex = convertPsbtToHex;

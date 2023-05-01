"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLightningChannelClosePsbt = exports.detectLightningChannelClose = void 0;
const convert_psbt_to_hex_1 = require("../common/convert-psbt-to-hex");
const get_inputs_1 = require("../common/get-inputs");
const decode_transaction_1 = require("../common/decode-transaction");
const script_1 = require("bitcoinjs-lib/src/script");
const OP_0 = "OP_0";
// Function to detect a 2-of-2 multisig input in legacy format
const detectLegacy2Of2Multisig = (scriptSig) => {
    const script = scriptSig.split(' ');
    // Check length and OP_0
    if (script.length !== 3 || script[0] !== OP_0) {
        return false;
    }
    // Check signature format
    try {
        const isValid1stSig = (0, script_1.isCanonicalScriptSignature)(Buffer.from(script[1], 'hex'));
        const isValid2ndSig = (0, script_1.isCanonicalScriptSignature)(Buffer.from(script[2], 'hex'));
        return isValid1stSig && isValid2ndSig;
    }
    catch (error) {
        return false;
    }
};
// Function to detect a 2-of-2 multisig input in witness format
const detect2Of2Multisig = (scriptSig) => {
    // Not implemented yet
    return scriptSig.length < 0;
};
// Function to detect lightning channel close inputs
const detectLightningChannelClose = (transactionHex) => {
    // Decode the transaction
    const transaction = (0, decode_transaction_1.decodeRawTransaction)(transactionHex);
    if (!transaction.status) {
        return { status: false, error: transaction.error };
    }
    // Get the transaction inputs
    const inputs = (0, get_inputs_1.getTransactionInputs)(transaction.transaction);
    if (!inputs.status) {
        return { status: false, error: inputs.error };
    }
    // Find the indices of inputs that are 2-of-2 multisig
    const multisigInputIndices = [];
    for (let i = 0; i < inputs.data.length; i++) {
        // Check for 2-of-2 multisig input in legacy format
        if (inputs.data[i].script.length > 0) {
            const isLegacy2Of2Multisig = detectLegacy2Of2Multisig(inputs.data[i].script);
            if (isLegacy2Of2Multisig) {
                multisigInputIndices.push(i);
            }
        }
        // Check for 2-of-2 multisig input in witness format
        const isWitness2Of2Multisig = detect2Of2Multisig(inputs.data[i].witness);
        if (isWitness2Of2Multisig) {
            multisigInputIndices.push(i);
        }
    }
    // Return the result
    return {
        status: multisigInputIndices.length > 0,
        inputs: multisigInputIndices,
    };
};
exports.detectLightningChannelClose = detectLightningChannelClose;
// Function to detect lightning channel close inputs in PSBT format
const detectLightningChannelClosePsbt = (psbtBase64) => {
    // Convert PSBT to transaction hex
    const transactionHex = (0, convert_psbt_to_hex_1.convertPsbtToHex)(psbtBase64);
    if (transactionHex.status === false) {
        return { status: false, error: transactionHex.error };
    }
    // Detect lightning channel close inputs
    return (0, exports.detectLightningChannelClose)(transactionHex.transactionHex);
};
exports.detectLightningChannelClosePsbt = detectLightningChannelClosePsbt;

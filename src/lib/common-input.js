"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonInputs = void 0;
const bitcoin = require("bitcoinjs-lib");
const decode_psbt_1 = require("../common/decode_psbt");
const commonInputs = (psbtBase64) => {
    // Decode the base64-encoded PSBT
    const decodedPsbt = (0, decode_psbt_1.decodePsbt)(psbtBase64);
    //Error check  
    if (!decodedPsbt.status || !decodedPsbt.data)
        return false;
    const psbt = decodedPsbt.data;
    // Get the transaction's inputs
    const inputs = psbt.data.inputs;
    // Get the transaction's outputs 
    const outputs = psbt.txOutputs;
    //  Edge cases
    if (outputs.length === 1 || inputs.length === 1) {
        return true;
    }
    // Get the amount of the inputs
    const inputAmounts = [];
    for (let i = 0; i < inputs.length; i++) {
        // `vout` is the UTXO index of the input
        let vout = psbt.txInputs[i].index;
        //  Get the hex representation of the serialized input transaction
        let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
        // Decode the serialied transaction
        let tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined;
        if (tx) {
            inputAmounts.push(tx.outs[vout].value);
        }
    }
    // Ensure PSBT is processed and the amounts are added
    // Else return false
    if (inputAmounts.length === 0)
        return false;
    // Get the amount of the outputs
    const outputAmounts = outputs.map(output => output.value);
    // Sort the inputs and outputs in ascending order
    outputAmounts.sort((a, b) => a - b);
    inputAmounts.sort((a, b) => a - b);
    let result = true;
    for (let i = 0; i < outputAmounts.length; i++) {
        for (let j = 0; j < inputAmounts.length; j++) {
            // Check if the output amount is less than or equal to the input.
            // If yes, then the input is enough to spend the output.
            // Other inputs might not be from the same wallet. If it's greater
            // than the input, then the output is likely to be from the same wallet.
            if (outputAmounts[i] <= inputAmounts[j]) {
                result = false;
            }
            else {
                result = true;
            }
        }
    }
    return result;
};
exports.commonInputs = commonInputs;

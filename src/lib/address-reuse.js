"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddressReuse = void 0;
const bitcoin = require("bitcoinjs-lib");
const decode_psbt_1 = require("../common/decode_psbt");
const get_address_1 = require("../common/get_address");
const checkAddressReuse = (psbtBase64) => {
    const reusedAddressAndInputs = [];
    // Decode the base64-encoded PSBT
    // Error check
    const decodedPsbt = (0, decode_psbt_1.decodePsbt)(psbtBase64);
    if (!decodedPsbt.status || !decodedPsbt.data) {
        return {
            status: false,
            data: [],
            error: decodedPsbt.error,
        };
    }
    const psbt = decodedPsbt.data;
    // Get the transaction's inputs address
    const inputs = psbt.data.inputs;
    const inputsAddresses = [];
    for (let i = 0; i < inputs.length; i++) {
        // `vout` is the UTXO index of the input
        const vout = psbt.txInputs[i].index;
        // Get the hex representation of the serialized input transaction
        const serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
        // Decode the serialied transaction
        const tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined;
        // Convert the scriptPubKey of the input UTXO to an address
        const address = tx ? (0, get_address_1.getAddress)(tx.outs[vout].script) : "";
        inputsAddresses.push(address);
    }
    // Get the transaction's outputs address
    const outputs = psbt.txOutputs;
    const outputsAddress = outputs.map(output => {
        return (0, get_address_1.getAddress)(output.script);
    });
    // Check for address reuse
    for (let i = 0; i < inputsAddresses.length; i++) {
        const inputAddress = inputsAddresses[i];
        // Compare input address with all output addresses to check for a match
        for (let j = 0; j < outputsAddress.length; j++) {
            if (inputAddress == outputsAddress[j]) {
                let reuse = {
                    vin: i,
                    vout: j // Index of the output
                };
                reusedAddressAndInputs.push(reuse);
            }
        }
    }
    return {
        status: reusedAddressAndInputs.length > 0,
        data: reusedAddressAndInputs
    };
};
exports.checkAddressReuse = checkAddressReuse;

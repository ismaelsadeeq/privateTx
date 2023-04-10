"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddressReuse = void 0;
const bitcoin = require("bitcoinjs-lib");
const buffer_1 = require("buffer");
const checkAddressReuse = (psbtBase64) => {
    // Decode the base64-encoded PSBT
    const psbtBuffer = buffer_1.Buffer.from(psbtBase64, 'base64');
    const psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);
    // Get the transactions inputs addresses
    const inputs = psbt.data.inputs;
    let inputAddresses = [];
    for (let i = 0; i < inputs.length; i++) {
        // vout is the UTXO index of the input
        let vout = psbt.txInputs[i].index;
        //  Get the hex representation of the serialized input transaction
        let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
        // Decode the serialied transaction
        let tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined;
        // convert the scriptpubkey of the input UTXO to an address
        let address = tx ? bitcoin.address.fromOutputScript(tx.outs[vout].script) : "";
        inputAddresses.push(address);
    }
    // Get the transactions outputs addresses
    const outputs = psbt.txOutputs;
    let outputAddresses = [];
    for (let i = 0; i < outputs.length; i++) {
        // convert the scriptpubkey of the output to an address
        let address = bitcoin.address.fromOutputScript(outputs[i].script);
        outputAddresses.push(address);
    }
    let response = {
        status: false,
        data: []
    };
    // check for address reuse
    for (let i = 0; i < inputAddresses.length; i++) {
        for (let j = 0; j < outputAddresses.length; j++) {
            if (inputAddresses[i] == outputAddresses[j]) {
                response.status = true;
                let reuse = {
                    vin: i,
                    vout: j
                };
                response.data.push(reuse);
            }
        }
    }
    return response;
};
exports.checkAddressReuse = checkAddressReuse;

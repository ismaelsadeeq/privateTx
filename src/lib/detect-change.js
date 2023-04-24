"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangeFromReusedAddresses = exports.detectChange = exports.SATOSHI = void 0;
const bitcoin = require("bitcoinjs-lib");
const peeling_1 = require("./peeling");
const address_reuse_1 = require("./address-reuse");
const decode_psbt_1 = require("../common/decode_psbt");
const get_address_type_1 = require("../common/get_address_type");
const get_address_1 = require("../common/get_address");
exports.SATOSHI = 100000000;
const NO_PAYMENT_OUTPUTS = 0;
const detectChange = (psbtBase64) => {
    const response = {
        status: false,
        changeOutputIndices: []
    };
    // Decode the base64-encoded PSBT
    const decodedPsbt = (0, decode_psbt_1.decodePsbt)(psbtBase64);
    // Error check  
    if (!decodedPsbt.status || !decodedPsbt.data) {
        return {
            status: false,
            changeOutputIndices: [],
            error: decodedPsbt.error,
        };
    }
    const psbt = decodedPsbt.data;
    const outputs = psbt.txOutputs;
    // Edge case
    if (outputs.length === 1) {
        return response;
    }
    // Detect change outputs from address reuse
    const reusedAddressOutputs = (0, exports.getChangeFromReusedAddresses)(psbtBase64);
    if (reusedAddressOutputs.status) {
        return reusedAddressOutputs;
    }
    // Detect change outputs from outputs with the same script type with inputs
    const sameScriptTypeOutputs = getChangeOutputsFromSameScriptType(psbt);
    if (sameScriptTypeOutputs.status) {
        return sameScriptTypeOutputs;
    }
    // Detect change outputs from output value that is greater than all the inputs.
    const outputGreaterThanAllInputs = getOutputGreaterThanAllInputs(psbt);
    if (outputGreaterThanAllInputs.status) {
        return outputGreaterThanAllInputs;
    }
    // Detect change from non round value outputs in bitcoin not satoshi
    const nonRoundValueOutputs = getNonRoundValueOutputs(psbt);
    if (nonRoundValueOutputs.status) {
        return nonRoundValueOutputs;
    }
    // Detect change from the largest output value
    const largestOutput = getlargestOutput(psbt);
    if (largestOutput.status) {
        return largestOutput;
    }
    return response;
};
exports.detectChange = detectChange;
const getChangeFromReusedAddresses = (psbtBase64) => {
    // Initialize a new DetectChangeResponse object with default values
    let response = {
        status: false,
        changeOutputIndices: []
    };
    // Detect change from address reuse by calling the checkAddressReuse function
    const reusedAddresses = (0, address_reuse_1.checkAddressReuse)(psbtBase64);
    // If address reuse is detected, extract the change output indices and update the response object
    if (reusedAddresses.status) {
        // Initialize a new Set object to store the unique change output indices
        const changes = new Set();
        // Extract the vout property from each reusedInputsAndOutputs object and add it to the change output set
        reusedAddresses.data.map((reusedInputsAndOutputs) => {
            changes.add(reusedInputsAndOutputs.vout);
        });
        // Update the response object with the detected change output indices and return it
        response.status = true;
        response.heuristic = "Address reuse";
        response.changeOutputIndices = Array.from(changes);
        return response;
    }
    // If no address reuse is detected, return the default response object
    return response;
};
exports.getChangeFromReusedAddresses = getChangeFromReusedAddresses;
const getChangeOutputsFromSameScriptType = (psbt) => {
    let response = {
        status: false,
        changeOutputIndices: []
    };
    // Get the transactions inputs addresses
    const inputs = psbt.data.inputs;
    let inputAddresses = [];
    for (let i = 0; i < inputs.length; i++) {
        // vout is the UTXO index of the input
        let vout = psbt.txInputs[i].index;
        //  Get the hex representation of the serialized input transaction
        let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
        // Decode the serialied transaction
        let tx = serializedTx && bitcoin.Transaction.fromHex(serializedTx);
        // convert the scriptpubkey of the input UTXO to an address
        let address = tx ? (0, get_address_1.getAddress)(tx.outs[vout].script) : "";
        inputAddresses.push(address);
    }
    // Get the transactions outputs addresses
    const outputs = psbt.txOutputs;
    const outputAddresses = outputs.map(output => {
        return (0, get_address_1.getAddress)(output.script);
    });
    // Initialize the address type variable
    let inputsAddressType = "";
    // Loop through all the input addresses to find type
    for (const address of inputAddresses) {
        const currentInputAddressType = (0, get_address_type_1.getAddressType)(address);
        if (inputsAddressType != "" && inputsAddressType != currentInputAddressType.data || !currentInputAddressType.status) {
            return response;
        }
        inputsAddressType = currentInputAddressType.data;
    }
    // Initialize change and payment outputs
    let changeOutputs = [];
    let paymentOutputs = [];
    // Map through all the outputs
    for (const address of outputAddresses) {
        const outputAddressType = (0, get_address_type_1.getAddressType)(address);
        // If the address type is the same if the input address type
        if (inputsAddressType == outputAddressType.data) {
            // it is as a change output
            changeOutputs.push(address);
        }
        else {
            // it is as a payment output
            paymentOutputs.push(address);
        }
    }
    // if there are no payments detected return
    if (paymentOutputs.length == NO_PAYMENT_OUTPUTS) {
        return response;
    }
    let changeOutputsIndexes = [];
    // Loop through all the change outputs and get it's index
    for (let i = 0; i < changeOutputs.length; i++) {
        for (let j = 0; j < outputs.length; j++) {
            if (changeOutputs[i] === outputs[j].address) {
                changeOutputsIndexes.push(j);
            }
        }
    }
    response.status = true;
    response.changeOutputIndices = changeOutputsIndexes;
    response.heuristic = "Different output script type";
    return response;
};
const getOutputGreaterThanAllInputs = (psbt) => {
    let response = {
        status: false,
        changeOutputIndices: []
    };
    // Get the transactions inputs addresses
    const inputs = psbt.data.inputs;
    let inputValues = [];
    for (let i = 0; i < inputs.length; i++) {
        // vout is the UTXO index of the input
        let vout = psbt.txInputs[i].index;
        //  Get the hex representation of the serialized input transaction
        let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
        // Decode the serialied transaction
        let tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined;
        // convert the scriptpubkey of the input UTXO to an address
        if (tx) {
            inputValues.push(tx.outs[vout].value);
        }
    }
    // Ensure PSBT is processed and the amounts are added
    // Else return response
    if (inputValues.length === 0)
        return response;
    // Get the transactions outputs addresses
    const outputs = psbt.txOutputs;
    const outputValues = outputs.map(output => output.value);
    // Sort input and output values in ascending order
    inputValues.sort((a, b) => a - b);
    outputValues.sort((a, b) => a - b);
    // Find the maximum input value
    const maxInput = Math.max(...inputValues);
    // Find the index of the last output value that is less than the max input value
    let lastIndex = -1;
    for (let i = 0; i < outputValues.length; i++) {
        if (outputValues[i] > maxInput) {
            lastIndex = i - 1;
        }
    }
    // Create an array to store the unique output values
    const values = [];
    for (let i = 0; i <= lastIndex; i++) {
        values.push(outputValues[i]);
    }
    // Loop through the unique output values and find the corresponding output index
    for (let value of values) {
        for (let i = 0; i < outputs.length; i++) {
            // If the value matches an output value and the output index is not already in the response, add it to the response
            if (value == outputs[i].value && response.changeOutputIndices.findIndex(val => val == i) == -1) {
                response.changeOutputIndices.push(i);
            }
        }
    }
    if (response.changeOutputIndices.length > 0) {
        response.status = true;
        response.heuristic = "Output greater than all inputs";
    }
    return response;
};
const getNonRoundValueOutputs = (psbt) => {
    const changeOutputs = [];
    // Get transaction outputs
    const outputs = psbt.txOutputs;
    // Declare a set to store round outputs
    const roundOutputs = new Set();
    // Loop through all outputs to and add a round output value to the set
    for (let i = 0; i < outputs.length; i++) {
        // Get the value in BTC 
        const btcValue = outputs[i].value / exports.SATOSHI;
        // Check if it is round
        if (btcValue % 1 == 0) {
            roundOutputs.add(outputs[i].value);
        }
    }
    // If there are no round outputs return
    const NO_OUTPUTS = 0;
    if (roundOutputs.size === NO_OUTPUTS) {
        return {
            status: false,
            changeOutputIndices: [],
        };
    }
    // Add the indices of all non round outputs as change outputs
    for (let i = 0; i < outputs.length; i++) {
        if (roundOutputs.has(outputs[i].value) === false) {
            changeOutputs.push(i);
        }
    }
    return {
        status: true,
        heuristic: "Non-round number outputs",
        changeOutputIndices: changeOutputs,
    };
};
const getlargestOutput = (psbt) => {
    const changeOutputIndices = [];
    const outputs = psbt.txOutputs;
    // Edge case
    if (outputs.length > 2) {
        return {
            status: false,
            changeOutputIndices: []
        };
    }
    const checkPeeling = (0, peeling_1.peelingTransaction)(psbt.toBase64());
    if (checkPeeling.status) {
        changeOutputIndices.push(checkPeeling.index);
    }
    return {
        status: true,
        heuristic: "Largest output",
        changeOutputIndices
    };
};

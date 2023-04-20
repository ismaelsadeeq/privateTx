"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peelingTransaction = void 0;
const decode_psbt_1 = require("../common/decode_psbt");
const peelingTransaction = (psbtBase64) => {
    // Initialize the response object with default values
    const response = {
        status: false,
        index: -1
    };
    // DecodePSBT
    const decodedPsbt = (0, decode_psbt_1.decodePsbt)(psbtBase64);
    // Error check  
    if (!decodedPsbt.status && !decodedPsbt.data) {
        response.error = decodedPsbt.error;
        return response;
    }
    const psbt = decodedPsbt.data;
    // Extract the outputs from the PSBT
    const outputs = psbt.txOutputs;
    // Get the amounts of each output
    const outputAmounts = outputs.map(output => output.value);
    // If there's only one output, then we can't peel it, so return the default response
    if (outputAmounts.length === 1) {
        return response;
    }
    // Sort the output amounts in ascending order
    outputAmounts.sort((a, b) => a - b);
    // Get the two largest output amounts
    const largestAmount = outputAmounts[outputAmounts.length - 1];
    const secondLargestAmount = outputAmounts[outputAmounts.length - 2];
    // Calculate the difference between the two largest output amounts
    const difference = largestAmount - secondLargestAmount;
    // Get half of the second largest output
    const halfOfSecondLargestAmount = secondLargestAmount / 2;
    // If the difference is less than the half of the second largest output, then we can't peel it
    if (difference < halfOfSecondLargestAmount) {
        return response;
    }
    // Find the index of the largest output
    let changeOutputIndex = -1;
    for (let i = 0; i < outputs.length; i++) {
        if (outputs[i].value === largestAmount) {
            changeOutputIndex = i;
            break;
        }
    }
    // Set the response status to true and the index to the index of the largest output
    response.status = true;
    response.index = changeOutputIndex;
    // Return the response
    return response;
};
exports.peelingTransaction = peelingTransaction;

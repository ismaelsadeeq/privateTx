"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peelingTransaction = void 0;
const bitcoin = require("bitcoinjs-lib");
const buffer_1 = require("buffer");
function numberSort(a, b) {
    return a - b;
}
const peelingTransaction = (psbtBase64) => {
    // Decode the base64-encoded PSBT
    const psbtBuffer = buffer_1.Buffer.from(psbtBase64, 'base64');
    const psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);
    // Get the transactions outputs 
    const outputs = psbt.txOutputs;
    const outputAmounts = [];
    for (let i = 0; i < outputs.length; i++) {
        outputAmounts.push(outputs[i].value);
    }
    let response = {
        status: false,
        index: -1
    };
    // Edge case
    if (outputAmounts.length === 1) {
        return response;
    }
    outputAmounts.sort(numberSort);
    let largestAmount = outputAmounts[outputAmounts.length - 1];
    let secondLargestAmount = outputAmounts[outputAmounts.length - 2];
    let difference = largestAmount - secondLargestAmount;
    let halfOfSecondLargestAmount = secondLargestAmount / 2;
    if (difference < halfOfSecondLargestAmount) {
        return response;
    }
    let vout = -1;
    for (let i = 0; i < outputs.length; i++) {
        if (outputs[i].value == largestAmount) {
            vout = i;
        }
    }
    response.status = true;
    response.index = vout;
    return response;
};
exports.peelingTransaction = peelingTransaction;

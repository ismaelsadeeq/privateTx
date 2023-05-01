"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionInputs = void 0;
const bitcoin = require("bitcoinjs-lib");
// Define a function to get the inputs of a transaction
const getTransactionInputs = (transaction) => {
    try {
        const inputs = [];
        transaction.ins.map((input) => {
            // Parse the input and add it to the array of inputs
            inputs.push({
                txid: input.hash.reverse().toString('hex'),
                n: input.index,
                script: bitcoin.script.toASM(input.script),
                sequence: input.sequence,
                witness: input.witness.map((witnessBuffer) => Buffer.from(witnessBuffer).toString('hex')) // Convert the witnesses to hexadecimal strings
            });
        });
        // Return the inputs as a successful response
        return {
            status: true,
            data: inputs
        };
    }
    catch (error) {
        // Return an error response if there is an exception
        return {
            status: false,
            error: JSON.stringify(error),
        };
    }
};
exports.getTransactionInputs = getTransactionInputs;

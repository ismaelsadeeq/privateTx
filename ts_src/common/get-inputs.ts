import * as bitcoin from 'bitcoinjs-lib';

// Define the structure of an input
export interface Input {
  txid: string,      // Transaction ID
  n: number,         // Index of the input in the transaction
  script: string,    // Script
  sequence: number,  // Sequence number
  witness: string[]  // Array of witnesses
}

// Define the structure of the response
export interface GetTransactionInputResponse {
  status: boolean,  // Indicates whether the operation was successful or not
  data?: Input[],   // Array of inputs (optional)
  error?: string    // Error message (optional)
}

// Define a function to get the inputs of a transaction
export const getTransactionInputs = (transaction: bitcoin.Transaction): GetTransactionInputResponse => {
  try {
    const inputs: Input[] = [];
    transaction.ins.map((input) => {
      // Parse the input and add it to the array of inputs
      inputs.push({
        txid: input.hash.reverse().toString('hex'),                  // Convert the transaction ID to a hexadecimal string
        n: input.index,                                             // Get the index of the input in the transaction
        script: bitcoin.script.toASM(input.script),                 // Convert the script to human-readable form
        sequence: input.sequence,                                   // Get the sequence number
        witness: input.witness.map((witnessBuffer) => Buffer.from(witnessBuffer).toString('hex')) // Convert the witnesses to hexadecimal strings
      });
    });
    // Return the inputs as a successful response
    return {
      status: true,
      data: inputs
    };
  } catch (error) {
    // Return an error response if there is an exception
    return {
      status: false,
      error: JSON.stringify(error),
    };
  }
};
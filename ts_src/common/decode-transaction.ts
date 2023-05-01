import * as bitcoin from 'bitcoinjs-lib';

// Define the response interface for the decodeRawTransaction function
export interface DecodeRawTransactionResponse {
  status: boolean,
  error?: any,
  transaction?: bitcoin.Transaction
}

// Define the decodeRawTransaction which decodes a raw transaction hex to a standard Transaction
export const decodeRawTransaction = (rawTransaction:string):DecodeRawTransactionResponse =>{
  try {
    // Decode the raw transaction
    const tx = bitcoin.Transaction.fromHex(rawTransaction);
    // Return the decoded transaction object
    return {
      status: true,
      transaction:tx
    }
  }catch (err:any){
    // If an error occurred, return an error response with the error message
    return {
      status:false,
      error: err
    }
  }
}
import * as bitcoin from 'bitcoinjs-lib';
import { decodePsbt } from '../common/decode_psbt';

// Define the response interface
export interface ConvertPsbtToHexResponse {
  status: boolean,
  error?: string,
  transactionHex?: string
}

// Define the function to convert a base64-encoded PSBT to transaction hex
export const convertPsbtToHex = (psbtBase64:string):ConvertPsbtToHexResponse =>{

  try {
    // Decode the base64-encoded PSBT
    const decodedPsbt = decodePsbt(psbtBase64);

    // Check for errors in decoding the PSBT
    if (!decodedPsbt.status || !decodedPsbt.data) {
      return {
        status: false,
        error: decodedPsbt.error,
      };
    }

    // Get the PSBT object from the decoded PSBT data
    const psbt: bitcoin.Psbt = decodedPsbt.data!;

    // Extract the transaction hex from the PSBT object
    const transactionHex = psbt.extractTransaction(true).toHex();

    // Return the transaction hex in the response
    return {
      status: true,
      transactionHex: transactionHex
    }

  } catch (err) {
    // Return error if any exception occurs
    return {
      status: false,
      error: JSON.stringify(err)
    }
  }
}
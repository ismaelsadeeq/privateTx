import { convertPsbtToHex } from '../common/convert-psbt-to-hex';
import { getTransactionInputs } from '../common/get-inputs';
import { decodeRawTransaction } from '../common/decode-transaction';
import { isCanonicalScriptSignature } from 'bitcoinjs-lib/src/script';

export interface DetectLightningChannelCloseResponse {
  status: boolean,
  inputs?: number[],
  error?: string
}

const OP_0 = "OP_0";
const OP_2 = "52";
const OP_CHECKMULTISIG = "ae";

// Function to detect a 2-of-2 multisig input in legacy format
const detectLegacy2Of2Multisig = (scriptSig: string): boolean => {
  const script = scriptSig.split(' ');

  // Check length and OP_0
  if ( script.length !== 3 || script[0] !== OP_0 ) {
    return false;
  }

  // Check signature format
  try {
    const isValid1stSig = isCanonicalScriptSignature(Buffer.from(script[1], 'hex'));
    const isValid2ndSig = isCanonicalScriptSignature(Buffer.from(script[2], 'hex'));

    return isValid1stSig && isValid2ndSig;

  } catch (error) {
    return false;
  }
};

// Function to detect a 2-of-2 multisig input in witness format
const detect2Of2Multisig = (witness:string[]):boolean =>{

  const witnessLength = 4;
  // Ensure the witness length is witnessLength and the first value is empty string
  if( witness.length !== witnessLength || witness[0] !== ""){
    return false;
  }

  const signature = witness[3];
  const n  = signature.length;

  // Ensure the witness program is two of two multisig.

  // check if the first opcode  is pushing two to the stack
  if (signature.slice(0, 2) !== OP_2){
    return false;
  }
  // Check if the last opcode is pushing two to the stacck
  if (signature.slice(n-4, n-2) !== OP_2){
    return false
  }  
  // check if the last opcode OP_CHECKMULTISIG
  if (signature.slice(n-2, n) !== OP_CHECKMULTISIG){
    return false
  }

  return true;
}

// Function to detect lightning channel close inputs
export const detectLightningChannelClose = (transactionHex: string): DetectLightningChannelCloseResponse => {

  // Decode the transaction
  const transaction = decodeRawTransaction(transactionHex);
  if (!transaction.status) {
    return { status: false, error: transaction.error };
  }

  // Get the transaction inputs
  const inputs = getTransactionInputs(transaction.transaction!);
  if (!inputs.status) {
    return { status: false, error: inputs.error };
  }

  // Find the indices of inputs that are 2-of-2 multisig
  const multisigInputIndices: number[] = [];

  for (let i = 0; i < inputs.data!.length; i++) {
    // Check for 2-of-2 multisig input in legacy format
    if (inputs.data![i].script.length > 0) {
      const isLegacy2Of2Multisig = detectLegacy2Of2Multisig(inputs.data![i].script);
      if (isLegacy2Of2Multisig) {
        multisigInputIndices.push(i);
      }
    }
    // Check for 2-of-2 multisig input in witness format
    const isWitness2Of2Multisig = detect2Of2Multisig(inputs.data![i].witness);
    if (isWitness2Of2Multisig) {
      multisigInputIndices.push(i);
    }
  }

  // Return the result
  return {
    status: multisigInputIndices.length > 0,
    inputs: multisigInputIndices,
  };
};

// Function to detect lightning channel close inputs in PSBT format
export const detectLightningChannelClosePsbt = (psbtBase64:string): DetectLightningChannelCloseResponse=> {

  // Convert PSBT to transaction hex
  const transactionHex = convertPsbtToHex(psbtBase64);
  if(transactionHex.status === false) {
    return { status: false , error: transactionHex.error}
  }

  // Detect lightning channel close inputs
  return detectLightningChannelClose(transactionHex.transactionHex!);
}
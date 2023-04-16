import * as bitcoin from 'bitcoinjs-lib';
import { PsbtInput } from 'bip174/src/lib/interfaces';
import { decodePsbt } from '../common/decode_psbt';

// Define Check Address Reuse response
export interface AddressReuseResponse {
  status: boolean,
  data: ReusedInputsAndOutPuts[]
  error?:string
}
export interface ReusedInputsAndOutPuts {
  vin: number,
  vout: number
}

export const checkAddressReuse  = (psbtBase64:string):AddressReuseResponse =>{

  const reusedAddressAndInputs:Array<ReusedInputsAndOutPuts> = []

  // Decode the base64-encoded PSBT

  // Error check
  const decodedPsbt = decodePsbt(psbtBase64);
  if (!decodedPsbt.status || !decodedPsbt.data) {
    return {
      status: false,
      data: [],
      error: decodedPsbt.error,
    };
  }
  const psbt: bitcoin.Psbt = decodedPsbt.data!;

  // Get the transaction's inputs address
  const inputs: PsbtInput[] = psbt.data.inputs;
  const inputsAddresses = [];

  for(let i = 0; i< inputs.length; i++){
    // `vout` is the UTXO index of the input
    const vout = psbt.txInputs[i].index; 

    // Get the hex representation of the serialized input transaction
    const serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');

    // Decode the serialied transaction
    const tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined ;

    // Convert the scriptPubKey of the input UTXO to an address
    const address: string = tx? bitcoin.address.fromOutputScript(tx.outs[vout].script) : "";
    inputsAddresses.push(address);
  }

  // Get the transaction's outputs address
  const outputs = psbt.txOutputs;

  const outputsAddress = outputs.map(output => {
    return bitcoin.address.fromOutputScript(output.script)
  })

  // Check for address reuse
  for (let i = 0; i< inputsAddresses.length; i++){

    const inputAddress = inputsAddresses[i]

    // Compare input address with all output addresses to check for a match
    for (let j = 0; j< outputsAddress.length; j++){

      if (inputAddress == outputsAddress[j]) {

        let reuse: ReusedInputsAndOutPuts = {
          vin:i, // Index of the input
          vout:j // Index of the output
        }

        reusedAddressAndInputs.push(reuse)
      }
    }
  }

  return {
    status: reusedAddressAndInputs.length > 0,
    data:reusedAddressAndInputs
  };
}
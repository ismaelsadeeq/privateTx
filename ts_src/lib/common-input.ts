import * as bitcoin from 'bitcoinjs-lib';
import { PsbtInput } from 'bip174/src/lib/interfaces';
import { Buffer } from 'buffer';

function numberSort(a:number, b:number) {
  return a - b;
}

export const commonInputs = (psbtBase64:string):boolean =>{

  // Decode the base64-encoded PSBT
  const psbtBuffer: Buffer = Buffer.from(psbtBase64, 'base64');
  const psbt: bitcoin.Psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);


  // Get the transactions inputs
  const inputs: PsbtInput[] = psbt.data.inputs;

  // Get the transactions outputs 
  const outputs:bitcoin.PsbtTxOutput[] = psbt.txOutputs

  //  Edge cases
  if (outputs.length === 1 || inputs.length === 1) {
    return true;
  }

  const inputAmounts: number[] = [];
  const outputAmounts: number[] = [];

  for(let i = 0; i< inputs.length; i++){

    // vout is the UTXO index of the input
    let vout: number = psbt.txInputs[i].index; 

    //  Get the hex representation of the serialized input transaction
    let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');

    // Decode the serialied transaction
    let tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined ;
    if (tx) {
      inputAmounts.push(tx.outs[vout].value)
    }
  }

  for(let i = 0; i< outputs.length; i++) {
    outputAmounts.push(outputs[i].value);
  }

  outputAmounts.sort(numberSort);
  inputAmounts.sort(numberSort);

  let result = true;
  for(let i = 0; i< outputAmounts.length; i++) {

    for(let j = 0; j< inputAmounts.length; j++){

      // check if the output amount is less than or equal to an input 
      // If yes then the input is enough to spend the output
      // other inputs might not be from same wallet
      if ( outputAmounts[i] <= inputAmounts[j]) {

        result = false;
      } 
      else  { result = true; }

    }
  }

  return result

}
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';


export interface peelingTransactionResponse {
  status: boolean
  index: number
}
function numberSort(a:number, b:number) {
  return a - b;
}

export const peelingTransaction = (psbtBase64:string):peelingTransactionResponse =>{

  // Decode the base64-encoded PSBT
  const psbtBuffer: Buffer = Buffer.from(psbtBase64, 'base64');
  const psbt: bitcoin.Psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);


  // Get the transactions outputs 
  const outputs:bitcoin.PsbtTxOutput[] = psbt.txOutputs


  const outputAmounts: number[] = [];


  for(let i = 0; i< outputs.length; i++) {
    outputAmounts.push(outputs[i].value);
  }

  let response: peelingTransactionResponse = {
    status:false,
    index: -1
  }
  // Edge case
  if (outputAmounts.length === 1 ){
    return response;
  }

  outputAmounts.sort(numberSort);

  let largestAmount = outputAmounts[outputAmounts.length -1];
  let secondLargestAmount = outputAmounts[outputAmounts.length -2];

  let difference = largestAmount - secondLargestAmount;

  let halfOfSecondLargestAmount = secondLargestAmount / 2;


  if (difference < halfOfSecondLargestAmount) {
    return response;
  } 

  let vout:number = -1;
  for(let i = 0; i< outputs.length; i++){

    if(outputs[i].value == largestAmount){
      vout = i
    }
  }

  response.status = true;
  response.index = vout;
  return response;

}
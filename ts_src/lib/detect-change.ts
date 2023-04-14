import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { peelingTransaction } from './peeling';
import { PsbtInput } from 'bip174/src/lib/interfaces';
import { checkAddressReuse } from './address-reuse';

export const SATOSHI = 100000000;

const NO_PAYMENT_OUTPUTS = 0;

interface DetectChangeResponse {
  status: boolean;
  heuristic: string;
  changeOutputIndices: number[];
}

export const detectChange = (psbtBase64:string):DetectChangeResponse=>{

  const response:DetectChangeResponse = {
    status: false,
    heuristic: "",
    changeOutputIndices: []
  };

  const psbtBuffer: Buffer = Buffer.from(psbtBase64, 'base64');
  const psbt: bitcoin.Psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);

  const outputs = psbt.txOutputs;

  // Edge case
  if(outputs.length === 1){
    return response;
  }

  // Detect change outputs from address reuse
  const reusedAddressOutputs = getChangeFromReusedAddresses(psbtBase64);

  if(reusedAddressOutputs.status){
    return reusedAddressOutputs;
  }

  // Detect change outputs from outputs with the same script type with inputs
  const sameScriptTypeOutputs = getChangeOutputsFromSameScriptType(psbt);
  if(sameScriptTypeOutputs.status){
    return sameScriptTypeOutputs;
  }

  // Detecct change outputs from output value that is greater than all the inputs.
  const outputGreaterThanAllInputs = getOutputGreaterThanAllInputs(psbt);
  if(outputGreaterThanAllInputs.status) {
    return outputGreaterThanAllInputs;
  }

  // Detect change from non round value outputs in bitcoin not satoshi
  const nonRoundValueOutputs = getNonRoundValueOutputs(psbt);
  if(nonRoundValueOutputs.status) {
    return nonRoundValueOutputs;
  }

  // Detect change from the largest output value
  const largestOutput = getlargestOutput(psbt);
  if(largestOutput.status) {
    return largestOutput;
  }

  return response;
}

export const getChangeFromReusedAddresses = (psbtBase64:string):DetectChangeResponse=>{

  // Initialize a new DetectChangeResponse object with default values
  let response:DetectChangeResponse = {
    status:false,
    heuristic:"",
    changeOutputIndices: []
  }

  // Detect change from address reuse by calling the checkAddressReuse function
  const reusedAddresses = checkAddressReuse(psbtBase64);

  // If address reuse is detected, extract the change output indices and update the response object
  if(reusedAddresses.status){

    // Initialize a new Set object to store the unique change output indices
    const changes:Set<number> = new Set();

    // Extract the vout property from each reusedInputsAndOutputs object and add it to the change output set
    reusedAddresses.data.map((reusedInputsAndOutputs)=>{
      changes.add(reusedInputsAndOutputs.vout)
    })

    // Update the response object with the detected change output indices and return it
    response.status = true;
    response.heuristic = "Address reuse";
    response.changeOutputIndices = Array.from(changes);
    return response;

  }

  // If no address reuse is detected, return the default response object
  return response;
}

const getChangeOutputsFromSameScriptType = (psbt: bitcoin.Psbt):DetectChangeResponse =>{

  let response:DetectChangeResponse = {
    status:false,
    heuristic:"",
    changeOutputIndices: []
  }

  // Get the transactions inputs addresses
  const inputs: PsbtInput[] = psbt.data.inputs;
  let inputAddresses:string[] = [];

  for(let i = 0; i< inputs.length; i++){
    
    // vout is the UTXO index of the input
    let vout: number = psbt.txInputs[i].index; 
 
    //  Get the hex representation of the serialized input transaction
    let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');
 
    // Decode the serialied transaction
    let tx = serializedTx && bitcoin.Transaction.fromHex(serializedTx);
 
    // convert the scriptpubkey of the input UTXO to an address
    let address: string = tx? bitcoin.address.fromOutputScript(tx.outs[vout].script) : "";
    inputAddresses.push(address);
  }
  
  // Get the transactions outputs addresses
  const outputs = psbt.txOutputs;
  const outputAddresses = outputs.map(output => {
    return bitcoin.address.fromOutputScript(output.script);
  });

  // Initialize the address type variable
  let inputsAddressType:string = "";

  // Loop through all the input addresses to find type
  for(const address of inputAddresses) {
    const currentInputAddressType = getAddressType(address);
    if (inputsAddressType != "" && inputsAddressType != currentInputAddressType) {
      return response;
    }
    inputsAddressType = currentInputAddressType;
  }

  // Initialize change and payment outputs
  let changeOutputs:string[] = []
  let paymentOutputs:string[] = []

  // Map through all the outputs
  for(const address of outputAddresses) {

    const outputAddressType = getAddressType(address);
    // If the address type is the same if the input address type
    if(inputsAddressType == outputAddressType){
       // it is as a change output
      changeOutputs.push(address);
    }else{
       // it is as a payment output
       paymentOutputs.push(address)
    }
  }

  // if there are no payments detected return
  if (paymentOutputs.length == NO_PAYMENT_OUTPUTS) {
    return response;
  }

  let changeOutputsIndexes:number[] = [];

  // Loop through all the change outputs and get it's index

  for(let i = 0;i< changeOutputs.length; i++){

    for(let j = 0; j < outputs.length; j++){

      if (changeOutputs[i] === outputs[j].address){
        changeOutputsIndexes.push(j)
      }
    }
  }
  response.status = true;
  response.changeOutputIndices = changeOutputsIndexes;
  response.heuristic = "Different output script type"
  return response;

}

const getOutputGreaterThanAllInputs = (psbt: bitcoin.Psbt):DetectChangeResponse => {

  let response:DetectChangeResponse = {
    status:false,
    heuristic:"",
    changeOutputIndices: []
  }

  // Get the transactions inputs addresses
  const inputs: PsbtInput[] = psbt.data.inputs;
  let inputValues: number[] = [];

  for(let i = 0; i< inputs.length; i++){
    
    // vout is the UTXO index of the input
    let vout: number = psbt.txInputs[i].index; 

    //  Get the hex representation of the serialized input transaction
    let serializedTx = inputs[i].nonWitnessUtxo?.toString('hex');

    // Decode the serialied transaction
    let tx = serializedTx ? bitcoin.Transaction.fromHex(serializedTx) : undefined ;

    // convert the scriptpubkey of the input UTXO to an address
    
    if(tx){
      inputValues.push(tx.outs[vout].value)
    }
  }
  // Get the transactions outputs addresses
  const outputs = psbt.txOutputs;
  const outputValues = outputs.map(output => output.value);

  // Find the maximum input and output values
  const maxInput = Math.max(...inputValues)
  const maxOutput = Math.max(...outputValues)

  // Check if any output is greater than all inputs
  const isOutputGreaterThanAllInputs = maxOutput > maxInput;

  if(isOutputGreaterThanAllInputs) {

    // Find the index of the output with the maximum value
    for(let i = 0; i< outputs.length; i++){
      if (maxOutput == outputs[i].value ) {

        response.status = true;
        response.heuristic = "Output greater than all inputs";
        response.changeOutputIndices.push(i);
        break
      }

    }
  }

  return response;
}

const getNonRoundValueOutputs = (psbt: bitcoin.Psbt):DetectChangeResponse=>{

  const changeOutputs: number[] = [];

  // Get transaction outputs
  const outputs = psbt.txOutputs;

  // Declare a set to store round outputs
  const roundOutputs:Set<number> = new Set();

  // Loop through all outputs to and add a round output value to the set
  for(let i = 0; i< outputs.length; i++){

    // Get the value in BTC 
    const btcValue = outputs[i].value / SATOSHI;

    // Check if it is round
    if (btcValue % 1 == 0){
      roundOutputs.add(outputs[i].value);
    }
  }

  // If there are no round outputs return
  const NO_OUTPUTS = 0;
  if(roundOutputs.size === NO_OUTPUTS) {
    return {
      status: false,
      heuristic: "",
      changeOutputIndices: [],
    };
  }

  // Add the indices of all non round outputs as change outputs
  for (let i = 0; i < outputs.length;i++){
    if (roundOutputs.has(outputs[i].value) === false) {
      changeOutputs.push(i)
    }
  }

  return {
    status: true,
    heuristic: "Non-round number outputs",
    changeOutputIndices: changeOutputs,
  };
}

const getlargestOutput = (psbt: bitcoin.Psbt):DetectChangeResponse =>{
  
  const changeOutputIndices:number[] = [];
  
  const outputs = psbt.txOutputs;

  // Edge case
  if (outputs.length > 2 ){
    return {
      status: false,
      heuristic: "",
      changeOutputIndices: []
    };
  }
  const checkPeeling = peelingTransaction(psbt.toBase64());
  if(checkPeeling.status) {
    changeOutputIndices.push(checkPeeling.index);
  }
  return {
    status:true,
    heuristic: "Largest output",
    changeOutputIndices
  }
}


// Helper function
const getAddressType = (address: string): string => {
  try {
    // Try decoding the address with base58check
    const addressObj = bitcoin.address.fromBase58Check(address);
    // Assign the address type to the version string
    return addressObj.version.toString();
  } catch (err) {
    // If decoding with base58check fails, it may be a bech32 address
    const addressObj = bitcoin.address.fromBech32(address)
    return `${addressObj.prefix}${addressObj.version}`;
  }
}

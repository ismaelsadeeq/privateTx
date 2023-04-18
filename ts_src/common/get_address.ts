import * as bitcoin from 'bitcoinjs-lib';

export const getAddress = (script:Buffer):string => {
  try {
    return bitcoin.address.fromOutputScript(script); 
  }
  catch(err){
    return script.toString('hex');
  }
}
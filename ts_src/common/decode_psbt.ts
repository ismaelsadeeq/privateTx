import * as bitcoin from 'bitcoinjs-lib';

interface DecodePSBTResponse {
  status: boolean,
  data?: bitcoin.Psbt,
  error?: string 
}
export const decodePsbt = (psbtBase64: string): DecodePSBTResponse =>{
  try {
    const psbtBuffer: Buffer = Buffer.from(psbtBase64, 'base64');
    const psbt: bitcoin.Psbt = bitcoin.Psbt.fromBuffer(psbtBuffer);

    return {
      status: true,
      data: psbt,
    };
  } catch (error) {
    return {
      status: false,
      error: 'Invalid PSBT string'
    };
  }
}
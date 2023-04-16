import * as assert from 'assert';
import { describe,it } from "mocha";
import { decodePsbt } from "../../src/common/decode_psbt";

describe("Test PSBT decoding", ()=>{

  it("Empty psbt string", ()=>{
    const psbt = "";
    const response = decodePsbt(psbt);
    const result = {
      status:false,
      error:"Invalid PSBT string"
    }
    assert.deepStrictEqual(response,result)
  })

  it("Invalid psbt string", ()=>{
    const psbt = "Invalid";
    const response = decodePsbt(psbt);
    const result = {
      status:false,
      error:"Invalid PSBT string"
    }
    assert.deepStrictEqual(response,result)
  })
  
  it("correct psbt string", ()=>{
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AQBlzR0AAAAAFgAUH07rdLvAqWwab5nTbBda6Xg0Q98AAAAAAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK9AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgZGDkxdepdIYHZEhITaZem41Rc/n99csk9RNxDrRDrKkCIE1MniWw0E5wyuVc1fhb7dkBsfwb2oGgGsNYMY8vgLFMASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAA==";
    const response = decodePsbt(psbt);
    assert.deepStrictEqual(response.status,true);
  })

})
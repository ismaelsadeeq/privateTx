import * as assert from 'assert';
import {describe, it} from 'mocha';
import { checkAddressReuse } from '../../src';

describe('Address Reuse', () => {

  it("Invalid PSBT string", () => {
    
    const psbt = "Invalid";

    const response = {
      status:false,
      data:[],
      error:"Invalid PSBT string"
    };
    const result = checkAddressReuse(psbt);
    assert.deepStrictEqual(result,response);
  })
  it("PSBT string without reuse", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AQBlzR0AAAAAFgAUH07rdLvAqWwab5nTbBda6Xg0Q98AAAAAAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK9AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgZGDkxdepdIYHZEhITaZem41Rc/n99csk9RNxDrRDrKkCIE1MniWw0E5wyuVc1fhb7dkBsfwb2oGgGsNYMY8vgLFMASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAA==";

    const response = {
      status:false,
      data:[]
    };
    const result = checkAddressReuse(psbt);
    assert.deepStrictEqual(result,response);
  })

  it("PSBT string with reuse", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AQAvaFkAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK9AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgB6BbgRymkVNZZ8watf8OIrjUeKlR4Q3SPbsb5vlBUBACIBTeDjLV2+Yj/+vg26mXNbKZhmjj6Jt+4QqBQISEo9VZASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAIgICEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UMio6FlQAAAAAAAAAAAA==";

    const response = {
      status:true,
      data:[
        {
          vin: 0,
          vout: 0
        }
      ]
    };
    const result = checkAddressReuse(psbt);
    assert.deepStrictEqual(result,response);
  })
  
  it("PSBT with OP_RETURN output that is not processed", () => {
    const psbt = "cHNidP8BAGwCAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD/////AmDjFgAAAAAAFgAUhLhXbj+oNR0OzS29IpNsRwYRfQsAAAAAAAAAABFqD0hlbGxvIE9wX1JldHVybgAAAAAAAAAA";
    const response = {
      status:false,
      data:[]
    }
    const result = checkAddressReuse(psbt);
    assert.deepStrictEqual(result,response)
  })
  it("PSBT with P2TR output that is not processed", () => {
    const psbt = "cHNidP8BAO4CAAAAA7Qi7ef0E6AD6g9Bt3wyoscHkmxLEC5h3Ba8cmPSQ/4sAAAAAAD9////IqQqb5nXIPMqqsrPKqqM9EE/eX9gkZKUAy+fYMdXmkYAAAAAAP3////QRU3Xxh602opM72kygIRMSblXBjkRBEtaTJPmuBmiQAAAAAAA/f///wMAZc0dAAAAABYAFNb4eJD53mxJ8Ru5hiMCUxXal0g+APIFKgEAAAAWABQ71TsKSsxnTrRIXJ4LZAegWU1xlYB00hoAAAAAIlEgYLkNmG8lbNqEXf+I5magfYfc5xOelIeFrp5VLlc6D5IAAAAAAAAAAAAAAA==";
    const response = {
      status:false,
      data:[]
    }
    const result = checkAddressReuse(psbt);
    assert.deepStrictEqual(result,response)
  })

})
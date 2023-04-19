import * as assert from 'assert';
import { describe,it } from "mocha";
import {getAddressType} from '../../src/common/get_address_type'

describe("Test get address type", ()=>{

  it("Empty address string", ()=>{
    const address = "";
    const response = getAddressType(address);
    const result = {
      status:false,
      data:"",
      error:"Invalid address string"
    };
    assert.deepStrictEqual(response,result)
  })

  it("Invalid address string", ()=>{
    const address = "Invalid";
    const response = getAddressType(address);
    const result = {
      status:false,
      data:"",
      error:"Invalid address string"
    }
    assert.deepStrictEqual(response,result)
  })

  it("Invalid address string", ()=>{
    const address = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqR242hem";
    const response = getAddressType(address);
    const result = {
      status:false,
      data:"",
      error:"Invalid address string"
    }
    assert.deepStrictEqual(response,result)
  })
  
  it("base58 mainnet P2PK address string", ()=>{
    const address = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem";
    const response = getAddressType(address);
    const result = {
      data: '0',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("base58 testnet P2PK address string", ()=>{
    const address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";
    const response = getAddressType(address);
    const result = {
      data: '111',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("base58 mainnet P2SH address string", ()=>{
    const address = "3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX";
    const response = getAddressType(address);
    const result = {
      data: '5',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("base58 testnet P2SH address string", ()=>{
    const address = "2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc";
    const response = getAddressType(address);
    const result = {
      data: '196',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("bech32 mainet P2WPKH address string", ()=>{
    const address = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4";
    const response = getAddressType(address);
    const result = {
      data: 'bc0',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("bech32 regtest P2WPKH address string", ()=>{
    const address = "bcrt1qp09zelfkrlgs9lwztcpa9k62888nka9qmju0v2";
    const response = getAddressType(address);
    const result = {
      data: 'bcrt0',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })
  it("bech32 signet P2WPKH address string", ()=>{
    const address = "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx";
    const response = getAddressType(address);
    const result = {
      data: 'tb0',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })
  it("bech32 mainnet P2WSH address string", ()=>{
    const address = "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3";
    const response = getAddressType(address);
    const result = {
      data: 'bc0',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })

  it("bech32 mainnet P2TR address string", ()=>{
    const address = "bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0";
    const response = getAddressType(address);
    const result = {
      data: 'bc1',
      status: true
    }
    assert.deepStrictEqual(response,result);
  })


})
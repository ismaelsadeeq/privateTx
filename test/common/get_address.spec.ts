import * as assert from 'assert';
import {describe, it} from 'mocha';
import { getAddress } from '../../src/common/get_address';
import * as bitcoin from 'bitcoinjs-lib';


describe('Get Address from script buffer',  ()=> {

  it("Empty script buffer", ()=>{
    const script = Buffer.from("");
    const response = getAddress(script);
    const result = script.toString('hex')
    assert.deepStrictEqual(response,result)
  })

  it("Invalid script buffer ", ()=>{
    const script = Buffer.from('00141f4eeb74ba96c1a6f99d36c175ae9783443df', 'hex');
    const response = getAddress(script);
    const result = script.toString('hex')
    assert.deepStrictEqual(response,result)
  })

  it("bech32 mainnet P2WPKH script buffer", ()=>{
    const script = Buffer.from('00141f4eeb74bbc0a96c1a6f99d36c175ae9783443df', 'hex');
    const response = getAddress(script);
    const result = bitcoin.address.fromOutputScript(script); 
    assert.deepStrictEqual(response,result)
  })
  it("bech32 mainnet P2WSH script buffer", ()=>{
    const script = Buffer.from('00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262', 'hex');
    const response = getAddress(script);
    const result = bitcoin.address.fromOutputScript(script); 
    assert.deepStrictEqual(response,result)
  })
  it("bech32 mainnet P2WSH script buffer", ()=>{
    const script = Buffer.from('00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262', 'hex');
    const response = getAddress(script);
    const result = bitcoin.address.fromOutputScript(script); 
    assert.deepStrictEqual(response,result)
  })
  it("bech32 mainnet P2TR script buffer", ()=>{
    const script = Buffer.from('512060b90d986f256cda845dff88e666a07d87dce7139e948785ae9e552e573a0f92', 'hex');
    const response = getAddress(script);
    // Bitcoinjs does not support P2TR scriptBuffer
    const result = script.toString('hex');; 
    assert.deepStrictEqual(response,result)
  })
  it("base58 mainnet P2PK script buffer", ()=>{
    const script = Buffer.from('76a91485cff1097fd9e008bb34af709c62197b38978a4888ac', 'hex');
    const response = getAddress(script);
    const result = bitcoin.address.fromOutputScript(script); 
    assert.deepStrictEqual(response,result)
  })
  it("base58 mainnet P2SH script buffer", ()=>{
    const script = Buffer.from('a9143545e6e33b832c47050f24d3eeb93c9c03948bc787', 'hex');
    const response = getAddress(script);
    const result = bitcoin.address.fromOutputScript(script); 
    assert.deepStrictEqual(response,result)
  })



})
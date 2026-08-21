#!/usr/bin/env node
'use strict';
global.window = global;
require('../js/ciphers.js');
const C = global.Ciphers;
function eq(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(label+'\nactual: '+JSON.stringify(actual)+'\nexpected: '+JSON.stringify(expected));
}
if (!C.validate()) throw new Error('built-in cipher validation failed');
eq(C.caesarEnc('HELLO', 3), 'KHOOR', 'Caesar');
eq(C.caesarDec('KHOOR', 3), 'HELLO', 'Caesar decrypt');
eq(C.railFenceDec(C.railFenceEnc('WEAREDISCOVERED', 3), 3), 'WEAREDISCOVERED', 'Rail Fence');
const key=[0x2b,0x7e,0x15,0x16,0x28,0xae,0xd2,0xa6,0xab,0xf7,0x15,0x88,0x09,0xcf,0x4f,0x3c];
const pt=[0x32,0x43,0xf6,0xa8,0x88,0x5a,0x30,0x8d,0x31,0x31,0x98,0xa2,0xe0,0x37,0x07,0x34];
const ct=[0x39,0x25,0x84,0x1d,0x02,0xdc,0x09,0xfb,0xdc,0x11,0x85,0x97,0x19,0x6a,0x0b,0x32];
eq(C.aesEncryptBlock(pt,key),ct,'FIPS-197 AES');eq(C.aesDecryptBlock(ct,key),pt,'AES inverse');
const rsa=C.rsaKeyPair(16), m=42;eq(C.rsaDecrypt(C.rsaEncrypt(m,rsa),rsa),m,'RSA toy roundtrip');
if(C.dhShared(2,7,23)!==13)throw new Error('DH known vector');
if(C.modInv(3,100)!==67)throw new Error('modular inverse');
console.log('PASS: cipher regression suite');
#!/usr/bin/env node
'use strict';
global.window = global;
require('../js/ciphers.js');
const C = global.Ciphers;
global.window.CURRICULUM = undefined;
require('../js/curriculum.js');
if (global.CURRICULUM.all.length < 30) throw new Error('curriculum coverage unexpectedly small');
if (global.CURRICULUM.days.length !== 3) throw new Error('course must have exactly three training days');
if (global.CURRICULUM.days[0].chapters.join() !== 'classical') throw new Error('Day 1 must be classical cryptography');
if (global.CURRICULUM.days[1].chapters.join() !== 'symmetric') throw new Error('Day 2 must be symmetric cryptography');
if (global.CURRICULUM.days[2].chapters.join() !== 'asymmetric,quantum') throw new Error('Day 3 must be asymmetric plus PQC outlook');
require('../js/course-content.js');
if (!global.COURSE_CONTENT) throw new Error('Authored course content is missing');
global.CURRICULUM.all.forEach(({id}) => {
  const lesson = global.COURSE_CONTENT[id];
  if (!lesson || !lesson.durationMinutes || lesson.objectives.length < 2 || lesson.terms.length < 2 || lesson.sections.length < 3 || !lesson.lab || !lesson.check) throw new Error('Detailed lesson contract failed: ' + id);
});
for (const required of ['frequency','pigpen','des','ecb','cbc','ctr','gcm','hmac','oaep','signature','dh','mitm','pfs','ecc','hybrid','shor','grover','standards','migration']) {
  if (!global.CURRICULUM.byId[required]) throw new Error('missing curriculum lesson: '+required);
}
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
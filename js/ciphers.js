/* Real cipher implementations — the math behind every island.
 * All pure JS, deterministic, unit-testable via window.Ciphers.validate(). */
(function () {
  "use strict";
  var A = 65, Z = 90, a = 97, z = 122;

  function ord(c) { return c.charCodeAt(0); }
  function isA(c) { var o = ord(c); return o >= 65 && o <= 90; }
  function isB(c) { var o = ord(c); return o >= 97 && o <= 122; }
  function shiftChar(c, k) {
    var o = ord(c);
    if (isA(c)) return String.fromCharCode(A + (o - A + k) % 26);
    if (isB(c)) return String.fromCharCode(a + (o - a + k) % 26);
    return c;
  }

  function caesarEnc(plain, k) {
    return plain.split("").map(function (c) { return shiftChar(c, k); }).join("");
  }
  function caesarDec(cipher, k) { return caesarEnc(cipher, 26 - (k % 26)); }

  function atbash(c) {
    var o = ord(c);
    if (isA(c)) return String.fromCharCode(155 - o);
    if (isB(c)) return String.fromCharCode(219 - o);
    return c;
  }
  var atbashEnc = function (p) { return p.split("").map(atbash).join(""); };
  var atbashDec = atbashEnc; // involution

  function railFenceEnc(plain, rails) {
    var letters = plain.replace(/[^A-Za-z]/g, "");
    var out = [], idx = 0, dir = 1, line;
    for (var i = 0; i < letters.length; i++) {
      line = out[idx];
      out[idx] = (line || "") + letters[i];
      if (idx === 0) dir = 1;
      else if (idx === rails - 1) dir = -1;
      idx += dir;
    }
    return out.join("|");
  }
  function railFenceDec(enc, rails) {
    var rows = enc.split("|");
    var n = 0;
    for (var i = 0; i < rows.length; i++) n += rows[i].length;
    var pos = [], idx = 0, dir = 1;
    for (var j = 0; j < n; j++) {
      pos.push(idx);
      if (idx === 0) dir = 1; else if (idx === rails - 1) dir = -1;
      idx += dir;
    }
    var ptr = rows.map(function () { return 0; }), res = new Array(n);
    for (var k = 0; k < n; k++) {
      var r = pos[k];
      res[k] = rows[r].charAt(ptr[r]++);
    }
    return res.join("");
  }

  function playfairKey(word) {
    var seen = {}, sq = [];
    word = word.toUpperCase().replace(/[^A-Z]/g, "");
    var all = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // no J
    for (var i = 0; i < word.length && sq.length < 25; i++) {
      var c = word[i];
      if (!seen[c]) { seen[c] = 1; sq.push(c); }
    }
    for (var j = 0; j < all.length && sq.length < 25; j++) {
      if (!seen[all[j]]) sq.push(all[j]);
    }
    return sq;
  }
  function playfairEnc(plain, keyWord) {
    var sq = playfairKey(keyWord), idx = {};
    for (var i = 0; i < 25; i++) idx[sq[i]] = i;
    var norm = plain.toUpperCase().replace(/J/g, "Q").replace(/[^A-Z]/g, "");
    var pairs = [];
    for (var p = 0; p < norm.length; p += 2) {
      var x = norm[p], y = norm[p + 1] || "";
      if (y && x === y) y = "X";
      else if (!y) y = "X";
      pairs.push(x + y);
    }
    var out = "";
    for (var q = 0; q < pairs.length; q++) {
      var r1 = idx[pairs[q][0]], r2 = idx[pairs[q][1]];
      var c1 = Math.floor(r1 / 5), c2 = Math.floor(r2 / 5);
      var row1 = r1 % 5, row2 = r2 % 5;
      var s1, s2;
      if (c1 === c2) { s1 = sq[c1 * 5 + ((row1 + 1) % 5)]; s2 = sq[c2 * 5 + ((row2 + 1) % 5)]; }
      else if (row1 === row2) { s1 = sq[((c1 + 1) % 5) * 5 + row1]; s2 = sq[((c2 + 1) % 5) * 5 + row2]; }
      else { s1 = sq[c1 * 5 + row2]; s2 = sq[c2 * 5 + row1]; }
      out += s1 + s2;
    }
    return out;
  }
  function playfairDec(cipher, keyWord) {
    var sq = playfairKey(keyWord), idx = {};
    for (var i = 0; i < 25; i++) idx[sq[i]] = i;
    var out = "";
    for (var p = 0; p < cipher.length; p += 2) {
      var r1 = idx[cipher[p]], r2 = idx[cipher[p + 1]];
      var c1 = Math.floor(r1 / 5), c2 = Math.floor(r2 / 5);
      var row1 = r1 % 5, row2 = r2 % 5;
      var s1, s2;
      if (c1 === c2) { s1 = sq[c1 * 5 + ((row1 + 4) % 5)]; s2 = sq[c2 * 5 + ((row2 + 4) % 5)]; }
      else if (row1 === row2) { s1 = sq[((c1 + 4) % 5) * 5 + row1]; s2 = sq[((c2 + 4) % 5) * 5 + row2]; }
      else { s1 = sq[c1 * 5 + row2]; s2 = sq[c2 * 5 + row1]; }
      out += s1 + s2;
    }
    return out;
  }

  /* ---------- AES (128-bit key, full 10 rounds) ---------- */
  var SBOX = (function () {
    var box = [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
      0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
      0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
      0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
      0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
      0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
      0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
      0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
      0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
      0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
      0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
      0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
      0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
      0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
      0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
      0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
    return box;
  })();
  var SBOX_INV = (function () { var b = new Array(256); for (var i = 0; i < 256; i++) b[SBOX[i]] = i; return b; })();
  var RCON = [0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];

  function gmul(a, b) {
    var p = 0;
    for (var i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      var hi = a & 0x80;
      a = (a << 1) & 0xff;
      if (hi) a ^= 0x1b;
      b >>= 1;
    }
    return p;
  }
  function copyArr(dst, src) { for (var i = 0; i < dst.length; i++) dst[i] = src[i]; }
  function xtime(x) { return gmul(x, 2); }

  function aesExpand(key16) {
    var w = key16.slice(0, 16);
    for (var k = 4; k < 44; k++) {
      // word k = word (k-4) ^ temp, where temp = word (k-1) or RotWord+SubWord+Rcon
      var b = k * 4;
      var t0 = w[b - 4], t1 = w[b - 3], t2 = w[b - 2], t3 = w[b - 1];
      var s1, s2, s3, s4;
      if (k % 4 === 0) {
        s1 = SBOX[t1] ^ RCON[k / 4]; s2 = SBOX[t2]; s3 = SBOX[t3]; s4 = SBOX[t0];
      } else {
        s1 = t0; s2 = t1; s3 = t2; s4 = t3;
      }
      w.push(w[b - 16] ^ s1, w[b - 15] ^ s2, w[b - 14] ^ s3, w[b - 13] ^ s4);
    }
    return w;
  }
  /* State layout: flat byte array in input byte order — FIPS-197 column-major:
   * State[r][c] = s[4c + r]. Byte i of the block sits at s[i]. */
  function aesAddRoundKey(s, w, r) {
    for (var c = 0; c < 4; c++)
      for (var row = 0; row < 4; row++)
        s[4 * c + row] ^= w[(4 * r + c) * 4 + row];
  }
  function aesSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = SBOX[s[i]]; }
  function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = SBOX_INV[s[i]]; }
  function aesShiftRows(s) {
    var o = s.slice();
    for (var c = 0; c < 4; c++)
      for (var r = 0; r < 4; r++)
        o[4 * c + r] = s[4 * ((c + r) % 4) + r];
    copyArr(s, o);
  }
  function aesInvShiftRows(s) {
    var o = s.slice();
    for (var c = 0; c < 4; c++)
      for (var r = 0; r < 4; r++)
        o[4 * c + r] = s[4 * ((c - r + 4) % 4) + r];
    copyArr(s, o);
  }
  function aesMixCol(s) {
    for (var c = 0; c < 4; c++) {
      var i = 4 * c, a0 = s[i], a1 = s[i+1], a2 = s[i+2], a3 = s[i+3];
      s[i]    = xtime(a0) ^ (xtime(a1) ^ a1) ^ a2 ^ a3;
      s[i+1]  = a0 ^ xtime(a1) ^ (xtime(a2) ^ a2) ^ a3;
      s[i+2]  = a0 ^ a1 ^ xtime(a2) ^ (xtime(a3) ^ a3);
      s[i+3]  = (xtime(a0) ^ a0) ^ a1 ^ a2 ^ xtime(a3);
    }
  }
  function aesInvMixCol(s) {
    for (var c = 0; c < 4; c++) {
      var i = 4 * c, a0 = s[i], a1 = s[i+1], a2 = s[i+2], a3 = s[i+3];
      s[i]    = gmul(a0,14) ^ gmul(a1,11) ^ gmul(a2,13) ^ gmul(a3,9);
      s[i+1]  = gmul(a0,9)  ^ gmul(a1,14) ^ gmul(a2,11) ^ gmul(a3,13);
      s[i+2]  = gmul(a0,13) ^ gmul(a1,9)  ^ gmul(a2,14) ^ gmul(a3,11);
      s[i+3]  = gmul(a0,11) ^ gmul(a1,13) ^ gmul(a2,9)  ^ gmul(a3,14);
    }
  }
  function aesEncryptBlock(pt16, key16) {
    var w = aesExpand(key16);
    var s = new Array(16);
    for (var i = 0; i < 16; i++) s[i] = pt16[i] ^ w[i];
    for (var r = 1; r < 10; r++) { aesSubBytes(s); aesShiftRows(s); aesMixCol(s); aesAddRoundKey(s, w, r); }
    aesSubBytes(s); aesShiftRows(s); aesAddRoundKey(s, w, 10);
    return s;
  }
  function aesDecryptBlock(ct16, key16) {
    var w = aesExpand(key16);
    var s = new Array(16);
    for (var i = 0; i < 16; i++) s[i] = ct16[i] ^ w[10 * 16 + i];
    for (var r = 9; r > 0; r--) { aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, r); aesInvMixCol(s); }
    aesInvShiftRows(s); aesInvSubBytes(s); aesAddRoundKey(s, w, 0);
    return s;
  }

  /* ---------- modular arithmetic for RSA / DH ---------- */
  function modPow(base, exp, mod) {
    base = ((base % mod) + mod) % mod;
    var result = 1;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1;
    }
    return result;
  }
  function modInv(a, mod) {
    var t = 0, newt = 1, r = mod, newr = a, q;
    while (newr !== 0) {
      q = Math.floor(r / newr);
      var tt = t - q * newt; t = newt; newt = tt;
      var rr = r - q * newr; r = newr; newr = rr;
    }
    if (r > 1) return null;
    if (t < 0) t += mod;
    return t;
  }
  function randInt(max) { return Math.floor(Math.random() * max); }

  function rsaKeyPair(bits) {
    // small, educational primes (deterministic-friendly, fast in JS)
    var small = [1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061,
      1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1171, 1181];
    var n = null, attempt = 0;
    while (!n && attempt < 400) {
      attempt++;
      var p = small[randInt(small.length)];
      var q = small[randInt(small.length)];
      if (p === q) continue;
      var cand = p * q;
      if (Math.floor(Math.log2(cand)) + 1 >= bits - 4) n = cand;
    }
    if (!n) n = 1009 * 1033;
    // factor n properly for phi
    var p2 = null, q2 = null;
    for (var i = 2; i * i <= n; i++) { if (n % i === 0) { p2 = i; q2 = n / i; break; } }
    var phi = (p2 - 1) * (q2 - 1);
    var e = 65537;
    var d = modInv(e, phi);
    if (d === null) { e = 17; d = modInv(e, phi); }
    return { n: n, e: e, d: d, p: p2, q: q2, bits: Math.floor(Math.log2(n)) + 1 };
  }
  function rsaEncrypt(m, key) { return modPow(m, key.e, key.n); }
  function rsaDecrypt(c, key) { return modPow(c, key.d, key.n); }

  function dhShared(a, b, p) { return modPow(a, b, p); }

  /* ---------- validation (run at boot, logs results) ---------- */
  function validate() {
    var ok = true, fail = function (msg) { ok = false; console.warn("[ciphers] FAIL: " + msg); };
    if (caesarEnc("HELLO", 3) !== "KHOOR") fail("caesar enc");
    if (caesarDec("KHOOR", 3) !== "HELLO") fail("caesar dec");
    if (caesarEnc("abc xyz", 13) !== "nop klm") fail("caesar rot13 lowercase");
    if (atbashEnc("HELLO") !== "SVOOL") fail("atbash");
    var rf = railFenceEnc("WEAREDISCOVERED", 3);
    if (railFenceDec(rf, 3) !== "WEAREDISCOVERED") fail("railfence roundtrip: " + rf);
    var pf = playfairEnc("HELLOWORLD", "KEY");
    if (playfairDec(pf, "KEY") !== "HELXOWORLD") fail("playfair roundtrip: " + pf);
    // AES FIPS-197 Appendix B vector (key 2b7e1516..., input ...0734)
    var key = [0x2b,0x7e,0x15,0x16,0x28,0xae,0xd2,0xa6,0xab,0xf7,0x15,0x88,0x09,0xcf,0x4f,0x3c];
    var pt  = [0x32,0x43,0xf6,0xa8,0x88,0x5a,0x30,0x8d,0x31,0x31,0x98,0xa2,0xe0,0x37,0x07,0x34];
    var ct = aesEncryptBlock(pt, key);
    var expect = [0x39,0x25,0x84,0x1d,0x02,0xdc,0x09,0xfb,0xdc,0x11,0x85,0x97,0x19,0x6a,0x0b,0x32];
    for (var i = 0; i < 16; i++) if (ct[i] !== expect[i]) fail("AES FIPS-197 vector");
    if (JSON.stringify(aesDecryptBlock(ct, key)) !== JSON.stringify(pt)) fail("AES decrypt roundtrip");
    // AES zero-key zero-plaintext
    var z = aesEncryptBlock(new Array(16).fill(0), new Array(16).fill(0));
    if (JSON.stringify(z) !== JSON.stringify([0x66,0xe9,0x4b,0xd4,0xef,0x8a,0x2c,0x3b,0x88,0x4c,0xfa,0x59,0xca,0x34,0x2b,0x2e])) fail("AES zero vector");
    var k = rsaKeyPair(16);
    var m = 42;
    if (rsaDecrypt(rsaEncrypt(m, k), k) !== m) fail("RSA roundtrip");
    // DH: A = g^a, B = g^b, shared secret identity B^a == A^b
    var A2 = modPow(2, 3, 23), B2 = modPow(2, 6, 23);
    if (dhShared(B2, 3, 23) !== dhShared(A2, 6, 23)) fail("DH shared mismatch");
    if (dhShared(2, 7, 23) !== 13) fail("DH known vector");
    if (modInv(3, 100) !== 67) fail("modinv");
    return ok;
  }

  window.Ciphers = {
    caesarEnc: caesarEnc, caesarDec: caesarDec,
    atbashEnc: atbashEnc, atbashDec: atbashDec,
    railFenceEnc: railFenceEnc, railFenceDec: railFenceDec,
    playfairEnc: playfairEnc, playfairDec: playfairDec,
    aesExpand: aesExpand, aesEncryptBlock: aesEncryptBlock, aesDecryptBlock: aesDecryptBlock,
    _rounds: { addRoundKey: aesAddRoundKey, subBytes: aesSubBytes, invSubBytes: aesInvSubBytes, shiftRows: aesShiftRows, invShiftRows: aesInvShiftRows, mixCol: aesMixCol, invMixCol: aesInvMixCol, SBOX: SBOX, xtime: xtime },
    gmul: gmul, modPow: modPow, modInv: modInv,
    rsaKeyPair: rsaKeyPair, rsaEncrypt: rsaEncrypt, rsaDecrypt: rsaDecrypt,
    dhShared: dhShared,
    hex: function (arr) { return arr.map(function (b) { return ("0" + (b & 255).toString(16)).slice(-2); }).join(" "); },
    validate: validate
  };
  if (typeof window !== "undefined") window.Ciphers.validate();
})();
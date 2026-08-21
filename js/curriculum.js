/* Content model derived from the four Cryptography History posts on pjq.me. */
(function(){
  var C=[
    {id:'classical',title:'Classical Cryptography · 古典密码学',color:'#ffca5c',source:'https://pjq.me/?p=2461',lessons:[
      ['foundations','Plaintext, ciphertext & the cryptographic promise','明文、密文与密码学承诺','Start with the problem: transform a message so an observer can see traffic but cannot understand it. Confidentiality is only one goal; integrity, authenticity and availability matter too.','substitution'],
      ['caesar','Caesar cipher & ROT13','凯撒密码与 ROT13','Shift every alphabetic symbol by a key. The tiny keyspace makes exhaustive search and brute force visible.','caesar'],
      ['frequency','Frequency analysis','频率分析','Substitution changes symbols but preserves language statistics. Use an English frequency chart to attack a monoalphabetic cipher.','frequency'],
      ['pigpen','Pigpen cipher','猪圈密码','A geometric substitution cipher: replace each letter with its surrounding grid shape. Learn why a secret alphabet is not a secure modern design.','pigpen'],
      ['rail','Rail Fence transposition','栅栏密码','Keep the symbols and reorder their positions along a zig-zag rail pattern. Compare substitution and transposition.','rail'],
      ['playfair','Playfair digraph cipher','Playfair 双字母密码','Build a keyed 5×5 square, split plaintext into pairs, and transform pairs by row/column geometry.','playfair'],
      ['enigma','Enigma, rotors & Turing','恩尼格玛、转子与图灵','A changing substitution machine. Rotor stepping defeats simple frequency inspection, but operational weaknesses and captured settings matter.','enigma'],
      ['modern','From handcrafted rules to hard problems','从手工规则到数学难题','Modern cryptography grounds security in computational assumptions: factorization, discrete logarithms and elliptic-curve problems.','modern']
    ]},
    {id:'symmetric',title:'Symmetric Cryptography · 对称加密',color:'#8ef7a5',source:'https://pjq.me/?p=2474',lessons:[
      ['shared','One secret key, two directions','共享密钥','Symmetric encryption is fast: the same secret protects encryption and decryption. The key-distribution problem leads to public-key cryptography.','shared'],
      ['blocks','Block ciphers vs stream ciphers','分组密码与流密码','Large data is divided into fixed-size blocks, while stream constructions combine a keystream with plaintext.','blocks'],
      ['des','DES and the Feistel network','DES 与 Feistel 网络','Explore 64-bit blocks, 56-bit effective keys and 16 Feistel rounds. Brute force and 3DES explain its retirement.','des'],
      ['aes-round','AES structure & key expansion','AES 结构与密钥扩展','AES uses a 128-bit block, 128/192/256-bit keys and an SPN: SubBytes, ShiftRows, MixColumns and AddRoundKey.','aes'],
      ['ecb','ECB pattern leakage','ECB 模式图案泄漏','Identical plaintext blocks produce identical ciphertext blocks. An encrypted image can still reveal its outline.','ecb'],
      ['cbc','CBC chaining and IVs','CBC 链式与 IV','XOR each plaintext block with the previous ciphertext block. The IV provides the first unpredictable input, but encryption is sequential.','cbc'],
      ['ctr','CTR, nonce uniqueness & XOR reuse','CTR、Nonce 唯一性与 XOR 重用','CTR turns a block cipher into a stream-like construction. Reusing a nonce repeats the keystream and exposes M1 XOR M2.','ctr'],
      ['gcm','GCM confidentiality plus integrity','GCM 保密性与完整性','GCM combines CTR encryption with an authentication tag. Tampered ciphertext must be rejected, and nonces must never repeat.','gcm'],
      ['hmac','MAC, length extension & HMAC','MAC、长度扩展与 HMAC','A naive keyed hash can expose a length-extension attack. HMAC uses nested ipad/opad hashing to provide message authentication.','hmac']
    ]},
    {id:'asymmetric',title:'Public-Key Observatory · 非对称密码学',color:'#b78cff',source:'https://pjq.me/?p=2490',lessons:[
      ['channel','The hostile public channel','不可信的公开信道','Wi-Fi, routers and gateways can observe or alter traffic. The application needs secrecy and authentication without a pre-shared secret.','channel'],
      ['rsa-math','RSA number workshop','RSA 数学实验室','Choose p and q, calculate N and φ(N), select e, and find d so e·d ≡ 1 mod φ(N).','rsa'],
      ['rsa-attack','Raw RSA and small-message attacks','原始 RSA 与小消息攻击','Textbook RSA is deterministic and multiplicative. Small messages can remain exposed without randomized padding.','rsa-attack'],
      ['oaep','OAEP randomized padding','OAEP 随机填充','OAEP transforms a message using a random seed before RSA exponentiation, so equal plaintexts do not create equal ciphertexts.','oaep'],
      ['square','Square-and-multiply timing','平方-乘法与时间攻击','Modular exponentiation branches on secret exponent bits. Timing differences can leak information unless implementations are hardened.','square'],
      ['signature','Digital signatures','数字签名','Hash the document, sign with the private key, and verify with the public key. This gives integrity and origin authentication.','signature'],
      ['dh','Diffie-Hellman key exchange','Diffie-Hellman 密钥交换','Exchange g^a and g^b without sending a or b. Both sides derive g^(ab), relying on the discrete-log problem.','dh'],
      ['mitm','DH man-in-the-middle','DH 中间人攻击','Unauthenticated DH establishes secrets with whoever is in the middle. Signatures or authenticated key confirmation bind keys to identities.','mitm'],
      ['pfs','Perfect Forward Secrecy','完美前向保密','Ephemeral DH keys limit the damage of a later long-term-key compromise: old sessions remain protected.','pfs'],
      ['ecc','ECC point arithmetic','椭圆曲线点运算','Visualize point addition and repeated scalar multiplication. ECC offers strong security with shorter keys than RSA.','ecc'],
      ['hybrid','Hybrid encryption mission','混合加密任务','Use public-key exchange to protect a fresh symmetric key, then use AES-GCM for bulk data and signatures for identity.','hybrid']
    ]},
    {id:'quantum',title:'Quantum Frontier · 后量子密码学',color:'#62f4ff',source:'https://pjq.me/?p=2505',lessons:[
      ['threat','What quantum computers threaten','量子计算威胁什么','RSA, DH and ECC depend on problems Shor can attack. AES is affected differently because its security is a key-search problem.','threat'],
      ['shor','Shor factorization','Shor 因式分解','Period finding makes large integer factorization and discrete logarithms tractable on a sufficiently capable quantum computer.','shor'],
      ['grover','Grover search','Grover 搜索','Grover gives a quadratic search speedup: AES-128 is roughly 64-bit against idealized quantum search, while AES-256 remains about 128-bit.','quantum'],
      ['lattice','Lattice-based intuition','格密码直觉','Short vectors and noisy linear relations create hard problems used by modern post-quantum constructions.','lattice'],
      ['hashsig','Hash-based signatures','基于哈希的签名','SLH-DSA/SPHINCS+ trades larger signatures for conservative security based on hash functions.','hashsig'],
      ['standards','NIST PQC standards','NIST 后量子标准','ML-KEM/FIPS 203 protects key establishment; ML-DSA/FIPS 204 signs; SLH-DSA/FIPS 205 provides a hash-based signature alternative; HQC is a further standardization candidate.','standards'],
      ['migration','Crypto-agility & migration','密码敏捷与迁移','Inventory algorithms, identify long-lived secrets, deploy hybrid transitions, and design for algorithm rotation rather than another hard-coded dependency.','migration']
    ]}
  ];
  var by={};C.forEach(function(ch){ch.lessons.forEach(function(x){by[x[0]]={id:x[0],title:x[1],zh:x[2],body:x[3],kind:x[4],chapter:ch.id,chapterTitle:ch.title,color:ch.color,source:ch.source};});});
  window.CURRICULUM={chapters:C,byId:by,all:C.reduce(function(a,c){return a.concat(c.lessons.map(function(x){return by[x[0]];}));},[])};
})();
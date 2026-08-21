# CryptoWorld 3D · 密码学世界 3D

An offline-first, professional three-day cryptography training companion. The learning path follows Jianqing Peng's series while organizing it into the actual training structure: Day 1 introduction/classical cryptography, Day 2 symmetric cryptography, and Day 3 asymmetric cryptography with post-quantum cryptography as the closing outlook.

**Live deployment:** `https://chitchat.pjq.me/download/cryptography/`  
**Repository:** `git@github.com:pjq/Cryptography-Qwen3.8-27B.git`

## Product goals

- Make the historical arc visible: Caesar and transposition, Enigma, AES, RSA/DH, and quantum threats.
- Let learners manipulate real, inspectable toy algorithms instead of watching a passive slideshow.
- Work without a build step or third-party network dependency.
- Serve English and Simplified Chinese with locale persistence.
- Be honest about boundaries: demonstrations are not secure production implementations.

## Features

- Procedural 3D world with seven islands and animated cipher monoliths.
- A complete 35-lesson, three-day curriculum mapped to the source posts: Day 1 classical, Day 2 symmetric, Day 3 asymmetric plus post-quantum outlook. Topics include frequency analysis, Pigpen, DES/Feistel, all AES modes, HMAC, OAEP, signatures, DH/MITM/PFS, ECC, hybrid encryption, Shor, Grover and PQC migration.
- Orbit, zoom, map navigation, responsive layout, PWA installability, and offline cache.
- Specialized labs for Caesar, Rail Fence, Enigma-style rotors, AES/S-box, RSA and quantum search, plus a generic interactive lesson renderer for every remaining curriculum topic.
- AES implementation validated against FIPS-197 Appendix B (`3243f6a8885a308d313198a2e0370734` → `3925841d02dc09fbdc118597196a0b32`).
- Pure-JS unit tests for Caesar, Atbash, Rail Fence, Playfair, AES, RSA, DH, and modular inverse.

## Development

Requirements: Node.js 18+ and a static HTTP server for browser testing. No `npm install` is required.

```sh
node tests/ciphers.test.js
npm run check
python3 -m http.server 8200
# open http://localhost:8200
```

`file://` is not a supported runtime because service workers and some browser security APIs require HTTP.

## Repository layout

```text
index.html              runtime shell and script loading order
css/style.css           responsive HUD, panels, exercises
js/i18n.js              locale state and strings
js/curriculum.js        35-lesson source-aligned curriculum
js/ciphers.js           pure educational algorithms + self-validation
js/world.js             procedural Three.js scene
js/controls.js          pointer orbit controls
js/act/                 station exercises
lib/three.min.js        vendored Three.js runtime
sw.js                   offline cache
manifest.json           PWA metadata
tests/                  Node regression and curriculum coverage tests
docs/                   architecture, pedagogy, operations
```

## Safety and pedagogy

The RSA and DH stations use small parameters so learners can see the arithmetic. They are deliberately unsuitable for security. AES is implemented for educational block-level visualization and is not a replacement for Web Crypto or a reviewed cryptographic library. Production systems should use authenticated encryption, padding, key lifecycle controls, side-channel-safe implementations, and current standards.

The post-quantum island reflects the blog series' main distinction: Shor's algorithm threatens factoring/discrete-log public-key systems, while Grover provides a quadratic search speedup against symmetric keys. The practical migration message is inventory → hybrid transition → crypto-agility → rotation.

## Deployment

The VPS uses nginx with the public root `/mnt/backup_ssf/chitchat/`. Deploy the static app as `download/cryptography/`. See [`docs/operations.md`](docs/operations.md) for the exact non-root deployment and verification flow.

## License

MIT. Three.js remains under its own license; see the vendored library header.

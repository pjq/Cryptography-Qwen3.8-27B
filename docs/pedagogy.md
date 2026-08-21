# Learning design

## Journey

The route mirrors the author's four-post series on pjq.me:

- Classical: [`?p=2461`](https://pjq.me/?p=2461) — Caesar, Rail Fence, Playfair, Enigma, and the transition to modern cryptography.
- Symmetric: [`?p=2474`](https://pjq.me/?p=2474) — DES, AES, ECB/CBC/CTR/GCM, MAC/HMAC.
- Asymmetric: [`?p=2490`](https://pjq.me/?p=2490) — RSA/OAEP, signatures, DH/PFS, ECC, hybrid encryption.
- Post-quantum: [`?p=2505`](https://pjq.me/?p=2505) — Shor vs Grover, standards, and migration recommendations.

## Interaction principles

Every station has a one-minute experiment, a visible output, and a concise conceptual takeaway. The map makes chronology spatial; the exercises make diffusion, substitution, key exchange, and attack models concrete.

## Accuracy boundaries

The app distinguishes intuition from deployable cryptography. Toy RSA/DH values are intentionally tiny. The AES block exercise uses a known-answer vector but omits modes, authentication, nonce lifecycle, and side-channel hardening. Learners should use the Web Crypto API or audited libraries in real systems.

# Real Practical Cryptography Labs — Build Plan

**Status:** Approved implementation plan  
**Scope:** Replace all generic step/checklist labs with real input → calculation → output → misuse/attack → explanation → assessment labs.  
**Course:** Three-day cryptography training  
**Companion document:** [`course-redesign-plan.md`](course-redesign-plan.md)

---

## 1. Definition of done

A course lesson is **not** a practical lab because it has a title, prose, a step list, or a “complete” button.

A lab is complete only when the learner can:

1. See the task and success criteria.
2. Enter or choose meaningful inputs.
3. Execute a real deterministic teaching calculation.
4. Inspect intermediate values where they are educationally useful.
5. Observe the output.
6. Modify an input, key, nonce, ciphertext, network message, or protocol decision.
7. Observe the resulting attack, rejection, or security failure.
8. Reset and repeat the experiment.
9. Answer a lesson-specific knowledge check.
10. Receive an explanation for both correct and incorrect answers.

The course must never present a generic “complete step 1” checklist as a practical laboratory.

---

## 2. Lab user experience contract

Every lab uses the same visible structure.

```text
┌────────────────────────────────────────────────────────────┐
│ Lab title · duration · learning outcome                     │
├──────────────────┬─────────────────────────────────────────┤
│ 1. Inputs        │ 2. Calculation / protocol trace          │
│                  │                                          │
│ text fields      │ round state / diagram / network           │
│ selects          │ intermediate values                       │
│ ranges           │ highlighted changed values                │
│ action buttons   │                                          │
├──────────────────┴─────────────────────────────────────────┤
│ 3. Result                                                    │
│ expected output · attack outcome · explanation               │
├────────────────────────────────────────────────────────────┤
│ Reset lab             Check answer             Complete      │
└────────────────────────────────────────────────────────────┘
```

### Required controls

| Control | Requirement |
|---|---|
| **Run / Encrypt / Calculate / Send** | Performs the current operation; never a decorative button. |
| **Reset** | Restores the lab’s documented initial state without erasing course progress. |
| **Show worked example** | Loads a known-good training scenario. |
| **Try attack / Tamper / Intercept** | Available when an attack or failure mode is the lesson outcome. |
| **Explain result** | Reveals or focuses the interpretation after the learner has run the operation. |
| **Knowledge check** | Required before lesson completion for major labs. |

### Required result fields

Every lab result must show:

```text
Input used
Calculated output
Important intermediate values
Expected security property
Observed failure or protection
Plain-language explanation
```

### Input validation

- Validate before calculation.
- Explain invalid values in context, for example: “CTR nonce must be an integer between 0 and 255 in this teaching model.”
- Do not silently coerce security-critical values.
- Mark teaching-only values explicitly.
- Preserve the learner’s inputs after validation failure.

---

## 3. Lab state model

All labs should conform to one state shape; each lab may add domain fields.

```js
{
  id: 'ctr-nonce-reuse',
  status: 'not_started', // not_started | active | result | completed
  inputs: {
    messageOne: 'ATTACK AT DAWN',
    messageTwo: 'MEET AT THE BRIDGE',
    key: 'teaching-key-01',
    nonce: 42
  },
  output: null,
  trace: [],
  attack: {
    enabled: false,
    result: null
  },
  assessment: {
    answer: null,
    correct: false,
    attempts: 0
  }
}
```

### Required lab API

```js
const lab = {
  id: 'ctr-nonce-reuse',
  title: 'CTR nonce reuse attack',
  initialState() {},
  validate(state) {},
  run(state) {},
  attack(state) {},       // optional
  reset() {},
  assess(answer, state) {},
  render(container, state) {},
  describeResult(state) {}
};
```

The `run` and `attack` functions must be pure or deterministically seeded where possible. This permits unit testing and repeatable instructor demonstrations.

---

## 4. Technical architecture

### 4.1 New modules

```text
js/labs/
  engine.js                 shared state, validation, reset, completion
  components.js             input, output, trace, alert, assessment helpers
  classical.js              Day 1 lab implementations
  symmetric.js              Day 2 lab implementations
  asymmetric.js             Day 3 lab implementations
  pqc.js                    Day 3 closing-outlook labs
js/visualizations/
  alphabet-wheel.js
  frequency-chart.js
  cipher-grid.js
  block-pipeline.js
  aes-state.js
  protocol-sequence.js
  ecc-plot.js
  migration-matrix.js
js/course-content.js        lesson text, lab configuration, checks, references
js/course-app.js            route and lesson renderer; mounts registered labs
```

### 4.2 Preserve and reuse existing code

The current `js/ciphers.js` contains tested teaching implementations for Caesar, Rail Fence, Playfair, AES, RSA and DH. Reuse their deterministic functions through small lab adapters. Do not duplicate cryptographic calculations in DOM-rendering code.

### 4.3 Clear boundary

```text
Ciphers / math functions       → deterministic calculation
Lab adapter                    → validation, state transition, trace data
Visualization                  → SVG/HTML representation of trace
Course shell                   → route, progress, completion and sidebar
```

### 4.4 No production-crypto claim

- RSA/DH small-number calculations are educational only.
- Browser JavaScript exercises are not production cryptography.
- Real application guidance must point to Web Crypto or audited libraries, AEAD, unique nonces, validated key management and current standards.

---

## 5. Common component library

Build these once and reuse them across all labs.

| Component | Purpose |
|---|---|
| `LabFrame` | Title, objective, run/reset, result and completion shell |
| `InputField` | Label, help text, validation and error state |
| `HexField` | Fixed-length teaching hex input with grouping and validation |
| `NumberField` | Bounded integer input for toy primes, shifts, nonces and rails |
| `TraceTable` | Ordered calculation rows with current-row highlight |
| `ByteGrid` | AES state/key matrix display |
| `BitGrid` | Block/bit mutation display |
| `FlowDiagram` | SVG data-flow for modes and protocol messages |
| `NetworkDiagram` | Alice/Bob/Mallory interaction and message replacement |
| `ResultCard` | success, warning, attack succeeded, authentication failed |
| `Assessment` | question, answers, explanation, retry and score state |
| `TeachingWarning` | persistent “educational model only” warning for toy crypto |

---

## 6. Day 1: Introduction and classical cryptography labs

### 6.1 Foundations — threat-model annotation

**Learner inputs**

- Select attacker capabilities: observe, modify, replay, impersonate.
- Select requested property: confidentiality, integrity, authentication.

**Calculated output**

- Threat-to-control matrix.
- Missing controls highlighted.

**Challenge**

Given “Transfer 100 credits,” identify why encryption alone does not stop a modification to “Transfer 900 credits.”

**Success condition**

Learner correctly identifies integrity/authentication as missing.

---

### 6.2 Caesar — encryption, decryption and brute force

**Inputs**

```text
Plaintext
Shift key 0–25
Ciphertext for attack mode
```

**Output / trace**

```text
Plaintext letter | numeric value | + key | mod 26 | ciphertext letter
```

**Attack mode**

- Generate every candidate shift.
- Learner selects readable plaintext.
- Optional English-score indicator explains why language makes the answer recognizable.

**Success condition**

Learner recovers the target plaintext and explains that the 26-key space is exhaustible.

---

### 6.3 Frequency analysis — substitution attack workbench

**Inputs**

```text
Ciphertext
Candidate substitution mapping: ciphertext symbol → plaintext symbol
```

**Output / trace**

- Letter count table.
- Frequency bar chart.
- Sorted symbol ranking.
- Live partial plaintext.
- Repeated bigram / trigram list.
- Mapping conflicts.

**Attack mode**

- Provide a fixed monoalphabetic ciphertext and optional hint ladder.
- Learner proposes mappings and unlocks partial words.

**Success condition**

Learner recovers a defined percentage of the message and identifies why a fixed substitution leaks language statistics.

---

### 6.4 Pigpen — symbol mapping reconstruction

**Inputs**

```text
Select a grid/dot group
Select plaintext letters
```

**Output / trace**

- Symbol-to-letter mapping board.
- Encoded phrase.
- Repeated symbol indicators.

**Attack mode**

- Compare repeated plaintext letters with repeated glyphs.

**Success condition**

Learner identifies that unusual symbols still form a fixed substitution alphabet.

---

### 6.5 Rail Fence — encode and reconstruct

**Inputs**

```text
Plaintext
Rail count: 2–6
Ciphertext to reconstruct
```

**Output / trace**

- SVG zig-zag path.
- Rail rows populated character by character.
- Ciphertext readout.
- Reverse reconstruction animation.

**Attack mode**

- Try candidate rail counts.
- Compare readable outputs.

**Success condition**

Learner reconstructs a supplied ciphertext and explains that letter frequency is unchanged.

---

### 6.6 Playfair — key-square builder

**Inputs**

```text
Keyword
Plaintext digraph
```

**Output / trace**

- 5×5 square.
- Normalized plaintext and inserted filler letters.
- Pair coordinates.
- Rule selected: row / column / rectangle.
- Ciphertext digraph.

**Challenge**

Encrypt then decrypt a phrase containing a repeated letter.

**Success condition**

Learner correctly identifies and applies all three transformation rules.

---

### 6.7 Enigma — rotor and crib analysis

**Inputs**

```text
Rotor order
Rotor start positions
Ring settings (optional advanced mode)
Plaintext/ciphertext
Crib
```

**Output / trace**

- Rotor stepping state per character.
- Forward wiring path.
- Reflector path.
- Return path.
- Output character.

**Attack mode**

- Use a known crib to eliminate incompatible toy settings.
- Explain why no letter encrypts to itself in the teaching model.

**Success condition**

Learner traces a character and uses a crib to reject at least one impossible setting.

---

### 6.8 Modern assumptions — hardness comparison

**Inputs**

- Choose factorization, discrete logarithm or ECC scalar problem.
- Choose toy parameter size.

**Output / trace**

- Toy attack operation count.
- “Teaching scale” versus “production scale” warning.
- Assumption-to-protocol map.

**Success condition**

Learner identifies what secret an attacker is attempting to recover and why toy parameters are not secure.

---

## 7. Day 2: Symmetric cryptography labs

### 7.1 Shared-key and block/stream foundations

**Inputs**

```text
Message length
Block size
Mode: padded block / counter stream
```

**Output**

- Block segmentation.
- Padding bytes where relevant.
- Keystream alignment where relevant.

**Success condition**

Learner explains why the block primitive alone does not define message encryption.

---

### 7.2 DES Feistel round explorer

**Inputs**

```text
Toy left half L0
Toy right half R0
Round key K1
```

**Output / trace**

```text
F(R0, K1)
L1 = R0
R1 = L0 XOR F(R0, K1)
```

**Challenge**

Apply the round backwards with the reverse key order.

**Success condition**

Learner predicts one round output before reveal and identifies the 56-bit key-space limitation.

---

### 7.3 AES state and round explorer

**Inputs**

```text
16-byte plaintext state
16-byte key
Round selector
```

**Output / trace**

- 4×4 state before and after every operation.
- SubBytes mappings.
- ShiftRows position moves.
- MixColumns arithmetic summary.
- Round-key XOR values.
- Key-expansion word trace.

**Challenge**

Predict a byte location after ShiftRows or identify the omitted final-round operation.

**Success condition**

Learner can trace a supplied FIPS-197 teaching vector through one full round.

---

### 7.4 ECB pattern leakage

**Inputs**

```text
Block pattern grid
AES key (fixed teaching key)
Mode: ECB / CBC / CTR
```

**Output**

- Input block IDs.
- Output block IDs / ciphertext duplicates.
- Pattern preview.

**Attack mode**

Switch from ECB to CBC/CTR and compare duplicate ciphertext blocks.

**Success condition**

Learner demonstrates that identical ECB plaintext blocks produce identical ciphertext blocks.

---

### 7.5 CBC chaining and bit-flip propagation

**Inputs**

```text
Two or three plaintext blocks
IV
Ciphertext bit to flip
```

**Output / trace**

- `P1 XOR IV` and later `Pi XOR C(i−1)` values.
- Resulting decrypted blocks after bit mutation.
- Changed-bit highlight.

**Success condition**

Learner identifies garbling of one block and predictable influence on the following block, then states why CBC needs authentication.

---

### 7.6 CTR nonce-reuse attack

**Inputs**

```text
Message 1
Message 2
Teaching key
Nonce 1
Nonce 2
```

**Output / trace**

```text
Keystream 1 / Keystream 2
C1 = M1 XOR KS1
C2 = M2 XOR KS2
C1 XOR C2
M1 XOR M2
```

**Attack mode**

- Set `Nonce 2 = Nonce 1`.
- Supply known plaintext for part of message 1.
- Recover corresponding message-2 bytes.

**Success condition**

Learner demonstrates the equality `C1 XOR C2 = M1 XOR M2` after nonce reuse and explains why a public nonce may still be safe when unique.

---

### 7.7 GCM authenticated-encryption tampering

**Inputs**

```text
Plaintext
Associated data
Nonce
Ciphertext bit to mutate
Tag bit to mutate
```

**Output / trace**

- Ciphertext.
- Authentication tag.
- Verification result.
- Explicit “plaintext must not be released” state when verification fails.

**Success condition**

Learner causes tag verification failure by altering ciphertext or associated data and explains nonce uniqueness.

---

### 7.8 Naive MAC and HMAC comparison

**Inputs**

```text
Secret key (teaching value)
Message
Appended attacker data
Construction: Hash(K || M) / HMAC(K, M)
```

**Output / trace**

- Inner/outer HMAC values.
- Naive construction state.
- Forgery acceptance/rejection result.

**Success condition**

Learner distinguishes integrity from confidentiality and explains why HMAC is not merely a hash prefix.

---

## 8. Day 3: Asymmetric cryptography labs

### 8.1 Public-channel threat mapping

**Inputs**

- Alice/Bob/Mallory actions.
- Security objective selection.

**Output**

- Protocol properties still missing after chosen controls.

---

### 8.2 RSA key-generation workshop

**Inputs**

```text
p, q
public exponent e
message M
```

**Output / trace**

```text
N = p × q
φ(N) = (p−1)(q−1)
d = e⁻¹ mod φ(N)
C = Mᵉ mod N
M = Cᵈ mod N
```

**Validation**

- Reject non-primes, equal primes, invalid exponent, out-of-range message.

**Success condition**

Learner produces a valid toy keypair and verifies decryption.

---

### 8.3 Raw RSA versus OAEP

**Inputs**

```text
Same plaintext twice
Mode: raw RSA / OAEP teaching model
Random seed (shown in teaching mode)
```

**Output**

- Two ciphertexts.
- Equality comparison.
- OAEP seed/mask trace.

**Success condition**

Learner shows raw RSA determinism and OAEP randomized output.

---

### 8.4 Square-and-multiply timing trace

**Inputs**

```text
Base
Exponent bits
Modulus
Noise setting
```

**Output**

- Square/multiply operation trace.
- Branch count.
- Simulated timing chart.

**Success condition**

Learner identifies how secret-dependent operation patterns create a side-channel risk.

---

### 8.5 Digital signature and document tampering

**Inputs**

```text
Document
Teaching private/public key pair
Byte to modify
```

**Output**

- Digest before/after.
- Signature.
- Verification result.

**Success condition**

Learner signs, verifies, modifies a byte, and sees verification fail.

---

### 8.6 Certificate-chain validation

**Inputs**

- Leaf / intermediate / root certificate chain.
- Date, hostname and trust-store selection.
- One tampering or expired-certificate condition.

**Output**

- Chain validation trace.
- Failure location and explanation.

**Success condition**

Learner identifies why a mathematically valid key is not enough without a trusted identity binding.

---

### 8.7 Diffie-Hellman exchange

**Inputs**

```text
p, g
a, b
```

**Output / trace**

```text
A = gᵃ mod p
B = gᵇ mod p
Alice secret = Bᵃ mod p
Bob secret = Aᵇ mod p
```

**Success condition**

Learner independently verifies matching toy shared secrets.

---

### 8.8 DH man-in-the-middle

**Inputs**

- Mallory intercept toggle.
- Mallory exponents.
- Signature/authentication toggle.

**Output**

```text
Alice ↔ Mallory secret
Mallory ↔ Bob secret
Original / altered / re-encrypted message flow
```

**Success condition**

Learner performs the attack, then adds transcript authentication and sees interception fail.

---

### 8.9 Perfect Forward Secrecy timeline

**Inputs**

- Static DH / ephemeral DH.
- Session count.
- Long-term key compromise time.

**Output**

- Session timeline.
- Which historical sessions are recoverable.

**Success condition**

Learner explains why later identity-key compromise does not expose previously erased ephemeral session secrets.

---

### 8.10 ECC point arithmetic

**Inputs**

- Teaching curve.
- Point P.
- Operation: `P + Q`, `2P`, or `kP`.

**Output**

- SVG coordinate plot.
- Secant/tangent line.
- Result point.
- Scalar multiplication trace.

**Success condition**

Learner performs point doubling and scalar multiplication, then identifies the scalar-recovery assumption.

---

### 8.11 Hybrid-encryption capstone

**Inputs**

- Algorithm choices for identity, key establishment, data encryption and authentication.
- Nonce/key reuse choices.
- Compromise scenario.

**Output**

- Protocol sequence diagram.
- Derived security properties.
- Missing-control warnings.
- Capstone score.

**Required correct shape**

```text
Authenticate peer
→ authenticated ephemeral key exchange
→ derive fresh session key
→ encrypt bulk data with AES-GCM
→ verify tag before release
→ rotate/erase session secrets as required
```

**Success condition**

Learner builds a protocol that satisfies confidentiality, integrity, authenticity and forward secrecy in the teaching scenario.

---

## 9. Day 3 closing outlook: post-quantum labs

### 9.1 Shor / Grover impact matrix

**Inputs**

- Select algorithm: RSA, DH, ECC, AES-128, AES-256, hash.
- Select attacker model: classical, idealized quantum.

**Output**

- Attack family.
- Relative impact.
- Migration recommendation.

### 9.2 Lattice intuition

**Inputs**

- 2D teaching basis.
- Noise level.
- Secret vector.

**Output**

- Lattice plot.
- Noisy public point.
- Decoding result.

### 9.3 Hash-signature one-time-key exercise

**Inputs**

- Message.
- Leaf index.
- Reuse toggle.

**Output**

- Hash path to root.
- One-time-key warning.

### 9.4 PQC standards selector

**Inputs**

- System role: key establishment, signing, conservative signature fallback.
- Compatibility/performance constraints.

**Output**

- Candidate: ML-KEM, ML-DSA or SLH-DSA.
- Constraints requiring operational review.

### 9.5 Migration planner capstone

**Inputs**

- Service inventory: TLS, mobile application, document signing, long-lived archive.
- Data lifetime.
- Current algorithms.
- Upgrade/rollback capability.

**Output**

- Migration priority.
- Hybrid transition recommendation.
- Required inventory, interoperability and rotation actions.

---

## 10. Delivery order

Do not build 35 superficial widgets in parallel. Deliver complete, tested vertical slices.

### Milestone 1 — Lab engine and Day 1 core

1. `LabFrame`, input validation, result cards, trace table, reset and assessment.
2. Caesar encryption/decryption and brute force.
3. Frequency analysis workbench.
4. Rail Fence reconstruction.
5. Playfair square builder.
6. Enigma rotor trace.
7. Day 1 practical assessment.

**Exit criteria:** Day 1 can be taught entirely with live learner input and visible output.

### Milestone 2 — Day 2 core cryptography

1. Shared-key/block-stream segmentation.
2. DES Feistel round trace.
3. AES state and key expansion explorer.
4. ECB/CBC comparison.
5. CTR nonce-reuse attack.
6. GCM tamper rejection.
7. HMAC comparison.
8. Day 2 practical assessment.

**Exit criteria:** Learners can demonstrate why ECB and CTR nonce reuse fail, and why GCM/HMAC enforce integrity.

### Milestone 3 — Day 3 public-key protocol labs

1. RSA key workshop.
2. Raw RSA/OAEP comparison.
3. Sign/modify/verify exercise.
4. Certificate-chain validation.
5. DH exchange and MITM.
6. PFS timeline.
7. ECC point arithmetic.
8. Hybrid-encryption capstone.

**Exit criteria:** Learners can build and explain a secure channel rather than only naming algorithms.

### Milestone 4 — PQC outlook and instructor package

1. Shor/Grover impact matrix.
2. Lattice and hash-signature intuition labs.
3. Standards selector.
4. Migration planner capstone.
5. Instructor timing, answer key and workshop facilitation notes.

---

## 11. Test plan

### Unit tests

- Every calculation has deterministic expected values.
- Caesar, Rail Fence, Playfair, AES, RSA and DH adapt existing tests.
- XOR, encoding, nonce handling and teaching-mode validation have edge-case tests.
- Each lab’s `reset()` returns the documented initial state.

### Content contract tests

Every lab must declare:

```text
id
inputs
validation
run calculation
result fields
attack or failure interaction where applicable
reset
assessment
success criterion
```

The test suite must fail if a curriculum lesson falls back to generic checklist behavior.

### Browser integration tests

For every lab:

1. Open direct hash route.
2. Enter known inputs.
3. Run the calculation.
4. Assert output and trace fields.
5. Trigger the attack or mutation.
6. Assert the expected failure/protection result.
7. Reset.
8. Complete the correct assessment.
9. Confirm persisted completion state.

### Visual/accessibility tests

- Keyboard-only operation.
- Screen-reader labels for inputs, output regions and SVG diagrams.
- `aria-live` result changes.
- No color-only security result.
- Mobile layout at 320px width.
- `prefers-reduced-motion` compatible visualizations.

---

## 12. Acceptance criteria

The practical course is ready only when:

- [ ] No lesson uses a generic checklist as its laboratory.
- [ ] Every lesson has visible learner inputs and computed outputs.
- [ ] Every major construction exposes its relevant failure case or misuse.
- [ ] Every lab shows a plain-language security interpretation.
- [ ] Every lab can be reset and replayed.
- [ ] Every major lab includes a testable assessment.
- [ ] Lab calculations are deterministic and unit tested.
- [ ] Browser tests cover one complete lab flow for all 35 lessons.
- [ ] Day 1, Day 2 and Day 3 each end with a practical assessment.
- [ ] The hybrid-encryption capstone requires correct protocol composition.
- [ ] The migration capstone produces a justified PQC plan.
- [ ] Teaching-only cryptography is clearly separated from production guidance.

---

## 13. Immediate implementation action

Start **Milestone 1** with the reusable lab engine and fully implement the first two real learner-facing labs:

1. **Caesar encrypt/decrypt/brute-force lab** — extend the existing live cipher into trace and attack mode.
2. **Frequency-analysis workbench** — ciphertext input, live count table, histogram, mapping board, partial recovery and hint ladder.

These establish the component patterns required for every later lab: structured inputs, deterministic calculation, trace, attack mode, output, reset, assessment and persisted completion.

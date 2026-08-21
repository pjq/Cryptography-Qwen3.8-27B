# CryptoWorld → Professional Three-Day Cryptography Training

**Status:** Proposed redesign plan  
**Decision:** Retire the navigable 3D world. Build a structured, accessible, responsive 2D interactive training application.  
**Audience:** Learners attending a three-day cryptography introduction course.  
**Source material:** Jianqing Peng's four-post cryptography series:

- Classical cryptography — <https://pjq.me/?p=2461>
- Symmetric cryptography — <https://pjq.me/?p=2474>
- Asymmetric cryptography — <https://pjq.me/?p=2490>
- Post-quantum cryptography — <https://pjq.me/?p=2505>

---

## 1. Problem statement

The current implementation is a visual prototype. The floating-island Three.js world does not support professional training well:

- Learners cannot reliably discover what is interactive.
- Navigation is spatially ambiguous and slow compared with a curriculum outline.
- The 3D scene is decorative rather than explanatory.
- Click behavior is indirect; some interactions appear to do nothing.
- The world has weak hierarchy, weak progress signaling, and no course-level assessment flow.
- The generic lesson renderer is insufficient for a guided technical lab.
- WebGL creates accessibility, performance, testability, and mobile usability costs without corresponding instructional value.

The redesign must make the **course sequence, lesson objective, guided lab, answer feedback, and assessment** the product. Visualizations must explain a cryptographic property, attack, or protocol step—not act as decoration.

---

## 2. Product principles

### 2.1 Training first

A learner must always know:

1. Which training day and module they are in.
2. The current lesson's objective and duration.
3. What they need to do next.
4. Whether the current exercise is complete.
5. Why an answer, attack, or protocol outcome is correct or incorrect.

### 2.2 No decorative 3D

- Remove floating islands, orbit controls, star fields, rings, procedural monoliths, and random glyphs.
- Do not replace them with pseudo-3D gradients or generic dashboard decoration.
- Use SVG, Canvas, and semantic HTML only where they clarify an idea.
- Use a restrained Material-inspired UI language: light surfaces, Google-blue primary actions, rounded cards, clear focus states, and no gradients or glow. This is an interaction and layout reference, not a copy of Google branding.

### 2.3 Explain failure modes

Each cryptographic construction should expose its corresponding failure mode:

| Construction | Required failure demonstration |
|---|---|
| Caesar | Brute force and frequency analysis |
| Rail Fence / Playfair | Structural weakness and limited key space |
| DES | 56-bit brute-force risk |
| ECB | Repeated-block pattern leakage |
| CBC | Chaining and ciphertext bit-flip propagation |
| CTR | Nonce reuse: `C1 XOR C2 = M1 XOR M2` |
| GCM | Authentication-tag failure after tampering |
| Naive MAC | Length-extension risk |
| HMAC | Why nested construction avoids the naive issue |
| Raw RSA | Determinism and small-message weakness |
| OAEP | Randomization before RSA exponentiation |
| DH | Unauthenticated man-in-the-middle attack |
| Ephemeral DH | Perfect Forward Secrecy comparison |
| RSA/DH/ECC | Shor impact |
| AES | Grover key-search impact |

### 2.4 Honest cryptography

- Clearly label small-number RSA/DH and simplified Enigma implementations as educational models.
- Do not claim browser demonstrations are production cryptography.
- For real use, recommend Web Crypto or audited libraries, AEAD, nonce management, key rotation, and current standards.

---

## 3. Course information architecture

The course has exactly three primary training days.

```text
Course Dashboard
 ├── Day 1 — Introduction & Classical Cryptography
 ├── Day 2 — Symmetric Cryptography
 └── Day 3 — Asymmetric Cryptography
     └── Closing outlook: Post-Quantum Cryptography
```

### 3.1 Day 1 — Introduction & Classical Cryptography

**Learning outcome:** Explain why cryptography exists, distinguish basic security goals, recognize how classical ciphers operate, and explain why modern cryptography uses mathematical assumptions.

| Module | Lessons | Primary interaction |
|---|---:|---|
| 1. Security foundations | plaintext/ciphertext; confidentiality; integrity; authenticity; hostile channels | threat-model annotation |
| 2. Substitution | Caesar; ROT13; key space; brute force | alphabet wheel + brute-force run |
| 3. Cryptanalysis | frequency analysis; substitution weakness | frequency chart + letter mapping |
| 4. Classical structures | Pigpen; Rail Fence; Playfair | grid/pair/zig-zag builders |
| 5. Enigma | rotors; stepping; operational weakness; Turing context | rotor trace + known-plaintext exercise |
| 6. Transition | factorization; DLP; ECC problem overview | assumption comparison map |

**Target duration:** 6–7 training hours including breaks and assessment.

### 3.2 Day 2 — Symmetric Cryptography

**Learning outcome:** Explain block-cipher construction, choose safe AES modes, identify nonce/IV requirements, and distinguish encryption from message authentication.

| Module | Lessons | Primary interaction |
|---|---:|---|
| 1. Shared-key model | same key, key-distribution problem, block vs stream | payload segmentation simulator |
| 2. DES history | 64-bit block; 56-bit key; Feistel; 16 rounds; 3DES | Feistel round tracer |
| 3. AES internals | 128-bit state; key expansion; S-box; ShiftRows; MixColumns; AddRoundKey | AES state-matrix stepper |
| 4. ECB / CBC | repeated blocks; IV; chaining; padding; error propagation | block-pipeline comparison |
| 5. CTR / GCM | nonce/counter; parallelism; nonce reuse; tag verification | nonce-reuse and tamper labs |
| 6. MAC / HMAC | MAC; naive keyed hash; length extension; HMAC | nested-hash visualizer |

**Target duration:** 6–7 training hours including labs and assessment.

### 3.3 Day 3 — Asymmetric Cryptography

**Learning outcome:** Explain public-key motivation, RSA/OAEP/signatures, DH/PFS/ECC, and assemble a secure hybrid protocol. Recognize why PQC migration is necessary.

| Module | Lessons | Primary interaction |
|---|---:|---|
| 1. Public-key motivation | hostile networks; public/private keys; key reuse risk | network threat map |
| 2. RSA | p, q, N, φ(N), e, d; modular exponentiation | RSA key workshop |
| 3. RSA hardening | raw RSA weakness; OAEP; square-and-multiply/timing | repeated-message and timing traces |
| 4. Signatures / PKI | hash; private-key signing; public verification; CA model | sign/tamper/verify lab |
| 5. DH / PFS | DLP; shared secret; MITM; authentication; ephemeral keys | Alice/Bob/Mallory protocol simulator |
| 6. ECC | point addition; point doubling; scalar multiplication; key-size comparison | accessible SVG coordinate plot |
| 7. Hybrid encryption | key establishment; AES-GCM; signatures; protocol composition | secure-channel capstone |
| 8. PQC outlook | Shor; Grover; ML-KEM; ML-DSA; SLH-DSA; migration | algorithm-impact matrix + migration planner |

**Target duration:** 6–7 training hours including two capstones and assessment.

---

## 4. Application layout

### 4.1 Desktop

```text
┌────────────────────────┬──────────────────────────────────────────┬───────────────────────┐
│ Course outline          │ Lesson workspace                         │ Learning sidebar      │
│                        │                                          │                       │
│ DAY 1 [progress]        │ Breadcrumb                               │ Duration              │
│   Module 1              │ Title + objective                        │ Objectives            │
│   Module 2              │                                          │ Prerequisites         │
│   …                     │ Explanation / diagram / guided lab       │ Key terms             │
│ DAY 2 [progress]        │                                          │ Formula / reference   │
│ DAY 3 [progress]        │ Knowledge check                          │ Completion status     │
│                        │                                          │                       │
│ Resume lesson           │ Previous / Reset / Next                  │                       │
└────────────────────────┴──────────────────────────────────────────┴───────────────────────┘
```

### 4.2 Tablet and mobile

- The course outline becomes a drawer.
- The learning sidebar becomes expandable sections below the lesson title.
- Labs remain full-width and operate with tap controls.
- No hover-only behavior.
- No horizontal scrolling except explicit code/formula blocks.

### 4.3 Navigation behavior

- Clicking a lesson always opens the lesson; no intermediate modal is required.
- Browser URL uses hash routes, for example:

```text
#/day-2/aes/ctr-nonce-reuse
```

- Back/forward navigation restores the lesson.
- `Next` is disabled until required guided steps are completed, but learners may browse the outline freely.
- Progress is persisted locally by course version and lesson id.
- Provide a visible `Reset lesson` action that does not erase entire-course progress.

---

## 5. Lesson schema

Every lesson must use a typed content model. Do not use a generic title + paragraph placeholder.

```js
{
  id: 'ctr-nonce-reuse',
  day: 'day-2',
  module: 'modes',
  title: 'CTR nonce reuse',
  titleZh: 'CTR 模式与 Nonce 重用',
  durationMinutes: 10,
  objectives: [
    'Explain how CTR derives a keystream.',
    'Demonstrate why a nonce must be unique for a key.',
    'Recover plaintext information after nonce reuse.'
  ],
  prerequisites: ['xor', 'block-cipher'],
  terms: ['nonce', 'counter', 'keystream'],
  source: 'https://pjq.me/?p=2474',
  sections: [
    { type: 'explain', markdown: '...' },
    { type: 'diagram', component: 'CtrPipeline' },
    { type: 'guided-lab', component: 'CtrNonceReuseLab', required: true },
    { type: 'knowledge-check', component: 'CtrQuiz', required: true },
    { type: 'summary', bullets: ['...'] }
  ],
  references: ['NIST SP 800-38A'],
  nextLessonId: 'gcm-authentication'
}
```

### Required fields

| Field | Requirement |
|---|---|
| `durationMinutes` | Accurate training planning estimate |
| `objectives` | 2–4 measurable outcomes |
| `prerequisites` | Explicit learner dependencies |
| `terms` | Glossary entries available in sidebar |
| `source` | Corresponding blog post or primary standard |
| `sections` | At least one explanation and one learner action for lab lessons |
| `knowledge-check` | Required at end of each module, not necessarily every short lesson |
| `summary` | Concise, technically accurate takeaway |

---

## 6. Interaction contract

### 6.1 Guided lab contract

Every interactive lab must implement these states:

```text
not_started → active_step_n → incorrect_attempt | completed → reviewed
```

Every lab must provide:

- Current step number and instruction.
- Visible enabled/disabled controls.
- Expected action.
- Immediate result.
- Explanation of a wrong result.
- Retry path.
- Reset path.
- Completion event.

No lab may depend on hidden double-clicks, proximity detection, hover-only controls, or unexplained keyboard shortcuts.

### 6.2 Assessment contract

- Use multiple choice, ordering, matching, parameter selection, or small calculation tasks.
- Explain every answer; do not only show correct/incorrect.
- Persist score locally.
- Allow retry.
- Module completion requires either a completed lab or an acknowledged review, depending on the lesson type.

### 6.3 Accessibility contract

- All interactions are keyboard operable.
- Visible focus ring.
- SVG charts have text alternatives and data tables.
- Color is never the only signal.
- Motion honors `prefers-reduced-motion`.
- Diagrams have a non-animated step list.
- Form inputs have labels and error messages.

---

## 7. Visualization catalogue

### Day 1

| Visualization | Technology | Must show |
|---|---|---|
| Caesar wheel | SVG / HTML | alphabet mapping, shift, key space |
| Frequency chart | SVG bars + sortable table | ciphertext frequency and candidate mapping |
| Rail Fence | SVG path | row/column traversal and reconstruction |
| Playfair | HTML 5×5 grid | digraph rules and coordinate movement |
| Enigma | SVG wiring / rotor columns | rotor step, forward path, reflector, return path |

### Day 2

| Visualization | Technology | Must show |
|---|---|---|
| DES Feistel | SVG data-flow | L/R halves, F function, round key, XOR, swap |
| AES state | HTML/SVG 4×4 grid | byte state and each round transform |
| ECB/CBC/CTR/GCM | SVG pipeline | input blocks, IV/nonce, chaining, counter, tag |
| CTR reuse | HTML + SVG | same keystream and XOR disclosure |
| HMAC | SVG nested hash | K', ipad, opad, inner and outer hash |

### Day 3

| Visualization | Technology | Must show |
|---|---|---|
| RSA key generation | HTML calculation table | p, q, N, φ(N), e, d |
| OAEP | SVG masks | random seed, mask generation, randomized encoded message |
| Signatures | SVG message flow | hash, sign, verify, tamper failure |
| DH/MITM | SVG network diagram | Alice, Bob, Mallory, values, distinct secrets |
| PFS | session timeline | long-term identity vs ephemeral session keys |
| ECC | SVG coordinate plot | point addition / doubling / scalar multiplication |
| Hybrid protocol | SVG sequence diagram | authentication, key exchange, AES-GCM, tag verification |
| PQC impact | matrix + bar chart | Shor vs Grover, affected algorithms, migration action |

---

## 8. Dedicated labs: implementation priority

The generic curriculum renderer must be retired incrementally. Build these first because they cover the most important course outcomes.

### Priority 0 — Course shell

1. Three-day dashboard.
2. Hash routing.
3. Course outline with day/module/lesson progress.
4. Lesson template and sidebar.
5. Local progress and reset flows.
6. Assessment component library.

### Priority 1 — Day 1 labs

1. Caesar brute force.
2. Frequency analysis.
3. Rail Fence reconstruction.
4. Playfair square.
5. Enigma rotor trace.

### Priority 2 — Day 2 labs

1. DES Feistel round tracer.
2. AES state-matrix stepper.
3. ECB/CBC/CTR mode comparison.
4. CTR nonce-reuse attack.
5. GCM tamper verification.
6. HMAC versus naive keyed hash.

### Priority 3 — Day 3 labs

1. RSA key-generation and encryption workflow.
2. Raw RSA versus OAEP comparison.
3. Signature/tamper/verify workflow.
4. DH and MITM simulator.
5. PFS comparison.
6. ECC point arithmetic.
7. Hybrid encryption capstone.
8. PQC migration planner.

---

## 9. Technical architecture

### 9.1 Remove from runtime

After the 2D course shell is stable, remove these runtime dependencies:

```text
lib/three.min.js
js/world.js
js/controls.js
js/text3d.js
js/audio.js (unless retained for optional accessible feedback)
```

Also remove associated WebGL canvas, orbit interactions, world menu code, and world-specific styles.

### 9.2 Add runtime modules

```text
js/app.js                       application boot and hash routing
js/course/catalog.js            three-day curriculum data
js/course/state.js              progress, reset, completion, persistence
js/course/shell.js              layout and responsive navigation
js/course/lesson-renderer.js    typed lesson section renderer
js/course/assessment.js         reusable quiz/check components
js/course/glossary.js           term lookup and references
js/labs/classical/*.js          Day 1 labs
js/labs/symmetric/*.js          Day 2 labs
js/labs/asymmetric/*.js         Day 3 labs
js/visualizations/*.js          reusable SVG/Canvas diagram components
```

### 9.3 State model

```js
{
  version: 1,
  activeRoute: { dayId, moduleId, lessonId },
  lessons: {
    'ctr-nonce-reuse': {
      status: 'completed',
      completedSteps: ['identify-reuse', 'derive-xor'],
      attempts: 2,
      assessment: { score: 1, attempts: 2 },
      updatedAt: 'ISO-8601'
    }
  },
  dayCompletion: {
    'day-1': 0.7,
    'day-2': 0.2,
    'day-3': 0
  }
}
```

### 9.4 Testing requirements

| Level | Required verification |
|---|---|
| Unit | Cryptographic functions and deterministic lab calculations |
| Component | Lab state transitions, scoring, reset behavior |
| Content | Every lesson has objectives, duration, source, and required sections |
| Routing | Direct route, browser back/forward, resume route |
| Accessibility | Keyboard flows and semantic controls |
| Visual | Desktop and mobile snapshots of dashboard, lesson, lab, result state |
| E2E | Complete one lesson per day plus two capstones |

---

## 10. Migration plan

### Phase A — Freeze and preserve content

- Keep the existing source-aligned 35-lesson inventory.
- Add explicit Day 1 / Day 2 / Day 3 metadata.
- Preserve the tested `Ciphers` teaching functions.
- Stop adding features to the 3D world.

**Exit criteria:** All current content is represented in a stable three-day catalog.

### Phase B — Build course shell

- Replace `index.html` shell with a semantic training layout.
- Add routing, outline navigation, lesson sidebar, progress states and local persistence.
- Add desktop/tablet/mobile navigation.
- Retain only a temporary legacy link, not the 3D viewport.

**Exit criteria:** A learner can open, resume, reset and complete a placeholder lesson with keyboard-only navigation.

### Phase C — Day 1 production labs

- Replace generic Day 1 renderers.
- Add classical-cipher diagrams, guided steps and a module assessment.
- Validate all interactions with browser E2E tests.

**Exit criteria:** Day 1 can be delivered as a complete training day without opening the legacy 3D app.

### Phase D — Day 2 production labs

- Build DES/AES/mode/HMAC lab suite.
- Add ECB, CTR and GCM failure exercises.
- Add Day 2 assessment.

**Exit criteria:** Learners can explain why ECB and nonce reuse are unsafe and can select an appropriate authenticated-encryption construction.

### Phase E — Day 3 production labs and capstones

- Build RSA/OAEP, signatures, DH/MITM/PFS, ECC, hybrid protocol and PQC planning labs.
- Add secure-channel and PQC-migration capstones.
- Add Day 3 assessment.

**Exit criteria:** Learners can construct a secure-channel design and identify the required PQC migration actions.

### Phase F — Remove legacy 3D code

- Delete Three.js, world, controls and unused CSS.
- Update service worker assets and bundle size checks.
- Update screenshots, documentation and deployment notes.

**Exit criteria:** No runtime dependency or navigation path references the 3D world.

---

## 11. Acceptance criteria

The redesign is complete only when all of these are true.

### Course quality

- [ ] The dashboard displays exactly three training days.
- [ ] Day 1 is introduction/classical cryptography.
- [ ] Day 2 is symmetric cryptography.
- [ ] Day 3 is asymmetric cryptography with PQC as an outlook.
- [ ] Every lesson has duration, objectives, source and summary.
- [ ] Every module has at least one interaction and one knowledge check.
- [ ] Every day has an assessment and visible completion state.

### Interaction quality

- [ ] No required interaction relies on double-clicking a canvas or hidden proximity behavior.
- [ ] Every lab has visible instructions, reset, retry and completion feedback.
- [ ] Incorrect answers explain why they are incorrect.
- [ ] Browser back/forward works for lessons.
- [ ] Progress resumes after refresh.

### Visual quality

- [ ] No decorative 3D world, floating islands, random glyphs, neon rings or glassmorphism panels remain.
- [ ] The layout has a stable course-outline / workspace / learning-sidebar hierarchy on desktop.
- [ ] Mobile has a usable outline drawer and full-width labs.
- [ ] Diagrams use a restrained technical visual system with consistent type, spacing, color and annotations.

### Technical quality

- [ ] `npm test` passes.
- [ ] Syntax and content-schema checks pass.
- [ ] All runtime assets are listed in the service worker.
- [ ] E2E tests cover a complete flow from each day.
- [ ] No external runtime dependency is introduced without explicit approval.
- [ ] Deployment remains static and works under `https://chitchat.pjq.me/download/cryptography/`.

---

## 12. Explicit non-goals

- Do not create a game, metaverse, virtual island tour, or cinematic experience.
- Do not add decorative 3D merely because it is technically possible.
- Do not pretend toy parameters are production security.
- Do not replace technical diagrams with opaque AI art.
- Do not force completion by locking all navigation; learners may browse freely.
- Do not use a generic lesson placeholder as the final experience for a critical lab.

---

## 13. Immediate next implementation decision

Begin with **Phase B: the semantic 2D course shell**, then deliver Day 1 production labs end-to-end before building the later days. This validates the training experience, navigation, assessment pattern, responsive layout and visual language before duplicating components for Day 2 and Day 3.

# Architecture

## Runtime

The application is intentionally a static site. `index.html` loads vendored Three.js followed by ordered browser scripts. The scripts expose small global namespaces rather than requiring a bundler, preserving portability to the VPS static root and offline PWA cache.

### Layers

1. **Presentation** — `index.html` and `css/style.css`; HUD and exercise panels are DOM overlays above the WebGL canvas.
2. **Curriculum** — `js/curriculum.js` contains the source-aligned 35-lesson model across the four blog chapters, with bilingual titles, explanations, source links and activity kinds.
3. **World** — `js/world.js` builds islands, bridges, labels, lighting, particles, and station metadata procedurally.
4. **Input** — `js/controls.js` handles pointer orbit/zoom. Map and lesson actions remain normal DOM controls.
5. **Learning activities** — each `js/act/*.js` owns one specialized station or the generic curriculum lesson renderer, returning a cleanup function boundary.
6. **Crypto math** — `js/ciphers.js` contains pure functions and regression validation. It has no DOM dependency and can be loaded in Node tests.
7. **Persistence/i18n** — `js/main.js` persists visited lessons and `js/i18n.js` persists locale through `localStorage`.

## State model

- `World.stations`: immutable-ish station descriptors with id, position, color, and group.
- `visited`: a local-only set of explored lesson ids.
- `currentLesson`: active curriculum lesson; the lesson stage is created only when the learner presses Start.
- `Ciphers`: deterministic functions; random educational RSA key generation is isolated to `rsaKeyPair`.

## Cryptographic correctness

AES uses the FIPS-197 state convention `State[r][c] = block[4c+r]`. The key schedule is generated word-by-word for AES-128. The test vector in `Ciphers.validate()` is the official Appendix B vector. Decryption is tested as the inverse of encryption. Small RSA/DH tests validate arithmetic invariants but do not imply production security.

## Performance

The world uses a capped device pixel ratio, low-poly procedural meshes, one shared material strategy, and a bounded star field. No textures or model downloads are required. The service worker uses cache-first behavior for the fixed app shell and network fallback for future additions.

## Extension points

- Add a station: add its descriptor in `world.js`, strings in `i18n.js`, an `Activity*` file, its script in `index.html` and `sw.js`, and a test/lesson entry in docs.
- Add a crypto primitive: keep it pure in `ciphers.js`, add a known-answer test, then expose only the minimum activity-facing function.
- Add a language: extend both dictionaries; never hardcode translated UI text in controller logic.

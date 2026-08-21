# Contribution Guide

## Scope
CryptoWorld 3D is a dependency-free educational WebGL/PWA application. Runtime files are browser scripts loaded in order from `index.html`.

## Non-negotiable quality rules
- Keep the app offline-capable: do not add CDN, analytics, tracking, or remote runtime assets.
- Keep educational algorithms explicitly labelled as demonstrations; never present toy RSA/DH as production cryptography.
- Preserve bilingual EN/中文 UI and keyboard/touch accessibility.
- Run `npm test` (or `node tests/ciphers.test.js`) and `npm run check` before committing.
- Run `node --check` on every changed JavaScript file.
- Update `docs/architecture.md` and README when behavior, stations, or deployment changes.
- Do not commit secrets, SSH keys, local paths, generated caches, or browser profiles.

## Code conventions
- ES5-compatible browser JavaScript; no bundler required.
- Use the existing global namespaces (`Ciphers`, `I18N`, `CryptoWorld`, `Activity*`).
- Prefer small pure functions and deterministic tests.
- Three.js is intentionally vendored under `lib/`; do not replace it with a network import.

## Release checklist
1. Tests and syntax checks pass.
2. PWA asset list in `sw.js` includes new runtime files.
3. Manual smoke test covers language switch, map, all stations, and AES/RSA interactions.
4. Review docs and `git diff --check`.

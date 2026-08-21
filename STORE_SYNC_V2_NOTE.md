# Store Sync V2 — Distribution / Presentation Decoupling

Goal: reduce Store blast radius and stop landing-page/content edits from invalidating the signed Core Marketplace catalog.

## Invariants

1. `catalog/index.json` remains the Core 3.3 signed compatibility contract.
2. `catalog/presentation.json` is landing/UI metadata only.
3. Security-sensitive distribution fields always come from the signed catalog.
4. Presentation metadata can never override version, SHA256, release URL, download URL, or minimum Core version.
5. Missing/broken presentation data degrades gracefully to the legacy signed catalog.
6. A presentation-only sync does not load the private signing key and does not replace `index.json.sig`.
7. Product images are presentation assets and are uploaded only when their bytes change.
8. Core cache/verification behavior remains untouched.

This gives a low-risk migration path to Core 3.5, where presentation can later become a first-class optional feed without changing the Core 3.3 trust contract.

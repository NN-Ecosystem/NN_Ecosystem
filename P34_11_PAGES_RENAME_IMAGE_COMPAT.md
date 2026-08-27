# P34.11 Pages Rename / Image Compatibility Patch

- Canonical Pages root: `https://nn-ecosystem.github.io/`.
- Migrated unsigned `catalog/presentation.json` image URLs away from legacy `/NN_Ecosystem/` prefix.
- Added client-side compatibility normalization for legacy signed-catalog image URLs.
- `catalog/index.json` and `catalog/index.json.sig` are intentionally unchanged; no re-sign is required for this presentation-only migration.
- Existing GitHub release/download URLs may remain historical aliases because browser GET follows GitHub repository redirects; new publisher writes canonical repository endpoints.

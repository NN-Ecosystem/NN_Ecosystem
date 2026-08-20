# NN Ecosystem Landing — Release Alignment Audit

Date: 2026-08-20

## Frozen boundaries preserved

- `catalog/index.json` schema remains `core_factory_catalog_v1`.
- Catalog URL remains `catalog/index.json`.
- Current public catalog item types remain exactly: `engine`, `plugin`, `node_service`, `core`.
- `tools/build_catalog.py` was not changed.
- Product Catalog & GitHub Publisher 1.7.4 was not changed.
- Existing card fields and release/download/store link behavior remain unchanged.
- Firebase feedback storage keeps the same fields: `name`, `email`, `message`, `timestamp`.

## Release landing changes

1. Header / Welcome
   - Clear Core-first entry point.
   - Short getting-started flow: Download Core → Activate/Marketplace → Install Items → Run/Compose.
   - CTA links stay inside the landing page and rely on catalog cards for current release/download URLs.

2. Core Factory
   - Core moved ahead of ecosystem items.
   - Added concise platform positioning without duplicating Core documentation.
   - Existing Core catalog grid/search remains bound to catalog v1.

3. Ecosystem item hierarchy
   - Presentation order: Nodes → Plugins → Pipeline Recipes → Engines.
   - Node/Plugin/Engine sections still consume existing catalog v1 types.
   - Pipeline Recipe is presentation-only and explicitly marked as reserved; no synthetic catalog item/type added.

4. Media
   - Reframed as “Created with NN Ecosystem”.
   - Existing channel destinations retained.
   - Removed legacy Home buttons that were placeholders.

5. Community
   - Reframed Feedback as ecosystem contribution entry point for ideas, use cases, comments and source-code/repository links.
   - Reserved a future Community / Signature Items area without implementing publishing behavior.
   - Removed Favourite from the primary release flow; original markup remains in `index.release-backup.html`.

## Release safety fixes

- Removed duplicate Firebase `child_added` listener that rendered each feedback twice.
- Feedback display now uses DOM `textContent` instead of interpolating user input into `innerHTML`, reducing XSS risk.
- Added input length limits without changing stored field names.
- Added `rel="noopener noreferrer"` to media external links.
- Verified no duplicate HTML IDs.
- `node --check script.js` passes.

## Deliberately not implemented

- Pipeline Recipe catalog type / publisher store.
- Community item publishing.
- Signature verification/distribution for third-party items.
- New Core auto-download behavior.

These should be added only when the corresponding Core/Publisher contract is formally versioned.

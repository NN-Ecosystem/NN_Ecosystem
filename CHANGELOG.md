## Pipeline Recipe Landing UI — clean rebase

- Rebased from the unmodified landing baseline supplied by the owner.
- Opens the reserved Pipeline Recipes section as a real catalog grid.
- Adds Pipeline Recipe search, count, pagination, Release and Download actions through the existing catalog renderer.
- Adds `pipeline_recipe` aliases to the landing JavaScript and local catalog build helper.
- Does not modify production catalog JSON/signature, GitHub publishing, catalog sync, signing, or any repository write logic.

# Release landing alignment — 2026-08-20

- Reordered landing flow to Welcome → Core → Nodes → Plugins → Pipeline Recipes → Engines → Media → Community.
- Preserved `core_factory_catalog_v1` and all current catalog item types/fields.
- Added Pipeline Recipe as a presentation-only reserved section; no catalog/schema/publisher change.
- Kept Core, Node Service, Plugin and Engine grids bound to the existing catalog index.
- Reframed Media as “Created with NN Ecosystem”.
- Expanded Community copy for ideas, feedback, use cases and source-code links while preserving Firebase feedback fields.
- Removed duplicate feedback listener and escaped user content by rendering with DOM `textContent`.
- Removed Favourite from the primary release page flow; legacy source remains in `index.release-backup.html`.

# Changelog

## 1.2.0
- Added Node Service as a first-class public catalog section.
- Catalog order is Engine → Plugin → Node Service → Core Platform.
- Reuses existing desktop pagination and mobile horizontal-card behavior.
- Added Node Service type alias normalization.

## 1.1.0
- Catalog cards open GitHub Release when `release_url` is available.
- Added separate View Release, Download, and Link Store actions.
- Added accessible keyboard card navigation.
- Added catalog renderer and search binding.
- Removed duplicate Firebase initialization.
# 2026-09-03 — Multi-platform compatibility export

- Preserve canonical `platforms` metadata when the local catalog compatibility builder is explicitly used.
- Keep production `catalog/index.json` and its detached signature owned by Product Catalog Publisher sync.
- Do not rewrite the currently signed catalog during source migration.

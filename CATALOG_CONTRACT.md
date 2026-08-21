# Core Factory Store Catalog Contract

The Store is split into two independent layers.

## 1. Signed distribution catalog

`catalog/index.json` + `catalog/index.json.sig`

Schema remains `core_factory_catalog_v1` for Core 3.3 compatibility.

This layer is authoritative for install/trust semantics such as:

- item identity and type
- version and release channel
- minimum Core version
- GitHub release/download URL
- artifact SHA256
- released status
- catalog signing metadata

Presentation-only changes must not force this file to be rewritten or re-signed.

## 2. Presentation catalog

`catalog/presentation.json`

Schema: `core_factory_catalog_presentation_v1`

This layer is intentionally unsigned because it is not used to authorize installation or execution. It contains UI/marketing metadata such as:

- name/title
- description/summary
- product image
- store/commercial link
- optional presentation badges that do not control release/installability

The landing page overlays presentation fields on top of the signed distribution rows. Signed `status` always remains authoritative; presentation cannot make an item released/installable. If `presentation.json` is unavailable, the page falls back to the presentation fields already present in the legacy signed catalog.

## Release behavior

- Landing HTML/CSS/JS change -> deploy landing only.
- Description/image/store-link change -> update `presentation.json` and changed image only.
- New item/version/hash/download/release/core-compatibility change -> update and sign `catalog/index.json`.
- Existing unchanged item packages are never re-signed.
- Core 3.3 continues to consume `catalog/index.json` and its detached signature unchanged.

## Local builder

```bash
python tools/build_catalog.py <LOCAL_SHOP_ROOT> <GITHUB_PAGES_ROOT>
```

The local builder emits both compatibility and presentation files. Production Store publishing should use Product Catalog Plugin synchronization so the signed catalog is only updated when distribution semantics actually change.


## Core catalog exception

A `type=core` row may be displayed as released without a Marketplace download URL because Core cannot install/upgrade itself through an already-running Core Marketplace. Its signed status and artifact digest remain distribution metadata; Engine/Plugin/Pipeline/Node package rows must provide concrete release/download URLs when released.

# Core Factory GitHub Pages Catalog v1

The landing page reads `catalog/index.json` using schema `core_factory_catalog_v1`.

Build from Local Shop:

```bash
python tools/build_catalog.py <LOCAL_SHOP_ROOT> <GITHUB_PAGES_ROOT>
```

The builder reads `engines|plugins|cores/<slug>/item.json`, resolves technical metadata from the referenced release manifest, copies the first product image to `assets/catalog/<item_id>/`, and writes one lightweight catalog index.

GitHub Release publishing is intentionally separate. The next publisher layer will create/upload release assets and then update `publish.json` receipts.

# Core Factory GitHub Pages Catalog v1

The landing page reads `catalog/index.json` using schema `core_factory_catalog_v1`.

Build from Local Shop:

```bash
python tools/build_catalog.py <LOCAL_SHOP_ROOT> <GITHUB_PAGES_ROOT>
```

The builder reads `engines|plugins|node_services|cores/<slug>/item.json`, resolves technical metadata from the referenced release manifest, copies the first product image to `assets/catalog/<item_id>/`, and writes one lightweight catalog index.

GitHub Release publishing is intentionally separate. The next publisher layer will create/upload release assets and then update `publish.json` receipts.


## Link behavior v1.1
- `release_url`: primary card destination after an item is published.
- `download_url`: direct signed ZIP asset.
- `link_store`: optional commercial/store page.
- Landing falls back to `link_store` only when `release_url` is unavailable.


## Item types
- `engine`
- `plugin`
- `node_service`
- `core`

Aliases `node`, `node-service`, and `nodeservice` normalize to `node_service`.


## Pipeline Recipe
- Catalog type: `pipeline_recipe`
- Uses the same `core_factory_catalog_v1` row contract.
- `download_url` must be the direct signed Recipe ZIP asset URL.

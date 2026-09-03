from pathlib import Path

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "script.js").read_text(encoding="utf-8")
css = (root / "style.css").read_text(encoding="utf-8")

assert 'id="discover"' in html
assert 'id="catalog-domain-filter"' in html
assert 'id="catalog-family-filter"' in html
assert "function renderApplicationDiscovery(items)" in js
assert "item.domain_id && itemFamilies(item).length" in js
assert "Taxonomy metadata is not published yet" in js
assert "renderApplicationDiscovery(items);" in js
assert ".discovery-toolbar" in css

print("Landing Taxonomy Projection v1: PASS")

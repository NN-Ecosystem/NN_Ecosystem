"""Store V2 release contract validator (stdlib-only)."""
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
idx=json.loads((ROOT/"catalog/index.json").read_text(encoding="utf-8-sig"))
pres=json.loads((ROOT/"catalog/presentation.json").read_text(encoding="utf-8-sig"))
errors=[]
rows=idx.get("items",[])
if idx.get("count") != len(rows): errors.append("index count mismatch")
ids=[]
for row in rows:
    item_id=str(row.get("item_id","") or "")
    if not item_id: errors.append("index row missing item_id")
    ids.append(item_id)
    if str(row.get("status","")).lower()=="released":
        item_type=str(row.get("type","") or "").lower()
        required=("artifact_sha256",) if item_type=="core" else ("release_url","download_url","artifact_sha256")
        for field in required:
            if not str(row.get(field,"") or "").strip(): errors.append(f"{item_id}: released item missing {field}")
if len(ids)!=len(set(ids)): errors.append("duplicate item_id in index")
prows=pres.get("items",[])
if pres.get("count") != len(prows): errors.append("presentation count mismatch")
protected={"version","channel","minimum_core_version","release_url","download_url","artifact_sha256","status"}
for row in prows:
    overlap=protected.intersection(row)
    if overlap: errors.append(f"{row.get('item_id','<unknown>')}: presentation contains protected fields {sorted(overlap)}")
if errors:
    print("[STORE-CONTRACT] FAILED")
    for e in errors: print(" -",e)
    sys.exit(1)
print(f"[STORE-CONTRACT] PASSED ({len(rows)} distribution / {len(prows)} presentation items)")

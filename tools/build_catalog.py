#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCHEMA = "core_factory_catalog_v1"
PRESENTATION_SCHEMA = "core_factory_catalog_presentation_v1"
ITEM_SCHEMA = "core_factory_local_item_v1"

ITEM_TYPE_ALIASES = {
    "engine": "engine",
    "plugin": "plugin",
    "pipeline_recipe": "pipeline_recipe",
    "pipeline-recipe": "pipeline_recipe",
    "pipeline": "pipeline_recipe",
    "core": "core",
    "node_service": "node_service",
    "node-service": "node_service",
    "nodeservice": "node_service",
    "node": "node_service",
}
SUPPORTED_ITEM_TYPES = {"engine", "plugin", "pipeline_recipe", "node_service", "core"}

def normalize_item_type(value: Any) -> str:
    raw = str(value or "").strip().lower().replace(" ", "_")
    return ITEM_TYPE_ALIASES.get(raw, raw)

def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))

def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def first_summary(description: str, limit: int = 260) -> str:
    lines = [line.strip("#* -\t") for line in description.splitlines() if line.strip()]
    text = next((line for line in lines if len(line) > 20), "")
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"

def export_item(item_dir: Path, pages_root: Path) -> dict[str, Any]:
    item_path = item_dir / "item.json"
    item = read_json(item_path)
    if item.get("schema") != ITEM_SCHEMA:
        raise ValueError(f"Unsupported item schema: {item_path}")

    release_path = item_dir / str(item.get("release_manifest", ""))
    release = read_json(release_path) if release_path.is_file() else {}
    release_item = release.get("item") if isinstance(release.get("item"), dict) else {}
    artifact = release.get("artifact") if isinstance(release.get("artifact"), dict) else {}
    compatibility = release.get("compatibility") if isinstance(release.get("compatibility"), dict) else {}

    item_id = str(release_item.get("id") or item.get("item_id") or "").strip()
    item_type = normalize_item_type(release_item.get("type") or item.get("type"))
    version = str(release_item.get("version") or item.get("version") or "").strip()
    if not item_id or item_type not in SUPPORTED_ITEM_TYPES:
        raise ValueError(f"Invalid identity in {item_path}: id={item_id!r}, type={item_type!r}")

    image_url = ""
    images = item.get("images") if isinstance(item.get("images"), list) else []
    if images:
        source_image = item_dir / str(images[0])
        if source_image.is_file():
            target_dir = pages_root / "assets" / "catalog" / item_id
            target_dir.mkdir(parents=True, exist_ok=True)
            target_image = target_dir / source_image.name
            shutil.copy2(source_image, target_image)
            image_url = target_image.relative_to(pages_root).as_posix()

    return {
        "item_id": item_id,
        "slug": item.get("slug", item_id),
        "type": item_type,
        "name": item.get("name") or item.get("title") or item_id,
        "title": item.get("title") or item.get("name") or item_id,
        "summary": item.get("summary") or first_summary(str(item.get("description", ""))),
        "version": version,
        "channel": release.get("channel") or item.get("release_channel") or "stable",
        "minimum_core_version": compatibility.get("minimum_core_version") or item.get("minimum_core_version") or "",
        "image": image_url,
        "link_store": item.get("link_store") or item.get("store_url") or "",
        "status": item.get("status", "draft"),
        "artifact_sha256": artifact.get("sha256") or item.get("artifact_sha256") or "",
        "content_sha256": artifact.get("content_sha256") or item.get("content_sha256") or "",
        "release_url": item.get("release_url") or release.get("release_url") or "",
        "download_url": item.get("download_url") or artifact.get("download_url") or "",
        "platforms": item.get("platforms") if isinstance(item.get("platforms"), dict) else {},
    }

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("local_shop", type=Path)
    parser.add_argument("pages_root", type=Path)
    parser.add_argument(
        "--write-compatibility-catalog",
        action="store_true",
        help="Also write catalog/index.json. Production signed catalog sync should normally be done by Product Catalog Plugin.",
    )
    args = parser.parse_args()

    items: list[dict[str, Any]] = []
    errors: list[str] = []
    for item_path in sorted(args.local_shop.glob("*/*/item.json")):
        try:
            item = export_item(item_path.parent, args.pages_root)
            if item["status"] == "released":
                items.append(item)
        except Exception as exc:
            errors.append(f"{item_path}: {exc}")

    ordered = sorted(items, key=lambda row: (row["type"], row["name"].lower()))
    catalog = {
        "schema": SCHEMA,
        "catalog_version": "1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "items": ordered,
    }
    target = args.pages_root / "catalog" / "index.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    if args.write_compatibility_catalog:
        target.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")

    presentation = {
        "schema": PRESENTATION_SCHEMA,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(ordered),
        "items": [
            {
                "item_id": row.get("item_id", ""),
                "type": row.get("type", ""),
                "name": row.get("name", ""),
                "title": row.get("title", ""),
                "summary": row.get("summary", ""),
                "image": row.get("image", ""),
                "link_store": row.get("link_store", ""),
                "status": row.get("status", "released"),
            }
            for row in ordered
        ],
    }
    presentation_target = args.pages_root / "catalog" / "presentation.json"
    presentation_target.write_text(
        json.dumps(presentation, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if args.write_compatibility_catalog:
        print(f"Compatibility catalog written: {target}")
    else:
        print("Compatibility catalog unchanged (use --write-compatibility-catalog only for an explicit compatibility rebuild).")
    print(f"Presentation catalog written: {presentation_target}")
    print(f"Released items: {len(items)}")
    for error in errors:
        print(f"WARNING: {error}")
    return 0 if not errors else 2

if __name__ == "__main__":
    raise SystemExit(main())

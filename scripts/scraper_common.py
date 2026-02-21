#!/usr/bin/env python3
"""
Shared helpers for scraper scripts.
"""

from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Any


def env_int(name: str, default: int, minimum: int | None = None, maximum: int | None = None) -> int:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        value = default
    else:
        try:
            value = int(raw)
        except ValueError:
            value = default

    if minimum is not None:
        value = max(minimum, value)
    if maximum is not None:
        value = min(maximum, value)
    return value


def env_float(name: str, default: float, minimum: float | None = None, maximum: float | None = None) -> float:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        value = default
    else:
        try:
            value = float(raw)
        except ValueError:
            value = default

    if minimum is not None:
        value = max(minimum, value)
    if maximum is not None:
        value = min(maximum, value)
    return value


def ensure_parent_dir(path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)


def atomic_write_json(path: str, data: Any) -> None:
    ensure_parent_dir(path)
    temp_path = f"{path}.tmp"
    with open(temp_path, "w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
    os.replace(temp_path, path)


def safe_goto(
    page: Any,
    url: str,
    *,
    timeout_ms: int,
    retries: int = 3,
    wait_until: str = "domcontentloaded",
    backoff_seconds: float = 1.5,
) -> None:
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            page.goto(url, wait_until=wait_until, timeout=timeout_ms)
            return
        except Exception as exc:  # noqa: BLE001 - scraper must not crash on transient errors
            last_error = exc
            if attempt >= retries:
                break
            sleep_for = backoff_seconds * attempt
            print(f"    ⚠️ Goto retry {attempt}/{retries} ({url}) after error: {exc}")
            time.sleep(sleep_for)

    raise RuntimeError(f"Failed to load URL after {retries} retries: {url}") from last_error


def iso_utc_now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


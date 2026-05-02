#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

GOOGLEBOT_USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
DEFAULT_OUTPUT = Path("output/spreadsheet/wix-author-resolution.csv")
DEFAULT_URLS_FILE = Path("database/data/wix-urls.json")
REQUEST_TIMEOUT_SECONDS = int(os.getenv("WIX_AUTHOR_REPORT_TIMEOUT", "25"))
REQUEST_DELAY_SECONDS = float(os.getenv("WIX_AUTHOR_REPORT_DELAY", "0.2"))
GENERIC_HEADLINES = {"Yazı | Ben İzledim", "Post | Ben İzledim"}
REPORT_EXTRA_FIELDS = [
    "wix_url",
    "live_headline",
    "live_published_date",
    "wix_visible_author",
    "wix_author_profile_url",
    "resolution_status",
    "match_method",
    "notes",
    "manual_search_query",
]


@dataclass(frozen=True)
class LivePost:
    url: str
    headline: str
    author_name: str
    author_profile_url: str
    published_date: str
    status_code: int


def normalize_title(value: str | None) -> str:
    if value is None:
        return ""

    normalized = value.strip().lower()
    if not normalized:
        return ""

    replacements = {
        "ç": "c",
        "ğ": "g",
        "ı": "i",
        "i̇": "i",
        "ö": "o",
        "ş": "s",
        "ü": "u",
        "â": "a",
        "î": "i",
        "û": "u",
        "ê": "e",
        "ô": "o",
        "’": "'",
        "‘": "'",
        "“": '"',
        "”": '"',
        "–": "-",
        "—": "-",
        "―": "-",
        "|": " ",
        "·": " ",
        "•": " ",
    }

    for source, target in replacements.items():
        normalized = normalized.replace(source, target)

    normalized = unicodedata.normalize("NFKD", normalized)
    normalized = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    normalized = re.sub(r"[^a-z0-9]+", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)

    return normalized.strip()


def parse_csv_date(value: str | None) -> date | None:
    raw = (value or "").strip()
    if not raw:
        return None

    try:
        return datetime.strptime(raw, "%d.%m.%Y").date()
    except ValueError:
        return None


def parse_live_date(value: str | None) -> date | None:
    raw = (value or "").strip()
    if not raw:
        return None

    normalized = raw.replace("Z", "+00:00")

    try:
        return datetime.fromisoformat(normalized).date()
    except ValueError:
        pass

    for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            continue

    return None


def read_csv_rows(csv_path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None:
            raise ValueError(f"CSV headers missing: {csv_path}")

        headers = [header.strip() for header in reader.fieldnames]
        rows = []
        for row in reader:
            rows.append({key.strip(): (value or "").strip() for key, value in row.items() if key is not None})

    return headers, rows


def load_url_pool(urls_path: Path) -> list[str]:
    with urls_path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if not isinstance(payload, list):
        raise ValueError(f"URL seed must be a JSON list: {urls_path}")

    return [str(url).strip() for url in payload if str(url).strip()]


def _iter_json_candidates(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, dict):
        items = [payload]
        if "@graph" in payload and isinstance(payload["@graph"], list):
            items.extend(item for item in payload["@graph"] if isinstance(item, dict))
        return items
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    return []


def _extract_json_ld_blog_post(soup: BeautifulSoup) -> dict[str, str]:
    for script in soup.select('script[type="application/ld+json"]'):
        text = script.get_text(strip=True)
        if not text:
            continue

        try:
            payload = json.loads(text)
        except json.JSONDecodeError:
            continue

        for item in _iter_json_candidates(payload):
            if item.get("@type") != "BlogPosting":
                continue

            author = item.get("author") or {}
            if isinstance(author, list):
                author = author[0] if author else {}
            if not isinstance(author, dict):
                author = {}

            return {
                "headline": str(item.get("headline") or "").strip(),
                "author_name": str(author.get("name") or "").strip(),
                "author_profile_url": str(author.get("url") or "").strip(),
                "published_date": str(item.get("datePublished") or "").strip(),
            }

    return {}


def extract_live_post(html: str, url: str, status_code: int = 200) -> LivePost | None:
    soup = BeautifulSoup(html, "html.parser")
    json_ld = _extract_json_ld_blog_post(soup)

    headline = json_ld.get("headline") or ""
    author_name = json_ld.get("author_name") or ""
    author_profile_url = json_ld.get("author_profile_url") or ""
    published_date = json_ld.get("published_date") or ""

    if not headline:
        headline_el = soup.find("h1")
        headline = headline_el.get_text(strip=True) if headline_el else ""

    if not author_name or not author_profile_url:
        profile_link = soup.select_one('a[href*="/profile/"]')
        if profile_link is not None:
            author_name = author_name or profile_link.get_text(strip=True)
            author_profile_url = author_profile_url or profile_link.get("href", "").strip()

    if not published_date:
        time_el = soup.select_one("time[datetime]")
        if time_el is not None:
            published_date = time_el.get("datetime", "").strip()

    if not published_date:
        meta_time = soup.find("meta", attrs={"property": "article:published_time"})
        if meta_time is not None:
            published_date = meta_time.get("content", "").strip()

    if author_profile_url and author_profile_url.startswith("/"):
        parsed = urlparse(url)
        author_profile_url = f"{parsed.scheme}://{parsed.netloc}{author_profile_url}"

    if not headline or headline in GENERIC_HEADLINES:
        return None

    return LivePost(
        url=url,
        headline=headline,
        author_name=author_name,
        author_profile_url=author_profile_url,
        published_date=published_date,
        status_code=status_code,
    )


def fetch_live_post(url: str, session: requests.Session, timeout_seconds: int) -> LivePost | None:
    response = session.get(url, timeout=timeout_seconds)
    return extract_live_post(response.text, url=url, status_code=response.status_code)


def fetch_live_posts(
    urls: list[str],
    session: requests.Session,
    *,
    timeout_seconds: int,
    delay_seconds: float,
) -> tuple[list[LivePost], list[dict[str, str]]]:
    live_posts: list[LivePost] = []
    errors: list[dict[str, str]] = []

    for index, url in enumerate(urls, start=1):
        print(f"[{index}/{len(urls)}] Fetching {url}")

        try:
            live_post = fetch_live_post(url, session, timeout_seconds)
        except requests.RequestException as exc:
            errors.append({"url": url, "error": str(exc)})
            time.sleep(delay_seconds)
            continue

        if live_post is None:
            errors.append({"url": url, "error": "missing_live_post_markup"})
        else:
            live_posts.append(live_post)

        time.sleep(delay_seconds)

    return live_posts, errors


def build_live_indexes(live_posts: list[LivePost]) -> tuple[dict[str, list[LivePost]], dict[str, list[LivePost]]]:
    exact: dict[str, list[LivePost]] = defaultdict(list)
    normalized: dict[str, list[LivePost]] = defaultdict(list)

    for post in live_posts:
        exact[post.headline].append(post)
        normalized[normalize_title(post.headline)].append(post)

    return exact, normalized


def _resolve_candidate_set(
    candidates: list[LivePost],
    csv_date: date | None,
    base_method: str,
) -> tuple[str, LivePost | None, str, str]:
    if not candidates:
        return "missing_live_match", None, "", ""

    if len(candidates) == 1:
        return "resolved", candidates[0], base_method, "unique live title match"

    if csv_date is not None:
        date_filtered = [candidate for candidate in candidates if parse_live_date(candidate.published_date) == csv_date]
        if len(date_filtered) == 1:
            return "resolved", date_filtered[0], f"{base_method}+published_date", "resolved with live published date"
        if len(date_filtered) > 1:
            return "ambiguous_post_match", None, base_method, "multiple live posts remain after date tie-break"

    return "ambiguous_post_match", None, base_method, "multiple live posts share the same title"


def resolve_rows(rows: list[dict[str, str]], live_posts: list[LivePost]) -> list[dict[str, str]]:
    exact_index, normalized_index = build_live_indexes(live_posts)
    resolved_rows: list[dict[str, str]] = []

    for row in rows:
        row_copy = dict(row)
        csv_title = row_copy.get("Yazı başlığı", "").strip()
        csv_date = parse_csv_date(row_copy.get("Yayınlama tarihi"))
        manual_search_query = f'site:benizledim.com/post "{csv_title}"'

        exact_result = _resolve_candidate_set(exact_index.get(csv_title, []), csv_date, "exact_title")
        status, candidate, match_method, notes = exact_result

        if status != "resolved":
            normalized_result = _resolve_candidate_set(
                normalized_index.get(normalize_title(csv_title), []),
                csv_date,
                "normalized_title",
            )

            if normalized_result[0] == "resolved" or status == "missing_live_match":
                status, candidate, match_method, notes = normalized_result
            elif normalized_result[0] == "ambiguous_post_match":
                status, candidate, match_method, notes = normalized_result

        extra = {
            "wix_url": "",
            "live_headline": "",
            "live_published_date": "",
            "wix_visible_author": "",
            "wix_author_profile_url": "",
            "resolution_status": status,
            "match_method": match_method,
            "notes": notes,
            "manual_search_query": manual_search_query,
        }

        if candidate is not None:
            extra.update(
                {
                    "wix_url": candidate.url,
                    "live_headline": candidate.headline,
                    "live_published_date": candidate.published_date,
                    "wix_visible_author": candidate.author_name,
                    "wix_author_profile_url": candidate.author_profile_url,
                }
            )

            if not candidate.author_name:
                extra["resolution_status"] = "manual_review"
                extra["notes"] = "live post matched but author name is missing"
            elif not candidate.author_profile_url:
                extra["resolution_status"] = "manual_review"
                extra["notes"] = "live post matched but author profile URL is missing"

        row_copy.update(extra)
        resolved_rows.append(row_copy)

    return resolved_rows


def write_report(
    output_path: Path,
    original_headers: list[str],
    rows: list[dict[str, str]],
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = output_path.with_suffix(output_path.suffix + ".tmp")
    fieldnames = original_headers + [field for field in REPORT_EXTRA_FIELDS if field not in original_headers]

    with temp_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fieldnames})

    temp_path.replace(output_path)


def summarize_statuses(rows: list[dict[str, str]]) -> Counter[str]:
    return Counter(row.get("resolution_status", "unknown") for row in rows)


def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": GOOGLEBOT_USER_AGENT,
            "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        }
    )
    return session


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Resolve Wix author data for a CSV export.")
    parser.add_argument("--csv", required=True, help="Path to the blog export CSV file.")
    parser.add_argument("--urls-file", default=str(DEFAULT_URLS_FILE), help="Seed JSON file with Wix post URLs.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="Output CSV report path.")
    parser.add_argument("--timeout", type=int, default=REQUEST_TIMEOUT_SECONDS, help="HTTP timeout in seconds.")
    parser.add_argument("--delay", type=float, default=REQUEST_DELAY_SECONDS, help="Delay between requests in seconds.")
    parser.add_argument("--limit", type=int, default=None, help="Optional limit for fetched Wix URLs.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    csv_path = Path(args.csv)
    urls_path = Path(args.urls_file)
    output_path = Path(args.output)

    if not csv_path.is_file():
        print(f"CSV file not found: {csv_path}", file=sys.stderr)
        return 1

    if not urls_path.is_file():
        print(f"URL seed file not found: {urls_path}", file=sys.stderr)
        return 1

    try:
        original_headers, rows = read_csv_rows(csv_path)
        urls = load_url_pool(urls_path)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if args.limit is not None:
        urls = urls[: max(args.limit, 0)]

    session = build_session()
    live_posts, errors = fetch_live_posts(
        urls,
        session,
        timeout_seconds=max(args.timeout, 1),
        delay_seconds=max(args.delay, 0.0),
    )
    resolved_rows = resolve_rows(rows, live_posts)
    write_report(output_path, original_headers, resolved_rows)

    print()
    print(f"Live posts fetched: {len(live_posts)}")
    print(f"Fetch errors: {len(errors)}")
    for status, count in summarize_statuses(resolved_rows).items():
        print(f"{status}: {count}")
    print(f"Report written to: {output_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

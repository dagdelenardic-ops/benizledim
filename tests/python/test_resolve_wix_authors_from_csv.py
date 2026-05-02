from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT_PATH = ROOT / "scripts" / "resolve_wix_authors_from_csv.py"
FIXTURE_PATH = ROOT / "tests" / "Fixtures" / "wix" / "googlebot_blog_post.html"

spec = importlib.util.spec_from_file_location("resolve_wix_authors_from_csv", SCRIPT_PATH)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
assert spec.loader is not None
spec.loader.exec_module(module)


class ResolveWixAuthorsFromCsvTest(unittest.TestCase):
    def test_normalize_title_variants(self) -> None:
        self.assertEqual(
            module.normalize_title("İçgüdülerimizle Neden Barışık Değiliz?"),
            "icgudulerimizle neden barisik degiliz",
        )
        self.assertEqual(
            module.normalize_title("Fantastic Four: First Steps – Is Marvel Back?"),
            module.normalize_title("Fantastic Four First Steps Is Marvel Back"),
        )

    def test_extract_live_post_prefers_json_ld_author(self) -> None:
        html = FIXTURE_PATH.read_text(encoding="utf-8")

        live_post = module.extract_live_post(
            html,
            url="https://www.benizledim.com/post/2-farkli-film-tek-konu",
        )

        self.assertIsNotNone(live_post)
        assert live_post is not None
        self.assertEqual(live_post.headline, "2 Farkli Film; Tek Konu")
        self.assertEqual(live_post.author_name, "Melike Zeynep Korkmaz")
        self.assertEqual(
            live_post.author_profile_url,
            "https://www.benizledim.com/profile/melikezeynepkorkmaz/profile",
        )
        self.assertEqual(live_post.published_date, "2024-07-15T10:00:00.000Z")

    def test_resolve_rows_smoke(self) -> None:
        live_posts = [
            module.LivePost(
                url="https://www.benizledim.com/post/fantastic-four-first-steps-is-marvel-back",
                headline="Fantastic Four: First Steps - Is Marvel Back?",
                author_name="Nedir",
                author_profile_url="https://www.benizledim.com/profile/61a5/profile",
                published_date="2025-07-20T10:00:00.000Z",
                status_code=200,
            ),
            module.LivePost(
                url="https://www.benizledim.com/post/another-post",
                headline="Another Post",
                author_name="Su Evci",
                author_profile_url="https://www.benizledim.com/profile/suevci/profile",
                published_date="2025-07-21T10:00:00.000Z",
                status_code=200,
            ),
        ]
        rows = [
            {
                "Yazı başlığı": "Fantastic Four: First Steps – Is Marvel Back?",
                "Yayınlama tarihi": "20.07.2025",
            },
            {
                "Yazı başlığı": "Missing Post",
                "Yayınlama tarihi": "20.07.2025",
            },
        ]

        resolved_rows = module.resolve_rows(rows, live_posts)

        self.assertEqual(resolved_rows[0]["resolution_status"], "resolved")
        self.assertEqual(resolved_rows[0]["match_method"], "normalized_title")
        self.assertEqual(resolved_rows[0]["wix_visible_author"], "Nedir")
        self.assertEqual(resolved_rows[1]["resolution_status"], "missing_live_match")

        summary = module.summarize_statuses(resolved_rows)
        self.assertEqual(summary["resolved"], 1)
        self.assertEqual(summary["missing_live_match"], 1)


if __name__ == "__main__":
    unittest.main()

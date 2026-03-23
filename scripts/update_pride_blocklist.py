#!/usr/bin/env python3
import json
import sys
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen, Request

URL = "https://www.humandignitytrust.org/lgbt-the-law/map-of-criminalisation/"
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "data" / "pride-blocklist.json"

EXCLUDED_HEADINGS = {
    "countries",
    "asia",
    "africa",
    "caribbean and the americas",
    "caribbean & the americas",
    "pacific",
}

class H2Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h2 = False
        self.current = []
        self.headings = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "h2":
            self.in_h2 = True
            self.current = []

    def handle_endtag(self, tag):
        if tag.lower() == "h2" and self.in_h2:
            text = "".join(self.current).strip()
            if text:
                self.headings.append(text)
            self.in_h2 = False
            self.current = []

    def handle_data(self, data):
        if self.in_h2:
            self.current.append(data)


def fetch_html():
    req = Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def load_existing():
    if OUTPUT.exists():
        with OUTPUT.open("r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "source": {},
        "updated_at": None,
        "countries": [],
        "supplementalCountries": ["Russia", "Belarus"],
    }


def main():
    html = fetch_html()
    parser = H2Parser()
    parser.feed(html)

    countries = []
    seen = set()
    for heading in parser.headings:
        normalized = heading.strip().lower()
        if normalized in EXCLUDED_HEADINGS:
            continue
        if normalized in seen:
            continue
        seen.add(normalized)
        countries.append(heading.strip())

    if not countries:
        raise RuntimeError("No countries detected from Human Dignity Trust page.")

    data = load_existing()
    data["source"] = {
        "name": "Human Dignity Trust – Map of Criminalisation",
        "url": URL,
    }
    data["updated_at"] = datetime.utcnow().strftime("%Y-%m-%d")
    data["countries"] = countries

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Updated {OUTPUT} with {len(countries)} countries.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Error updating blocklist: {exc}", file=sys.stderr)
        sys.exit(1)

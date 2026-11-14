#!/usr/bin/env python3
"""Fails if any FAQPage JSON-LD on a page doesn't match its visible questions
and answers word for word (Google requires the markup to match the page)."""
import glob, html, json, re, sys

def text(s):
    s = re.sub(r"<br\s*/?>", " ", s)
    s = re.sub(r"</p>\s*<p>", " ", s)
    s = re.sub(r"</li>\s*<li>", "; ", s)
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

failed = False
for path in sorted(glob.glob("**/*.html", recursive=True)):
    src = open(path, encoding="utf-8").read()
    schema = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
        data = json.loads(block)
        nodes = data if isinstance(data, list) else data.get("@graph", [data])
        for node in nodes:
            if node.get("@type") == "FAQPage":
                schema += [(q["name"], q["acceptedAnswer"]["text"]) for q in node["mainEntity"]]
    if not schema:
        continue
    visible = [(text(q), text(a)) for q, a in re.findall(
        r'<details class="faq-item"[^>]*>\s*<summary>(.*?)</summary>\s*<div class="faq-answer">(.*?)</div>\s*</details>', src, re.S)]
    if visible != schema:
        failed = True
        print(f"{path}: FAQPage JSON-LD doesn't match the visible FAQ")
        for i, (v, s) in enumerate(zip(visible, schema)):
            if v != s:
                print(f"  #{i + 1}\n    page:   {v}\n    schema: {s}")
        if len(visible) != len(schema):
            print(f"  {len(visible)} visible questions, {len(schema)} in JSON-LD")
    else:
        print(f"{path}: {len(schema)} questions match")
sys.exit(1 if failed else 0)

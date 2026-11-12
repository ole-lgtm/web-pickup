#!/bin/sh
# Bygger docs/handelsbetingelser-og-fortrydelsesret.pdf ud fra handelsbetingelser.html og fortrydelse.html.
# Kør fra webshop-mappen efter hver ændring i betingelserne:  sh tools/build-vilkaar-pdf.sh
set -e
TMP=$(mktemp -d)
python3 - "$TMP/vilkaar.html" <<'PY'
import re, sys
def body(fn):
    s = open(fn).read()
    b = s[s.index('<div class="wrap legal">') + len('<div class="wrap legal">'):s.rindex('</div>\n  </section>')]
    b = re.sub(r'<nav class="toc">.*?</nav>', '', b, flags=re.S)
    b = re.sub(r'<form class="withdraw-form".*?</form>\s*<div class="withdraw-confirm"[^>]*></div>',
               '<p>Du kan fortryde online på <strong>ole-lgtm.github.io/web-pickup/fortrydelse.html</strong>.</p>', b, flags=re.S)
    b = re.sub(r'<a [^>]*href="(fortrydelse|handelsbetingelser)\.html[^"]*"[^>]*>(.*?)</a>', r'\2', b)
    return b
css = """body { font: 10pt/1.45 -apple-system, Helvetica, Arial, sans-serif; color:#1b1b1d; }
h1 { font: 600 20pt Georgia, serif; margin: 0 0 2px; } h2 { font: 600 13pt Georgia, serif; margin: 16px 0 4px; page-break-after: avoid; }
.eyebrow { color:#b0883f; font-size:8pt; letter-spacing:.12em; text-transform:uppercase; margin:0; font-weight:600 }
.updated { color:#6b6760; font-size:9pt; margin:0 0 10px } a { color:inherit; text-decoration:none }
ul,ol { padding-left: 1.2em; margin: 4px 0 } li { margin: 2px 0 } p { margin: 5px 0 }
.note { border-left: 3px solid #b0883f; padding: 2px 10px; } .formular { border: 1px dashed #999; padding: 6px 12px; }
.break { page-break-before: always; }"""
open(sys.argv[1], 'w').write('<!doctype html><html lang="da"><head><meta charset="utf-8"><style>' + css + '</style></head><body>'
    + body('handelsbetingelser.html') + '<div class="break"></div>' + body('fortrydelse.html') + '</body></html>')
PY
swift tools/html2pdf.swift "$TMP/vilkaar.html" "$(pwd)/docs/handelsbetingelser-og-fortrydelsesret.pdf" 2>/dev/null
echo "docs/handelsbetingelser-og-fortrydelsesret.pdf er opdateret"

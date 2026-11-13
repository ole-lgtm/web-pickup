#!/bin/sh
# Sætter et nyt versionsnummer på css/js-links i alle sider, så browsere (fx iPad) henter de nye filer med det samme.
cd "$(dirname "$0")/.." || exit 1
v=$(date +%Y%m%d%H%M)
for f in *.html; do
  sed -i '' -E "s#(href=\"css/[^\"?]+\.css)(\?v=[0-9]+)?\"#\1?v=$v\"#g; s#(src=\"js/[^\"?]+\.js)(\?v=[0-9]+)?\"#\1?v=$v\"#g" "$f"
done
echo "version $v"

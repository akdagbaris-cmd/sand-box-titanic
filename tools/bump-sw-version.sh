#!/usr/bin/env bash
# Sets VERSION in sw.js to a short fingerprint of the game files.
# The fingerprint only changes when a cached file changes, so every real
# release gets a new offline cache and unchanged releases keep the old one.
#   Usage:  ./tools/bump-sw-version.sh          (writes sw.js)
#           ./tools/bump-sw-version.sh --check  (fails if sw.js is out of date)
set -euo pipefail
cd "$(dirname "$0")/.."

if command -v sha256sum >/dev/null; then sha() { sha256sum; }; else sha() { shasum -a 256; }; fi

# Every file the service worker caches (the CORE list), minus sw.js itself.
files=$(grep -o "'\./[^']*'" sw.js | tr -d "'" | grep -v '^\./$' | sed 's#^\./##')
for f in $files; do [ -f "$f" ] || { echo "missing: $f" >&2; exit 1; }; done

version=$(for f in $files; do printf '%s ' "$f"; sha < "$f"; done | sha | cut -c1-10)
current=$(sed -n "s/^const VERSION = '\(.*\)';/\1/p" sw.js)

if [ "${1:-}" = "--check" ]; then
  [ "$current" = "$version" ] && { echo "sw.js up to date ($version)"; exit 0; }
  echo "sw.js VERSION is '$current', expected '$version'. Run tools/bump-sw-version.sh" >&2; exit 1
fi

if [ "$current" = "$version" ]; then echo "sw.js already at $version"; exit 0; fi
sed -i.bak "s/^const VERSION = '.*';/const VERSION = '$version';/" sw.js && rm -f sw.js.bak
echo "sw.js VERSION: $current -> $version"

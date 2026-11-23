#!/usr/bin/env bash
# Pakai: ./salin-game.sh /jalur/ke/kode-nusantara-prototipe.html
# Menyalin versi game terbaru ke www/ lalu menyinkronkan ke proyek Android.
set -euo pipefail
[ $# -eq 1 ] && [ -f "$1" ] || { echo "Pakai: $0 berkas-game.html"; exit 1; }
cp "$1" www/index.html
# index.html v23 menautkan manifest dan ikon; salin juga bila ada di sebelah berkas game (sw.js sengaja tidak dipakai di APK)
d=$(dirname "$1"); [ -f "$d/manifest.webmanifest" ] && cp "$d/manifest.webmanifest" www/ ; [ -d "$d/icons" ] && { mkdir -p www/icons; cp "$d"/icons/*.png www/icons/; } || true
npx cap sync android
grep -o 'APP_VERSION="[^"]*"' www/index.html | head -1

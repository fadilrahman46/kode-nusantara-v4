# Kode Nusantara — PWA (v23)

Isi folder ini adalah game yang sama dengan v22 ditambah lapisan PWA. Tidak ada kode permainan yang berubah.

| Berkas | Fungsi |
|---|---|
| `index.html` | Game (satu berkas, Three.js sudah tertanam) + blok `kn-pwa` (tombol pasang, pendaftaran service worker, pemberitahuan versi baru) |
| `manifest.webmanifest` | Nama, warna, ikon, mode `standalone` |
| `sw.js` | Service worker: cache untuk luring dan alur pembaruan |
| `icons/` | 192 dan 512 (any), 192 dan 512 (maskable), apple-touch 180, favicon 32 |
| `_headers` | Aturan cache untuk Netlify / Cloudflare Pages |
| `.github/workflows/pages.yml` | Terbit otomatis ke GitHub Pages |
| `tools/render-icons.js` | Sumber pembuat ikon (Playwright, dari gambar lampu di pulau) |

## 1. Syarat yang tidak bisa dihindari: alamat HTTPS milik sendiri

PWA hanya bisa dipasang dari alamat HTTPS (atau `localhost`). Halaman artifact di claude.ai **tidak** bisa dipasang sebagai aplikasi, karena manifest dan service worker harus dilayani dari asal yang sama dengan halamannya. Artifact hanya satu berkas HTML, jadi tidak punya tempat untuk keduanya. Kemungkinan besar blok PWA di artifact tidak melakukan apa-apa; saya tidak mengujinya di claude.ai.

Empat cara menerbitkan, dari yang paling mudah:

1. **Netlify Drop / Cloudflare Pages**: seret folder ini ke dasbor. `_headers` ikut terbaca.
2. **Vercel** (paling mudah bila Anda sudah punya akun): lihat bagian "Deploy ke Vercel" di bawah.
3. **GitHub Pages**: unggah folder ini ke repositori, buka *Settings > Pages > Source = GitHub Actions*, lalu dorong ke cabang `main`. `pages.yml` yang bekerja. Alamatnya `https://<akun>.github.io/<repo>/`; semua jalur di manifest relatif, jadi subfolder tidak masalah.
4. **Server sendiri**: sajikan folder ini lewat HTTPS. Pastikan `.webmanifest` bertipe `application/manifest+json` dan `sw.js` tidak di-cache lama.

### Deploy ke Vercel

Situs ini statis (tanpa build). `vercel.json` di folder ini hanya mengatur header: `sw.js` dan `manifest.webmanifest` tidak di-cache lama, tipe `application/manifest+json`, `Service-Worker-Allowed: /`. Sengaja **tidak** ada `cleanUrls`, `rewrites`, atau `redirects`: pengalihan (misalnya `/index.html` ke `/`) membuat respons yang disimpan service worker berstatus "redirected", dan Chrome menolak memakainya untuk navigasi, sehingga mode luring rusak.

- **Dari repositori Git (disarankan)**: dorong ke GitHub/GitLab/Bitbucket, lalu di Vercel pilih *Add New > Project*, impor repositori. Preset: *Other*. Biarkan Build Command dan Install Command kosong. Bila repositori berisi seluruh kode (ada folder `pwa/`, `android/`, `tests/`), `vercel.json` di akar sudah mengarahkan `outputDirectory` ke `pwa`; bila yang Anda dorong hanya isi folder `pwa/`, pakai `pwa/vercel.json` itu apa adanya.
- **Dari CLI**: `npm i -g vercel`, lalu `cd pwa && vercel` (uji coba) dan `vercel --prod`.
- Setelah terbit, buka alamat `https://<proyek>.vercel.app/` di Chrome Android: menu game menampilkan **Pasang aplikasi**. Domain sendiri bisa ditambahkan di *Settings > Domains*.
- Rilis berikutnya: ganti `index.html`, naikkan `CACHE_VERSION` di `sw.js`, dorong ke Git; Vercel membangun ulang otomatis.
- Alamat pratinjau (`...-git-cabang-...vercel.app`) bisa diproteksi login oleh Vercel (Deployment Protection) sehingga manifest dan service worker mengembalikan halaman login dan PWA tidak bisa dipasang dari sana. Uji pemasangan dari alamat produksi.

## 2. Cara pemain memasang

- **Chrome / Edge Android dan desktop**: buka menu game (tombol Menu); muncul tombol **Pasang aplikasi**. Bisa juga lewat menu browser.
- **iPhone / iPad (Safari)**: Safari tidak punya prompt pasang. Menu game menampilkan petunjuk: Bagikan, lalu Tambah ke Layar Utama.
- Setelah terpasang, game terbuka tanpa bilah alamat dan tetap bisa dimainkan tanpa internet. Satu-satunya yang butuh internet adalah font Baloo 2 pada kunjungan pertama; service worker dirancang menyimpannya, tetapi ini belum teruji (akses font diblokir di lingkungan uji saya). Tanpa font itu game tetap berjalan dengan font cadangan.

## 3. Cara merilis versi baru

1. Ganti `index.html` dengan versi baru.
2. Naikkan `CACHE_VERSION` di `sw.js` (misalnya `kn-v23-1` menjadi `kn-v24-1`). Tanpa ini browser tidak melihat service worker baru.
3. Terbitkan ulang.

Pemain yang sedang online mendapat tombol **Versi baru tersedia, muat ulang** di menu. Versi baru **tidak** mengambil alih sendiri, supaya pemain tidak kehilangan tahap yang sedang dikerjakan. Halaman utama diambil lewat jaringan lebih dulu (batas 4 detik) dan baru jatuh ke cache bila gagal, jadi lupa menaikkan `CACHE_VERSION` tidak membuat halaman macet di versi lama; ikon dan berkas lain yang di-cache saja yang bisa tertinggal.

## 4. Kapan service worker sengaja tidak aktif

Blok `kn-pwa` tidak mendaftarkan service worker saat: `navigator.webdriver` bernilai true (uji otomatis), di dalam Capacitor / WebView Android (APK), dibuka sebagai `file://`, atau bukan konteks aman. Alasannya supaya 1.600+ kasus uji regresi tetap memeriksa halaman apa adanya, dan supaya APK tidak punya dua lapis cache.

## 4b. Orientasi potret (v24)

Manifest mengunci `portrait` pada PWA terpasang di Android; APK dikunci lewat `AndroidManifest.xml`. Kunci ini berlaku untuk semua perangkat Android, termasuk tablet. Di peramban HP (bukan terpasang) kunci tidak mungkin; game menampilkan layar "Putar ponselmu tegak" bila HP mendatar. iOS tidak mendukung kunci orientasi. Desktop dan tablet mendatar tidak diblokir.

## 5. Batasan yang perlu Anda ketahui

- **Progres tidak dibagi antar bentuk pemasangan.** Pemain di PWA, di APK, dan di browser biasa menyimpan progres di penyimpanan masing-masing (`localStorage` per asal). Pindah dari satu ke yang lain berarti mulai dari awal. Fitur ekspor/impor progres belum ada.
- **Penyimpanan bisa dihapus browser.** Chrome dan Safari bisa membersihkan data situs yang lama tidak dibuka; pemasangan sebagai aplikasi mengurangi risikonya tetapi tidak menjaminnya. Safari iOS membersihkan data situs yang tidak dikunjungi sekitar tujuh hari bila tidak dipasang ke Layar Utama.
- **Belum diuji di perangkat nyata.** Uji otomatis memakai Chromium headless dan peristiwa `beforeinstallprompt` buatan. Yang belum terbukti: dialog pasang asli di Chrome Android, ikon maskable pada beragam peluncur, perilaku iOS, dan skor audit Lighthouse.

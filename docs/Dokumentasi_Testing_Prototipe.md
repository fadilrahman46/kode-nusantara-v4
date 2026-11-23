# Dokumentasi Testing & Review — Prototipe Kode Nusantara (P0 + P1)

**Tanggal:** 11 November 2026
**Objek uji:** `kode-nusantara-prototipe.html` (50 KB; Stage Pengantar, Stage 7 "Kotak Berbentuk", Stage 8 "Timbangan Pasar")
**Mode review:** audit sendiri, blak-blakan. Prototipe dan seluruh uji ditulis oleh pihak yang sama (Claude), jadi ada risiko titik buta. Lihat §9.

---

## 1. Ringkasan

> **Status terbaru (setelah perbaikan):** lihat §12. F01–F12 sudah diperbaiki; uji ulang 133/134 lulus. Bagian 1–11 di bawah adalah hasil uji **sebelum** perbaikan dan dipertahankan sebagai catatan.

**Keputusan (sebelum perbaikan):** prototipe **belum siap diuji ke siswa di HP**. Di laptop/Chromebook, prototipe bisa dimainkan dan logikanya kuat, tetapi ada beberapa cacat yang akan mengotori data playtest.

| | |
|---|---|
| Uji otomatis | 125 uji: **93 lulus, 32 gagal** (+ 1 info) |
| Temuan unik | **16**: 1 Blocker, 5 Major, 6 Minor, 4 Catatan |
| Dari uji gagal | 32 kegagalan dipetakan ke 11 temuan. Lima temuan lain (F04, F13–F16) berasal dari tinjauan visual/data |
| Yang kuat | Logika interpreter (71.274 eksekusi kartu acak, 0 exception, 0 pelanggaran invarian); skor/hint/bintang sesuai GDD pada kasus yang diuji (Easy, Hard, dan label biaya hint Medium); 23–48 draw call (anggaran <100); kontras warna ≥ 5.26:1 |
| Yang rusak | **Di HP, tombol kontrol keluar dari layar saat papan terisi** (F01). 360×740: ▶ Jalankan hilang mulai 4 kartu. 390×844: mulai 6 kartu. HP lanskap 667×375: semua kontrol sudah di luar layar sejak papan kosong |

**Satu hal paling mendesak:** perbaiki F01 (tata letak HP). Akar masalahnya sudah ditemukan dan perbaikan portrait sudah **diverifikasi** (§6): satu baris CSS.

**Koreksi atas pernyataanku sebelumnya:** saat menyerahkan prototipe aku menyebut logikanya sudah diuji tetapi tampilannya belum. Setelah tampilan diuji, ternyata di HP prototipe ini tidak bisa dimainkan. Seharusnya tata letak diuji sebelum diserahkan.

---

## 2. Lingkungan & cara uji

| Komponen | Nilai |
|---|---|
| Browser | Chromium 131 headless, WebGL lewat **SwiftShader (render perangkat lunak)** |
| Otomasi | puppeteer-core 23, Node 22; layar sentuh diemulasikan lewat CDP (`hasTouch`, `isMobile`) |
| Three.js | r128 dari paket npm (versi yang sama dengan CDN yang dipakai halaman) |
| Penyajian | Server HTTP lokal; halaman asli + **satu baris ekspor** `window.__t` agar logika internal dapat diperiksa |
| Font | Google Fonts **diblokir**, tampilan memakai font cadangan |
| Layar | 1280×720, 1366×768 (Chromebook), 360×740 dan 390×844 (HP potret, @2x), 667×375 dan 844×390 (HP lanskap, @2x), 768×1024 (tablet) |
| Skrip & bukti | `tests/` (skrip, `results/*.json`, `evidence/*.png`). Cara menjalankan ulang: `tests/README.md`. T3c adalah pengukuran tanpa asersi, tidak dihitung dalam jumlah uji |

**Perbedaan dengan kondisi sebenarnya:** versi publik berjalan di dalam panel artifact claude.ai, bukan di halaman penuh. Ukuran area, sandbox, dan CSP-nya tidak diuji.

---

## 3. Cakupan

| Dimensi | Status | Dasar |
|---|---|---|
| Logika interpreter & kelayakan stage | **Teruji** | T1: brute force atas ruang state + fuzzing |
| Alur permainan (menang/kalah, hint, skor, bintang, kode, tes ulang tutorial) | **Teruji** di desktop | T2 |
| Tata letak & keterbacaan di 7 ukuran layar | **Teruji** (screenshot + pengukuran) | T3, T3b |
| Interaksi sentuh | **Teruji parsial** (emulasi) | T4 |
| Memori GPU, draw call, ketahanan (storage ditolak, CDN gagal, resize) | **Teruji** | T5 |
| Aksesibilitas | **Parsial**: kontras, fokus keyboard, target sentuh | T2, T3 |
| **FPS / performa GPU nyata** | **Tidak teruji** | SwiftShader adalah render CPU; angka FPS tidak bermakna |
| **Sentuhan di HP asli** (latensi, pull-to-refresh, address bar iOS/Android) | **Tidak teruji** | perlu perangkat nyata (§8) |
| **Safari / Firefox** | **Tidak teruji** | hanya Chromium |
| **Pembaca layar** | **Tidak teruji** | hanya cek atribut `aria-*` |
| **Apakah anak memahami & belajar; seru atau tidak** | **Tidak dapat dinilai** | hanya bisa dari playtest siswa |
| Sandbox/CSP artifact claude.ai yang sebenarnya | **Tidak teruji** | hanya disimulasikan (R06) |

---

## 4. Hasil per suite

| Suite | Jumlah uji | Lulus | Gagal | Info |
|---|---|---|---|---|
| T1 Logika inti | 10 | 9 | 1 | 0 |
| T2 Fungsional UI desktop | 42 | 37 | 5 | 1 |
| T3 Tata letak & kontras | 47 | 30 | 17 | 0 |
| T3b Verifikasi usulan CSS | 8 | 6 | 2 | 0 |
| T4 Sentuh | 9 | 4 | 5 | 0 |
| T5 Sumber daya & ketahanan | 9 | 7 | 2 | 0 |
| **Total** | **125** | **93** | **32** | **1** |

> Jumlah gagal tampak besar karena T3 menguji 7 layar dengan asersi yang sama: dari 17 kegagalan di sana, 15 berasal dari **3 akar masalah** (F01, F02, F03) dan 2 dari F12. T3b bukan uji produk, melainkan uji **usulan perbaikan**.

### 4.1 Tata letak per layar (state: Stage 7, 3 kartu di papan)

| Layar | Area dunia (px) | Papan (px / baris, b7 + 3 kartu) | Dasar kontrol vs tinggi layar | Bubble menutupi dunia (b7) |
|---|---|---|---|---|
| desktop-1280x720 | 768×658 | 408 / 7 | 710 / 720 (terlihat: ya) | 22% |
| chromebook-1366x768 | 820×706 | 472 / 8 | 758 / 768 (terlihat: ya) | 20% |
| hp-portrait-360x740 | 360×262 | 218 / 3 | 841 / 740 (terlihat: **TIDAK**) | 94% |
| hp-portrait-390x844 | 390×306 | 218 / 3 | 885 / 844 (terlihat: **TIDAK**) | 66% |
| hp-landscape-667x375 | 667×131 | 176 / 2 | 555 / 375 (terlihat: **TIDAK**) | 105% |
| hp-landscape-844x390 | 506×328 | 120 / 1 | 466 / 390 (terlihat: **TIDAK**) | 51% |
| tablet-portrait-768x1024 | 768×404 | 362 / 6 | 1014 / 1024 (terlihat: ya) | 34% |

### 4.2 Kelayakan stage (hasil brute force)

| Stage | Tingkat | Atom kartu | Batas kartu | Jumlah program benar per panjang |
|---|---|---|---|---|
| p0 | easy | 1 | 8 | 4 kartu: 1 |
| p0 | medium | 2 | 8 | 4 kartu: 1, 5 kartu: 1, 6 kartu: 1, 7 kartu: 1, 8 kartu: 5 |
| p0 | hard | 3 | 8 | 4 kartu: 1, 5 kartu: 2, 6 kartu: 12, 7 kartu: 24, 8 kartu: 104 |
| b7 | easy | 24 | 5 | 3 kartu: 6, 4 kartu: 96, 5 kartu: 1070 |
| b7 | medium | 60 | 5 | 3 kartu: 6, 4 kartu: 132, 5 kartu: 2840 |
| b7 | hard | 61 | 5 | 3 kartu: 6, 4 kartu: 156, 5 kartu: 3500 |
| b8 | easy | 15 | 4 | 3 kartu: 5, 4 kartu: 68 |
| b8 | medium | 16 | 4 | 3 kartu: 5, 4 kartu: 88 |
| b8 | hard | 17 | 4 | 3 kartu: 5, 4 kartu: 108 |

Tanpa kartu ×, Stage 8 masih punya **10 solusi 4 kartu** dan 0 solusi 3 kartu (lihat F05).

### 4.3 Kontras warna

Kontras teks terendah: **5.26:1 (mode terang)** dan **7.1:1 (mode gelap)**. Keduanya di atas 4,5:1.

### 4.4 Visibilitas tombol kontrol menurut jumlah kartu (T3c, Stage Pengantar)

Penuh = seluruh tombol berada di dalam layar; angka % = sebagian terpotong; **HILANG** = di luar layar.

| Layar | Kartu | ▶ Jalankan | ⏭ Langkah | ⏹ Ulang | 💡 Hint | 🗑️ Sampah |
|---|---|---|---|---|---|---|
| 360x740 | 0 | penuh | penuh | 93% | 93% | 93% |
| 360x740 | 1 | penuh | penuh | 93% | 93% | 93% |
| 360x740 | 2 | penuh | penuh | 89% | 89% | 89% |
| 360x740 | 3 | penuh | penuh | **HILANG** | **HILANG** | **HILANG** |
| 360x740 | 4 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 360x740 | 6 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 360x740 | 8 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 390x844 | 0 | penuh | penuh | penuh | penuh | penuh |
| 390x844 | 1 | penuh | penuh | penuh | penuh | penuh |
| 390x844 | 2 | penuh | penuh | penuh | penuh | penuh |
| 390x844 | 3 | penuh | penuh | penuh | penuh | penuh |
| 390x844 | 4 | penuh | penuh | penuh | **HILANG** | **HILANG** |
| 390x844 | 6 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 390x844 | 8 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 0 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 1 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 2 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 3 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 4 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 6 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 667x375 | 8 | **HILANG** | **HILANG** | **HILANG** | **HILANG** | **HILANG** |
| 844x390 | 0 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 1 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 2 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 3 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 4 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 6 | penuh | penuh | 39% | 39% | **HILANG** |
| 844x390 | 8 | penuh | penuh | 39% | 39% | **HILANG** |

---

## 5. Daftar temuan

Severity mengikuti definisi review: **Blocker** = membatalkan premis/tidak bisa dimainkan; **Major** = merusak pengalaman atau mahal diperbaiki nanti; **Minor** = nyata tapi bisa ditunda; **Catatan** = observasi/risiko belum terbukti.

### Blocker

**F01 — Di HP, tombol kontrol keluar dari layar sehingga game tidak bisa dijalankan**
- **Bukti:** T3 `X-*-e`; T3c (tabel §4.4); T4 S03, S04; screenshot `hp-portrait-360x740_b7_papan.png`. Di 360×740, setelah 4 kartu tombol ▶ ada di y=742–794 pada layar setinggi 740 px; ⏹/💡/🗑️ sudah hilang sejak 3 kartu. Di 390×844, 💡/🗑️ hilang dari 4 kartu dan ▶ dari 6 kartu. Di 667×375 semua kontrol berada di luar layar sejak awal. Di 844×390 tombol 🗑️ selalu di luar layar, sehingga kartu tidak bisa dibuang dengan menyeret.
- **Akar masalah (terverifikasi):** `kode-nusantara-prototipe.html:57` `#editor{flex:1 1 40%;…}` tanpa `min-height:0`. Di tata letak kolom, panel ikut membesar mengikuti isi papan dan mendorong tombol keluar layar; `html,body{overflow:hidden}` membuatnya tak bisa di-scroll. Pada layar lanskap, `:108` `@media (orientation:portrait), (max-width:760px)` memaksa tata letak kolom, sehingga di 667×375 area dunia hanya **131 px**.
- **Dampak:** di HP potret, pemain tidak bisa menekan Jalankan setelah 4–6 kartu (tergantung lebar layar), dan Stage 7 saja sudah membutuhkan 3. Di HP lanskap kecil game tidak bisa dimainkan sama sekali. Target "kontrol sentuh" di GDD §11 tidak bisa diuji.
- **Perbaikan:** (a) tambahkan `#editor{min-height:0}`; (b) ubah query menjadi `(orientation:portrait)` saja dan beri tata letak baris untuk lanskap; (c) mode ringkas untuk `max-height:450px` (topbar tipis, label zona disembunyikan); (d) pakai `100dvh`.
- **Verifikasi:** T3b menunjukkan (a) memulihkan tombol di dua layar potret; di lanskap perlu (b)+(c), yang membuat kontrol terlihat di 667×375 dan 844×390 (hanya sisa 10 px, jadi masih rapat).
- **Effort:** 1–3 jam untuk pemulihan; tata letak HP yang layak ada di F02.

### Major

**F02 — Papan dan palet tidak layak dipakai di HP**
- **Bukti:** T3 `X-*-b`, `X-*-g`; T4 S05, S07, S08. Setelah perbaikan F01(a), papan di 360×740 hanya **120 px (1 baris kartu)**. Menggeser jari di atas kartu tidak men-scroll papan (scrollTop tetap 0) karena `:66` `.card{…touch-action:none}`; hanya kolom nomor yang bisa dipakai. Palet Hard Stage 8 berisi 577 px di wadah 340 px: kartu "Maju" hanya 36% tampak, "Belok kanan" 0% tampak dan tidak bisa di-scroll.
- **Dampak:** anak tidak bisa melihat atau menjangkau semua kartunya.
- **Perbaikan:** (1) drag hanya dari **gagang seret** (⠿, ≥44 px) di kiri kartu, sisanya `touch-action:pan-y`; ketuk tetap menambah kartu; (2) palet `flex-wrap` di layar sempit, bukan scroll horizontal; (3) padatkan: topbar 1 baris, kontrol 1 baris dengan ikon, area dunia ±36% di potret.
- **Effort:** 0,5–1 hari.

**F03 — Dialog NPC menutupi hampir seluruh dunia di HP, padahal jawaban teka-teki harus dibaca dari dunia**
- **Bukti:** T3 `X-*-c`; screenshot `hp-portrait-360x740_b7_bubble.png`: bubble 245 px dari area dunia 262 px (**94%**); 390×844: 66%; 667×375: 105%. Di desktop hanya 22%.
- **Dampak:** Stage 7 dibuka dengan teks panjang yang menyembunyikan jumlah ikan dan nama perahu yang harus dibaca pemain.
- **Perbaikan:** bubble maksimal 2 baris dengan "Selengkapnya", tidak menutupi dunia (taruh di strip antara dunia dan papan), otomatis mengecil setelah pemain menambah kartu pertama. Persingkat intro Stage 7 (kini ±230 karakter).
- **Effort:** 2–3 jam.

**F04 — Informasi kunci Stage 7 sulit dibaca dari adegan** *(tinjauan visual; tidak ada uji otomatis)*
- **Bukti:** `evidence/stage7_ikan_zoom.png`: kelima "ikan" adalah kerucut biru yang saling menumpuk (`:715`), tampak seperti paku, dan jumlahnya sulit dihitung. Label "Kenari" (`:719`) berupa kotak merah di atas lambung merah, kecil dan kontrasnya rendah; di HP hampir tak terbaca. Label kotak (`:747`) saling menimpa dan menutupi bentuk kotak, padahal **bentuk adalah inti pelajaran**; label "peti ikan" menutupi kotak sakelar (`desktop-1280x720_b7_bubble.png`).
- **Dampak:** pemain bisa salah karena tidak bisa membaca soal, bukan karena belum paham tipe data. Ini akan tercatat sebagai "kesulitan" padahal masalah visual.
- **Perbaikan:** gambar 5 ikan terpisah dalam satu baris dengan bentuk ikan; label perahu putih di atas bendera/papan nama di luar lambung; atur label kotak ke posisi tetap yang tidak bertumpuk; perbesar zoom kamera di stage ini.
- **Uji penerimaan:** 4 dari 5 anak menghitung ikan dengan benar dari screenshot, tanpa bantuan.
- **Effort:** 3–5 jam.

**F05 — Batas 4 kartu di Stage 8 tidak memaksa perkalian**
- **Bukti:** T1 L10; `:261` `limit:4`. Tanpa kartu ×, ada **10 solusi 4 kartu** (contoh: Isi 2, +4, +4, +4). Hint 1 menyatakan "Perkalian membuat angka tumbuh lebih cepat" dan intro menyebut papan hanya muat 4 kartu, jadi niat desainnya adalah memaksa perkalian.
- **Dampak:** stage tidak mengajarkan hal yang dimaksud; pemain bisa menang dengan penjumlahan berulang.
- **Perbaikan:** `limit:3`. Dengan 3 kartu ada tepat 5 solusi dan **semuanya memakai ×** (T1: tanpa × = 0). Perbarui teks intro dan hint 3.
- **Effort:** 10 menit.

**F06 — Race condition: tekan Ulang lalu Jalankan cepat saat animasi berjalan**
- **Bukti:** T2 U22: setelah `Ulang → Jalankan`, status `running=false` dan semua tombol aktif padahal eksekusi kedua sedang berjalan. Penyebab: loop `run()` yang sudah dibatalkan tetap mengeksekusi `running=false; setBusy(false)` di akhirnya (`:546`).
- **Dampak:** anak yang menekan tombol bertubi-tubi bisa mengubah kartu atau memulai eksekusi ganda di tengah proses; hasil dan catatan uji menjadi tidak konsisten.
- **Perbaikan:** loop lama hanya boleh mengubah status jika `tok===cancelTok`.
- **Effort:** 15 menit.

### Minor

| ID | Temuan | Bukti | Perbaikan | Effort |
|---|---|---|---|---|
| F07 | Teks hasil menyebut **batas** ★ ("berhasil dalam 3 kali jalankan"), bukan jumlah sebenarnya (2). Istilah "hint berbayar" tak bermakna bagi anak SD karena tidak ada uang di game. | T2 U24; `:583-584`; `ui_p0_hasil.png` | Teruskan `runs` sebenarnya ke `showResult` (attempt sudah ditutup saat dipanggil); ganti "hint berbayar" dengan "tanpa hint besar". | 20 menit |
| F08 | Mode Langkah: setelah **kartu terakhir** selesai tidak ada penilaian sampai pemain menekan Langkah sekali lagi tanpa petunjuk. | T2 U14a (overlay terbuka: tidak, tidak, tidak, ya); `:522` | Nilai segera setelah kartu terakhir selesai. | 20 menit |
| F09 | Mengganti tingkat kesulitan membuang kartu yang tidak ada di palet baru **tanpa pemberitahuan**. | T2 U16 (2→1 kartu, toast kosong) | Toast "Kartu Maju dibuang: tidak ada di tingkat ini" atau pertahankan kartu dalam keadaan abu-abu. | 15 menit |
| F10 | **Catatan uji tercemar**: setiap ganti kesulitan/stage tanpa bermain menambah entri `runs:0`. Padahal fungsi utama prototipe ini adalah mengumpulkan data playtest. | T2 U21 (3 entri kosong); `:793` | `closeAttempt` hanya jika ada eksekusi, hint, atau kartu ditambahkan. | 15 menit |
| F11 | **Kebocoran memori GPU** saat ganti stage: geometri 132→540 dan tekstur 8→43 setelah 31 pergantian. `buildScene` melepas objek tanpa `dispose()`. Dampak kecil di sesi pendek, polanya nyata. | T5 R02; `:699` | Fungsi `disposeScene()` (geometri, material, tekstur label) sebelum membangun ulang. | 1 jam |
| F12 | Tombol "Hapus catatan" memakai `confirm()` yang **diabaikan** di iframe tersandbox tanpa `allow-modals` (tombol diam). Tong sampah setinggi 36 px di beberapa layar (<44 px). | T5 R06; T3 `X-chromebook-1366x768-d`, `X-hp-landscape-844x390-d`; `:818` | Konfirmasi dua ketukan di dalam halaman; beri `min-height:52px` pada `#trash`. Kondisi sandbox sebenarnya belum diverifikasi. | 30 menit |

### Catatan (observasi/risiko, belum terbukti)

| ID | Catatan | Dasar |
|---|---|---|
| F13 | **Tingkat kesulitan hanya menambah pengecoh.** Solusi terpendek identik di Easy/Medium/Hard (Stage 7: 6, Stage 8: 5), sementara pengali skor naik 1→2×. Hard memberi 2× poin untuk masalah yang sama. | T1 L05 |
| F14 | **Ikon ⬆️ pada kartu "Maju"** sementara Bit bergerak ke kanan-bawah layar pada kamera isometrik. Arti panah tidak selaras dengan gerak di layar. Perlu dicek ke anak. | `desktop-1280x720_p0_awal.png` (observasi visual) |
| F15 | **Hint 3 berisi jawaban lengkap** dan di Easy hanya berbiaya 10% dan hilangnya ★. Anak bisa melewati stage tanpa berpikir. Tingkat pemakaian hint 3 perlu dipantau. | T2 U12b |
| F16 | Modal hasil menggelapkan adegan sehingga **momen lampu menyala** (puncak emosi stage) nyaris tidak terlihat; mercusuar di sisi kanan terpotong tepi panel dunia di desktop. | `ui_p0_hasil.png`, `desktop-1280x720_b7_bubble.png` |

---

## 6. Verifikasi usulan perbaikan CSS (T3b)

Usulan disuntikkan ke halaman uji; **berkas asli tidak diubah**. Dasar kontrol = batas bawah panel kontrol; ia harus ≤ tinggi layar agar tombol bisa disentuh.

| Layar | Asli | Usulan A (`#editor{min-height:0}`) | Usulan B (A + landscape + layar pendek) |
|---|---|---|---|
| 360x740 | **di luar layar** (841/740); dunia 360×262; papan 218px | terlihat (730/740); dunia 360×262; papan 120px | terlihat (730/740); dunia 360×262; papan 120px |
| 390x844 | **di luar layar** (885/844); dunia 390×306; papan 218px | terlihat (834/844); dunia 390×306; papan 166px | terlihat (834/844); dunia 390×306; papan 166px |
| 667x375 | **di luar layar** (555/375); dunia 667×131; papan 176px | **di luar layar** (451/375); dunia 667×131; papan 120px | terlihat (365/375); dunia 347×325; papan 143px |
| 844x390 | **di luar layar** (466/390); dunia 506×328; papan 120px | **di luar layar** (466/390); dunia 506×328; papan 120px | terlihat (380/390); dunia 506×340; papan 162px |

- **Usulan A** (`#editor{min-height:0}`) memulihkan layar potret, tetapi papan tinggal 120–166 px.
- **Usulan B** membuat kontrol terlihat di keempat layar, namun margin di lanskap hanya ±10 px. Ini bukti bahwa perbaikan cepat cukup untuk **memulihkan**, bukan untuk membuat tata letak HP **nyaman**; F02 tetap perlu dikerjakan.

---

## 7. Rekomendasi & urutan pengerjaan

Untuk pengembang tunggal tanpa tenggat. Estimasi kasar; tiap butir punya uji otomatis yang bisa dijalankan ulang.

| Urutan | Butir | Effort | Uji penerimaan |
|---|---|---|---|
| **1** | F06 race condition; F05 `limit:3`; F10 log tercemar; F07 teks hasil; F08, F09 | ±2 jam | T2 U22, U21, U24, U14a, U16; T1 L10 |
| **2** | F01 tata letak HP (a–d) | 1–3 jam | T3 `X-*-e`; T4 S03, S04 |
| **3** | F03 bubble ringkas | 2–3 jam | T3 `X-*-c` |
| **4** | F02 gagang seret, palet wrap, tata letak padat | 0,5–1 hari | T3 `X-*-b`, `X-*-g`; T4 S05, S07, S08 |
| **5** | F04 keterbacaan adegan Stage 7 | 3–5 jam | uji anak menghitung ikan (4 dari 5 benar) |
| **6** | Uji manual di 2 HP asli (§8) | 1–2 jam | semua butir checklist |
| **7** | F11 `disposeScene`; F12 | ±1,5 jam | T5 R02; R06 |
| **8** | F13–F16: putuskan setelah playtest | — | data Catatan uji |

**Kriteria "siap playtest siswa":** butir 1–6 selesai. **Kriteria "siap playtest di laptop sekarang":** butir 1 selesai; butir 2–5 boleh menyusul bila playtest hanya di laptop/Chromebook.

**Pertimbangan yang sering terlewat:** jangan menunggu sempurna. Playtest di laptop bisa jalan setelah butir 1 dan menjawab pertanyaan yang tidak bisa dijawab oleh uji otomatis (apakah anak paham bentuk kotak = tipe), sementara perbaikan HP berjalan paralel.

**Uji regresi:** jalankan T1–T5 setiap kali mengubah tata letak atau logika. Tambahkan asersi untuk setiap bug yang ditemukan di playtest agar tidak muncul lagi.

---

## 8. Checklist uji manual di perangkat nyata (belum dilakukan)

Lakukan di minimal **dua HP**: satu Android murah (RAM 2–3 GB) dan satu iPhone bila ada.

- [ ] Halaman terbuka tanpa tulisan "Grafis 3D gagal dimuat" lewat jaringan seluler
- [ ] Kontrol ▶ ⏭ ⏹ 🐢 💡 🗑️ terlihat dan bisa disentuh dengan 4 dan 8 kartu di papan (potret **dan** lanskap)
- [ ] Bar alamat browser muncul/menghilang saat menggulir: kontrol tidak tertutup (uji `100dvh`)
- [ ] Menyeret kartu dari palet ke papan dengan satu jari: tidak memicu pull-to-refresh, tidak memicu menu tekan-lama
- [ ] Menggeser papan penuh dengan satu jari untuk melihat kartu bawah
- [ ] Memutar layar saat stage berjalan: adegan 3D ikut menyesuaikan, program tidak hilang
- [ ] Gerak animasi terasa mulus (subjektif); catat model HP dan angka `fpsAvg` di Catatan uji
- [ ] Jumlah ikan di Stage 7 dapat dihitung, dan nama perahu "Kenari" dapat dibaca tanpa memperbesar
- [ ] Teks dialog terbaca tanpa menutupi adegan
- [ ] Mode gelap (pengaturan sistem): semua teks terbaca
- [ ] Mode hemat daya / koneksi lambat: halaman tetap muncul dan memberi pesan jelas bila 3D gagal

## 9. Batasan dan bias dokumen ini

- **Penulis kode = penulis uji.** Titik buta yang sama bisa ada di keduanya. Dua asersi awal (U14a, U16) kuhitung keliru karena menguji perilaku yang ada, bukan yang seharusnya; L05 awalnya terlalu ketat. Ketiganya sudah dikoreksi dan hasil di tabel adalah versi koreksi. Review independen oleh orang lain tetap dianjurkan.
- **Hanya Chromium dengan render perangkat lunak.** Tidak ada klaim tentang FPS, Safari, atau perangkat nyata.
- **Tinjauan visual** (F04, F14, F16) berdasarkan beberapa screenshot yang kulihat sendiri, bukan uji dengan anak. Perlakukan sebagai hipotesis yang perlu dikonfirmasi saat playtest.
- Tidak ada satu pun uji di sini yang menjawab apakah game **mengajar**. Itu hanya bisa dijawab oleh playtest dengan kriteria di GDD §11.

---

## 10. Lampiran A — Rincian kasus uji

### T1 Logika inti
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| L01 | p0: tepat 1 solusi terpendek (4 × Maju) di semua tingkat | LULUS |  |
| L02 | b7: ada solusi 3 kartu di semua tingkat | LULUS | easy=6, medium=6, hard=6 |
| L03 | b7: tidak ada solusi < 3 kartu | LULUS |  |
| L04 | b8: ada solusi di semua tingkat dan tidak ada yang < 3 kartu | LULUS | easy: 3 kartu=5, 4 kartu=68 \| medium: 3 kartu=5, 4 kartu=88 \| hard: 3 kartu=5, 4 kartu=108 |
| L05 | Kartu pengecoh tidak mengubah himpunan solusi TERPENDEK (b7: 6, b8: 5) — tingkat kesulitan = pengecoh saja | LULUS | solusi 3 kartu identik di ketiga tingkat; hanya solusi alternatif yang lebih panjang bertambah |
| L10 | b8: batas 4 kartu MEMAKSA perkalian (niat desain hint 1) | **GAGAL** | tanpa kartu ×: solusi 3 kartu=0, solusi 4 kartu=10; tanpa × dan ÷: 4 kartu=10 (contoh: Isi 2, +4, +4, +4) |
| L06 | Interpreter: 0 exception dalam fuzzing | LULUS | 71274 eksekusi kartu;  |
| L07 | Invarian: Bit tidak keluar peta / masuk petak terhalang; tipe kotak selalu cocok bentuk; angka selalu bulat | LULUS |  |
| L08 | Setiap stage punya 3 hint, dan batas kartu ≥ panjang solusi terpendek | LULUS |  |
| L09 | Tidak ada pelanggaran konsol (error/warning) saat memuat | LULUS |  |

### T2 Fungsional UI desktop
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| U01 | Memuat: tidak ada error konsol; WebGL aktif; menggambar > 0 draw call | LULUS | draw calls=23; error= |
| U02 | P0: bubble pengantar tampil dan kartu Maju berdenyut (menuntun pemain) | LULUS |  |
| U03 | Seret kartu dari palet ke papan → 1 kartu; tutorial lanjut; tombol Jalankan berdenyut | LULUS | kartu=1 |
| U04 | Jalankan 1 kartu → pesan "Masih kurang 3 petak" (tutorial petunjuk jelas) | LULUS | Masih kurang 3 petak lagi menuju lampu. Tambahkan kartu Maju lagi sampai Bit tiba di lampu. |
| U05 | P0: 4 kartu Maju → lampu menyala, hasil muncul, 3 bintang (2 kali jalankan) | LULUS | 3 dari 3 bintang \| Skor 100 · ★ tanpa hint berbayar · ★ berhasil dalam 3 kali jalankan |
| U24 | Teks hasil menyebut jumlah percobaan SEBENARNYA (bukan batas ★) | **GAGAL** | runs sebenarnya=2; teks="Skor 100 · ★ tanpa hint berbayar · ★ berhasil dalam 3 kali jalankan" |
| U18a | "Lihat versi kode" P0 = 4 × maju() | LULUS | "maju()\nmaju()\nmaju()\nmaju()" |
| U17a | Tombol "Coba lagi" tersembunyi saat 3 bintang | LULUS |  |
| U19a | Overlay hasil TIDAK tertutup oleh Esc (pemain harus memilih) | LULUS |  |
| U06a | 5 kartu Maju → Bit menabrak tong; pesan jelas; kartu penyebab berkedip merah; tong sampah berdenyut | LULUS | indeks kartu error=4; Kebanyakan atau salah arah! Seret kartu yang tidak perlu ke 🗑️ tempat sampah, lalu jalankan lagi. |
| U06b | Seret kartu ke tempat sampah → kartu terhapus (4 tersisa) | LULUS |  |
| U06c | Setelah buang kartu berlebih → berhasil | LULUS |  |
| U08a | Tap kartu palet 8× → 8 kartu (batas p0) | LULUS |  |
| U08b | Kartu ke-9 ditolak + toast "Papan penuh" | LULUS | {"n":8,"toast":"Papan penuh. Maksimal 8 kartu."} |
| U08c | Label papan menampilkan "8/8 kartu" | LULUS |  |
| U09a | b7: ganti stage via menu → judul "Kotak Berbentuk" | LULUS |  |
| U10 | Picker memperbarui teks kartu di papan | LULUS | 📦Isi kotak 🔢 jumlah ikan dengan “lima” |
| U09b | b7: teks ke kotak angka → "Tidak muat!"; kartu berkedip merah; Bit bereaksi | LULUS | Tidak muat! Kotak bulat (angka) tidak bisa diisi “lima”. |
| U07 | Seret-susun ulang: kartu pertama dipindah ke bawah → urutan berubah | LULUS | sebelum: tak 🔢 jumlah ikan den / tak 🔤 nama perahu den / tak ⏻ lampu mercusuar  → sesudah: tak 🔤 nama perahu den / tak ⏻ lampu mercusuar  / tak 🔢 jumlah ikan den |
| U10b | b7: 3 kartu benar → berhasil; 3★ (2 kali jalankan, tanpa hint) | LULUS | 3 dari 3 bintang |
| U18b | "Lihat versi kode" b7 benar | LULUS | "nama_perahu = \"Kenari\"\nlampu_mercusuar = nyala\njumlah_ikan = 5" |
| U11a | b8: 3 ÷ 2 → ditolak "tidak bisa dibagi rata" | LULUS | 3 tidak bisa dibagi rata dengan 2. |
| U11b | b8: 3 × 4 + 2 = 14 → berhasil | LULUS |  |
| U18c | "Lihat versi kode" b8 = berat = 3 / berat = berat * 4 / berat = berat + 2 | LULUS | "berat = 3\nberat = berat * 4\nberat = berat + 2" |
| U12a | Easy: urutan hint = 1 gratis → 2 gratis → 3 (−10%) | LULUS | Hint 1 (gratis) → Hint 2 (gratis) → Hint 3 (−10% skor) |
| U12b | Hint 3 memuat solusi lengkap (jawaban langsung) | INFO | Isi berat dengan 3, ubah berat × 4, lalu ubah berat + 2. |
| U12c | Easy + hint 3 dipakai + 1 kali jalankan → 2★, skor 60 (=100×1×2/3×0,9) | LULUS | 2 dari 3 bintang \| Skor 60 · Tanpa hint berbayar untuk ★ berikutnya · ★ berhasil dalam 3 kali jalankan |
| U17b | Tombol "Coba lagi" tampil saat <3★ dan mempertahankan program | LULUS | kartu setelah retry=3 |
| U13a | Medium: hint 2 berbiaya −10% | LULUS | Hint 2 (−10% skor) |
| U13b | Hard: hint 2 = −15% dan hint 3 TIDAK tersedia | LULUS | Hint 2 (−15% skor) \| setelah hint 2: tombol=0 |
| U14a | Langkah: hasil langsung dinilai begitu KARTU TERAKHIR selesai (3 kartu → hasil setelah langkah ke-3) | **GAGAL** | overlay terbuka setelah langkah 1–4: false,false,false,true → pemain harus menekan Langkah sekali lagi tanpa petunjuk apa pun |
| U14b | Hard + Langkah → pengali ×1,75; 3★ (1 kali jalankan) → skor 175 | LULUS | 3 dari 3 bintang \| Skor 175 · ★ tanpa hint berbayar · ★ berhasil dalam 1 kali jalankan · Langkah dipakai di Hard: pengali ×1,75 |
| U15 | Hard tanpa Langkah, benar sekali jalan → 3★, skor 200 | LULUS | Skor 200 · ★ tanpa hint berbayar · ★ berhasil dalam 1 kali jalankan |
| U16 | Ganti kesulitan yang membuang kartu → pemain diberi tahu (toast/pesan) | **GAGAL** | 2 → 1 kartu; toast="" |
| U19b | Esc menutup menu stage | LULUS |  |
| U20a | Keyboard: Enter pada kartu palet menambah kartu | LULUS |  |
| U20b | Keyboard: Enter pada kartu papan membuka pemilih | LULUS |  |
| U20c | Keyboard: Delete menghapus kartu | LULUS |  |
| U20d | Fokus keyboard terlihat (outline ≥ 2px) pada kartu | LULUS | {"w":"3px","st":"solid"} |
| U23 | Tombol 🐇 mempercepat animasi (4 kartu) | LULUS | normal=2871ms, cepat=1512ms |
| U21 | Ganti kesulitan 3× tanpa bermain → TIDAK menambah entri catatan uji | **GAGAL** | entri catatan = 3 (semua runs=0) |
| U22 | Ulang→Jalankan cepat: selama proses berjalan tombol tetap nonaktif dan status "running" benar | **GAGAL** | {"running":false,"runDis":false,"stepDis":false,"hintDis":false} |
| U25 | Klik ganda cepat ▶ Jalankan → hanya 1 eksekusi tercatat | LULUS | runs=1 |

### T3 Tata letak & kontras (7 layar)
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| X-desktop-1280x720-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-desktop-1280x720-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | LULUS | b7=7 baris (tinggi papan 408px); b8=6 baris (352px) |
| X-desktop-1280x720-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | LULUS | menutupi 22% (bubble 143px dari dunia 658px) |
| X-desktop-1280x720-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | LULUS |  |
| X-desktop-1280x720-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | LULUS | 2 baris; dasar kontrol di y=710 dari 720 |
| X-desktop-1280x720-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 768×658 |
| X-chromebook-1366x768-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-chromebook-1366x768-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | LULUS | b7=8 baris (tinggi papan 472px); b8=7 baris (416px) |
| X-chromebook-1366x768-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | LULUS | menutupi 20% (bubble 143px dari dunia 706px) |
| X-chromebook-1366x768-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | **GAGAL** | #trash:🗑️ 60×36 |
| X-chromebook-1366x768-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | LULUS | 2 baris; dasar kontrol di y=758 dari 768 |
| X-chromebook-1366x768-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 820×706 |
| X-hp-portrait-360x740-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-hp-portrait-360x740-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | **GAGAL** | b7=3 baris (tinggi papan 218px); b8=2 baris (136px) |
| X-hp-portrait-360x740-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | **GAGAL** | menutupi 94% (bubble 245px dari dunia 262px) |
| X-hp-portrait-360x740-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | LULUS |  |
| X-hp-portrait-360x740-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | **GAGAL** | 2 baris; dasar kontrol di y=841 dari 740 |
| X-hp-portrait-360x740-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 360×262 |
| X-hp-portrait-360x740-g | Palet kartu b8 Hard tidak meluap horizontal (agar tidak butuh scroll) | **GAGAL** | palette 340px |
| X-hp-portrait-390x844-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-hp-portrait-390x844-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | **GAGAL** | b7=3 baris (tinggi papan 218px); b8=2 baris (176px) |
| X-hp-portrait-390x844-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | **GAGAL** | menutupi 66% (bubble 202px dari dunia 306px) |
| X-hp-portrait-390x844-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | LULUS |  |
| X-hp-portrait-390x844-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | **GAGAL** | 2 baris; dasar kontrol di y=885 dari 844 |
| X-hp-portrait-390x844-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 390×306 |
| X-hp-portrait-390x844-g | Palet kartu b8 Hard tidak meluap horizontal (agar tidak butuh scroll) | **GAGAL** | palette 370px |
| X-hp-landscape-667x375-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-hp-landscape-667x375-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | **GAGAL** | b7=2 baris (tinggi papan 176px); b8=3 baris (230px) |
| X-hp-landscape-667x375-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | **GAGAL** | menutupi 105% (bubble 137px dari dunia 131px) |
| X-hp-landscape-667x375-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | LULUS |  |
| X-hp-landscape-667x375-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | **GAGAL** | 1 baris; dasar kontrol di y=555 dari 375 |
| X-hp-landscape-667x375-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | **GAGAL** | 667×131 |
| X-hp-landscape-844x390-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-hp-landscape-844x390-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | **GAGAL** | b7=1 baris (tinggi papan 120px); b8=1 baris (120px) |
| X-hp-landscape-844x390-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | **GAGAL** | menutupi 51% (bubble 166px dari dunia 328px) |
| X-hp-landscape-844x390-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | **GAGAL** | #trash:🗑️ 60×36 |
| X-hp-landscape-844x390-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | **GAGAL** | 3 baris; dasar kontrol di y=466 dari 390 |
| X-hp-landscape-844x390-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 506×328 |
| X-tablet-portrait-768x1024-a | Tidak ada scroll horizontal pada dokumen (semua keadaan) | LULUS |  |
| X-tablet-portrait-768x1024-b | Papan Program menampilkan ≥ 3 baris kartu tanpa scroll (b7/b8) | LULUS | b7=6 baris (tinggi papan 362px); b8=6 baris (362px) |
| X-tablet-portrait-768x1024-c | Bubble dialog menutupi ≤ 40% tinggi area dunia saat stage dibuka (b7) | LULUS | menutupi 34% (bubble 137px dari dunia 404px) |
| X-tablet-portrait-768x1024-d | Semua tombol/kartu ≥ 44×44 px (target sentuh) | LULUS |  |
| X-tablet-portrait-768x1024-e | Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar | LULUS | 1 baris; dasar kontrol di y=1014 dari 1024 |
| X-tablet-portrait-768x1024-f | Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan) | LULUS | 768×404 |
| X-err | Tidak ada error/warning konsol di semua ukuran layar | LULUS |  |
| K-terang | Kontras teks ≥ 4,5:1 (mode terang) | LULUS | terendah 5.26:1 |
| K-gelap | Kontras teks ≥ 4,5:1 (mode gelap) | LULUS | terendah 7.1:1 |

### T3b Verifikasi usulan perbaikan CSS
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| V-360x740-A | Usulan A (#editor{min-height:0}) membuat tombol kontrol terlihat | LULUS | dasar kontrol 730/740 |
| V-360x740-B | Usulan B (A + landscape + layar pendek) membuat tombol kontrol terlihat DAN dunia ≥ 200 px tinggi | LULUS | kontrol 730/740; dunia 360×262; papan 120px |
| V-390x844-A | Usulan A (#editor{min-height:0}) membuat tombol kontrol terlihat | LULUS | dasar kontrol 834/844 |
| V-390x844-B | Usulan B (A + landscape + layar pendek) membuat tombol kontrol terlihat DAN dunia ≥ 200 px tinggi | LULUS | kontrol 834/844; dunia 390×306; papan 166px |
| V-667x375-A | Usulan A (#editor{min-height:0}) membuat tombol kontrol terlihat | **GAGAL** | dasar kontrol 451/375 |
| V-667x375-B | Usulan B (A + landscape + layar pendek) membuat tombol kontrol terlihat DAN dunia ≥ 200 px tinggi | LULUS | kontrol 365/375; dunia 347×325; papan 143px |
| V-844x390-A | Usulan A (#editor{min-height:0}) membuat tombol kontrol terlihat | **GAGAL** | dasar kontrol 466/390 |
| V-844x390-B | Usulan B (A + landscape + layar pendek) membuat tombol kontrol terlihat DAN dunia ≥ 200 px tinggi | LULUS | kontrol 380/390; dunia 506×340; papan 162px |

### T4 Sentuh (emulasi HP 360×740)
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| S01 | Seret-sentuh kartu dari palet ke papan → kartu bertambah | LULUS |  |
| S02 | Ketuk kartu palet menambah kartu (4 kartu) | LULUS |  |
| S03 | Setelah 4 kartu, tombol ▶ Jalankan berada di dalam layar (dapat disentuh) | **GAGAL** | tombol y=742–794 dari tinggi layar 740 |
| S04 | Tombol ⏹ Ulang, 💡 Hint, dan tong sampah berada di dalam layar | **GAGAL** | 854/854/854 dari 740 |
| S05 | [dengan perbaikan CSS A] Papan penuh (8 kartu) bisa di-scroll dengan menggeser jari DI ATAS kartu | **GAGAL** | papan 442px isi / 116px tampak; scrollTop setelah geser di atas kartu = 0 (kartu menangkap gestur sebagai seret karena touch-action:none) |
| S06 | [dengan perbaikan CSS A] Papan bisa di-scroll dengan menggeser di kolom nomor (di luar kartu) | LULUS | scrollTop=109 — satu-satunya cara scroll, tidak intuitif bagi anak |
| S07 | Palet b8 Hard (4 kartu) muat seluruhnya di layar 360 px tanpa perlu scroll | **GAGAL** | isi 577px / tampak 340px; kartu terpotong: ⬆️Maju (36% tampak), ↱Belok kanan (0% tampak) |
| S08 | Palet bisa di-scroll dengan menggeser jari di atas kartu | **GAGAL** | scrollLeft=0 (touch-action:none pada kartu) |
| S09 | Pemilih nilai: tombol ≥ 44 px dan tombol "Selesai" terlihat tanpa scroll di 360×740 | LULUS | {"sheetH":548,"vh":740,"minBtn":52,"done":true} |

### T5 Sumber daya & ketahanan
| ID | Kasus uji | Hasil | Catatan |
|---|---|---|---|
| R01 | Draw call per stage < 100 (anggaran GDD §8.5) dan segitiga < 20.000 | LULUS | p0: 23 call, 1158 segitiga \| b7: 48 call, 1306 segitiga \| b8: 42 call, 1336 segitiga |
| R02 | Memori GPU stabil setelah 31× ganti stage (geometri & tekstur tidak menumpuk) | **GAGAL** | geometri 132→540, tekstur 8→43; heap JS 10→10 MB |
| R03 | 12× eksekusi berturut-turut: jumlah tekstur label stabil (tidak bocor per langkah) | LULUS | tekstur 3→3 |
| R04 | localStorage ditolak (mode privat/iframe): halaman tetap dapat dimainkan sampai menang | LULUS |  |
| R05a | CDN Three.js gagal dimuat: ada pesan yang jelas bagi pemain | LULUS | Grafis 3D gagal dimuat. Periksa koneksi internet, lalu muat ulang halaman. |
| R05b | CDN Three.js gagal: logika tetap jalan tanpa crash (menang tetap terdeteksi) | LULUS |  |
| R06 | [iframe tersandbox TANPA allow-modals] tombol "Hapus catatan" berfungsi | **GAGAL** | entri tersisa=1; confirm() diabaikan oleh sandbox → tombol diam tanpa umpan balik (kondisi sandbox artifact sebenarnya belum diverifikasi) |
| R07 | Rotasi/resize saat berjalan: kanvas 3D mengikuti ukuran area dunia | LULUS | {"cw":360,"ww":360,"bufW":720,"ch":262,"wh":262} |
| R08 | Bobot unduhan awal (HTML + Three.js r128) < 8 MB | LULUS | HTML 50 KB + Three.js 589 KB = 0.62 MB (font web belum dihitung) |

## 11. Lampiran B — Bukti visual (`tests/evidence/`)

| Berkas | Memperlihatkan |
|---|---|
| `hp-portrait-360x740_b7_papan.png` | F01: tombol Jalankan terpotong di dasar layar; label adegan kecil dan bertumpuk |
| `hp-portrait-360x740_b7_bubble.png` | F03: dialog menutupi dunia |
| `hp-landscape-667x375_b7_papan.png` | F01: area dunia 131 px; kontrol di luar layar |
| `desktop-1280x720_b7_bubble.png` | F04/F16: label bertumpuk, mercusuar terpotong |
| `stage7_ikan_zoom.png` | F04: ikan sulit dihitung |
| `desktop-1280x720_b8_hard.png` | Tampilan Stage 8; label "berat kosong" muncul dua kali |
| `ui_p0_hasil.png` | F07/F16: teks hasil dan modal |
| `sentuh_360_4kartu.png` | F01 saat 4 kartu (sentuh) |
| `perbaikan_B_*.png` | Hasil usulan perbaikan B di empat layar HP |
| Lainnya | Seluruh kombinasi layar × stage dari T3 |

---

## 12. Uji ulang setelah perbaikan (11 November 2026)

Prototipe diperbaiki mengikuti urutan rekomendasi §7, butir 1–5 dan 7 (F01–F12). Butir 6 (uji di HP asli) tidak bisa dilakukan di lingkungan ini. Butir 8 (F13–F16) sengaja ditunda sampai ada data playtest. Semua suite dijalankan ulang pada **berkas yang sama dengan yang dipublikasikan**.

### 12.1 Hasil

| Suite | Sebelum perbaikan | Sesudah perbaikan | Info |
|---|---|---|---|
| T1 Logika | 9/10 | **10/10** | 0 |
| T2 Fungsional desktop | 37/42 | **42/42** | 1 |
| T3 Tata letak & kontras | 30/47 | **60/61** | 8 |
| T4 Sentuh | 4/9 | **12/12** | 0 |
| T5 Sumber daya | 7/9 | **9/9** | 0 |
| **Total** | 87/117 | **133/134** | |

Sisa kegagalan:
- `X-hp-landscape-667x375-b`: Papan Program menampilkan seluruh kartu (3) tanpa scroll (b7/b8) → b7: 3/3 kartu terlihat utuh (papan 205px); b8: 2/3 (153px)

Ini **batasan Minor yang diterima**: di HP lanskap terkecil, Stage 8 Hard (palet 4 kartu) menampilkan 2 dari 3 kartu, dan kartu ketiga dijangkau dengan menggulir papan (gulir sentuh terbukti bekerja, T4 S05).

**Visibilitas tombol kontrol (T3c, Stage Pengantar):**

| Layar | 0 kartu | 4 kartu | 8 kartu |
|---|---|---|---|
| 360x740 | semua terlihat | semua terlihat | semua terlihat |
| 390x844 | semua terlihat | semua terlihat | semua terlihat |
| 667x375 | semua terlihat | semua terlihat | semua terlihat |
| 844x390 | semua terlihat | semua terlihat | semua terlihat |

### 12.2 Status temuan

| ID | Status | Perubahan | Bukti uji |
|---|---|---|---|
| F01 | **Selesai** | `#editor{min-height:0}`; tata letak kolom hanya untuk potret; mode ringkas untuk lanskap pendek; `100dvh`; label tombol jadi ikon (dengan `aria-label`) di layar sempit | T3 `X-*-e`, T3c, T4 S03–S04 |
| F02 | **Selesai** (1 batasan Minor) | Gagang seret ⠿ (≥40×48 px), badan kartu `touch-action:pan-y` (bisa digulir); palet terbungkus; di layar sempit tong sampah diganti zona "lepas di deretan kartu"; papan menggulir otomatis ke kartu baru; kata "kotak" disembunyikan di kartu pada layar sempit | T3 `X-*-b`, `X-*-g`; T4 S05–S12 |
| F03 | **Selesai** | Dialog dipecah per halaman (≤80/110 karakter, tombol "Lanjut ▸"); di HP potret dialog berada di atas papan; di layar lain kamera memaskan adegan ke area di atas dialog; tombol 💬 untuk membuka ulang; intro Stage 7 dipersingkat | T3 `X-*-h` (objek kunci tidak tertutup) |
| F04 | **Selesai, belum diuji anak** | 5 ikan terpisah dalam satu baris, dua warna; kotak di baris depan berjarak 2 petak; papan nama "perahu: Kenari" di atas perahu; label menjadi elemen HTML dengan huruf 12–13 px di semua layar (versi ringkas ikon+isi bila sempit); kamera dipaskan ke batas adegan; nama stage pindah ke topbar di layar kecil | T3 `X-*-h`, `X-*-i`, `X-*-j` |
| F05 | **Selesai** | Stage 8 `limit:3`; intro diperbarui | T1 L10 |
| F06 | **Selesai** | Loop yang dibatalkan tidak lagi mengubah status | T2 U22 |
| F07 | **Selesai** | Teks hasil menyebut jumlah percobaan sebenarnya; "hint berbayar" → "hint pengurang skor" | T2 U24 |
| F08 | **Selesai** | Hasil dinilai begitu kartu terakhir selesai | T2 U14a |
| F09 | **Selesai** | Toast saat kartu dibuang karena ganti kesulitan | T2 U16 |
| F10 | **Selesai** | Percobaan tanpa aktivitas tidak dicatat | T2 U21 |
| F11 | **Selesai** | `disposeObj()` untuk geometri, material, dan tekstur saat ganti stage | T5 R02 |
| F12 | **Selesai** | Hapus catatan dengan dua ketukan di dalam halaman; tong sampah min. 52 px; tombol ✕ dan "Lanjut" 44 px | T5 R06, T3 `X-*-d` |
| F13–F16 | **Ditunda** | Diputuskan setelah playtest (§7 butir 8) | — |

### 12.3 Perubahan kriteria uji (dinyatakan terbuka)

1. **`X-*-c` "dialog ≤ 40% tinggi dunia" → diganti `X-*-h` "objek kunci tidak tertutup dialog/judul dan tidak terpotong".** Screenshot membuktikan kriteria lama mengukur hal yang salah: dialog bisa kecil tetapi tetap menutupi kotak atau papan nama. `X-*-c` tetap dicatat sebagai INFO.
2. **`X-*-b` "≥ 3 baris kartu" (diperkirakan dari tinggi kartu pertama) → "semua kartu terlihat utuh tanpa scroll".** Perkiraan lama keliru saat kartu pertama kebetulan 2 baris teks; pengukuran ulang menunjukkan ketiga kartu sebenarnya muat.
3. **Uji baru:** `X-*-h` keterhalangan, `X-*-i` ukuran teks label 3D ≥ 12 px, `X-*-j` label tidak saling tumpuk, T4 S10–S12 (gagang seret).
4. **Prasyarat T4 S05–S06** disesuaikan karena papan kini menggulir otomatis ke kartu baru (posisi awal gulir diatur ulang sebelum mengukur).

### 12.4 Bug yang muncul selama perbaikan (dan sudah diperbaiki)

- Tombol ✕ dialog terlepas ke pojok kanan atas layar (karena dialog dipindah ke panel dengan `position:static`) dan menutupi tombol menu.
- Halaman gagal dimuat: `placeBubble()` memanggil `resize()` sebelum variabel `renderer` dideklarasikan.
- Papan nama perahu tertutup chip judul stage di layar kecil (ditemukan oleh uji keterhalangan yang baru).
- Kartu baru tersembunyi di bawah papan saat dialog tutorial tampil di HP potret (ditemukan oleh T4 S10).

### 12.5 Catatan infrastruktur uji

Render WebGL perangkat lunak (SwiftShader) di mesin uji 1 core sesekali macet. Versi lama yang sudah lolos uji juga mengalaminya, jadi ini bukan bug halaman. Mitigasi: batas waktu protokol 60 dtk, browser baru per ukuran layar, percobaan ulang otomatis yang **dicatat** (`X-infra`), dan T3 dapat dijalankan per layar (`T3_VP=<nama> node t3_layout.js`, lalu `T3_MERGE=1`). Pada run akhir, satu layar butuh satu percobaan ulang.

### 12.6 Yang masih belum terbukti

- **Semua hal di §3 yang bertanda "tidak teruji"** tetap belum teruji: FPS/GPU nyata, sentuhan di HP asli, Safari, dan sandbox artifact.
- **F04 belum diuji ke anak**: apakah 5 ikan bisa dihitung dan label terbaca di HP fisik.
- Di HP, halaman pertama dialog Stage Pengantar tidak lagi memuat instruksi "Seret kartu Maju" (ada di halaman ke-2); kartu Maju tetap berdenyut. Pantau saat playtest apakah anak tahu harus berbuat apa.
- Checklist perangkat nyata (§8) masih harus dijalankan sebelum playtest di HP.

---

## 13. Prototipe v4 — penambahan B08 dan regresi penuh (12 November 2026)

**Perubahan:** stage **B08 "Jembatan Panjang"** (variabel) ditambahkan; label layar mengikuti ID kurikulum (B01 · B08 · B09 · B10, menggantikan "Stage 1/7/8"); menu stage memakai `data-id`; interpreter mendapat dua kait opsional (`dynBlock`, `onFill`); 3D: ubin hanya di daratan dan papan jembatan yang muncul saat Isi kotak dijalankan. Stage lain tidak berubah.

### 13.1 Hasil (berkas yang sama dengan yang diterbitkan)
| Suite | Hasil | Catatan |
|---|---|---|
| T1 Logika | **12/12** | + L11: B08 punya tepat 3 solusi terpendek (Isi 3/4/5 + 5 × Maju) di ketiga tingkat; + L12: angka 1–2 tidak pernah menang. Kunci DP kini memuat `bridge` |
| T2b B08 (baru, 10 kasus) | **10/10** | menu berurutan B01→B08→B09→B10; instruksi di halaman 1 dialog; Maju tanpa Isi → "Byur!"; Isi 1 → jembatan kurang panjang (hanya papan pertama muncul); ubah ke 3 → menang, 3★, kode `langkah = 3` + 5 × `maju()`; jembatan tetap ada walau kotak kemudian diisi lebih kecil; HP 360×740 tanpa error konsol |
| T2 Fungsional desktop | **42/42** (+1 info) | percobaan pertama |
| T3 Tata letak (7 layar + kontras) | **60/61** | satu-satunya kegagalan: HP lanskap 667×375, B10 menampilkan 2 dari 3 kartu (Minor yang diterima, papan bisa digulir). Kontras terendah 5,26:1 (terang) dan 7,1:1 (gelap) |
| T4 Sentuh | **12/12** | butuh 3 percobaan; dua pertama gagal karena infrastruktur uji macet |
| T5 Sumber daya | **9/9** | termasuk 31 pergantian stage melewati B08 tanpa kebocoran, dan uji tanpa internet |

### 13.2 Catatan kejujuran
- **Jam kontainer uji tidak dapat dipercaya** (melompat). Karena itu cap waktu berkas tidak dipakai sebagai bukti kesegaran: semua berkas bagian T3 dihapus lalu dibuat ulang sebelum digabung.
- **Infrastruktur macet** (render WebGL perangkat lunak, 1 core): T3 butuh 1 percobaan ulang di layar Chromebook dan 2 di tablet (tercatat sebagai `X-infra`); T4 butuh 3 percobaan. Ini bukan bug halaman (versi lama yang lolos uji juga mengalaminya).
- **Perubahan harness:** `openStage` memakai id stage; uji kontras tidak lagi memakai WebGL (hanya membaca gaya DOM); T3 dapat dijalankan per layar lalu digabung.
- **Uji B08 ditulis oleh penulis kodenya.** Ia memeriksa perilaku yang diharapkan, bukan apakah anak menemukan cara mengubah angka pada kartu (hipotesis H1).

### 13.3 Yang belum terbukti
- Prototipe hanya memuat jalur B01 → B08 → B09 → B10; B02–B07 dan B11–B13 belum ada.
- ~~Hint 3 di B09 dan B10 masih memberi jawaban penuh~~ → diperbaiki di v5 (§14).
- Belum diuji: HP asli, Safari, FPS nyata, anak sungguhan.

---

## 14. Prototipe v5 — hint 3 parsial di B08, B09, B10 (12 November 2026)

**Perubahan (hanya teks hint):** hint 3 di **B09** dan **B10** tidak lagi memuat jawaban lengkap (menutup F15, konsisten dengan B08).
| Stage | Hint 3 sebelum | Hint 3 sesudah |
|---|---|---|
| B09 Kotak Berbentuk | "Isi jumlah ikan dengan 5, nama perahu dengan “Kenari”, lampu mercusuar dengan ⏻ nyala." | "Kartu pertamamu: Isi kotak “jumlah ikan” dengan jumlah ikan di peti. Dua kotak lainnya kamu isi sendiri." |
| B10 Timbangan Pasar | "Isi berat dengan 3, ubah berat × 4, lalu ubah berat + 2." | "Kartu pertamamu: Isi kotak “berat” dengan 3 atau 4. Dua kartu sisanya kamu pikirkan sendiri." |

Kartu pertama B10 disebut "3 atau 4" karena kelima solusi 3-kartu dimulai dengan salah satunya (dihitung dengan brute force: 3+4×2, 3×4+2, 4+3×2, 4×3+2, 4×4−2). **B01 sengaja tidak diubah**: itu tutorial, dan solusinya hanya satu kartu yang diulang.

**Uji baru:**
- **T1 L13** (tanpa browser): hint 3 B08/B09/B10 diawali "Kartu pertamamu:", tidak memuat jawaban (angka 5/"Kenari"/"nyala"/operator), dan ≤ 110 karakter. **Terbukti tidak vakum:** dijalankan pada versi sebelum perbaikan, L13 gagal dan menunjuk persis hint B09 dan B10 yang membocorkan jawaban.
- **T2c** (9 kasus): teks hint 3 yang tampil di dialog, muat satu halaman, dan urutan biaya hint Easy tetap (1 gratis, 2 gratis, 3 −10%).

**Hasil:** T1 **13/13** · T2c **9/9** (satu percobaan ulang karena browser tertutup sendiri) · T2 penuh **42/42** (§14.1).

**Batas:** uji ini memastikan hint 3 *tidak membocorkan* jawaban; ia tidak membuktikan hint 3 *cukup membantu* anak yang macet. Itu hanya bisa diketahui dari playtest (apakah anak yang membuka hint 3 akhirnya menyelesaikan stage).

### 14.1 Regresi T2 dan catatan kejujuran
- **T2 penuh: 42/42 lulus** (+1 info) pada kode v5, percobaan pertama. Kasus hint (U12a–U13b) dan skor/bintang (U14–U15) ikut lulus, sehingga perubahan teks hint tidak mengganggu biaya hint, bintang, maupun skor.
- Setelah itu hanya **deskripsi satu uji** (U12b, kasus INFO) kuperbarui karena sebelumnya masih menyebut hint 3 "memuat solusi lengkap". Menjalankan ulang T2 untuk perubahan kosmetik itu **tiga kali terputus kemacetan infrastruktur** (render WebGL perangkat lunak) di sekitar kasus ke-31 tanpa satu pun asersi gagal. Karena berkas hasil hanya ditulis saat run selesai, `results/t2_ui_desktop.json` berisi run penuh yang lengkap (deskripsi U12b di sana masih teks lama; keluaran konsol run parsial menunjukkan teks baru yang benar).
- **Tidak dijalankan ulang** (tidak relevan dengan perubahan teks hint): T3 (tata letak), T4 (sentuh), T5 (sumber daya).


## 15. Prototipe v6 — Beginner lengkap: B02–B07 dan B11–B13 (15 November 2026)

Prototipe sekarang memuat **13 stage Beginner** (B01–B13). Sembilan stage baru dibangun di berkas yang sama dengan mekanik baru: kartu **Ambil · Taruh · Tekan tombol** (B03–B04), kartu **Jika** dengan sensor *Ada tembok di depan?* / *Warna lantai* / *Isi kotak (> < = ≠) N* / *Sakelar nyala?* (B05–B07, B12–B13), dan jalur **selain itu** (B06 dan seterusnya).

### 15.1 Cara kerja yang baru
- **Variasi acak per stage.** B05, B06, B07, B12, B13 punya banyak "keadaan" (lantai merah/biru, ada tembok/lurus, muatan berat/ringan, sakelar nyala/mati). Tiap percobaan memilih satu keadaan secara acak (`Math.random`). Jika program menang di keadaan itu, program **dijalankan diam-diam di semua keadaan lain** sebelum dinilai. Kalau ada yang gagal, anak mendapat pesan "Berhasil untuk satu keadaan, tapi belum untuk keadaan lain (…)", dan tombol Jalankan berikutnya langsung memperlihatkan keadaan yang gagal itu. Jumlah keadaan: B05 = 2, B06 = 2, B07 = 8, B12 = 4, B13 = 2.
- **Kartu Jika adalah satu kartu** dengan satu tindakan di jalur *maka* dan satu (opsional) di jalur *selain itu*. Bukan kartu wadah bersarang seperti di GDD §3. Lihat catatan penyimpangan 15.5.
- Pesan "Ya/Tidak → tindakan" muncul sebagai toast tiap kartu Jika dijalankan, supaya anak melihat hasil pemeriksaan.
- Palet di layar sempit memakai label pendek ("Kiri", "Kanan", "Tekan", "Ubah", "Isi"), dan di HP lanskap tanpa ikon. Alasannya teknis: palet 9 kartu di B13 mendorong tombol Jalankan keluar layar.

### 15.2 Uji baru
| Berkas | Isi | Hasil |
|---|---|---|
| **T1b** `t1b_beginner_lengkap.js` | Program acuan lulus di **semua** keadaan tiap stage; program salah gagal di minimal satu keadaan; struktur peta valid; **tanpa kartu Jika tidak ada program ≤ batas kartu yang lulus semua keadaan** (BFS atas himpunan keadaan, B05/B06/B07/B12/B13 di Easy dan Hard) | **55/55** |
| **T2d** `t2d_beginner_lengkap.js` | Menyusun solusi lewat antarmuka (ketuk kartu, picker, Jalankan) untuk tiap stage baru, di beberapa keadaan (B07 di 2 keadaan, B12 di 4); penilaian lintas-keadaan; picker Jika; kode semu; kartu Jika di HP 360 px | **21/21** (4 + 6 + 11) |
| **T3d** `t3d_layout_stage_baru.js` | 9 stage × 3 tingkat × 4 layar HP: tombol kontrol terlihat penuh, dunia ≥ 150 px, papan ≥ 100 px | **108/108** (27 per layar) |

### 15.3 Regresi pada berkas yang sama
T1 **13/13** · T2 **42/42** · T2b **10/10** · T2c **9/9** · T3 **61/61** (+8 info) · T4 **12/12** · T5 **9/9**.
Catatan: T1 sekarang menghitung (DP) hanya 4 stage lama; menghitung semua 13 melewati batas waktu protokol. Stage baru ditutup oleh T1b.
Setelah perbaikan CSS terakhir (lebar minimum kartu palet di HP lanskap) saya menjalankan ulang hanya T2b bagian 1, T2d bagian 1, T3 (tiga layar yang terdampak + penggabungan), T3d, dan T4. T2, T2c, T5, dan sisa T2b dijalankan pada build sebelum perubahan itu; perubahannya hanya berlaku pada layar pendek (`max-height:450px`), jadi saya menilai risikonya kecil, tetapi itu penilaian saya, bukan bukti.

### 15.4 Yang ditemukan uji selama pengerjaan (dan sudah diperbaiki)
1. **Regresi di B08 (stage lama).** Pemeriksaan "petak bukan daratan" yang baru memblokir jembatan yang sudah terpasang. T1 L11 dan L12 gagal dan menunjuknya; tanpa uji lama itu tidak akan terlihat. Diperbaiki: celah jembatan dikecualikan.
2. **Label berdesakan di B11 dan B12** (nama + isi + pesanan + nama gerbang saling menimpa dan menutupi Bit). Ditemukan dari tangkapan layar, bukan dari uji otomatis. Diperbaiki: label pendek, papan pesanan satu baris di dermaga, jalur B12 diperpanjang.
3. **Palet B13 mendorong tombol Jalankan keluar layar** di HP 360×740 dan 667×375 (T2d X5, lalu T3d). Diperbaiki dengan palet ringkas (15.1).
4. **Target sentuh kartu palet "Isi" lebar 40 px** di HP lanskap (T3 X-d). Diperbaiki dengan lebar minimum 48 px.
5. **Uji lama kedaluwarsa:** T2b B01 mengharapkan menu hanya 4 stage. Kriterianya kuubah menjadi 13 stage berurutan (perubahan harapan, bukan perbaikan kode).
6. Efek samping yang menguntungkan: sisa temuan Minor lama (HP lanskap 667×375, B10 hanya 2 dari 3 kartu terlihat) hilang karena palet lebih pendek. T3 sekarang 61/61.

### 15.5 Penyimpangan dari spesifikasi (jujur)
| Spesifikasi (Kurikulum v0.3 / GDD) | Prototipe v6 | Dampak |
|---|---|---|
| Kartu wadah **bersarang** (Jika berisi kartu lain) | Satu kartu Jika, satu tindakan per jalur | **Risiko terbesar untuk Junior.** Ulangi bersarang, Syarat gabungan, dan Mesin-di-dalam-Mesin butuh wadah sungguhan. Hasil playtest B05–B07 tidak bisa dipakai untuk menyimpulkan bahwa anak mampu memakai kartu bersarang. |
| B05 sensor *Ada benda?* | Tidak dibuat (hanya tembok, warna, kotak, sakelar) | Kecil. |
| B04 "mengantar tiga peti" | Bit membawa beberapa peti sekaligus; Taruh melepas semuanya; solusi 13 kartu | Mengubah strategi (tanpa bolak-balik). Aturan ini harus diajarkan lewat hint. |
| B12 "buka gerbang A / B" | Gerbang A dan B adalah dua dermaga yang dicapai dengan Belok kiri / kanan; tidak ada aksi "buka gerbang" | Konsepnya (cabang berdasarkan nilai kotak) tetap sama, bentuknya berbeda. |
| B13 memakai "pembanding" | Sensor kotak tersedia, tetapi solusi acuan tidak memerlukannya | Pembanding hanya **dipaksa** di B12. B13 tetap memakai ≥ 4 mekanik (urutan/belok, aksi, Jika–selain itu, variabel/operasi). |
| Easy/Medium/Hard berbeda kartu pengecoh | Di B07 dan B12 palet ketiga tingkat **sama** (tanpa pengecoh) | Pada stage itu tingkat kesulitan hanya mengubah pengali skor dan batas percobaan bintang. |

### 15.6 Yang belum terbukti (penting)
- **Pedagogi.** T1b membuktikan bahwa kartu Jika *diperlukan* (tanpa Jika tidak ada solusi) dan bahwa program acuan *ada*. Ia tidak membuktikan bahwa anak SD **menemukan** itu. Penulis kode, program acuan, dan uji adalah orang yang sama.
- **Pesan "berhasil untuk satu keadaan, tapi…"** belum diuji pada anak. Bisa jadi dibaca sebagai hukuman, bukan petunjuk. Ini hal pertama yang perlu diamati di B05.
- **B07 butuh 11 kartu dan tiga kartu Jika.** Tidak ada bukti bahwa itu wajar untuk kelas 4. Kalau playtest menunjukkan anak menyerah di B07, pangkas persimpangan menjadi satu.
- Variasi acak memakai `Math.random`; tidak ada jaminan anak melihat semua keadaan sebelum menang. Penilaian lintas-keadaan menutup celah itu untuk *kebenaran*, bukan untuk *pengalaman belajar*.
- Tetap belum diuji: HP asli, Safari/iOS, FPS nyata, layar baca, dan **anak sungguhan**.


## 16. Prototipe v7 — sisa C1: label Indonesia, pengali Sulit, modal hasil, pesan ramah (16 November 2026)

| Kode | Perubahan | Uji |
|---|---|---|
| **G1** | Antarmuka berbahasa Indonesia: Easy/Medium/Hard → **Mudah/Sedang/Sulit**, Hint → **Petunjuk**, Stage → **Tahap** (tombol, menu, dialog, hasil). Nilai internal (`easy/medium/hard`) dan ID stage tidak berubah. Teks menu usang ("Stage Pengantar (P0)…") diganti "13 tahap tingkat Beginner (B01–B13)". | T2e G1a, G1b (tidak ada kata Hint/Stage/Easy/Medium/Hard di teks terlihat) |
| **F13** (sementara) | Pengali **Sulit ×1,5** (sebelumnya ×2). Sulit + tombol Langkah **×1,25** (sebelumnya ×1,75; selisih 0,25 dipertahankan). Alasan: di semua stage, Sulit hanya menambah pengecoh dan solusi terpendeknya sama dengan Mudah (F13), jadi ×2 tidak adil. **Bagian "varian data Sulit" belum dibuat**; pengali ini baru dinaikkan setelah ada. | T2 U14b (125), U15 (150) |
| **F16** | Layar hasil muncul **1,6 detik** setelah menang (sebelumnya 0,9) sebagai **lembar bawah tanpa latar gelap**; di HP lanskap lembar bergeser ke kanan (di atas kolom editor). Momen lampu menyala tidak tertutup. | T2e F16a–F16d: menutupi 29% panel dunia di desktop, 0% di HP 360×740, 667×375, 844×390; tombol hasil terlihat penuh |
| **G3** | Pesan gagal diakhiri "Tidak apa-apa, coba lagi!" (kecuali pesan lintas-keadaan yang sudah berisi ajakan menjalankan ulang). Humor "Duk!/Byur!" dipertahankan. | T2e G3 |

**Hasil regresi pada berkas yang sama:** T1 **13/13** · T1b **55/55** · T2 **42/42** · T2b **10/10** · T2c **9/9** · T2d **21/21** · **T2e 9/9 (baru)** · T3 **61/61** (+8 info) · T3d **108/108** · T4 **12/12** · T5 **9/9**.

**Perubahan harapan uji (bukan bug):** semua pembantu "tunggu hasil" diperpanjang ke 1,9 detik karena modal sengaja tertunda; satu uji (T2 U14a) sempat gagal karena memeriksa modal terlalu cepat, lalu timingnya kuperbaiki dan lulus 42/42 pada putaran kedua. Skor yang diharapkan U14b/U15 mengikuti pengali baru.

**Belum terbukti:** apakah label Indonesia benar-benar lebih jelas bagi anak, apakah 1,6 detik pas (bisa terlalu lama bagi anak yang ingin lanjut), dan apakah "Tidak apa-apa, coba lagi!" menenangkan atau justru terasa berulang. Semuanya hipotesis untuk playtest.

**Sisa C1:** varian data Sulit (F13 bagian dua) dan F14 (bersyarat data D5). Keduanya sengaja menunggu playtest nyata.


## 17. Prototipe v8 — Junior misi pertama (J01–J06) dan kartu wadah bersarang (16 November 2026)

Keputusan pemilik: **membangun tanpa menunggu playtest**. Urutan yang dipakai: Junior → Middle A → Middle B → Senior → Expert (Expert tetap sesudah Senior, sesuai aturan progres). Putaran ini menyelesaikan fondasi Junior dan misi "Kincir Rusak".

### 17.1 Yang baru
- **Kartu wadah:** *Ulangi … kali* dan *Selama …*. Tiap wadah otomatis mendapat kartu **Selesai** sebagai penutup; kartu di antaranya menjorok. Selesai tidak dihitung dalam batas kartu. Setelah tiap perubahan, Selesai tanpa pasangan dibuang dan yang kurang ditambahkan, jadi susunan tidak pernah "rusak".
- **Ketuk-tambah masuk ke wadah terakhir yang masih terbuka.** Mengetuk kartu Selesai menutup wadah (✓), sehingga kartu berikutnya diletakkan sesudahnya. Menyeret tetap bisa ke posisi mana pun.
- **Syarat gabungan** pada Selama: awalan TIDAK, lalu DAN / ATAU dengan syarat kedua. Sensor: ada jalan / tembok / lubang di depan, ada koin di sini.
- **Penafsir bersarang** (generator) dengan langkah pemeriksaan yang terlihat ("Putaran 2 dari 8", "…? Ya → ulangi"). Putaran yang tidak mengubah keadaan dihentikan seketika dengan pesan; batas keras 30 putaran.
- Kode semu berindentasi.

| Tahap | Mekanik baru | Solusi acuan | Batas | Keadaan acak |
|---|---|---|---|---|
| J01 Jalan Panjang (K) | Ulangi | Ulangi 8 [Maju] | 2 | 1 |
| J02 Tangga Batu (L) | — | Ulangi 3 [Maju, Kanan, Maju, Kiri] | 5 | 1 |
| J03 Keliling Kebun (K) | Ulangi di dalam Ulangi | Ulangi 4 [Ulangi 3 [Maju], Kanan] | 4 | 1 |
| J04 Sampai Tembok (K) | Selama | Selama ada jalan [Maju] | 2 | 3 (panjang 3/5/7) |
| J05 Tembok atau Lubang (K) | TIDAK · DAN · ATAU | Selama TIDAK tembok DAN TIDAK lubang [Maju] | 2 | 4 |
| J06 Jalur Koin (L) | — | Selama ada jalan [Jika koin → Ambil, Maju], Jika koin → Ambil | 5 | 4 |

### 17.2 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1c** (baru) | Program acuan di semua keadaan; 15 program salah gagal; **tanpa kartu wadah tidak ada solusi ≤ batas kartu** (BFS); J03 satu tingkat butuh 5 kartu > batas 4; urutan langkah penafsir; pengaman putaran; normalisasi Selesai | **33/33** |
| **T2f** (baru) | Semua tahap lewat antarmuka di tiap keadaan; ketuk-masuk-wadah; tutup wadah; indentasi; picker syarat gabungan; hapus wadah; tombol Langkah di dalam putaran; putaran tak berujung; HP 360×740 dan 667×375 | **24/24** (7 + 9 + 8) |
| T3d (diperluas ke J01–J06) | 15 tahap × 3 tingkat × 4 layar HP | **180/180** |
| Regresi | T1 13/13 · T1b 55/55 · T2 42/42 · T2b 10/10 · T2c 9/9 · T2d 21/21 · T2e 9/9 · T3 61/61 · T4 12/12 · T5 9/9 | semua lulus |

### 17.3 Temuan selama pengerjaan
1. **Toast menghalangi ketukan.** Pesan sementara di tengah-atas layar menutupi kartu palet dan menelan ketukan (T2f J03a gagal karena itu). Bug ini sudah ada sejak awal dan baru terlihat karena wadah memunculkan toast petunjuk. Diperbaiki: toast tidak lagi menerima sentuhan.
2. **Putaran tak berujung terasa macet.** Dengan batas 300 putaran, "Selama ada jalan" tanpa Maju berjalan lebih dari 20 detik sebelum berhenti. Diperbaiki: putaran yang tidak mengubah keadaan dideteksi setelah satu putaran (0,9 detik).
3. Harapan uji menu (T2b B01) diperbarui menjadi 19 tahap.

### 17.4 Penyimpangan dan keputusan desain yang perlu kamu ketahui
- **J03:** spesifikasi menyebut kebun 3×4; prototipe memakai kebun persegi (4 sisi sama) agar solusi K hanya 4 kartu. Kebun 3×4 butuh 7 kartu dan dua Ulangi dalam, terlalu berat untuk tahap pengenalan.
- **J04:** spesifikasi tidak menyebut sensor "ada jalan di depan"; saya menambahkannya karena TIDAK baru diajarkan di J05, sehingga "Selama TIDAK ada tembok" belum boleh dipakai di J04.
- **Kartu Jika masih kartu tunggal** (satu tindakan per jalur), belum wadah. Cukup untuk J06; perlu jadi wadah bila ada tahap yang butuh beberapa tindakan di dalam Jika.
- **Wadah memakai kartu penutup "Selesai" dalam daftar datar**, bukan blok berlekuk seperti di GDD §3. Pilihan ini murah dan tahan sentuhan, tetapi berbeda dari rancangan.

### 17.5 Yang belum terbukti
- Seluruh model interaksi wadah (Selesai, menjorok, ketuk untuk menutup) **belum pernah dicoba anak**. Ini asumsi terbesar yang sekarang menopang Junior dan semua tingkat di atasnya.
- J05 meminta TIDAK dan DAN sekaligus di tahap pengenalan pertama logika boolean. Aturan "satu mekanik baru per tahap" terpenuhi di atas kertas (satu entri registri), tetapi beban kognitifnya bisa dua.
- Tidak ada tahap yang memaksa ATAU; ATAU hanya muncul sebagai pilihan yang salah di J05.
- Belum dibangun: J07–J14 (Mesin, masukan, keluaran, Rak, Untuk setiap, tahap penutup), Placement Test 1, serta Middle A, Middle B, Senior, dan Expert.


## 18. Prototipe v9 — Junior lengkap: J07–J14 (16 November 2026)

Junior sekarang lengkap di prototipe: **14 dari 14 tahap**. Total prototipe **27 tahap**, sama dengan cakupan MVP rilis (Beginner + Junior).

### 18.1 Mekanik baru
- **Mesin (fungsi):** kartu wadah *Buat Mesin* menyimpan langkah; *Jalankan Mesin* mengerjakannya. Isi Mesin tidak dijalankan saat kartu Buat Mesin dilewati.
- **Masukan (parameter):** *Jalankan Mesin dengan masukan N*; di dalam Mesin, Ulangi bisa memakai "masukan" sebagai jumlah putaran.
- **Keluaran (nilai balik):** *Keluarkan masukan × N* menghentikan Mesin dan menghasilkan angka. Slot nilai *hasil Mesin(N)* di kartu Isi kotak mengisikan hasil itu.
- **Rak bernomor mulai 0 (list):** *Ambil dari rak nomor N*. Nomor di luar rak ditolak dengan pesan "dimulai dari 0".
- **Untuk setiap isi rak:** wadah yang mendatangi isi rak satu per satu, dengan slot *isi rak sekarang* untuk Jika (rusak?) dan Ubah kotak (+ beratnya).
- Aksi baru: Susun balok, Pasang atap, Buang. Sensor baru: ada tanda menara, isi rak sekarang rusak.
- Pengaman: Mesin yang menjalankan Mesin di dalam dirinya ditolak (rekursi = materi Middle A); "masukan" dan "isi rak sekarang" di luar wadahnya ditolak dengan pesan.

| Tahap | Mekanik baru | Solusi acuan | Batas | Keadaan acak |
|---|---|---|---|---|
| J07 Tiga Menara (K) | Buat & Jalankan Mesin | Mesin [Susun, Susun, Atap] + Maju/Jalankan ke 3 lahan | 13 | 1 |
| J08 Menara Berbeda (K) | Masukan | Mesin [Ulangi masukan [Susun], Atap]; Jalankan 2, 4, 3 | 13 | 1 |
| J09 Hitung Bata (K) | Keluaran + slot hasil Mesin | Mesin [Keluarkan masukan × 4]; Isi kotak hasil Mesin(2), (3), (5) | 5 | 1 |
| J10 Kota Bertanda (L) | — | Mesin [Ulangi 3 [Susun], Atap]; Ulangi 5 [Maju, Jika tanda → Jalankan Mesin] | 8 | 4 |
| J11 Rak Nomor Nol (K) | Rak mulai 0 | Ambil rak 2, Ambil rak 4 | 2 | 1 |
| J12 Sortir Barang (K) | Untuk setiap + isi rak sekarang | Untuk setiap [Jika rusak → Buang] | 2 | 4 |
| J13 Timbang Semua (L) | — | Isi total 0; Untuk setiap [Ubah total + isi rak sekarang] | 3 | 4 |
| J14 Mercusuar Ulang (P) | — | Isi 0; Untuk setiap [Ubah + isi]; Selama ada jalan [Maju]; Tekan | 7 | 4 |

### 18.2 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1d** (baru) | Acuan di semua keadaan; 17 program salah gagal; **tanpa Mesin / Untuk setiap / Selama tidak ada solusi ≤ batas** (BFS menurut biaya; Ulangi k [satu kartu] dihitung 2 kartu); masukan, Keluarkan, larangan rekursi, isi rak sekarang, nomor rak 0 | **42/42** |
| **T2g** (baru) | Semua tahap J07–J14 lewat antarmuka (Mesin bersarang, picker masukan/hasil Mesin/nomor rak), beberapa keadaan, kode semu fungsi | **17/17** |
| T3d (diperluas ke 23 tahap) | 4 layar HP × 3 tingkat | **276/276** |
| Regresi | T1 13 · T1b 55 · T1c 33 · T2 42 · T2b 10 · T2c 9 · T2d 21 · T2e 9 · T2f 24 · T3 61 · T4 12 · T5 9 | semua lulus |

**Total v9: 633 kasus lulus dari 633.**

### 18.3 Temuan selama pengerjaan
1. **Kartu Selesai tertinggal di bawah papan.** Setelah menambah kartu ke dalam wadah, papan hanya menggulir ke kartu baru; Selesai yang perlu diketuk berada di luar layar, dan ketukan uji mengenai tombol Jalankan. Diperbaiki: papan juga menggulir agar Selesai terlihat.
2. Ambil dari rak di tahap tanpa keranjang membuat galat (ditemukan oleh BFS). Diperbaiki dengan pesan.
3. Label keranjang menimpa label rak nomor 0 (J11) dan papan aturan menimpa Bit (J09); ditemukan dari tangkapan layar dan dipindahkan.
4. Pembantu uji kini menggulir kartu ke layar sebelum mengetuknya (papan panjang di J08).
5. Infrastruktur: folder keluaran sempat dipasang ulang di tengah rangkaian uji sehingga 5 suite berhenti dengan `uv_cwd`. Suite itu dijalankan ulang dan lulus; ini bukan kegagalan kode.

### 18.4 Penyimpangan dan keterbatasan
- **J07 menara di samping jalan**, bukan "3 menara identik" yang dibangun di tempat; Mesin tetap wajib karena batas kartu.
- **J10** tidak ada di spesifikasi dengan bentuk ini (spesifikasi: "rangkai Mesin dan Ulangi"); saya menambahkan Jika agar Mesin benar-benar diperlukan (Jika hanya bisa menjalankan satu tindakan).
- **J14 tidak memaksa Mesin.** Mekanik yang wajib: Isi, Untuk setiap, Ubah dengan isi rak sekarang, Selama, Tekan. Spesifikasi menyebut Mesin juga.
- Hanya **satu Mesin** per program (tanpa nama); Mesin di dalam Mesin ditolak.
- Rak hanya bisa dibaca (Ambil, Buang), belum bisa ditambah atau diurutkan; itu bagian Middle A.
- BFS "tanpa wadah" memakai pendekatan: Ulangi hanya berisi satu kartu. Program datar dengan Ulangi berisi beberapa kartu tidak dijelajahi.

### 18.5 Yang belum terbukti
- Anak memahami beda **Buat Mesin** (menyimpan) dan **Jalankan Mesin** (mengerjakan). Ini miskonsepsi fungsi yang paling umum, dan prototipe hanya menjelaskannya lewat toast "Mesin disimpan".
- J09 (masukan + keluaran + slot hasil sekaligus) mungkin terlalu padat untuk satu tahap K.
- Belum ada Placement Test 1, sertifikat, dan penyimpanan progres antar-tahap, padahal ketiganya bagian MVP.


## 19. Prototipe v10 — progres pemain, kunci tahap, keadaan acak yang bisa diputar ulang (17 November 2026)

Mengerjakan dua item paling mendesak dari review kesiapan rilis: #1 (simpan progres + buka-kunci) dan #2 (keadaan acak yang bisa diulang + ekspor catatan). Keputusan pemilik yang tercatat bersamaan: **nama anak muncul di sertifikat**; **belum ada skor tingkat**. Sertifikat sendiri belum dibangun.

### 19.1 Progres dan kunci tahap (#1)
- Tahap selesai dan bintang terbaik disimpan di perangkat (`localStorage`, kunci `kn_progres_v1`). Tidak ada nama, akun, atau skor di data progres.
- **Aturan buka:** tahap terbuka bila tahap sebelumnya selesai. J01 terbuka bila **semua** tahap Beginner selesai. Nantinya Placement Test 1 juga bisa membuka J01; aturan itu belum ada.
- Menu dikelompokkan per tingkat ("Beginner · 3 dari 13 selesai"). Tahap terkunci tampil dengan 🔒 dan alasannya ("Selesaikan B04 Rute Memutar dulu."). Mengetuknya hanya memunculkan alasan.
- Tombol hasil "Tahap berikutnya" hanya muncul bila tahap berikutnya sudah terbuka; jika belum, tombolnya menjadi "Pilih tahap".
- Saat dibuka lagi, permainan lanjut di tahap terakhir yang dimainkan bila masih terbuka. Jika tidak, ia membuka tahap pertama yang belum selesai.
- **Untuk pengajar dan fasilitator:**
  - Centang "Buka semua tahap (pengajar)" membuka semua tahap dan tetap aktif setelah muat ulang.
  - Tombol "Hapus progres" butuh dua ketukan.
- Jika penyimpanan diblokir, permainan tetap jalan dan progres hanya bertahan selama halaman terbuka.

### 19.2 Keadaan acak yang bisa diputar ulang + ekspor catatan (#2)
- `Math.random` untuk pemilihan keadaan diganti dengan **benih sesi** (6 digit). Keadaan tiap percobaan = hash(benih, tahap, urutan percobaan). Benih sesi yang sama menghasilkan urutan keadaan yang sama persis.
- Parameter tautan:
  - `?benih=123456` memakai benih tertentu.
  - `?tahap=s05&keadaan=1` langsung membuka tahap dan keadaan itu. Kunci tahap diabaikan, supaya laporan bug bisa diputar ulang.
- Tiap kali Jalankan selesai (menang atau gagal), catatan menyimpan jejak: nomor dan nama keadaan, berhasil atau tidak, pesan, jumlah kartu, dan **tautan ulang** (`?tahap=…&keadaan=…&benih=…`). Maksimal 20 jejak per percobaan.
- Panel "Catatan uji" menampilkan kode sesi. Isi ekspor: versi aplikasi, kode sesi, waktu, ukuran layar, peramban, progres, dan semua catatan.
- Tombol baru **"Unduh .json"** membuat berkas `kode-nusantara-catatan-YYYYMMDD-HHMM-<sesi>.json`. Di claude.ai, unduhan memakai kapabilitas `downloads`: penampil melihat konfirmasi nama dan ukuran berkas, lalu boleh menolak. Sebagai berkas HTML lokal, unduhan memakai tautan unduh biasa. Tombol Salin tetap tersedia. Jalur `downloads` belum bisa diuji otomatis karena hanya ada di dalam penampil claude.ai.

### 19.3 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T2h** (baru) | Profil baru hanya B01 terbuka; alasan kunci; ketuk tahap terkunci; menang → bintang + B02 terbuka; muat ulang → progres tetap + lanjut di B02; hapus progres dua ketukan; mode pengajar; penyimpanan diblokir; benih sama → urutan sama (B07, 8 keadaan); tautan ulang membuka keadaan 5 walau terkunci; jejak + tautan ulang di catatan; nama dan isi berkas unduhan | **12/12** |
| Regresi | T1 13 · T1b 55 · T1c 33 · T1d 42 · T2 42 · T2b 10 · T2c 9 · T2d 21 · T2e 9 · T2f 24 · T2g 17 · T3 61 · T3d 276 · T4 12 · T5 9 | semua lulus |

**Total v10: 645 kasus lulus dari 645.**

Perubahan pada perangkat uji (bukan perubahan harapan):
- `lib.js` sekarang menyalakan "Buka semua tahap" untuk uji lama, karena uji lama membuka tahap mana pun. Uji kunci memakai `locked:true`.
- Penanda ekspor uji mengikuti baris mulai yang baru.

### 19.4 Temuan
- Bintang di menu sempat tersusun ke bawah karena gaya `span` bawaan menu. Ditemukan dari tangkapan layar dan diperbaiki.
- Rangkaian uji kini masuk ulang ke folder uji sebelum tiap suite. Ini mencegah kegagalan `uv_cwd` saat folder keluaran dipasang ulang.

### 19.5 Keterbatasan dan yang belum terbukti
- Progres hanya ada di satu perangkat dan satu peramban. Anak yang berganti HP mulai dari awal. Untuk sekolah dengan perangkat bergiliran, progres anak lain bisa terlihat. Ini konsekuensi "tanpa akun" yang perlu diputuskan sebelum rilis.
- Aturan "J01 butuh semua Beginner" membuat anak yang sudah mahir harus menyelesaikan 13 tahap dulu sampai Placement Test 1 dibangun.
- Kunci tahap bisa dilewati siapa pun lewat centang pengajar, tanpa sandi. Disengaja untuk playtest; perlu ditinjau sebelum rilis publik.
- Belum diuji di peramban HP asli, termasuk perilaku unduhan berkas di Android/iOS.


## 20. Prototipe v11 — Middle A misi 1: rekursi (MA01–MA03) (17 November 2026)

Permintaan pemilik: (1) rancangan placement test dan tes ulang, (2) lanjutkan Middle A dan Middle B, (3) rancang model permainan Senior dan Expert. Butir 1 dan 3 selesai sebagai dokumen terpisah (*Rancangan Placement Test dan Tes Ulang*, *Model Permainan Senior dan Expert*). Butir 2 baru sampai **Middle A misi 1 (3 dari 20 tahap)**. Middle B belum dimulai; alasannya di §20.4.

### 20.1 Mekanik baru: Mesin memanggil dirinya
- Di tahap bertanda `recursive`, kartu Jika di dalam Mesin bisa memeriksa **masukan** (> < = ≠ angka) dan menjalankan **"Jalankan Mesin dengan masukan − 1"** atau **"Keluarkan 0"**.
- Kartu Keluarkan punya pilihan baru **"masukan + hasil Mesin(masukan − 1)"** (rekursi dengan nilai balik).
- Pengaman: kedalaman maksimum 20. Rekursi tanpa titik berhenti dihentikan dengan pesan "Mesin memanggil dirinya terus tanpa berhenti. Tambahkan titik berhenti…". Di Junior, Mesin memanggil dirinya tetap ditolak.
- Nilai bawaan picker sengaja **bukan jawaban**: Jika masukan > **0** memberi menara 8 balok, alih-alih 7 (kesalahan klasik "kurang satu").
- Menu kini punya tingkat **Middle A**. MA01 terkunci sampai semua Junior selesai.

| Tahap | Teka-teki | Solusi acuan | Batas | Cara tanpa rekursi |
|---|---|---|---|---|
| MA01 Menara Cermin (K) | Menara 7 balok + atap | Mesin [Susun, Jika masukan > 1 → Mesin(masukan − 1)]; Maju; Mesin(7); Atap | 6 | 9 kartu (tanpa Mesin, atau Mesin 2 balok dipanggil 3×) |
| MA02 Piramida Batu (K) | Isi kotak total dengan 6+5+4+3+2+1 | Mesin [Jika masukan = 0 → Keluarkan 0, Keluarkan masukan + hasil Mesin(masukan − 1)]; Isi total hasil Mesin(6) | 4 | 6 kartu (Isi + 5 Ubah) |
| MA03 Tangga Turun (L) | Menara 4, 3, 2, 1 beratap | Mesin [Maju, Ulangi masukan [Susun], Atap, Jika masukan > 1 → Mesin(masukan − 1)]; Mesin(4) | 7 | 9 kartu (Mesin bermasukan dipanggil 4×) |

### 20.2 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1e** (baru) | Acuan; 7 program salah (titik berhenti salah, tanpa titik berhenti, masukan salah); cara tanpa rekursi benar tetapi melebihi batas; Ulangi tidak ada di palet MA01; pengaman rekursi; Junior tetap menolak rekursi; kode semu | **20/20** |
| **T2i** (baru) | MA01–MA03 lewat antarmuka; kesalahan titik berhenti bawaan; MA01 terkunci sampai Junior selesai | **5/5** |
| T3d | 26 tahap × 3 tingkat × 4 layar HP | **312/312** |
| Regresi | semua suite lain | semua lulus |

**Total v11: 706 kasus lulus dari 706.**

### 20.3 Temuan
- Batas tinggi menara (6) membuat menara 7 balok MA01 mustahil. Batasnya dinaikkan ke 8; ditemukan oleh T1e.
- **Celah desain yang hampir lolos:** MA01 di tingkat Sedang dan Sulit semula memuat Ulangi. Ulangi 2 [Ulangi 3 [Susun]] + Susun menyelesaikannya dalam 6 kartu tanpa rekursi. Ulangi dihapus dari palet MA01, dan uji M0 menjaganya.
- Papan aturan MA02 menimpa Bit; dipindahkan.

### 20.4 Keterbatasan dan alasan berhenti di MA03
- **Bukti "rekursi diperlukan" lebih lemah dari Junior.** T1e menunjukkan cara tanpa rekursi yang *diketahui* melebihi batas. Uji ini tidak mencari semua program secara menyeluruh, karena ruang program dengan Mesin dan wadah bersarang terlalu besar untuk BFS yang dipakai di Junior.
- **Komposisi fungsi (Mesin(Mesin(2))) dari spesifikasi MA02 tidak dibuat.**
- **Middle B (OOP) butuh bahasa kartu baru**: cetakan bernama, objek dengan atribut, method, pewarisan, dan rak berisi objek. Mesin saat ini hanya satu, tanpa nama. Membangunnya di berkas prototipe tanpa rancangan kartu dulu berisiko menghasilkan 10 tahap yang harus dibongkar. Langkah berikutnya yang saya sarankan: rancangan kartu OOP (satu dokumen pendek) sebelum MB01.
- MA04–MA10 (cari linear dan biner, tumpukan, antrean, pohon) bisa dibangun dengan mesin sekarang dan menjadi pekerjaan berikutnya.


## 21. Prototipe v12 — Placement Test 1 "Ujian Si Teka" + tes ulang (17 November 2026)

Dibangun sesuai dokumen *Rancangan Placement Test dan Tes Ulang*.

### 21.1 Yang dibangun
- **Bank soal**: 7 konsep × 3 varian = 21 butir (urutan dan arah, Tekan tombol bersyarat, Isi kotak, Ubah kotak, bentuk kotak, isi kotak berurutan, Jika gabungan). Setiap butir punya pilihan "Aku belum tahu" (dihitung salah).
- **Pintu masuk**: tombol di menu (dengan status) dan tawaran di layar hasil setelah menang B01. "Nanti saja" tidak menghabiskan kesempatan.
- **Penilaian**: 7/7 → Junior Programmer dan J01 terbuka; tahap Beginner tetap bisa dimainkan; MA01 tetap butuh Junior selesai. Di bawah 7 → Beginner Programmer, plus paling banyak 2 konsep yang perlu dilatih. Layar hasil tidak menampilkan kunci jawaban.
- **Tes ulang**: paling banyak 3 percobaan. Percobaan berikutnya terbuka setelah 3 tahap Beginner **baru** (mengulang tahap lama tidak dihitung). Setiap percobaan memakai varian berbeda untuk setiap konsep (permutasi dari benih sesi).
- **Aturan hasil**: percobaan **terbaik** yang berlaku (usulan di dokumen rancangan; menunggu keputusan pemilik).
- **Data** `kn_tes_v1`: ikut terhapus dengan "Hapus progres" dan ikut ekspor catatan. Bila penyimpanan diblokir, ujian tetap berjalan.
- **Aksesibilitas**: pilihan berperan radio (tinggi ≥ 48 px), tombol panah memindah pilihan, status soal dibacakan (aria-live).

### 21.2 Uji T2j (baru) — 35/35
| Kelompok | Isi |
|---|---|
| K1A–K7C (21) | Kunci tiap butir dicocokkan dengan **penafsir game**, bukan dengan kunci tulisan tangan. Konsep 1: simulasi jalur semua pilihan, hanya kunci yang sampai bintang. Konsep 5: hanya kunci yang diterima/ditolak bentuk kotak. |
| U1–U8 | Tawaran setelah B01; 6/7 → Beginner, J01 terkunci; "Aku belum tahu" = salah; syarat 3 tahap baru; lulus di tes ulang membuka J01, MA01 tetap terkunci; status bertahan setelah muat ulang; hapus progres; tanpa galat konsol |
| U9–U13 | 3 percobaan → varian berbeda per konsep, percobaan ke-4 ditolak; benih sama → urutan sama; papan ketik; HP 360×740 dan 667×375; penyimpanan diblokir |

Regresi penuh semua suite lain: lulus. **Total v12: 741 kasus lulus dari 741.**

### 21.3 Temuan
- Kalimat konsep lemah "Urutan dan arah dan Kartu Jika" diperbaiki menjadi "…, serta …".

### 21.4 Keterbatasan
- Kunci diperiksa penafsir, tetapi **validitas soal untuk anak belum diuji**. Apakah 7/7 benar memisahkan anak yang siap Junior adalah klaim yang hanya bisa dibuktikan playtest.
- Bila 7/7 terlalu ketat (satu salah klik = gagal), anak yang siap bisa tertahan. Datanya ada di catatan ekspor (jenis "ujian-si-teka").
- Belum diuji di HP asli dan pembaca layar sungguhan.


## 22. Prototipe v13 — Middle A lengkap (MA04–MA10) + Middle B misi 1 (MB01–MB03) (17 November 2026)

Permintaan pemilik: lanjutkan Middle A dan Middle B; rinci model Senior. Keputusan pemilik: Senior dirinci per tahap; Middle B dimulai dari rancangan kartu OOP. Dokumen terkait: *Rancangan Bahasa Kartu OOP (Middle B)* (https://claude.ai/artifact/TMt2hryPD1gCtYieJakCx7) dan bagian baru "Spesifikasi tahap Senior (rinci)" di *Model Permainan Senior dan Expert*.

### 22.1 Middle A MA04–MA10
| Tahap | Teka-teki | Solusi acuan | Batas | Cara pintas yang gagal (diuji) |
|---|---|---|---|---|
| MA04 Cari Satu per Satu (K) | Ambil satu buku dari rak 5–6 buku; berhenti setelah ketemu | Untuk setiap [Jika isi = dicari → Ambil lalu berhenti] | 2 | Ambil tanpa berhenti (terus membuka buku); nomor rak tetap |
| MA05 Buka Tengah (K) | Rak terurut 7 buku, maks. 3 buka | Selama belum ketemu [Buka tengah; Jika = → Ambil berhenti; Jika < → buang kiri selain itu kanan] | 4 | Cari satu per satu (melebihi 3 buka); arah buang terbalik; tanpa memeriksa = |
| MA06 Terurut atau Acak? (L) | Rak kadang terurut (maks. 3 buka), kadang acak (maks. 7) | Mesin [satu per satu]; Jika rak acak → Jalankan Mesin; Selama belum ketemu [buka tengah …] | 8 | Buka tengah untuk semua rak (buku ikut terbuang di rak acak); satu per satu untuk semua |
| MA07 Tumpukan Surat (K) | Bacakan surat dari yang paling baru; 3–5 surat | Untuk setiap [Taruh di atas tumpukan]; Selama tumpukan berisi [Ambil dari atas] | 4 | Langsung ambil lagi; Ulangi 3 kali |
| MA08 Loket Antrean (K) | Layani warga saat lonceng; yang datang dulu dilayani dulu | Untuk setiap [Masuk antrean; Jika lonceng → Layani depan]; Selama antrean berisi [Layani depan] | 5 | Pakai tumpukan; tidak melayani saat lonceng |
| MA09 Pohon Arsip (K) | Kunjungi map: diri, cabang kiri, cabang kanan (4 bentuk pohon) | Mesin [Kunjungi; Jika anak kiri → Mesin kiri; Jika anak kanan → Mesin kanan]; Jalankan di akar | 5 | Inorder; kanan dulu; tanpa memeriksa anak |
| MA10 Pohon Terurut (P) | Cari map di pohon terurut, maks. sebanyak tingkat pohon | Mesin [Kunjungi; Jika = → Ambil berhenti; Jika < → Mesin kanan selain itu kiri]; Jalankan di akar | 5 | Kunjungi semua map (melebihi batas buka); arah terbalik |

Mekanik baru: kartu Buka tengah, Taruh di atas tumpukan, Ambil dari atas tumpukan, Masuk ke belakang antrean, Layani yang paling depan, Kunjungi map ini; tindakan Jika "Ambil lalu berhenti mencari" (keluar dari perulangan terdalam), "Buang separuh kiri/kanan", "Jalankan Mesin di anak kiri/kanan"; sensor "isi dibuka … yang dicari", "rak ini acak?", "lonceng berbunyi?", "punya anak kiri/kanan?"; syarat Selama "belum ketemu", "tumpukan/antrean masih berisi". Pohon digambar sebagai panel SVG di atas dunia, karena pohon 3D di sudut kamera isometrik tidak terbaca.

### 22.2 Middle B MB01–MB03
| Tahap | Teka-teki | Solusi acuan | Batas | Cara pintas yang gagal (diuji) |
|---|---|---|---|---|
| MB01 Tiga Kucing (K) | Cetakan Kucing jadi (oranye); pesanan Belang oranye, Mochi putih, Kopi hitam | 3 × Buat objek; Ubah Mochi.warna; Ubah Kopi.warna | 5 | Ubah sebelum objek dibuat; lupa mengubah satu; nama objek ganda |
| MB02 Kucing Bersuara (K) | Tulis cetakan: atribut warna, method mengeong; Belang mengeong | Cetakan Kucing [Atribut warna oranye; Method mengeong [Bersuara meong]]; Buat objek Belang; Suruh Belang mengeong | 6 | Bit bersuara sendiri; tanpa atribut; warna bawaan; suruh sebelum dibuat; Bersuara langsung di cetakan; Method di luar cetakan; tanpa cetakan |
| MB03 Paduan Suara (L) | Satu kucing per nama di rak (3–5), masing-masing mengeong sekali | Cetakan [Method [Bersuara]]; Untuk setiap [Buat objek isi rak sekarang; Suruh isi rak sekarang] | 6 | Objek tetap untuk 3 nama; mengeong dua kali; isi rak sekarang di luar Untuk setiap |

Kartu baru: Buat Cetakan (wadah), Atribut, Method (wadah), Buat objek, Ubah atribut, Suruh, Bersuara. Penafsir membaca cetakan dari papan sebelum jalan; Suruh mendorong objek ke tumpukan "diri"; setiap objek punya salinan atribut sendiri (uji C1).

### 22.3 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1f** (baru) | MA04–MA10: acuan di semua keadaan; 16 cara pintas gagal dengan pesan; kode semu; urutan menu | **27/27** |
| **T2k** (baru) | MA04–MA10 lewat antarmuka; 3 pesan cara salah; panel pohon; kunci MA04 | **13/13** |
| **T1g** (baru) | MB01–MB03: acuan; 13 cara pintas; salinan atribut; kode semu kelas | **20/20** |
| **T2l** (baru) | MB01–MB03 lewat antarmuka; label objek; picker 3 grup di HP 360 px; kunci MB01 | **6/6** |
| T3d | 36 tahap × 3 tingkat × 4 layar HP | **432/432** |
| Regresi | semua suite lain | semua lulus |

**Total v13: 927 kasus lulus dari 927.**

### 22.4 Temuan
- **"Berhenti mencari" bocor satu putaran.** Tanda berhenti baru diperiksa di awal kartu berikutnya, jadi Untuk setiap sempat membuka satu buku lagi. Ditemukan T1f (MA04); diperbaiki dengan memeriksa tanda di akhir blok.
- **Label kunci terpotong:** "Selesaikan MA0 Tangga Turun" (kode dipotong 3 huruf, asumsi kode B01/J01). Diperbaiki; ditemukan T2k.
- **Palet 7 kartu mendorong tombol Jalankan keluar layar** di HP 667×375 dan 360×740 (MA06 Sulit, MA08). Label pendek diperpendek, Ulangi pengecoh dihapus dari MA06/MA08 Sulit, kartu "Ambil dari atas tumpukan" di MA08 hanya tersedia sebagai tindakan Jika. Ditemukan T3d.
- **Pohon 3D tidak terbaca** di kamera isometrik (akar tidak tampak di atas). Diganti panel SVG.
- **Panel SVG tidak tersembunyi** dengan atribut `hidden` (elemen SVG tidak mengenalnya). Diganti `style.display`; uji TV0 menjaganya.

### 22.5 Keterbatasan
- Bukti "harus pakai struktur X" di MA05, MA06, MA10 bergantung pada batas buka yang ditampilkan di dasbor, bukan pada pencarian program menyeluruh. Uji hanya memeriksa cara pintas yang terpikirkan.
- MB01 dan MB02 hanya punya satu keadaan; penilaian lintas-keadaan tidak berlaku di sana.
- Riddle Si Teka antarmisi (MA dan MB) belum dibuat di prototipe.
- Belum ada playtest untuk Middle A maupun Middle B.


## 23. Prototipe v14 — Middle B lengkap (MB04–MB10) (18 November 2026)

Permintaan pemilik: lanjutkan tingkat Middle. Rekomendasi sebelumnya (playtest sebelum MB04) tidak diikuti; MB04–MB10 dibangun sekarang, dengan risiko yang dicatat di 23.5.

### 23.1 Mesin OOP lanjutan
- **Atribut terkunci 🔒**: hanya bisa diubah oleh method yang sedang dijalankan untuk objek itu sendiri; dari luar ditolak.
- **Method dengan masukan**; kartu Ubah atribut mendapat cara *menjadi / tambah / kurang* dan nilai *masukan*.
- **Jika berbentuk wadah** (kartu Jika baru untuk Middle B): membandingkan atribut diri dengan masukan atau angka; isinya kartu lengkap.
- **Mewarisi**: pilihan di kartu Buat Cetakan. Atribut dan method dicari dari cetakan objek ke induknya; pewarisan melingkar dan induk yang belum dibuat ditolak.
- **Atribut berisi objek** (komposisi): nilai "objek Kamar baru" membuat objek bagian saat objek induknya dibuat; Suruh bisa ke `diri.kamar`.
- **Skrip tokoh**: mulai MB04, objek dibuat dan disuruh oleh tokoh (Nenek, Penjaga, pengunjung iseng) sebelum atau sesudah program anak, seperti uji unit. Perintah "coba" boleh ditolak (Kambing memang tidak bisa terbang).

### 23.2 Tahap MB04–MB10
| Tahap | Teka-teki | Batas | Cara pintas yang gagal (diuji) |
|---|---|---|---|
| MB04 Celengan (K) | Setor/ambil lewat method; saldo terkunci; ambil menolak bila saldo kurang | 7 | Tidak dikunci; tanpa penjaga; penjaga ">"; setor-ambil tertukar |
| MB05 Burung Juga Hewan (K) | Burung mewarisi makan dari Hewan; Kambing tidak bisa terbang | 7 | Tidak mewarisi; makan disalin (10 kartu); terbang di Hewan |
| MB06 Kandang Burung (L) | Terbang hanya bila energi ≥ 2; energi terkunci | 9 | Tidak dikunci; tanpa penjaga; penjaga ≥ 1 |
| MB07 Pinguin (K) | Override terbang → plung; pinguin tetap punya 2 sayap; kambing tidak | 11 | Burung diubah jadi plung; Pinguin tidak mewarisi; mewarisi Hewan langsung; sayap di Hewan |
| MB08 Paduan Hewan (K) | Satu Suruh untuk kucing dan bebek di rak acak | 8 | Bit bersuara; hanya Kucing; Bebek mengeong |
| MB09 Rumah dan Kamar (K) | Rumah menyuruh kamarnya mematikan lampu; dua rumah | 8 | Lampu milik Rumah; lampu awal mati; tidur tanpa menyuruh kamar |
| MB10 Pertunjukan Malam (P) | Hewan.tampil menyuruh diri bernyanyi bila energi ada; Kucing/Bebek mewarisi | 14 | Tidak dikunci; tanpa penjaga; tampil ditulis di tiap cetakan (16 kartu) |

MB10 menyimpang dari rancangan ("Pabrik Musuh", komposisi kemampuan): butuh perulangan atas bagian objek dan palet lebih dari 7 kartu. Komposisi sudah diajarkan di MB09.

### 23.3 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1h** (baru) | MB04–MB10: acuan di semua keadaan; 22 cara pintas; kode semu (terkunci, +=, kelas anak, `diri.kamar.matikan()`) | **35/35** |
| **T2m** (baru) | MB04, MB07, MB09 lewat picker (terkunci, cara ubah, masukan, mewarisi, objek baru); pesan cara pintas; picker di HP 360 px; kunci MB04 | **6/6** |
| T3d | 43 tahap × 3 tingkat × 4 layar HP | **516/516** |
| Regresi | semua suite lain | semua lulus setelah satu perbaikan uji (23.4) |

**Total v14: 1.052 kasus lulus dari 1.052.**

### 23.4 Temuan
- **Dua celah desain ditemukan uji cara pintas** (bukan bug kode): di MB05, menaruh method terbang di Hewan lolos karena tidak ada yang menyuruh Kambing terbang; di MB07, Pinguin yang mewarisi Hewan langsung lolos karena tidak ada yang membedakan burung. Ditutup dengan perintah "coba" ke Kambing dan atribut sayap (Kambing tidak boleh bersayap).
- **Palet 7 kartu MB10** melewati tinggi layar 667×375 sebanyak 7 px. Label pendek "Ubah atribut" menjadi "Ubah"; lulus di 4 ukuran HP.
- **Regresi T2l MB01**: grup picker "Menjadi" pada kartu Ubah atribut berganti nama menjadi "Nilai" (karena kini ada cara tambah/kurang), sehingga uji lama tidak menemukan grupnya. Uji disesuaikan; perilaku game benar.
- **Label objek bagian** ("RumahA.kamar") panjang dan saling tumpang di HP; diganti "kamar RumahA", jarak objek MB09 dilebarkan.

### 23.5 Keterbatasan
- Beban kartu MB06–MB10 (9–14 kartu, wadah 3 tingkat) belum pernah dicoba anak. Ini risiko terbesar Middle B.
- Bentuk 3D semua objek sama (kucing); hanya warna yang membedakan cetakan. Rumah dan celengan tidak punya model sendiri.
- Gerbang Si Teka antarmisi Middle A dan Middle B belum dibuat.

## 24. Prototipe v15 — Gerbang Si Teka antarmisi Middle (18 November 2026)

Permintaan pemilik: lanjutkan Gerbang Si Teka untuk Middle A dan Middle B. Mekanik gerbang ternyata **belum ada di prototipe sama sekali**, termasuk untuk Beginner dan Junior (hanya ada di GDD §3.8). Dibangun satu komponen umum; empat gerbang dipasang sesuai Kurikulum v0.3.

### 24.1 Aturan yang diimplementasikan (GDD §3.8)
- Gerbang muncul setelah tahap terakhir misi: **MA03, MA06, MB03, MB06**. Tombol "🦉 Gerbang Si Teka" di layar hasil dan baris di menu tahap. Gerbang terkunci sampai tahapnya selesai, tetapi **tidak pernah mengunci tahap lain**.
- Salah 2× → petunjuk Si Teka. Salah 3× → gerbang terbuka, jawaban dan penjelasan tampil, **tanpa bonus**. Boleh kembali dari menu untuk bonus; soal yang ditampilkan ganti. Percobaan ulang yang gagal tidak menurunkan bonus.
- Bentuk jawaban mengikuti tingkat: Mudah = 4 pilihan beda jauh; Sedang = 4 pilihan mirip (kesalahpahaman umum); Sulit = susun ubin.
- 3 varian per gerbang. **Jawaban dihitung program** (rekursi, hitung pembukaan terburuk, pemodel objek kecil), bukan diketik.
- Tercatat di progres (`gerbang`: status, bonus, salah, buka) dan di catatan uji (jenis "gerbang"). Dapat dibuka lewat tautan `?gerbang=g_mb06&varian=1`.

### 24.2 Isi
| Gerbang | Konsep | Varian |
|---|---|---|
| Cermin (setelah MA03) | rekursi bernilai | hitung(4)=10, hitung(5)=15, 2×hitung(n−1) → 16 |
| Perpustakaan (MA06) | cari biner | rak 1.000 / 5.000 / 100.000 buku → 10 / 13 / 17 kali buka |
| Cetakan (MB03) | objek menyimpan atribut sendiri | warna kucing2 setelah kucing1 diubah; energi kucing2; kucing dibuat sesudah perubahan |
| Silsilah (MB06) | pewarisan | method burung1; kambing.terbang(); energi burung setelah makan() dua kali |

### 24.3 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1i** (baru) | 12 jawaban dicek ke perhitungan independen (pencarian biner sungguhan, kelas JavaScript asli); pengecoh; ubin; anti-blokir A–I | **41/41** |
| **T2n** (baru) | menu, layar hasil, ketuk, klaviatur, Sulit, simpan dan muat ulang, tautan, 4 layar × 2 bentuk × 12 soal, mode gelap | **18/18** |
| T2b | menu kini berisi baris gerbang; uji menghitung hanya tahap | 4/4 (setelah penyesuaian uji) |
| Regresi | semua suite lain | lulus |

**Total v15: 1.111 kasus lulus dari 1.111** (dengan aturan bonus ≤ 2 saat itu).

### 24.4 Temuan
- **Jawaban satu digit bisa ditebak di Sulit** (ubin 5–6 buah, 3 kesempatan). Uji G4c menangkapnya di gerbang MA06 (jawaban 4 dan 7). Diganti rak 1.000 / 5.000 / 100.000 buku sehingga jawaban dua digit.
- **Eliminasi pilihan membuat tebakan acak berhasil 75%** pada 4 pilihan bila bonus diberikan selama salah ≤ 2 (aturan GDD). **Diubah di v16 ke `GATE_BONUS_MAKS_SALAH=1`**: bonus hanya bila tebakan pertama atau kedua benar, sehingga keberhasilan tebakan acak turun menjadi 50%. Data "jumlah salah" tetap tercatat untuk menilainya. Uji gerbang T1i (42 kasus) disesuaikan dan lulus.
- Fokus otomatis pada opsi menggulirkan lembar di HP mendatar sehingga soal tidak terlihat. Diperbaiki (tanpa gulir otomatis, opsi 2 kolom di layar pendek).

### 24.5 Keterbatasan
- **Bonus +10% hanya dicatat dan ditandai 🌟.** Belum ada total skor per wilayah, jadi tidak ada efek angka.
- Gerbang Beginner dan Junior (spesifikasi ada di Kurikulum) belum dibuat; komponennya umum, cukup menambah data.
- Misi ketiga Middle (MA07–MA10, MB07–MB10) tidak punya gerbang di Kurikulum; tidak ditambah.
- Soal gerbang belum dicoba anak; 12 soal ini kecil untuk pemain yang mengulang.

---

## 25. Prototipe v16 — Senior lengkap (SE01–SE10) dan aturan bonus gerbang ≤ 1 (19 November 2026)

Permintaan pemilik: lanjutkan sesuai rekomendasi perhitungan bonus, dan kerjakan tingkat Senior. Dua hal dikerjakan: (1) konstanta bonus gerbang diubah ke salah ≤ 1; (2) sepuluh tahap Senior dibangun di atas rancangan "Papan Sistem" (dokumen model Senior/Expert).

### 25.1 Apa yang dibangun
- **Satu panel dasbor baru** (`#sysView`) di dalam dunia: menampilkan keadaan sistem tiap tahap (log loket, peta 6×2, cabang, riwayat, peti, jalur rilis). Panel ikut berubah setelah setiap kartu dijalankan, dan satu baris "▶" menyebut langkah terakhir.
- **17 kartu "sys"** (warna teal): Kirim permintaan, Jika …, Simpan versi, Terapkan perubahan, Mundur satu versi, Buang yang tertunda, Terapkan ulang yang tertunda, Buat cabang, Pindah cabang, Gabungkan cabang, Pilih ubahan konflik, Masukkan bahan, Buat peti, Kirim peti, Pasang gerbang uji, Rollback. Semua memakai satu tabel `SYSF` (bidang picker, teks kartu, kode semu), jadi picker, teks, dan kode semu bekerja otomatis.
- **Mesin yang dipakai ulang tanpa diubah:** Papan Program, Ulangi, Selama, penilaian lintas-keadaan, tautan putar ulang, bintang, petunjuk. Ditambah tiga sensor untuk Selama (peta masih rusak, masih ada konflik, masih ada perubahan tertunda) dan dukungan **papan terisi awal** (SE03).
- **Tiap tahap adalah mesin keadaan murni** yang menjawab lima fungsi: `init`, `apply`, `sense`, `draw`, `check`. Hasil dinilai di semua keadaan, deterministik.
- Pilihan awal di picker sengaja **salah** (tidak ada isi otomatis yang benar).

### 25.2 Tahap
| Tahap | Konsep | Kartu | Keadaan | Cara pintas yang harus gagal |
|---|---|---|---|---|
| SE01 Loket Pesanan | permintaan API: alamat, aksi, isi | Kirim | 1 | alamat/aksi/jumlah salah, kurang barang |
| SE02 Jawaban Loket | kode jawaban menentukan tindakan | Kirim, Jika | 3 (normal, stok habis, alamat pindah) | tanpa Jika, hanya satu Jika, selalu kirim ulang (pesanan ganda) |
| SE03 Pesanan Teman | memperbaiki program orang lain | Kirim (papan terisi, batas = 3) | 3 (letak kesalahan) | program teman apa adanya |
| SE04 Mesin Waktu | titik simpan, kembali ke versi | Ulangi, Simpan, Terapkan, Jika | 3 (bug di perubahan 5, 2, 4) | tanpa Jika, kembali ke versi pertama, simpan sesudah terapkan, ulangi 5 atau 7 kali |
| SE05 Dua Cabang | cabang melindungi peta utama | Buat cabang, Pindah, Terapkan | 3 (Rani, Dodi, atau keduanya membawa bug) | semua di utama, lupa pindah |
| SE06 Gabung Peta | konflik gabung | Gabung, Pilih, Selama | 3 (1, 2, 3 petak konflik) | selalu pilih satu sisi, tanpa memilih |
| SE07 Bug Tersembunyi | mundur, buang, terapkan ulang | Selama, Mundur, Buang, Terapkan ulang | 4 (bug di perubahan 2–5) | mundur saja, tidak membuang bug |
| SE08 Peti Kemas | bahan di dalam peti, bukan di pulau | Masukkan, Buat peti, Kirim peti | 3 (isi pulau berubah) | bahan kurang, semua bahan (peti maks. 4), kirim sebelum peti |
| SE09 Jalur Kapal | gerbang uji dan rollback | Gerbang, Rollback | 3 (urutan rilis cacat) | tanpa gerbang, gerbang di uji saja, tanpa rollback, rollback lambat, dua gerbang |
| SE10 Kapal Perdana | gabungan: loket, versi, peti, pulau, rollback | 6 kartu | 4 (stok habis dan uji gagal bervariasi) | tanpa cadangan, tanpa pulihkan, tanpa simpan, selalu kembali |

### 25.3 Penyimpangan dari rancangan (jujur)
- **Tidak ada simulasi berdetak.** Rancangan menyebut detak, grafik jejak, dan kecepatan 1×/4×. Yang dibangun: kartu dijalankan satu per satu seperti tingkat lain, dengan dasbor keadaan. Hanya SE09 memakai simulasi per rilis, dihitung ulang tiap kartu. Syarat atas jejak ("antrean tidak pernah lebih dari 8") baru relevan untuk Expert dan belum ada.
- **Dunia 3D tidak punya stasiun sebagai bangunan.** Dermaga lama tetap jadi latar; dasbor menutupi tengahnya.
- **SE05–SE07 memakai kartu berbasis peran**, bukan NPC yang mengubah peta bersamaan (SE05–SE06) dan bukan sekadar "temukan versi" (SE07 memakai Mundur/Buang/Terapkan ulang). Kartu "Urutkan tahap" untuk SE09 tidak dibuat; jalurnya sudah berurutan.
- **Varian pada beberapa tahap tidak memaksa program berbeda.** Sebuah program tanpa percabangan tidak mungkin lulus di keadaan dengan target berbeda, jadi SE01, SE03, SE05, SE06, SE08, SE09 memvariasikan hal yang tidak mengubah jawaban benar (letak bug, jumlah konflik, isi pulau). Varian itu menutup cara pintas, bukan membuat soal yang berbeda. Hanya SE02, SE04, SE07, SE10 benar-benar menuntut program yang membaca keadaan.
- **Uji kelayakan "konsep diperlukan" (pencarian menyeluruh atas semua konfigurasi) belum dibuat.** Penggantinya: 5–6 cara pintas tangan per tahap (T1j). Ini bukan bukti bahwa tidak ada cara pintas lain.
- SE09 hanya punya dua kartu dan satu jawaban (gerbang di staging + rollback segera). Konsepnya benar, tetapi kedalamannya paling tipis di antara kesepuluh tahap.

### 25.4 Uji
| Suite | Isi | Hasil |
|---|---|---|
| **T1j** (baru) | acuan lulus di semua keadaan; 46 cara salah gagal dengan pesan bermakna; perbaikan SE03; kode semu; urutan menu | **63/63** |
| **T2o** (baru) | menu dan kunci; SE02 dan SE03 dimainkan dengan ketukan dan picker; SE09; layar hasil dan kode semu; 4 layar × 10 tahap; mode gelap | **11/11** |
| T3d | diperluas ke 10 tahap Senior × 4 layar | 4 × 159 lulus |
| T2b, T1h | daftar menu diperbarui untuk SE01–SE10 | lulus (setelah penyesuaian uji) |
| T1i | disesuaikan dengan bonus ≤ 1 | 42/42 |
| Regresi | semua suite lain | lulus |

**Total v16: 1.306 kasus lulus dari 1.306.**

### 25.5 Temuan saat membangun
- Pesan gagal SE04 untuk program tanpa Jika awalnya menyarankan "simpan sebelum menerapkan", padahal penyebabnya bukan urutan simpan. Diperbaiki: saran itu hanya muncul bila memang ada pengembalian ke titik simpan yang sudah rusak.
- Toast langkah menutupi dasbor di HP potret. Catatan langkah dipindahkan ke baris di dalam dasbor.
- Kartu di papan yang dimasukkan lewat kode tanpa `id` tidak bisa diketuk untuk diubah. Hanya terjadi di uji; kartu dari antarmuka selalu punya `id`.
- Palet SE10 memakai 6 kartu; label panjang ("Kirim peti") membuat palet 3 baris di layar 360 px dan mendorong tombol Jalankan keluar layar. Label singkat diganti ("Peti", "Antar").

### 25.6 Keterbatasan
- **Belum dimainkan siapa pun.** Kesulitan SE04, SE06, SE07, SE10 (paling banyak kartu: 12 dari 13) tidak diketahui. Dugaan: SE10 terlalu panjang untuk SMA kelas 10 tanpa pemanasan.
- Bonus gerbang masih hanya dicatat; belum ada total skor per wilayah.
- Gerbang Si Teka untuk Senior tidak ada di Kurikulum dan tidak dibuat.
- Placement Test untuk melompat ke Senior belum ada.


## 26. Prototipe v17 — Review ulang Senior dan perbaikannya (19 November 2026)

### 26.1 Yang diperiksa
Review ulang SE01–SE10 beserta mesin dan dasbor. Tidak ada celah konsep yang ditemukan; temuan menyangkut keterbacaan, aksesibilitas, dan satu koreksi terhadap klaim saya sendiri.

### 26.2 Koreksi terhadap §25.3 dan review sebelumnya
§25.3 dan review pertama menyebut varian di SE05 dan SE06 "tidak memaksa program berbeda". **Itu keliru untuk keduanya.** Dihitung per varian (program ≤ batas+2 kartu, jumlah program yang lulus di satu varian dibanding yang lulus di semua varian):

| Tahap | Lulus per varian | Lulus di semua | Arti |
|---|---|---|---|
| SE02 | 15.250 · 2.029 · 2.029 | 68 | varian memaksa |
| SE04 | 537 · 806 · 538 | 523 | memaksa (selisih kecil) |
| SE05 | 921 · 921 · 432 | 432 | memaksa |
| SE06 | 290 · 128 · 72 | 58 | memaksa (jumlah konflik berbeda, menolak jumlah "Pilih" tetap) |
| SE07 | 14 · 582 · 13 · 39 | 12 | memaksa |
| SE08 | 12 · 12 · 76 | 12 | varian 1 dan 2 **redundan** (tiap varian sendirian sudah menuntut jawaban yang sama) |
| SE09 | 2 · 2 · 2 | 2 | **redundan** |
SE01 hanya punya satu varian; SE03 adalah tahap perbaikan (varian menentukan letak kesalahan awal). Sisa klaim yang benar: SE08 dan SE09.

### 26.3 SE10 terverifikasi eksak
Pencarian ruang keadaan (252.207 keadaan, kedalaman 13, tanpa terpotong): program lulus terpendek **12 kartu**, 24 keadaan akhir yang lulus. Tanpa "Jika stok habis", tanpa "Jika uji gagal → kembali", tanpa Simpan versi, tanpa Buat peti, atau tanpa memasukkan bahan: **tidak ada** program yang lulus. Dicatat di suite **T1k**.
SE09: dari 155 program ≤ 3 kartu hanya 2 yang lulus (1,3%), kira-kira 60 kali lebih mudah ditebak daripada tahap Senior lain. Ruang ≤ 5 kartu (3.905 program) tetap hanya memuat 2 jawaban (gerbang staging dan rollback segera, dua urutan).

### 26.4 Perubahan
- **Intro Senior dipersingkat** (SE01, SE02, SE03, SE04, SE07, SE08, SE10). Intro dipecah menjadi halaman "Lanjut ▸" per kalimat, jadi masalahnya bukan luapan layar tetapi halaman terlalu panjang (SE10: 142 karakter) dan terlalu banyak (SE02, SE03: 5 halaman). Sekarang maksimum 4 halaman dan ≤ 100 karakter per halaman.
- **Dasbor mengikuti mode gelap** (sebelumnya kotak putih tetap).
- **Pembaca layar:** catatan langkah diumumkan lewat daerah `role="status"` `aria-live="polite"` terpisah. Seluruh dasbor sengaja **tidak** dijadikan aria-live, supaya tabel tidak dibacakan ulang tiap langkah.
- Teks deskripsi menu sekarang menyebut Senior (sisa v15).
- **Kontras:** uji baru memeriksa semua teks dasbor di 4 tahap, dua tema. Menemukan sel "–" di tabel SE09 berkontras 2,42:1 pada mode terang; diperbaiki ke 4,72:1.
- Durasi jalan diukur: SE10 (12 kartu, 4 keadaan) ±5,4 detik; SE04 (loop 6×, 3 keadaan) ±8,5 detik.

### 26.5 Uji
| Suite | Hasil |
|---|---|
| **T1k** (baru): ablasi SE10, SE09 lengkap, panjang intro | **7/7** |
| T2o: ditulis ulang DK, tambah LT dan LV | **13/13** |
| Suite lain | tidak berubah |

**Total v17: 1.315 kasus lulus dari 1.315.**

### 26.6 Keputusan yang saya tunda, dan alasannya
- **SE09 tidak dirancang ulang.** Penguatan nyata butuh jenis kartu baru ("pantau") dan syarat anggaran; itu biaya besar untuk tahap yang belum pernah dimainkan. Playtest (Playtest_Kit_Senior.md, baris "SE09 bukan tebakan") menentukan apakah itu perlu.
- **Lencana dan sertifikat Senior tidak dibuat.** Koreksi: tidak ada tingkat lain yang punya lencana kelulusan tingkat atau sertifikat; hanya Ujian Si Teka yang memberi lencana. Jadi ini fitur baru lintas tingkat, bukan kekurangan Senior, dan bergantung pada keputusan penyimpanan nama (UU PDP) yang belum dijawab.

### 26.7 Keterbatasan
- Belum dimainkan siapa pun. Seluruh pernyataan "benar" di bagian ini adalah pernyataan tentang kode, bukan tentang pembelajaran.
- Kontras diuji pada elemen dengan teks langsung; ikon emoji tidak termasuk.


## 27. Prototipe v18 — SE09 dirancang ulang, rancangan Expert (19 November 2026)

Permintaan pemilik: sertifikat memuat **username** (bukan nama asli); placement test memakai percobaan **terbaik**; rancang ulang SE09 lebih dulu; rancang tingkat Expert.

### 27.1 SE09 "Jalur Kapal" v2
Alasan: SE09 lama punya satu jawaban dua kartu (2 dari 155 program ≤ 3 kartu lulus = 1,3%).
- **Tiga lapis:** gerbang (menahan cacat sebelum tayang), pemantau (mendeteksi cacat yang sudah tayang), rollback (menarik rilis). **Waktu tayang = waktu deteksi + waktu rollback**, batas 2 detak.
- **Kartu baru "Pantau"** (kartu sys ke-18). Rollback sekarang ditolak bila belum ada pemantau.
- **Jenis cacat:** uji, staging, *jelas* (aplikasi mogok setelah tayang), *senyap* (hasil salah, tidak mogok). Pemantau "kesehatan aplikasi" hanya melihat yang jelas (0 detak); "keluhan pengguna" melihat keduanya (1 detak); "beban server" tidak melihat apa pun (pengecoh). Gerbang di "build" tidak melihat apa pun (pengecoh). Rollback: 1/2/3/5 detak.
- **Jawaban:** gerbang staging + pemantau keluhan pengguna + rollback segera; pemantau sebelum rollback (3 urutan).
- **Verifikasi:** dari 1.110 program ≤ 3 kartu, 3 lulus (**0,27%**, sebelumnya 1,3%). Seluruh ruang ≤ 5 kartu (111.110 program) hanya memuat 3 jawaban itu. Per varian: 9 · 3 · 3 program lulus, 3 lulus di semua. Varian 1 memaksa; varian 2 dan 3 masing-masing sendirian sudah menuntut jawaban yang sama.
- **Jujur:** peluang tebak membaik ±5 kali, tetapi masih 100 kali lebih longgar daripada tahap Senior lain (0,001–0,03%). Dua pengecoh (build, beban server) adalah penambah ruang tebak, bukan konsep baru.

### 27.2 Rancangan Expert
Dokumen terpisah: *Spesifikasi_Expert.md*. Isi: paradigma aturan + detak, 8 jenis kartu baru, EX01–EX10, risiko, ukuran, sertifikat username. Angka EX04–EX07 dihitung dengan model murni (`tests/expert_model/`): EX04 satu jawaban (2 pekerja + penyangga 24), EX05 skala otomatis lulus untuk T ∈ {0, 2, 4} dan tidak ada pekerja tetap yang lulus, EX06 satu jawaban (3 server + paling kosong), EX07 satu jawaban (ukuran 3 + paling sering dipakai). EX01–EX03 dan EX08–EX10 **belum** diverifikasi. Dua percobaan parameter pertama gagal (EX04 tanpa jawaban; EX05 skala otomatis tidak lebih murah) dan diubah sebelum ditulis.

### 27.3 Uji
| Suite | Hasil |
|---|---|
| T1j: 8 cara salah SE09 baru + 3 pengecoh | **69/69** |
| T1k: A6 untuk ruang SE09 baru | **7/7** |
| T2o, T3d (4 layar), semua suite lain | lulus |

**Total v18: 1.321 kasus lulus dari 1.321.**

### 27.4 Keputusan pemilik yang dicatat
- Sertifikat: **username**, diketik saat mencetak, tidak disimpan di server; teks sertifikat menyebut "penghargaan dalam game". Belum dibangun; bergantung pada sistem skor total yang belum ada.
- Placement test memakai percobaan **terbaik** (sudah demikian di kode).

### 27.5 Keterbatasan
- Belum dimainkan siapa pun.
- Expert hanya rancangan; mesin detak belum ada.

---

## 28. v19–v20 (19–20 November 2026): mesin detak dan Expert EX01–EX10

### 28.1 Yang dibangun
- **v19:** mesin aturan + detak (kartu `aturan`: "Ketika ⟨peristiwa⟩, maka ⟨aksi⟩"), tabel detak bergulir 6 baris, tombol 1×/4×/⏭, gerak berkurang, EX01–EX03.
- **v20:** kartu setelan (Pekerja, Penyangga, Skala otomatis, Server, Cara membagi, Rak, Coba lagi, Server cadangan, Pemutus) dan EX04–EX10. Model murni satu sumber (`tests/expert_model/expert_sim.js`), tertanam identik di halaman (diuji t1n/M1).

### 28.2 Temuan dan keputusan desain (jujur)
1. **Celah rantai satu detak (EX01, EX03).** Aturan berantai runtuh dalam satu detak dan lulus lewat jalan pintas. Perbaikan: efek aksi baru berlaku di detak berikutnya. Hasil: EX01 0 pintas dari 15.275 himpunan.
2. **EX03 punya beberapa urutan sah** (kemas paralel dengan uji, kirim saat uji lulus). Definisi "aturan inti" di uji ablasi dilonggarkan; itu keputusan desain, bukan perbaikan mesin.
3. **EX09:** aturan menang diubah. Keadaan sementara dan berkedip menuntut ≥ 90% sukses lewat server utama; permanen menuntut ≥ 90% total. Tanpa itu cadangan saja menyelesaikan semuanya.
4. **EX10 bukan jalur terpadu.** Model jalur terpadu terlalu longgar (ratusan sampai puluhan ribu jawaban, hampir semua bagian bisa dilepas). Dibangun sebagai lima subsistem dengan satu anggaran 13 dan empat keadaan. Tanpa skala, rak, cadangan, pemutus, coba lagi, atau urutan Coba-sebelum-Cadangan: 0 jawaban. "Paling kosong" tidak wajib (6 dari 12 jawaban memakai bergilir).
5. **Intro:** uji P1 menangkap dua intro yang melanggar batas (EX07 lima halaman, EX10 satu halaman 105 karakter); dipersingkat.
6. **Proses:** regresi latar belakang mati dua kali saat sesi dijeda (proses latar tidak bertahan). Dijalankan ulang penuh untuk v20 sambil sesi aktif. Intro EX07/EX10 diperpendek **setelah** uji tata letak berjalan; hanya t1k yang dijalankan ulang (lulus). Teks lebih pendek tidak dapat menambah luapan, tetapi uji tata letak tidak diulang.

### 28.3 Jumlah jawaban (dicari seluruhnya)
EX01 17/15.275 himpunan · EX02 9/2.804.011 · EX03 140/245.505 · EX04 1/18 · EX05 3/78 · EX06 1/12 · EX07 1/12 · EX08 1/156 · EX09 2/79 · EX10 12/133.293 (ruang kartu; ruang penuh 1.845.087 menghasilkan 12 yang sama).

### 28.4 Uji v20
| Suite | Hasil |
|---|---|
| T1l (EX01–03 + ablasi EX01/EX02/EX03) | 21/21 |
| T1m (EX04–10: acuan, 24 cara salah, ruang setelan) | 36/36 |
| T1n (EX10: 12 jawaban, ablasi, halaman = Node) | 11/11 |
| T2p (UI Expert) | 10/10 |
| T3e (kontras Expert terang/gelap) | 10/10 |
| T1k (intro Senior + Expert, setelah perbaikan) | 7/7 |
| T3d (4 layar, ex01–ex10 termasuk) | 189 × 4 lulus |
| T3 (merge 7 viewport) | 61/61, 8 info |
| Suite lain (t1–t2o, t4, t5) | lulus |

**Total v20 ≈ 2.346 kasus lulus, 0 gagal** (jumlah dihitung dari ringkasan tiap suite, termasuk T3/T3d yang pada §27 dihitung terpisah, jadi tidak setara langsung dengan 1.321 di v18).

### 28.5 Keterbatasan
- **Belum dimainkan siapa pun.** Semua angka membuktikan kode, bukan pedagogi.
- Expert dibangun sebelum playtest Senior (urutan ini atas permintaan pemilik; risikonya: bila Senior No-go, sebagian pekerjaan mungkin dirombak).
- Istilah "detak", "aturan", "penyangga", "rak" belum diuji ke pemain.
- EX10 hampir tanpa interaksi antar-subsistem.
- Belum ada (diperbarui di §29): sertifikat, uji perangkat sentuh nyata.

---

## 29. Prototipe v21: Gerbang Si Teka Expert dan Ujian Senior/Expert (20 November 2026)

### 29.1 Isi
- **Gerbang Detak** (setelah EX03) dan **Gerbang Antrean** (setelah EX06), masing-masing 3 varian. Kunci dihitung oleh model murni `EXS` (`gTick`, `qSim`, `lbSim`), bukan diketik. Bentuk soal sama dengan gerbang lama: mudah dan sedang pilihan ganda, sulit ubin angka.
- **Mesin placement umum** `TDEF={t1,t2,t3}`. Tes 1 tidak berubah perilakunya, data lama tetap terbaca.
- **Ujian Senior (Test 2)**: 10 konsep × 3 varian, lulus 10/10, sesuai rancangan 17 November. Ditawarkan di layar hasil J14 dan di menu setelah semua tahap Junior selesai; membuka SE01. Tes ulang setelah 3 tahap Middle baru.
- **Ujian Expert (Test 3)**: 8 konsep × 3 varian, lulus 8/8, membuka EX01. **Ini usulan saya, bukan bagian rancangan**: rancangan menyatakan Expert butuh semua tahap Senior. Prasyarat: Senior sudah terbuka. Menu saja, tanpa tawaran di layar hasil.
- Aturan bersama: maksimum 3 percobaan, hasil terbaik berlaku, “Aku belum tahu” dihitung salah, kunci tidak ditampilkan, urutan varian diacak per konsep.

### 29.2 Hasil uji (file akhir, regresi penuh)
| Suite | Hasil |
|---|---|
| t1o (butir, kunci dihitung ulang, aturan kunci, data rusak) | 26/26 |
| t2q (antarmuka ujian, tes ulang, 6 varian gerbang, tata letak 54 soal di 360×740 dan 667×375) | 21/21 |
| t1i, t2n (gerbang, diperbarui untuk 6 gerbang) | 48/48, 18/18 |
| t1n (model Expert, sinkron HTML) | 11/11 |
| t2j placement | 35/35 |
| t3d tata letak, 4 viewport | 189/189 × 4 |
| t3_layout (7 viewport) | 61/61 |
| seluruh suite lain | hijau, tanpa gagal |

### 29.3 Temuan selama pengerjaan
1. Uji lama G4c menolak kunci satu digit: pada ubin angka, jawaban satu digit bisa ditebak. G4b menolak kunci palindrom (11, 22) karena urutan terbalik tak bisa ditolak. Soal gerbang dirancang ulang ke kunci dua digit bukan palindrom (10, 12, 13; 12, 28, 31).
2. Uji lama mengasumsikan 4 gerbang; diperbarui jadi 6.
3. Salah satu butir Ujian Expert hanya punya 2 pengecoh berbeda; ditambah satu.
4. Beberapa uji awal mengubah progres lewat `markWin("se01")`; dipindah ke `se05` agar tidak membuka kunci tahap yang diuji.

### 29.4 Keterbatasan
- **Aturan semua benar itu keras.** Rancangan sendiri memperkirakan ~40% salah-gagal per percobaan; belum divalidasi ke pemain.
- **Kesetaraan tiga varian** (isi dan kesulitan) adalah klaim rancangan, belum data. Perlu uji coba ke pemain.
- Soal Ujian Senior/Expert memakai blok teks berlabel, bukan kartu bergambar.
- Ketepatan bank Ujian Expert bergantung pada pembacaan saya atas aturan tahap SE; perlu dicek pemilik.
- Belum ada: sertifikat (butuh sistem skor total), playtest nyata, uji perangkat sentuh sungguhan.

---

## 30. Prototipe v22: Halaman pembuka — pemain, daftar, masuk, cerita (20 November 2026)

### 30.1 Keputusan rancangan
- **Tidak ada akun sungguhan.** Game ini satu berkas tanpa server, jadi “login” berarti memilih profil di perangkat itu. Profil disimpan di `localStorage` (`kn_profil_v1`), progres dipisah dengan akhiran nama pemain pada kunci (`kn_progres_v1@dina_cerdas`, juga `kn_tes_v1`, `kn_proto_logs_v1`). Tamu memakai kunci lama tanpa akhiran, sehingga progres penguji v21 tidak hilang.
- **Tanpa data pribadi.** Hanya nama samaran (3–16 huruf/angka/spasi/_, peringatan “bukan nama aslimu”), tokoh (8 hewan), dan PIN opsional. Tidak ada email, nama asli, atau umur. Nama ini yang kelak dicetak di sertifikat (keputusan 11 November).
- **Memilih nama dari daftar, bukan mengetik**, supaya murid SD tidak perlu mengetik di tiap sesi. PIN default kosong.
- **PIN hanya penghalang iseng.** Hash SHA-256 bergaram bila `crypto.subtle` ada, hash cadangan sederhana bila tidak (konteks tidak aman). Siapa pun yang membuka alat pengembang bisa melihat atau menghapus data. **PIN tidak bisa dipulihkan**: “Lupa PIN?” hanya menawarkan menghapus pemain beserta progresnya.
- **Sesi** di `sessionStorage` (hilang saat tab ditutup, cocok untuk komputer sekolah bersama); kotak “Tetap masuk di perangkat ini” menyimpan `kn_aktif` di `localStorage`. “Ganti pemain” ada di menu tahap.
- **Cerita 5 adegan** (senja, lampu padam, Si Teka, Nek Urut, Bit), tanpa pemajuan otomatis (WCAG 2.2.1), selalu ada “Lewati”, gambar SVG dengan teks alternatif, animasi mati bila `prefers-reduced-motion`. Tampil otomatis sekali: setelah daftar dan saat tamu pertama kali. Dapat diputar ulang dari “Lihat cerita”.
- Pindah progres tamu ke pemain baru (kotak centang hanya muncul bila ada progres tamu).
- Tautan `?tamu`, `?tahap=…`, `?gerbang=…` melewati halaman pembuka (tautan putar-ulang laporan tetap bekerja). Harness uji memakai sesi tamu.
- Selama halaman pembuka tampil, game di belakangnya `inert` dan menulis ke ruang tunda yang dibersihkan saat masuk.

### 30.2 Hasil uji
`t1p_pembuka.js`: **51/51**. Mencakup keadaan awal dan penguncian game, 5 aturan validasi nama dan PIN, normalisasi spasi dan huruf besar, duplikat, alur daftar → cerita → game, pemisahan progres dua pemain, “Hapus progres” hanya pada pemain aktif, PIN benar/salah/kosong, hash cadangan tanpa `crypto.subtle`, Lupa PIN dan hapus pemain, tetap masuk lintas tab, ganti pemain, tamu (cerita sekali), pindah progres, tautan khusus, penyimpanan diblokir, profil rusak (HTML, duplikat, JSON tidak valid, batas 30 pemain), kurangi gerak, papan ketik, dan tata letak di 360×740, 667×375, 768×1024, 1280×720 (tanpa geser horizontal, kontrol di dalam layar, tombol ≥ 44 px).
Regresi penuh seluruh suite pada berkas akhir: lihat 30.3.

### 30.3 Regresi
Seluruh suite dijalankan ulang pada berkas akhir v22 (58 berkas log): **1.623 kasus, semuanya lulus**, tanpa FAIL. Termasuk t2h (progres), t2j (placement), t2 (UI desktop), t3_layout 61/61 di 7 ukuran layar, t3d 189/189 × 4 ukuran, dan t1p 51/51. Suite lama tidak diubah kecuali `lib.js` yang kini membuka sesi tamu.

### 30.4 Temuan selama pengerjaan
1. Id tahap Beginner tidak berurutan (`p0`, `s02`, …); uji awal salah memakai `b1`.
2. Kotak pilihan tokoh pecah jadi dua baris tidak rata karena aturan `.m-card label` ikut mengenai; diperbaiki dengan kisi 4×2.
3. Panah antar batu pijakan di adegan 4 melayang di atas batu; dipindah ke antara batu.
4. Uji lama membuka halaman baru dengan konteks sendiri; semua dilewati lewat sesi tamu di `lib.js` (parameter `entry:true` untuk menampilkan halaman pembuka).

### 30.5 Keterbatasan
- **Bukan sistem akun.** Progres terikat pada satu peramban di satu perangkat. Ganti perangkat, buka mode penyamaran, atau hapus data situs: progres hilang. Belum ada ekspor/impor progres.
- PIN lupa = progres hilang; PIN tidak melindungi dari yang bisa membuka alat pengembang.
- **Belum ada penyaring kata kasar** pada nama pemain, padahal nama dicetak di sertifikat dan dilihat guru.
- Bila PIN dibuat di konteks aman (hash `s…`) lalu perangkat dibuka lewat HTTP biasa tanpa `crypto.subtle`, PIN tidak akan cocok (pesan salah menyesatkan “PIN belum cocok”).
- Ikon Si Teka tidak konsisten di game: 🦉 di tombol dan cerita, 🐦 di gelembung dialog tahap.
- Belum diuji: layar sentuh sungguhan, pembaca layar (hanya atribut ARIA dan fokus yang diperiksa), terbaca-tidaknya cerita oleh murid SD kelas 4 (tingkat bahasa belum divalidasi).

---

## 31. Laporan pengujian per modul v22 (21 November 2026)

Laporan lengkap per modul ada di Claude Docs: *Laporan Pengujian Kode Nusantara v22*. Ringkasannya: regresi penuh 1.623 kasus lulus pada berkas yang sama dengan yang terbit. Audit liputan menemukan 6 tahap (MB05, MB06, MB08, MB10, EX05, EX06) yang hanya diuji lewat simulator dan 2 (EX08, EX10) yang hanya lewat uji kontras; suite baru `t2r_celah_ui.js` (24 kasus, 23 nyata) menutupnya di tingkat tombol ▶. Penyusunan kartu lewat picker untuk 8 tahap itu masih belum diuji.


---

## 32. Prototipe v23: Progressive Web App (22 November 2026)

**Perubahan.** Di atas v22 ditambahkan: `manifest.webmanifest`, `sw.js`, ikon (192/512 any, 192/512 maskable, apple-touch 180, favicon), tombol "Pasang aplikasi" dan tombol "Versi baru tersedia, muat ulang" di menu, blok `kn-pwa` (pendaftaran SW dengan penjaga). Kode permainan tidak berubah. `APP_VERSION` menjadi `v23`. Seluruh berkas ada di `kode-nusantara-pwa/`; panduan di `README_PWA.md`.

**Keputusan rancangan.**
- Navigasi: jaringan dulu dengan batas 4 detik, lalu jatuh ke cache. Aset lokal: cache dulu. Font Google: stale-while-revalidate.
- Versi baru tidak memakai `skipWaiting` otomatis; hanya setelah pemain menekan tombol (supaya tahap yang sedang dikerjakan tidak hilang oleh muat ulang tiba-tiba).
- SW tidak didaftarkan bila `navigator.webdriver`, di Capacitor/WebView, `file://`, atau konteks tidak aman.

**Uji baru `t6_pwa.js`: 30 kasus, semuanya lulus** (A manifest/ikon 6, B pendaftaran dan cache 5, C luring dengan server dimatikan 4, D alur pembaruan 6, E tombol pasang 5, F penjaga 4).
- Luring diuji dengan mematikan server sungguhan, bukan emulasi jaringan, supaya fetch milik SW ikut gagal.
- Pembaruan diuji dengan menyajikan salinan "versi 2" (penanda baru + `CACHE_VERSION` baru): tombol muncul, halaman TIDAK berpindah sendiri, setelah ditekan halaman dimuat ulang sekali ke versi 2 dan cache lama terhapus, luring tetap menyajikan versi 2.
- Bukti visual: `tests/evidence/pwa_menu_390.png` (menu 390×844 dengan kedua tombol).

**Regresi.** Dijalankan ulang pada berkas v23: t1p 51/51, t2_ui_desktop 42/42, t2h 12/12, t3_layout 61/61, t4_sentuh 12/12, t5_sumberdaya 9/9, t2j 35/35, t2e 9/9 (total 231 kasus) + t6 30/30. **Regresi penuh 1.623 kasus TIDAK dijalankan ulang untuk v23**; perubahan bersifat tambahan (tautan head, satu blok menu, satu skrip), tetapi hasil v22 tidak otomatis berlaku untuk v23 pada suite yang tidak dijalankan.

**Belum teruji / batasan.**
- Dialog pasang asli di Chrome Android, ikon maskable di peluncur nyata, perilaku iOS, dan audit Lighthouse belum dijalankan. Uji tombol pasang memakai peristiwa `beforeinstallprompt` buatan.
- Font Baloo 2 di cache luring tidak teruji (akses font diblokir di lingkungan uji); game memakai font cadangan bila tidak ada.
- Artifact di claude.ai tidak bisa dipasang sebagai PWA (manifest dan SW harus dilayani dari asal yang sama). Perlu alamat HTTPS sendiri; tidak diuji bagaimana halaman artifact bereaksi terhadap blok PWA.
- Progres (`localStorage`) terpisah per asal: PWA, APK, dan browser biasa tidak berbagi progres. Ekspor/impor progres belum ada.
- Menaikkan `CACHE_VERSION` di `sw.js` dilakukan manual setiap rilis.


---

## 33. Prototipe v24: cutscene pembuka dan kunci potret (22 November 2026)

**Perubahan.** (1) Cutscene pembuka otomatis ±12,6 dtk, 4 adegan potret penuh layar (senja dengan lampu menyala; malam, lampu padam satu per satu; Si Teka; judul dan lampu menyala kembali), tombol Lewati/Mulai selalu terlihat, Escape menutup. Diputar sekali per sesi aplikasi (`sessionStorage kn_buka`), sebelum halaman masuk. Bisa dimatikan di menu ("Putar cutscene pembuka saat aplikasi dibuka") dan diputar ulang dari menu. (2) Kunci potret: `orientation: "portrait"` di manifest PWA, `android:screenOrientation="portrait"` di MainActivity, `screen.orientation.lock("portrait")` pada HP, dan layar "Putar ponselmu tegak" untuk peramban HP yang tidak bisa dikunci. `APP_VERSION` v24, `CACHE_VERSION` kn-v24-1.

**Aturan kapan tidak diputar.** `navigator.webdriver` (otomatisasi), tautan `?tamu/?tahap/?gerbang`, pengaturan dimatikan, atau sudah diputar di sesi itu. `?pembuka` memaksa putar; `?putar` memaksa penjaga potret aktif (dipakai uji). Muat ulang setelah masuk/ganti pemain tidak memutar ulang.

**Penjaga potret hanya untuk HP:** penunjuk kasar (`pointer: coarse`) **dan** sisi pendek layar < 600 px. Desktop dan tablet mendatar tidak diblokir (tata letak mendatar yang sudah diuji tetap berlaku di sana). Catatan: kunci di manifest dan AndroidManifest berlaku untuk SEMUA perangkat Android, termasuk tablet.

**Uji baru `t7_pembuka.js`: 44 kasus, semuanya lulus.** A penjaga otomatisasi 3; B pemutaran penuh 8 (urutan adegan, warna lampu terhitung, durasi 12,4 dtk); C lewati/Escape/putar ulang 4; D logika sesi nyata dengan webdriver disamarkan 10 (peluncuran pertama, muat ulang, `?tamu`, sesi baru, matikan di menu, gerak dikurangi, penyimpanan ditolak); E tata letak 5 layar (320×568 sampai 1280×720) 10; F kunci potret 9 (manifest, AndroidManifest, `lock()` dipanggil di HP tegak, layar putar muncul/hilang saat rotasi tanpa muat ulang, tidak muncul di desktop/tablet/otomatisasi). Bukti: `tests/evidence/pembuka_*.png`, `putar_844x390.png`.

**Regresi pada berkas v24:** t6_pwa 30/30, t1p 51/51, t2h 12/12, t2_ui_desktop 42/42, t5 9/9, t3_layout 61/61, t4_sentuh 12/12, t2j 35/35, t2e 9/9 (total 261 kasus wakil) + t7 44/44. **Regresi penuh 1.623 kasus tidak dijalankan ulang untuk v24.** Temuan uji: suite PWA lama gagal 2 kasus (E1, E2) karena cutscene menutupi menu saat webdriver disamarkan; suite diperbaiki (menandai pembuka sudah diputar), bukan produknya.

**Belum teruji / batasan.**
- Kunci potret sungguhan (Android WebView, PWA terpasang, iOS Safari) belum dicoba di perangkat; yang teruji hanya logika di Chromium dengan `lock()` palsu dan emulasi viewport. iOS tidak punya kunci orientasi sama sekali, jadi hanya layar putar yang berlaku.
- Pada peramban Chrome Android biasa, `lock()` hanya berhasil dalam layar penuh/PWA terpasang; di tab biasa yang berlaku hanya layar "Putar ponselmu tegak".
- HP lipat yang dibuka (sisi pendek ≥ 600) tidak terkena penjaga.
- Cutscene tanpa suara. Keterbacaan teks oleh murid SD kelas 4 belum divalidasi.
- Cerita 5 adegan (setelah daftar) dan pembuka ini sebagian tumpang tindih (Si Teka diperkenalkan dua kali).
- Pembuka diputar tiap peluncuran aplikasi; belum ada data apakah murid atau guru terganggu. Tombol Lewati dan opsi mematikan adalah mitigasinya.


---

## 34. Kesiapan deploy Vercel (23 November 2026)

**Perubahan (tidak ada kode permainan yang berubah; tetap v24).** `pwa/vercel.json` (situs statis, header untuk `sw.js`, manifest, ikon, nosniff), `vercel.json` akar repo (`outputDirectory: "pwa"`, header identik), `.vercelignore` (akar: android, tests, docs, game; folder pwa: sumber ikon dan berkas Netlify/GitHub), `.gitignore`, `README.md` akar. Panduan di `pwa/README_PWA.md` bagian "Deploy ke Vercel".

**Keputusan.** Tanpa `cleanUrls`/`rewrites`/`redirects`/`trailingSlash`: pengalihan membuat respons "redirected" tersimpan di cache service worker dan ditolak browser untuk navigasi. Akar repo tanpa `package.json` agar Vercel tidak menjalankan instal/build.

**Uji baru `t8_vercel.js`: 17 kasus, semuanya lulus** (A konfigurasi dan struktur repo 7; B header per jalur 5; C PWA tetap hidup di bawah header itu, termasuk luring dan tidak ada respons "redirected" di cache, 4; D konfigurasi akar repo 1). Pengujian MENIRUKAN penerapan `headers` memakai path-to-regexp pada server statis lokal.

**Belum teruji / batasan.** Belum ada deploy sungguhan ke Vercel (tidak ada akun/akses jaringan dari lingkungan ini): perilaku asli Vercel (urutan penggabungan header, Deployment Protection pada alamat pratinjau, penanganan `.webmanifest`) belum terbukti. Tidak ada CSP; ditambahkan nanti hanya setelah diuji karena game memakai skrip inline dan Google Fonts. Skema `$schema` tidak divalidasi terhadap skema resmi (tanpa akses). Regresi penuh tidak dijalankan ulang (game tidak berubah sejak v24; hasil v24 tetap berlaku).

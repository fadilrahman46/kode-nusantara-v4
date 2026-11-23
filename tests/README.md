# Uji otomatis prototipe Kode Nusantara (P0 + P1)

Menjalankan halaman asli `../kode-nusantara-prototipe.html` di Chromium headless (WebGL perangkat lunak/SwiftShader).
Harness hanya **menambahkan satu baris ekspor** (`window.__t`) agar logika internal bisa diperiksa; tidak ada kode game yang diubah.

## Menjalankan
```bash
npm install            # puppeteer-core, @sparticuz/chromium, three@0.128.0
# atau pakai Chrome lokal:  CHROME_PATH="/path/ke/chrome" node t1_logika.js
node t1_logika.js              # logika: kelayakan stage (brute force), fuzzing interpreter
node t2_ui_desktop.js          # fungsional lewat UI (mouse + keyboard), 1280×720
node t3_layout.js              # tata letak 7 ukuran layar + kontras warna (+ screenshot ke evidence/)
node t3b_verifikasi_perbaikan_css.js   # menguji USULAN perbaikan CSS dengan menyuntikkannya (file asli tidak berubah)
node t3c_visibilitas_kontrol.js        # tombol kontrol mana yang keluar layar, menurut jumlah kartu
node t4_sentuh.js              # interaksi sentuh (emulasi HP 360×740 @2x)
node t5_sumberdaya.js          # draw call, kebocoran memori, storage ditolak, CDN gagal, sandbox, resize
node t1c_junior.js             # Junior J01–J06: acuan, program salah, tanpa-wadah tak bisa menang, penafsir bersarang
PART=1|2|3 node t2f_junior.js  # Junior lewat antarmuka (wadah, Selesai, syarat gabungan)
node t1d_junior2.js            # Junior J07–J14: Mesin, masukan, keluaran, rak, Untuk setiap
PART=1|2 node t2g_junior2.js   # J07–J14 lewat antarmuka
node t1e_middleA.js            # Middle A MA01–MA03: rekursi, titik berhenti, cara tanpa rekursi melebihi batas
node t2i_middleA.js            # MA01–MA03 lewat antarmuka
node t2h_progres.js            # progres pemain, kunci tahap, benih sesi, tautan ulang, unduh catatan
node t2e_c1.js                # label Indonesia, modal hasil tertunda, pesan ramah
node t1b_beginner_lengkap.js   # stage baru B02–B07, B11–B13: program acuan di semua keadaan acak, program salah, tanpa-Jika tak bisa menang
PART=1|2|3 node t2d_beginner_lengkap.js   # stage baru lewat antarmuka + penilaian lintas-keadaan + picker Jika
T3D_VP=360x740 node t3d_layout_stage_baru.js   # tata letak stage baru per layar (360x740, 390x844, 667x375, 844x390)
```
Hasil: `results/*.json` (ringkas per kasus uji) dan `results/*_data.json` (data mentah). Bukti visual: `evidence/`.

## Catatan
- Render WebGL perangkat lunak bisa sesekali macet di mesin lemah. Batas waktu protokol 60 dtk (`PROTO_TIMEOUT` untuk mengubah); T3 memakai browser baru per layar dan mengulang maksimal 3×. T3 juga bisa dijalankan per layar: `T3_VP=hp-portrait-360x740 node t3_layout.js` (ulangi untuk tiap layar), lalu `T3_MERGE=1 node t3_layout.js` untuk asersi.
- `TARGET=/path/lain.html` untuk menguji berkas lain; harness mencari baris penutup `ready.then(...)` untuk menyisipkan ekspor.
- Three.js disajikan dari paket npm r128 (sama dengan CDN yang dipakai halaman). Google Fonts sengaja diblokir (tampilan memakai font cadangan).
- Skrip ini **tidak** mengukur FPS/GPU nyata dan **tidak** menggantikan uji di HP asli maupun playtest dengan siswa.

- `t2j_placement.js` — Placement Test 1 (Ujian Si Teka): 21 kunci diperiksa penafsir, penilaian, tes ulang, varian, data, papan ketik, HP. 35 kasus.
- `t1f_middleA2.js` — MA04–MA10: acuan di semua keadaan, 16 cara pintas. 27 kasus.
- `t2k_middleA2.js` — MA04–MA10 lewat antarmuka, panel pohon. 13 kasus.
- `t1g_middleB.js` — MB01–MB03: acuan, 13 cara pintas, salinan atribut, kode semu kelas. 20 kasus.
- `t2l_middleB.js` — MB01–MB03 lewat antarmuka, picker di HP. 6 kasus.
- `t1h_middleB2.js` — MB04–MB10: acuan, 22 cara pintas, kode semu. 35 kasus.
- `t2m_middleB2.js` — MB04/MB07/MB09 lewat picker, picker di HP. 6 kasus.
- `t1i_gerbang.js` — Gerbang Si Teka: 12 jawaban dicek independen, pengecoh, ubin, aturan anti-blokir. 42 kasus.
- `t2n_gerbang.js` — Gerbang lewat antarmuka, HP, mode gelap, simpan/muat ulang. 18 kasus.
- `t1j_senior.js` — SE01–SE10: acuan di semua keadaan, 46 cara salah, perbaikan SE03, kode semu (SE09: 11 cara salah). 69 kasus.
- `t1k_senior_ablasi.js` — Senior: pencarian ruang keadaan SE10 (tanpa Jika-habis, Jika-uji-gagal, Simpan, Buat peti atau bahan: tidak ada yang lulus), seluruh ruang SE09, batas panjang intro. 7 kasus.
- `expert_model/` — `expert_sim.js` adalah model murni EX04–EX10 yang **tertanam identik** di halaman (diuji t1n/M1); skrip lain menghitung angka rancangan awal.
- `t2o_senior.js` — Senior lewat antarmuka: menu, SE02/SE03 dimainkan, dasbor, 4 layar, kontras teks dasbor terang dan gelap, pengumuman aria-live. 13 kasus.
- `t1l_expert.js` — EX01–EX03 (aturan + detak): acuan, 14 cara salah, ablasi seluruh himpunan aturan (EX01 15.275, EX02 2.804.011, EX03 245.505), definisi "aturan inti" EX03 dilonggarkan. 21 kasus.
- `t1m_expert2.js` — EX04–EX10 (setelan): acuan, 24 cara salah, ruang setelan dicari penuh dengan jumlah jawaban persis (1, 3, 1, 1, 1, 2). 36 kasus.
- `t1n_expert10.js` — EX10: model Node identik dengan halaman, 133.293 susunan dalam anggaran → tepat 12 lulus, ablasi tiap bagian, halaman = Node pada 150 susunan. 11 kasus.
- `t2p_expert.js` — Expert lewat antarmuka: menu, tabel detak, tombol 1×/4×/⏭, gerak berkurang, pindah tahap, HP, EX04 menang, EX09 urutan kartu, picker Rak. 10 kasus.
- `t3e_kontras_expert.js` — kontras tabel dan catatan Expert setelah Jalankan (EX04, 07, 08, 09, 10), terang dan gelap. 10 kasus.
- `t1o_ujian_senior_expert.js` — Gerbang Detak/Antrean dan butir Ujian Senior (10 × 3) / Ujian Expert (8 × 3): bentuk butir, kunci dihitung ulang dengan implementasi terpisah (rekursi, penelusuran pohon dengan tumpukan, push/pop dan enqueue, brankas, titik simpan, gabung, detak), aturan kunci tahap, syarat dasar, data lama dan rusak. 26 kasus.
- `t2q_ujian_senior_expert.js` — Ujian Senior dan Ujian Expert lewat antarmuka: tawaran di menu dan layar hasil J14, penilaian (satu salah, “Aku belum tahu”), kunci SE01/EX01, tes ulang (3 tahap baru), tiga varian berbeda, hapus progres, papan ketik, Gerbang Detak/Antrean 6 varian × 3 bentuk, tata letak 360×740 dan 667×375 untuk 54 soal. 21 kasus.
- `t1p_pembuka.js` — halaman pembuka v22: validasi nama/PIN, daftar, cerita, masuk, tamu, pemisahan progres antar pemain, data rusak, tata letak 4 ukuran. 51 kasus. `lib.js` kini melewati halaman pembuka lewat sesi tamu; `newPage({entry:true})` menampilkannya.
- `t2r_celah_ui.js` — celah liputan yang ditemukan audit laporan v22: MB05, MB06, MB08, MB10, EX05, EX06, EX08, EX10 dijalankan lewat tombol ▶ dengan program acuan (menang, progres tersimpan) dan cara salah (tidak menang, ada pesan). Program dimasukkan lewat `setProgram`, bukan picker. 24 kasus (satu dilewati karena melebihi batas kartu).
- `t6_pwa.js` — PWA v23: manifest dan ikon, SW terdaftar dan aktif, luring (server dimatikan), alur pembaruan v1→v2, tombol pasang (peristiwa buatan), penjaga webdriver/Capacitor/WebView/file://. Menyajikan `../kode-nusantara-pwa`; jalankan `TARGET=../kode-nusantara-pwa/index.html node t6_pwa.js`.
- `t7_pembuka.js` — cutscene pembuka v24 (urutan adegan, lewati/Escape/putar ulang, logika sesi dengan webdriver disamarkan, tata letak 5 layar) + kunci potret (manifest, AndroidManifest, lock(), layar putar). ANDROID_MANIFEST=… bila proyek Android di lokasi lain.
- `t8_vercel.js` — kesiapan Vercel: validasi vercel.json, struktur repo, header ditiru dengan path-to-regexp (`PTR=<path>` bila modul tidak ada), PWA tetap jalan dan luring di bawah header itu. path-to-regexp sudah ada di package.json.

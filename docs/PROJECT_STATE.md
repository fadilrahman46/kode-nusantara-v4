# PROJECT_STATE.md

> Lampirkan ulang file ini di awal percakapan baru agar pekerjaan bisa dilanjutkan.

**Project title:** Kode Nusantara (working title) — game edukasi logika pemrograman & sistem
**Last updated:** 2026-11-12
**Current phase:** 2 Pre-Production (prototipe v3 + perangkat playtest siap; menunggu playtest nyata untuk go/no-go)

## Concept snapshot
- Genre: Puzzle + riddle dengan kerangka RPG (stage, misi, NPC)
- Platform: Web (Three.js), laptop/Chromebook + browser HP
- Target audience: Pelajar **SD kelas 4** – SMA (MVP: SD kelas 4 – SMP)
- Fokus: logika pemrograman & sistem, tidak terikat bahasa
- Tech stack: TypeScript + Vite, Three.js, interpreter kartu buatan sendiri, localStorage
- Team size / scope: **solo developer, tanpa deadline eksternal**

## Decisions locked in
- Batas bawah usia: SD kelas 4
- Beginner: urutan, kondisional sederhana (satu titik keputusan per stage), variabel, tipe data, matematika dasar
- Junior: perulangan, fungsi, list — wajib diselesaikan sebelum Middle; tidak bisa dilompati
- Middle A (rekursi, search, struktur data) → Middle B (OOP)
- Senior: API, Versioning, Container, Deploy
- Expert: sistem lanjut & otomasi; terbuka setelah semua stage & misi Senior
- Test 1 (7 soal Beginner): ditawarkan setelah Stage Pengantar sebagai "Ujian Si Teka"; 7/7 → Junior, selain itu → Beginner; soal memakai bahasa kartu game
- Test 2 (10 soal Middle A+B, setelah Junior Complete): 10/10 → Senior, selain itu → Middle A; tanpa lompat sebagian
- Tes ulang: syarat 3 stage setelah penempatan, maks 2 kali, varian soal berbeda, hanya percobaan terakhir yang dihitung
- Riddle gerbang anti-blokir: 3 kali salah → gerbang terbuka tanpa bonus misi
- Hint tingkat 1 (riddle) selalu gratis; tombol Langkah ada di semua tingkat (Hard: pengali turun ke ×1.75)
- Kriteria bintang per stage; stage acak dinilai terhadap semua seed
- Easy / Medium / Hard di setiap mode
- Rilis publik

## Open questions / unresolved
- Model bisnis
- Tanggal playtest dan tanggal go/no-go (prioritas #1)
- HP uji termurah (model)
- Pilot sekolah untuk mengukur efektivitas belajar?
- Satu atau dua sertifikat? (ASUMSI: dua)
- Fitur "Lihat versi kode" masuk MVP? (ASUMSI: ya, versi ringan)
- Rincian Expert: draft di Kurikulum_Stage_v0.3.md (trigger, pipeline, antrean+pekerja, skala, cache, monitoring)

## Assumptions made so far
- Jumlah stage: Beginner 10, Junior 12, Middle A 10, Middle B 10, Senior 10, Expert 10
- Formula skor, kredit mode yang dilompati, bonus misi +10%
- Sertifikat dibuat di perangkat; nama tidak disimpan
- MVP = Test 1 + Beginner + Junior
- Bank soal 3 varian per butir (Test 1: 21, Test 2: 30)

## Current milestone / deliverable in progress
- Prototipe P0 (Stage Pengantar) + P1 (Beginner stage 7 & 8) dipublikasikan: https://claude.ai/artifact/3brjwF2zDnhH6TwBpjKZyR
- Review_Dokumen_MVP.md: butir 1–7 diterapkan; butir 8–10 belum
- Testing prototipe: awal 87/117 lulus dengan 16 temuan. Setelah perbaikan F01–F12: **133/134 lulus** (Dokumentasi_Testing_Prototipe.md §12). Sisa: Stage 8 Hard di HP lanskap 667×375 menampilkan 2 dari 3 kartu (Minor; bisa digulir). F13–F16 ditunda sampai playtest

## Known risks / dependencies
- Belum ada stage latihan; Junior padat (review #9)
- Estimasi belum menghitung konten tersembunyi (review #8) — makin kritis karena solo developer
- Tanpa deadline: risiko scope terus bertambah dan produksi tidak pernah dimulai
- Rendering 3D diuji di Chromium + SwiftShader (bukan GPU/HP nyata); FPS, sentuhan nyata, Safari, dan sandbox artifact belum teruji
- F01–F12 sudah diperbaiki dan diuji otomatis, tetapi belum di HP fisik
- F04 (keterbacaan ikan & papan nama) belum diuji ke anak
- Instruksi "Seret kartu Maju" kini di halaman ke-2 dialog Stage Pengantar di HP: pantau saat playtest
- Infrastruktur uji: render WebGL perangkat lunak sesekali macet (mitigasi: percobaan ulang tercatat)
- Versi TERBIT di claude.ai belum pernah dibuka/diuji; hanya salinan lokal yang diuji (berkas sama, kecuali satu baris ekspor uji)
- Halaman bergantung CDN (cdnjs Three.js, Google Fonts): jaringan sekolah bisa memblokir → tanpa Three.js tidak ada adegan (lihat A2)
- Angka uji 133/134 bukan apel-ke-apel dengan 87/117 (17 uji baru; 2 kriteria diganti oleh penulisnya sendiri); penulis kode = penulis uji
- Pembagian tidak habis, batas tes ulang hanya di localStorage, tidak ada data efektivitas belajar (review #10)
- Kredit mode yang dilompati merugikan predikat (pasca-MVP)
- Rekursi di Middle A sebagai titik drop-off; Senior/Expert berisiko menjadi hafalan istilah
- Soal belum divalidasi; data anak (UU PDP); performa di HP murah

## Next step — status per 12 Nov 2026
### Stage 1
- [x] Tanggal: 12 Nov dipakai untuk SIMULASI. **Playtest nyata: tanggal baru belum ditetapkan** (butuh izin orang tua/sekolah)
- [x] Perangkat playtest: Playtest_Kit_P0_P1.md (protokol, surat izin sekolah, persetujuan orang tua & anak, skrip fasilitator, tangga bantuan, lembar observasi, rekap & aturan keputusan)
- [x] Simulasi 5 anak + review "independen" (SIMULASI, bukan data): Simulasi_Playtest_dan_Analisis.md
- [x] Tugas 4: Three.js disematkan (jalan tanpa internet) + instruksi tutorial di halaman pertama dialog → prototipe v3 diterbitkan ke link yang sama
- [~] Uji aplikasi v3: T1 10/10, T4 12/12, T5 9/9 (termasuk uji tanpa internet); T2 21 kasus pertama lulus, sisanya terputus oleh infrastruktur; T3 tidak diulang (tata letak tidak berubah). **Uji di HP asli belum**
- [ ] Reviewer independen nyata (1 orang)

### Stage 2 (SIMULASI)
- [x] Prediksi terhadap kriteria GDD §11: "Go bersyarat"; risiko utama H1 (kartu tidak tampak bisa diubah), H2 (Stage 8 menguji aritmetika), H3 (ikon Maju)
- [x] F13–F16: keputusan desain Go (F13 varian data Sulit + pengali ×1,5 sementara; F14 bersyarat data D5; F15 hint 3 parsial; F16 modal tertunda)
- [ ] **Go/no-go produksi menunggu playtest nyata**

### Stage 3
- [x] B1 GDD_MVP v0.3 (bagian "Perubahan v0.3")
- [x] B2 Inventaris konten: ±300–460 jam (asumsi; belum dikalibrasi jam nyata) → Rencana_Produksi_MVP.md
- [x] B6 Review #9/#10 diputuskan
- [ ] B4 Keputusan nasib kode: rekomendasi B (spesifikasi hidup + repo TypeScript/Vite setelah Go). **Keputusan di tanganmu**
- [x] C1 dikerjakan di prototipe v7 (16 Nov): UI Indonesia (G1), hint 3 parsial (F15), modal hasil tertunda 1,6 dtk tanpa latar gelap (F16), pengali Sulit ×1,5 / +Langkah ×1,25 (F13 sementara), pesan gagal ramah (G3). **Sisa:** varian data Sulit (F13 bagian dua) dan F14; menunggu playtest nyata (Dokumentasi_Testing §16)
- [ ] C2–C6: digerbang oleh go/no-go playtest nyata

## Pembaruan 12 Nov — review stage Beginner/Junior → Middle/Senior/Expert
- [x] Review stage Beginner & Junior: desain v0.2 melanggar **16** aturan konsistensi (9 stage K berturut-turut, 4 misi tanpa latihan, slot nilai tak terspesifikasi, boolean hilang, riddle memakai konsep yang belum diajarkan, dll.) → Review_Stage_Beginner_Junior.md
- [x] Perbaikan (dokumen): **Beginner 10→13, Junior 12→14, MVP 27 stage**; pola kenalkan→latih→pelintir; + Ulangi bersarang, + Syarat gabungan (TIDAK/DAN/ATAU), + slot nilai, + sensor sakelar; Mesin-di-dalam-Mesin pindah ke MA02; Test 2 soal 4 = pohon; GDD v0.4, Progression v0.7, Rencana_Produksi diperbarui
- [x] Middle A, Middle B, Senior, Expert: dari 1 baris materi → **40 stage draft** (Kurikulum_Stage_v0.3.md) + bukti pemahaman + model keadaan; spesifikasi lolos design_lint (0 pelanggaran, 2 peringatan)
- [x] **B08 "Jembatan Panjang" ditambahkan ke prototipe** (BJ-07 selesai); Playtest_Kit §9 diperbarui
- [ ] Uji kelayakan Senior/Expert (model keadaan → solver) belum dibuat
- Prototipe v4 diterbitkan: + B08; label layar = ID kurikulum (B01/B08/B09/B10)

**Keputusan pemilik (12 Nov) — terjawab:**
1. Logika boolean (DAN/ATAU/TIDAK) **diajarkan** → J05 + sensor sakelar B12 dikunci
2. Kenaikan scope MVP 22→27 stage **diterima** (estimasi ±315–480 jam, asumsi)
3. B08 **dikerjakan di prototipe** → selesai (prototipe v4)

**Prototipe v4 (12 Nov):** memuat B01 Pengantar, **B08 Jembatan Panjang (baru)**, B09 Kotak Berbentuk, B10 Timbangan Pasar; label layar = ID kurikulum. Uji B08: T1 12/12, T2b 10/10. Regresi penuh pada v4: T1 12/12, T2 42/42, T2b 10/10, T3 60/61 (sisa: HP lanskap 667×375, B10 2/3 kartu terlihat; Minor), T4 12/12, T5 9/9 (Dokumentasi_Testing_Prototipe.md §13). **v4 diterbitkan ke link artifact yang sama.**

**Sisa pekerjaan terbuka:**
- ~~Stage B02–B07 dan B11–B13 belum ada~~ → **selesai di prototipe v6 (15 Nov)**; playtest kini bisa mencakup seluruh jalur Beginner B01–B13
- **Kartu bersarang belum dibuat** (Jika di prototipe = satu kartu, satu tindakan per jalur). Sebelum Junior (Ulangi bersarang, Syarat gabungan) perlu prototipe wadah sungguhan; hasil playtest B05–B07 tidak membuktikan anak mampu memakainya
- Pesan penilaian lintas-keadaan ("berhasil untuk satu keadaan, tapi…") belum pernah dilihat anak: amati di B05
- Hint 3 sudah parsial di B08/B09/B10 (prototipe v5, F15 selesai); B01 sengaja tidak diubah (tutorial). Belum terbukti hint 3 cukup membantu (butuh playtest)
- Uji kelayakan Senior/Expert belum dibuat
- Kalibrasi estimasi dengan jam nyata (isi kolom "Jam nyata" di Rencana_Produksi_MVP.md)
- Playtest nyata: tanggal dan izin belum ada

**Prototipe v6 (15 Nov): Beginner lengkap, 13 stage.** Keputusan pemilik: "Lengkapi Beginner" + tetap di berkas prototipe tunggal (repo TypeScript/Vite ditunda sampai playtest nyata memberi Go). Mekanik baru: Ambil/Taruh/Tekan, Jika + selain itu, 4 sensor, variasi acak dinilai di semua keadaan. Uji: T1 13/13, T1b 55/55 (baru), T2 42/42, T2b 10/10, T2c 9/9, T2d 21/21 (baru), T3 61/61, T3d 108/108 (baru), T4 12/12, T5 9/9 (Dokumentasi_Testing §15). Regresi menangkap satu bug di B08 lama. Penyimpangan dari spesifikasi di §15.5.

**Keputusan pemilik (16 Nov): bangun tanpa menunggu playtest; lanjut Junior → Middle A → Middle B → Senior → Expert.** Risiko yang diterima: seluruh model interaksi belum divalidasi anak; bila playtest membantahnya, pengerjaan ulang berlipat.

**Prototipe v8 (16 Nov): Junior J01–J06 + kartu wadah bersarang** (Ulangi, Selama, Selesai; syarat TIDAK/DAN/ATAU; penafsir bersarang). 19 tahap total. Uji: T1c 33/33 dan T2f 24/24 (baru), T3d 180/180, regresi lain semua lulus (Dokumentasi_Testing §17).

**Prototipe v9 (16 Nov): Junior lengkap, J07–J14** (Mesin, masukan, keluaran, rak mulai 0, Untuk setiap). 27 tahap = cakupan MVP rilis. 633/633 kasus uji lulus (Dokumentasi_Testing §18).

**Keputusan pemilik (17 Nov):** nama anak muncul di sertifikat; belum ada skor tingkat.

**Prototipe v10 (17 Nov): progres pemain + kunci tahap, keadaan acak dengan benih sesi + tautan ulang, ekspor catatan .json.** 645/645 kasus uji lulus (Dokumentasi_Testing §19). Kesiapan rilis MVP diperkirakan naik dari ±43% ke ±47% (perkiraan, bobot di review 17 Nov).

**17 Nov (sore):** dokumen *Rancangan Placement Test dan Tes Ulang* (https://claude.ai/artifact/3yJYN4XwZhbSjdCuZYJRq8) dan *Model Permainan Senior dan Expert* (https://claude.ai/artifact/MqAUBRBKUwHaSdC8B91H3N) selesai. Prototipe v11: Middle A misi 1 (MA01–MA03, rekursi); 706/706 kasus uji lulus (Dokumentasi_Testing §20). Keputusan yang menunggu pemilik: hasil tes = percobaan **terbaik** (usulan) vs **terakhir** (v0.7).

**Prototipe v12 (17 Nov):** Placement Test 1 "Ujian Si Teka" + tes ulang (21 butir, 3 percobaan, syarat 3 tahap Beginner baru, aturan hasil terbaik). T2j 35/35; total 741/741 (Dokumentasi_Testing §21).

**Prototipe v13 (17 Nov):** Middle A lengkap (MA04–MA10: cari linear/biner, tumpukan, antrean, pohon, pohon terurut) dan Middle B misi 1 (MB01–MB03: cetakan, objek, atribut, method). 927/927 kasus uji lulus (Dokumentasi_Testing §22). Dokumen baru: *Rancangan Bahasa Kartu OOP (Middle B)* (https://claude.ai/artifact/TMt2hryPD1gCtYieJakCx7); bagian "Spesifikasi tahap Senior (rinci)" ditambahkan ke *Model Permainan Senior dan Expert*. Keputusan menunggu pemilik: (1) anak menulis isi cetakan sendiri mulai MB02, (2) MB10 diganti teka-teki komposisi, (3) istilah cetakan/objek/atribut/method/diri; rekomendasi: playtest sebelum MB04.

**Prototipe v14 (18 Nov):** Middle B lengkap (MB04–MB10: atribut terkunci, pewarisan, override, polimorfisme, komposisi; MB10 diganti "Pertunjukan Malam"). Pemilik memutuskan lanjut tanpa playtest. 1.052/1.052 kasus uji lulus (Dokumentasi_Testing §23). Middle A dan Middle B kini 20/20 tahap di prototipe.

**Prototipe v15 (18 Nov):** Gerbang Si Teka antarmisi Middle (setelah MA03, MA06, MB03, MB06): 3 varian per gerbang, jawaban dihitung program, tiga bentuk menurut tingkat, aturan anti-blokir GDD §3.8. Mekanik gerbang belum ada sebelumnya, juga untuk Beginner/Junior. 1.111/1.111 kasus uji lulus (Dokumentasi_Testing §24). Aturan bonus kemudian diubah ke salah ≤ 1 di v16 (tebakan acak 50%).

**Prototipe v16 (19 Nov):** Senior lengkap SE01–SE10 di atas dasbor "Papan Sistem" (17 kartu sys, 4 jenis keadaan: loket, versi, cabang/peti, jalur rilis) dan aturan bonus gerbang diubah ke salah ≤ 1. 1.306/1.306 kasus uji lulus (Dokumentasi_Testing §25). Penyimpangan: tanpa simulasi berdetak, tanpa dunia 3D stasiun, tanpa uji pencarian menyeluruh; SE09 paling tipis; belum ada playtest.

**Prototipe v17 (19 Nov):** review ulang Senior. SE10 terbukti eksak tanpa jalan pintas (T1k). Intro Senior dipersingkat (≤ 4 halaman). Dasbor mengikuti mode gelap; catatan langkah lewat aria-live; kontras diuji di dua tema (sel SE09 diperbaiki). Koreksi: varian SE05/SE06 memang memaksa; yang redundan hanya SE08 dan SE09. SE09 paling mudah ditebak (2 dari 155 program). Total 1.315/1.315. Dokumen baru: Playtest_Kit_Senior.md. Ditunda sengaja: perancangan ulang SE09, lencana/sertifikat, placement/gerbang Senior (menunggu playtest dan keputusan #1, #4). Keputusan MB10 "Pertunjukan Malam" dan istilah (cetakan/objek/atribut/method/diri) sudah dikonfirmasi pemilik.

**Prototipe v18 (19 Nov):** SE09 dirancang ulang (gerbang + pemantau + rollback; kartu baru "Pantau"; peluang tebak 1,3% → 0,27%). Rancangan Expert selesai: Spesifikasi_Expert.md (paradigma aturan + detak; EX04–EX07 dihitung dengan model murni, EX01–EX03 dan EX08–EX10 belum diverifikasi). Keputusan pemilik: sertifikat memuat username (bukan nama asli); placement test "terbaik". Total 1.321/1.321. Belum dibangun: mesin detak Expert, sertifikat (butuh sistem skor total).

**Antrean bangun berikutnya (urut):**
1. Playtest Middle A dan Middle B (MB02, MB04, MB07 prioritas); sertifikat dengan nama anak (keputusan penyimpanan nama + izin orang tua, UU PDP); Placement Test 2 (Junior→Middle)
2. Senior SE01–SE03 dan SE04 (spike Mesin Waktu) bisa dibangun di mesin kartu sekarang; Gerbang Si Teka Beginner/Junior (data saja); Placement Test 2
2. Middle A (10) → Middle B (10) → Senior (10) → Expert (10). Senior/Expert butuh model keadaan non-grid (Kurikulum §6); solver kelayakannya belum ada

## Deliverable log
- Game_Concept_Brief.md v0.2 → diberi tanda ARSIP
- Placement_Test_Design.md v0.1 → digantikan
- Progression_Placement_Design.md v0.2 → … → v0.6
- GDD_MVP.md v0.1 → v0.2
- Review_Dokumen_MVP.md (11 Nov 2026)
- Playtest_Kit_P0_P1.md, Simulasi_Playtest_dan_Analisis.md (SIMULASI), Rencana_Produksi_MVP.md, GDD_MVP v0.3 (12 Nov 2026)
- Prototipe v3: Three.js disematkan (12 Nov 2026)
- kode-nusantara-prototipe.html (P0 + P1) — v1 diuji 11 Nov 2026; v2 (perbaikan F01–F12) diuji ulang & dipublikasikan ke link yang sama
- Dokumentasi_Testing_Prototipe.md + tests/ (skrip uji, results, evidence) (11 Nov 2026)
- Review_Stage_Beginner_Junior.md, Kurikulum_Stage_v0.3.md, design_lint/ (12 Nov 2026); GDD_MVP v0.4; Progression v0.7
- Prototipe v6: B02–B07 dan B11–B13 + t1b/t2d/t3d (15 Nov 2026); Dokumentasi_Testing §15
- Prototipe v7: sisa C1 + t2e (16 Nov 2026); Dokumentasi_Testing §16
- Prototipe v8: Junior J01–J06, kartu wadah bersarang + t1c/t2f (16 Nov 2026); Dokumentasi_Testing §17
- Prototipe v9: Junior J07–J14 + t1d/t2g (16 Nov 2026); Dokumentasi_Testing §18
- Prototipe v10: progres, kunci tahap, benih sesi, ekspor catatan + t2h (17 Nov 2026); Dokumentasi_Testing §19
- Rancangan Placement Test dan Tes Ulang; Model Permainan Senior dan Expert (Claude Docs, 17 Nov 2026)
- Prototipe v11: Middle A MA01–MA03 + t1e/t2i (17 Nov 2026); Dokumentasi_Testing §20
- Prototipe v12: Placement Test 1 + t2j (17 Nov 2026); Dokumentasi_Testing §21
- Prototipe v13: MA04–MA10, MB01–MB03 + t1f/t2k/t1g/t2l (17 Nov 2026); Dokumentasi_Testing §22
- Prototipe v14: MB04–MB10 + t1h/t2m (18 Nov 2026); Dokumentasi_Testing §23
- Rancangan Bahasa Kartu OOP (Claude Docs, 17 Nov 2026; diperbarui 18 Nov); Spesifikasi tahap Senior (bagian baru di Model Permainan Senior dan Expert)
- Prototipe v19: mesin aturan + detak, EX01–EX03 + t1l/t2p (19 Nov 2026); Dokumentasi_Testing §28
- Prototipe v20: kartu setelan, EX04–EX10 + t1m/t1n/t3e; Spesifikasi_Expert v1.1 (20 Nov 2026); diterbitkan ke tautan yang sama; Dokumentasi_Testing §28
- Prototipe v21: Gerbang Detak (EX03) dan Gerbang Antrean (EX06); Ujian Senior (Test 2, sesuai rancangan 17 Nov) dan Ujian Expert (Test 3, usulan baru) + t1o/t2q (20 November 2026); Dokumentasi_Testing §29
- Prototipe v22: halaman pembuka (pemain lokal per perangkat, daftar, masuk dengan PIN opsional, tamu, cerita 5 adegan) + t1p (20 November 2026); Dokumentasi_Testing §30
- Laporan pengujian per modul v22 (Claude Docs) + t2r_celah_ui (21 November 2026); Dokumentasi_Testing §31
- Prototipe v23: PWA (manifest, service worker, ikon, tombol pasang, pembaruan manual) di `kode-nusantara-pwa/` + t6_pwa 30/30; Android www diperbarui ke v23; regresi penuh belum diulang (22 November 2026); Dokumentasi_Testing §32
- Prototipe v24: cutscene pembuka otomatis (4 adegan, lewati, bisa dimatikan) + kunci potret (manifest, AndroidManifest, lock(), layar putar di HP); t7_pembuka 44/44; regresi wakil 261 kasus lulus, regresi penuh belum diulang (22 November 2026); Dokumentasi_Testing §33
- Kesiapan deploy Vercel: vercel.json (pwa/ dan akar), .vercelignore, .gitignore, README akar; t8_vercel 17/17 (header ditiru lokal, deploy sungguhan belum dicoba); game tetap v24 (23 November 2026); Dokumentasi_Testing §34

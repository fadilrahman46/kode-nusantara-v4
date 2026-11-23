# Review Stage Beginner & Junior — dan lanjutan ke Middle, Senior, Expert

**Tanggal:** 12 November 2026 · **Mode:** audit sendiri (blak-blakan) · **Objek:** daftar stage GDD_MVP v0.3 §6.2/§6.3, Progression §2/§5, Rencana_Produksi, Playtest Kit, prototipe v3
**Kejujuran:** semua dokumen ini ditulis oleh pihak yang sama dengan penulis review (Claude). Pemeriksa konsistensi di bawah memperkecil, tetapi tidak menghilangkan, bias itu.

---

## 1. Ringkasan

| | |
|---|---|
| Desain lama (v0.2), Beginner + Junior | **16 pelanggaran** pada pemeriksa konsistensi; 7 temuan Major |
| Desain revisi (v0.3), 6 mode | **0 pelanggaran**, 2 peringatan (cakupan placement test) |
| Perubahan scope | Beginner 10 → **13** stage, Junior 12 → **14**, MVP 22 → **27**; ±+12–19 jam (asumsi) |
| Middle A/B, Senior, Expert | dari **satu baris materi + metafora** menjadi **40 stage draft** dengan prasyarat, mekanik, dan bukti pemahaman |
| Belum selesai | uji kelayakan Senior/Expert; stage B02–B07 dan B11–B13 belum ada di prototipe |

**Yang paling penting:** lolos pemeriksa berarti desain *konsisten*, bukan *terbukti bagus*. Desain revisi ditulis agar memenuhi aturan, jadi "0 pelanggaran" bukan bukti independen. Kebenaran pedagogisnya baru bisa diuji lewat playtest.

## 2. Cakupan dan metode

- **Dinilai:** konsep & scope; gameplay *di atas kertas* (kurva mekanik, prasyarat, pola latihan); spesifikasi kartu.
- **Tidak dapat dinilai:** apakah stage seru, apakah kesulitannya pas, apakah anak paham. Tidak ada rekaman playtest nyata.
- **Metode:** tabel stage GDD §6.2/§6.3 saya **transkripsi manual** ke spesifikasi mesin (`design_lint/spec_v0.2_baseline.json`: tiap stage punya mekanik yang diperkenalkan dan dipakai), lalu `lint.py` memeriksa 12 aturan. Risiko: transkripsi dan penetapan "mekanik dipakai" adalah penilaianku; pembaca dapat membantahnya di berkas JSON.

## 3. Temuan Beginner & Junior

| ID | Sev. | Temuan | Bukti | Perbaikan | Status |
|---|---|---|---|---|---|
| **BJ-01** | Major | **9 stage berturut-turut memperkenalkan mekanik baru** (Beginner B1–B9) dan **8** di Junior (J3–J10); tidak ada kesempatan memakai konsep sebelum konsep berikutnya datang | Pemeriksa L3; GDD §6.2 kolom "Mekanik baru" terisi pada stage 1–9 | Pola K→L→P: maks. 3 K berturut-turut; stage latihan **B04, B07, B11, J02, J06, J10, J13** | Selesai (dokumen) |
| **BJ-02** | Major | **4 misi tanpa stage latihan/pelintir**: Dermaga Gelap, Jalan Pasar, Gudang Kotak, Bengkel Pak Rakit | L4 | Tiap misi kini punya ≥ 1 stage L/P | Selesai (dokumen) |
| **BJ-03** | Major | **Stage "Gabungan" (B9) sebenarnya memperkenalkan mekanik baru** (sensor pembanding) sehingga pelintir pertama bercampur dengan konsep baru | L11; GDD §6.2 baris 9 | B12 = K pembanding; B13 = P penutup | Selesai (dokumen) |
| **BJ-04** | Major | **Slot nilai tidak ada di spesifikasi.** J7 ("hasil Mesin mengisi kotak"), J8, J10 ("isi rak"), J11 ("Kotak + Untuk setiap") membutuhkan kartu yang menerima nilai dari Mesin/rak, padahal GDD §3.3 dan prototipe hanya punya pemilih konstanta | L1 ×4 (inferensi dari teks GDD); `kode-nusantara-prototipe.html` pemilih hanya `values`/`nums` | Spesifikasi **slot nilai** satu tingkat (chip), diperkenalkan bersama `nilai_keluaran` (J09) dan `untuk_setiap` (J12); GDD §3.13 | Selesai (dokumen); **belum dikode** |
| **BJ-05** | Major | **Logika boolean (TIDAK/DAN/ATAU) tidak diajarkan di mana pun**, padahal fokus game adalah logika; tipe **sakelar** diajarkan (B7) tetapi tidak pernah dipakai | L13, L12 (`tipe` yatim). Boolean sempat ada di Progression v0.2 (Junior) dan hilang saat restrukturisasi v0.4 | **J05 Syarat Ganda** (K) + sensor sakelar di **B12** | Selesai (dokumen); **butuh konfirmasimu** (§7) |
| **BJ-06** | Major | **Riddle Junior "3 × 4 tepukan" memakai perulangan bersarang yang tidak diajarkan** | L7 | **J03 Kebun Berpetak** (Ulangi di dalam Ulangi); riddle dirumuskan sebagai Ulangi-dalam-Ulangi | Selesai (dokumen) |
| **BJ-07** | Major | **Prototipe melompati stage variabel.** Playtest memberi B01 lalu langsung B09 (tipe) dan B10 (matematika): pemain bertemu kartu "Isi kotak" tanpa pernah diajar. Hasilnya tidak mewakili urutan nyata dan mencampur hipotesis H1 dengan celah kurikulum | Prototipe hanya memuat 3 stage; Playtest_Kit §1 | Tambahkan B08 "Jembatan Panjang" ke prototipe **sebelum playtest nyata**; batasan validitas dicatat di kit (§9 kit) | **Selesai** (prototipe v4, 12 Nov) |
| **BJ-08** | Minor | **Mekanik yatim & dokumen tak sinkron**: "Mesin di dalam Mesin" (J8) tidak dipakai lagi dan sudah diputuskan pindah ke Middle A (Rencana_Produksi §2), tetapi tabel GDD §6.3 belum diubah | L12; Rencana_Produksi §2 vs GDD §6.3 | Komposisi fungsi dipindah ke **MA02**; "Jika di dalam Ulangi" menjadi pemakaian ulang di J06 | Selesai (dokumen) |
| **BJ-09** | Minor | **Test 1 hanya menguji 8 dari 9 mekanik Beginner** (`aksi` tidak diuji) padahal 7/7 melompati seluruh pulau | L15 | Diterima: aksi trivial dan dipakai ulang di Junior; dicatat | Diterima |
| **BJ-10** | Catatan | **Bintang Beginner "★★★ = ≤ N kali jalankan" menghukum eksperimen**, padahal loop inti game adalah coba–amati–perbaiki | GDD §3.10 (templat Beginner) | Belum diubah; **belum ada bukti** anak terganggu. Amati di playtest: apakah anak menghindari mencoba? | Ditunda ke data |
| **BJ-11** | Catatan | **Scope naik**: +5 stage MVP. Stage L murah (tanpa mekanik baru ≈ 2–3 jam), stage K mahal (3–6 jam) | Rencana_Produksi (diperbarui) | "Paket hemat": hapus B04/B07/B11 (3 L) bila perlu, dengan risiko BJ-01 kembali | Keputusan pemilik |

## 4. Hasil pemeriksa: sebelum dan sesudah

| Aturan | v0.2 (Beginner+Junior) | v0.3 (6 mode) |
|---|---|---|
| L1 pemakaian sebelum diperkenalkan / prasyarat | **4** | 0 |
| L3 > 3 stage K berturut-turut | **2** | 0 |
| L4 misi tanpa latihan/pelintir | **4** | 0 |
| L7 riddle memakai konsep yang belum diajarkan | **1** | 0 |
| L11 label tidak jujur | **1** | 0 |
| L12 mekanik yatim | **3** | 0 |
| L13 konsep wajib hilang | **1** | 0 |
| **Total** | **16** | **0** |

Peringatan L15 (v0.3): Test 1 tidak menguji `aksi`; Test 2 tidak menguji `cari_linear` dan `komposisi`.

## 5. Review Middle A, Middle B, Senior, Expert

Dokumen sebelumnya hanya berisi satu baris materi dan beberapa metafora per mode (Progression §2, §10). **Tidak ada daftar stage, prasyarat, atau kondisi menang**, sehingga tidak bisa diestimasi, diimplementasikan, atau diuji.

| ID | Sev. | Temuan | Bukti | Perbaikan | Status |
|---|---|---|---|---|---|
| **MSE-01** | Major | **Tidak ada daftar stage** untuk 4 mode (40 stage direncanakan, tak satu pun dirinci) | Progression §2/§10 | `Kurikulum_Stage_v0.3.md`: 10 stage per mode, tipe K/L/P, mekanik, prasyarat; lolos pemeriksa | Selesai (draft) |
| **MSE-02** | Major | **Test 2 tidak menguji pohon**, padahal pohon tercantum di Middle A; skor 10/10 melompati pohon | Progression §2 vs soal 1–5 | Soal 4 (syarat search biner) diganti **pohon (urutan kunjungan)**. Konsekuensi: "data harus terurut" kini hanya menjadi premis soal 3, tidak diuji | Selesai |
| **MSE-03** | Minor | Test 2 tidak menguji `cari_linear` dan `komposisi` | L15 | Diterima; soal 10 dapat diperluas ke komposisi | Diterima |
| **MSE-04** | Major | **Senior/Expert hanya metafora**: berisiko menjadi hafalan istilah (risiko yang sudah dicatat sejak review lalu) | Progression §10 | Kolom **bukti pemahaman** untuk 13 stage K (lintas L14) + **model keadaan & kondisi menang** per topik (Kurikulum §6) | Selesai (draft); **belum ada uji kelayakan** |
| **MSE-05** | Catatan | **Expert memadatkan 6 topik dalam 10 stage** dan bergantung pada Senior (`deploy`) dan Middle A (`antrean`) | spec | Prasyarat dikunci di spesifikasi; Expert hanya terbuka setelah Senior selesai (aturan lama) | Diterima |
| **MSE-06** | Catatan | **Tidak ada prototipe, playtest, atau estimasi jam nyata** untuk keempat mode. Seluruh isinya hipotesis | — | Tidak masuk MVP; jangan dikerjakan sebelum Go dari playtest nyata | Dicatat |

## 6. Perubahan yang diterapkan

| Berkas | Perubahan |
|---|---|
| `Kurikulum_Stage_v0.3.md` (baru) | Aturan desain, registri 45 mekanik, 67 stage di 6 mode, slot nilai, model keadaan Senior/Expert |
| `design_lint/` (baru) | `build_specs.py`, `lint.py`, spesifikasi v0.2 dan v0.3, hasil, README |
| `GDD_MVP.md` | v0.4: §6.2/§6.3 diganti; §3.3 + §3.13 (slot nilai, syarat gabungan, sensor sakelar); jumlah stage MVP |
| `Progression_Placement_Design.md` | v0.7: materi per mode, jumlah stage, Test 2 soal 4 (pohon) |
| `Rencana_Produksi_MVP.md` | inventaris dan estimasi diperbarui |
| `Playtest_Kit_P0_P1.md`, `Simulasi_Playtest_dan_Analisis.md` | batasan validitas (BJ-07) dan pemetaan label prototipe |
| `PROJECT_STATE.md` | status, pertanyaan terbuka, langkah berikutnya |

**Prototipe tidak diubah** pada putaran ini (tetap v3). Label layar "Stage 7/8" tetap; pemetaannya ke ID baru ada di Kurikulum §2.

## 7. Keputusan pemilik dan sisa pekerjaan (diperbarui 12 Nov)

**Keputusan yang sudah diambil:**
1. **Logika boolean (DAN/ATAU/TIDAK) diajarkan** → J05 Syarat Ganda dan sensor sakelar B12 dikunci.
2. **Kenaikan scope diterima** → MVP 27 stage; estimasi ±315–480 jam (asumsi).
3. **B08 dikerjakan di prototipe** → selesai (v4).

**Sisa pekerjaan:** (a) uji kelayakan Senior/Expert (MSE-04) sebelum satu stage pun diimplementasikan; (b) kalibrasi estimasi dengan jam nyata; (c) playtest nyata.

## 8. Batas dan bias

- **"0 pelanggaran" adalah konsistensi, bukan kualitas.** Desain revisi memang disusun untuk lolos aturan yang kutulis sendiri.
- **Ambang aturan adalah heuristik** (mis. maks. 3 K berturut-turut), bukan hasil riset pembelajaran.
- **Transkripsi desain lama dan daftar "mekanik dipakai" adalah penilaianku.** Bantahlah lewat `spec_v0.2_baseline.json`.
- **Middle–Expert tidak pernah dilihat pemain.** Perlakukan sebagai draf kerja, bukan komitmen.
- **Sisa estimasi jam masih asumsi**, belum dikalibrasi dengan jam nyatamu.

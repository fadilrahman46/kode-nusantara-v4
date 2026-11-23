# Perangkat Playtest — Kode Nusantara P0 + P1 (+ B08)

**Versi:** 1.0 (12 November 2026) · **Build yang diuji:** prototipe v3 (link artifact yang sama; Three.js disematkan, jalan tanpa internet)
**Peserta:** 5 siswa SD kelas 4–6 · **Perangkat:** laptop/Chromebook (HP menyusul setelah uji perangkat nyata) · **Durasi:** ±30 menit per anak

> Dokumen ini berisi **instrumen**. Hasil simulasi ada di dokumen terpisah dan **tidak boleh** dipakai sebagai data playtest.

---

## 1. Protokol singkat

| Langkah | Waktu | Catatan |
|---|---|---|
| Persiapan perangkat | sebelum anak datang | Buka prototipe → **Catatan uji** → "Hapus catatan" (ketuk dua kali). Kesulitan **Easy**. Volume tidak relevan (tanpa suara) |
| Pembuka + persetujuan anak (§4) | 2 menit | Anak boleh berhenti kapan saja |
| Tugas A: Stage Pengantar | maks. 5 menit | **Jangan membantu** selama 3 menit pertama. Mulai stopwatch saat layar stage tampil |
| Tugas A2: **B08 "Jembatan Panjang"** (variabel) | maks. 6 menit | **Jangan menjelaskan kartu "Isi kotak"**; bantuan hanya menurut tangga bantuan (§5.3) |
| Tugas B: B09 "Kotak Berbentuk" | maks. 10 menit | Bantuan hanya menurut tangga bantuan (§5.3) |
| Tugas C: B10 "Timbangan Pasar" | maks. 10 menit | Sama |
| Tugas D: Pertanyaan pemahaman (§5.4) | 3 menit | Catat jawaban **kata demi kata** |
| Tugas E: Uji kertas Placement Test 1 (§7) | 5 menit | Dibacakan bila anak kesulitan membaca; catat bila dibacakan |
| Penutup | 2 menit | Pertanyaan "mau lanjut?" + kartu wajah |
| Setelah anak pergi | 3 menit | **Catatan uji → Salin**, tempel ke berkas `P#_catatan.json`, lalu hapus catatan |

**Peran:** idealnya 1 fasilitator + 1 pencatat. Bila sendirian, fokus pada lembar observasi; data waktu/klik sudah direkam oleh Catatan uji.

**Kode peserta:** P1–P5. **Nama anak tidak ditulis** di lembar observasi maupun berkas data.

---

## 2. Surat izin sekolah (contoh)

> Kepada Yth. Kepala Sekolah ______________________
>
> Dengan hormat, kami memohon izin melaksanakan uji coba prototipe permainan edukasi logika pemrograman "Kode Nusantara" kepada **5 siswa kelas 4–6**, pada hari/tanggal __________, pukul ______, di ruang __________.
>
> Setiap siswa bermain ±30 menit didampingi pengembang. Uji coba **tidak dinilai** dan tidak memengaruhi nilai sekolah. Kami **tidak mengumpulkan nama, foto, atau rekaman** (kecuali bila orang tua menyetujui secara tertulis). Data yang dicatat hanya waktu bermain, langkah di dalam game, dan catatan pengamatan dengan kode peserta.
>
> Setiap siswa membawa formulir persetujuan orang tua yang telah ditandatangani. Hasil uji coba dapat kami bagikan kepada sekolah bila diminta.
>
> Hormat kami, __________________ (nama, kontak)

---

## 3. Lembar informasi & persetujuan orang tua/wali

**Apa ini?** Uji coba permainan komputer untuk belajar logika pemrograman. Anak menyusun "kartu perintah" untuk menggerakkan robot di layar. Tujuannya menilai **permainannya**, bukan menilai anak.

**Apa yang dilakukan anak?** Bermain ±30 menit di laptop, menjawab beberapa pertanyaan singkat, dan mengerjakan 7 soal bergambar.

**Data apa yang dicatat?**
- Dicatat: waktu bermain, kartu yang disusun, berapa kali mencoba, jawaban pertanyaan (tanpa nama, memakai kode P1–P5).
- **Tidak** dicatat: nama, foto, suara, video, akun, alamat — kecuali Anda mencentang izin rekaman di bawah.
- Data disimpan di perangkat pengembang, hanya dipakai untuk memperbaiki permainan, dan dihapus paling lambat **___ bulan** setelah uji coba.

**Hak Anda dan anak:** keikutsertaan sukarela; anak atau Anda boleh berhenti kapan saja tanpa alasan; Anda boleh meminta data anak dihapus.

**Kontak:** __________________

| Pernyataan | Setuju |
|---|---|
| Saya mengizinkan anak saya mengikuti uji coba di atas | ☐ |
| Saya mengizinkan **rekaman layar** (tanpa wajah/suara) | ☐ (opsional) |
| Saya mengizinkan **rekaman suara** anak saat menjelaskan | ☐ (opsional) |

Nama anak: ______________ Kelas: ____ Nama orang tua/wali: ______________
Tanda tangan: ______________ Tanggal: ______________

> Formulir ini disusun mengikuti prinsip UU No. 27/2022 (persetujuan orang tua untuk data anak, data minimal, hak menghapus). **Bukan nasihat hukum**; sesuaikan dengan kebijakan sekolah atau kampus bila ada.

---

## 4. Persetujuan anak (diucapkan)

> "Halo! Aku sedang membuat permainan dan butuh bantuanmu untuk mengujinya. Yang diuji itu **permainannya**, bukan kamu — tidak ada jawaban yang salah. Kalau ada yang membingungkan, itu salah permainannya, dan itu justru yang ingin aku temukan. Kamu boleh berhenti kapan saja. Mau mencoba?"

Lanjut hanya bila anak setuju. Centang di lembar observasi.

---

## 5. Skrip fasilitator

### 5.1 Aturan emas
- **Jangan menunjuk layar dan jangan menyentuh mouse.**
- Pertanyaan pancingan yang netral: "Apa yang kamu pikirkan sekarang?", "Menurutmu Bit akan melakukan apa?", "Apa yang kamu cari?"
- Jangan mengatakan "benar"/"salah". Katakan "Oke" atau "Lanjutkan".
- Bila anak bertanya, kembalikan pertanyaannya: "Menurutmu bagaimana?" (kecuali pada tangga bantuan).

### 5.2 Kalimat pembuka tiap tugas
- **A:** "Ini permainannya. Coba mainkan sendiri seperti di rumah."
- **B dan C:** "Ini tantangan berikutnya." (Jangan menjelaskan aturannya.)

### 5.3 Tangga bantuan (catat setiap tingkat yang dipakai)
| Tingkat | Kapan | Yang dikatakan |
|---|---|---|
| B0 | anak diam > 60 detik | "Apa yang sedang kamu pikirkan?" |
| B1 | macet > 3 menit | "Ada tombol 💡 di layar. Boleh dipakai kalau mau." |
| B2 | macet > 5 menit setelah B1 | Arahkan ke satu bagian layar: "Lihat bagian ini." |
| B3 | macet > 8 menit | Akhiri tugas dengan ramah: "Terima kasih, yang ini memang sulit. Kita lanjut ke yang berikutnya." |

**Pemakaian B1 ke atas = "dengan bantuan"** untuk kriteria "menyelesaikan tanpa bantuan". Membuka hint di dalam game atas inisiatif sendiri **bukan** bantuan fasilitator, tapi dicatat (Catatan uji juga mencatatnya).

### 5.4 Pertanyaan pemahaman (tugas D)
Tunjukkan B09 dalam keadaan awal.
1. "Kotak-kotak ini untuk apa?" *(kriteria Pemahaman P1)*
2. "Kenapa kotak bulat tidak mau diisi tulisan 'lima'?"
3. "Ada berapa ikan di peti?" *(F04; jangan memperbesar layar)*
4. "Siapa nama perahunya?" *(F04)*
5. Tunjukkan Stage Pengantar: "Kalau kamu memasang kartu **Maju**, Bit akan pergi ke mana? Tunjukkan dengan jari." *(F14)*

### 5.5 Penutup
- "Kalau ada waktu, kamu **mau lanjut** main ke pulau berikutnya, atau sudah cukup?" (Ya / Tidak)
- Tunjukkan 5 wajah (😞 🙁 😐 🙂 😄): "Mana yang seperti perasaanmu tadi?"
- "Bagian mana yang paling seru? Mana yang paling bikin bingung?"

---

## 6. Lembar observasi (satu per anak)

**Kode:** P__ · **Kelas:** __ · **Tanggal/jam:** ______ · **Perangkat:** ______ · **Persetujuan anak:** ☐ · **Rekaman:** ☐ tidak ☐ layar ☐ suara

### Tugas A — B01 Pengantar
| Ukuran | Isi |
|---|---|
| Waktu sampai lampu menyala (mm:ss) | |
| Tanpa bantuan fasilitator? (B1+ = tidak) | ☐ ya ☐ tidak |
| Tahu harus menyeret kartu tanpa diberi tahu? | ☐ ya ☐ setelah membaca dialog ☐ tidak |
| Membaca dialog Nek Urut? | ☐ dibaca ☐ dilewati ☐ ditekan "Lanjut" tanpa dibaca |
| Kejadian penting (kutipan) | |

### Tugas A2 — B08 "Jembatan Panjang" (variabel)
| Ukuran | Isi |
|---|---|
| Waktu sampai lampu (mm:ss) atau "tidak selesai" | |
| Tingkat bantuan tertinggi (B0–B3) | |
| Menemukan sendiri bahwa kartu "Isi kotak" bisa diketuk untuk mengubah angkanya? | ☐ ya, tanpa dialog ☐ setelah membaca dialog ☐ tidak |
| Pesan "Byur! … kurang panjang" muncul → anak paham penyebabnya? | ☐ ya ☐ tidak ☐ tidak muncul |
| Penjelasan anak: "angka di kotak itu apa?" (kata demi kata) | |

### Tugas B — B09 · Tugas C — B10
| Ukuran | B09 | B10 |
|---|---|---|
| Waktu selesai (mm:ss) atau "tidak selesai" | | |
| Tingkat bantuan tertinggi (B0–B3) | | |
| Hint di dalam game yang dibuka (1/2/3) | | |
| Pesan "Tidak muat!" muncul → anak paham penyebabnya? | ☐ ya ☐ tidak ☐ tidak muncul | — |
| Mencoba penjumlahan berulang dulu sebelum perkalian? | — | ☐ ya ☐ tidak |
| Ekspresi dominan | ☐ fokus ☐ senang ☐ bingung ☐ frustrasi ☐ bosan | ☐ fokus ☐ senang ☐ bingung ☐ frustrasi ☐ bosan |
| Kutipan penting | | |

### Tugas D — Pemahaman (kata demi kata)
| Pertanyaan | Jawaban anak | Penilaian |
|---|---|---|
| 1. Kotak untuk apa? | | ☐ menyimpan sesuatu/nilai ☐ lain |
| 2. Kenapa ditolak? | | ☐ menyebut jenis/bentuk ☐ lain |
| 3. Jumlah ikan | | ☐ 5 ☐ lain: __ |
| 4. Nama perahu | | ☐ Kenari ☐ tidak terbaca |
| 5. Arah Maju | | ☐ searah hadap Bit ☐ ke atas layar (ikon ⬆️) ☐ lain |

### Tugas E — Placement Test 1 (kertas)
| Soal | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Total |
|---|---|---|---|---|---|---|---|---|
| Benar (✓) / Salah (✗) / Tidak tahu (?) | | | | | | | | /7 |
| Dibacakan oleh fasilitator? ☐ ya ☐ tidak · Soal yang membuat bingung: ____ | | | | | | | | |

### Penutup
Mau lanjut: ☐ ya ☐ tidak · Wajah: 😞 🙁 😐 🙂 😄 · Paling seru: ______ · Paling membingungkan: ______

---

## 7. Placement Test 1 versi kertas

Pakai 7 soal di *Progression_Placement_Design.md* §4 (bahasa kartu, kotak berbentuk dengan ikon). Cetak satu soal per halaman dengan gambar kartu yang sama dengan di game, dan sertakan opsi "Aku belum tahu". Urutan soal diacak untuk tiap anak (catat urutannya).

---

## 8. Rekap & aturan keputusan (diisi setelah 5 anak)

| Kriteria (GDD §11) | Ambang lulus | Hasil | Lulus? |
|---|---|---|---|
| Onboarding P0 | ≥ 4/5 menyalakan lampu tanpa bantuan dalam ≤ 3 menit | __/5 | |
| Menyelesaikan tanpa bantuan | ≥ 4/5 per stage dalam ≤ 8 menit (B09 dan B10 dinilai terpisah) | 7: __/5 · 8: __/5 | |
| Pemahaman (P1) | ≥ 3/5 menjelaskan "kotak untuk apa" dengan kata sendiri | __/5 | |
| Keinginan bermain | ≥ 3/5 "mau lanjut" | __/5 | |
| Kontrol sentuh, Performa | — | **tidak dinilai** (playtest di laptop; menunggu uji HP) | — |
| *Tambahan:* keterbacaan B09 (F04) | ≥ 4/5 menghitung 5 ikan **dan** membaca "Kenari" | __/5 | |
| *Tambahan:* arah Maju (F14) | ≥ 4/5 menunjuk searah hadap Bit | __/5 | |

**Aturan keputusan:**
- **Go** = semua kriteria inti (4 baris pertama) lulus.
- **Go bersyarat** = 1 kriteria inti gagal tipis (kurang 1 anak) **dan** penyebabnya teridentifikasi jelas di lembar observasi → perbaiki, uji ulang ke ≥ 3 anak baru sebelum produksi.
- **No-go** = ≥ 2 kriteria inti gagal, atau "Pemahaman" gagal → ubah metafora/UI, ulangi playtest.
- **Hanya data anak nyata** yang boleh mengisi tabel ini. Hasil simulasi tidak boleh.

**Data yang menentukan F13–F16:**
| Temuan | Data penentu |
|---|---|
| F13 Hard = pengecoh saja | Belum bisa dinilai di playtest Easy; keputusan desain, lihat dokumen analisis |
| F14 Ikon ⬆️ Maju | Pertanyaan D5 |
| F15 Hint 3 (sudah parsial di B08–B10) | Berapa anak membuka hint 3, dan apakah hint itu **cukup** untuk menyelesaikan stage (bila banyak anak tetap macet setelah hint 3, hint terlalu kurus) |
| F16 Modal menutupi lampu | Ekspresi saat lampu menyala; apakah anak sempat melihatnya |

---

## 9. Status validitas build uji (diperbarui 12 Nov)

**Celah variabel sudah ditutup di prototipe.** Urutan kurikulum B01 → **B08 (Isi kotak, variabel)** → B09 (tipe) → B10 (matematika) kini ada utuh di prototipe, sehingga anak tidak lagi bertemu kartu "Isi kotak" tanpa diajar. Label layar mengikuti ID kurikulum (B01, B08, B09, B10); label lama "Stage 7/8" tidak dipakai lagi.

**Sisa batasan:**
- Stage B02–B07 (belok, aksi, kondisional) **belum ada** di prototipe. Anak tidak pernah diajar belok atau Jika; B08–B10 tidak memakainya, sehingga tidak mengganggu, tetapi hasilnya hanya berlaku untuk jalur B01 → B08 → B09 → B10.
- B08 sengaja memberi kartu "Isi kotak" bernilai **1** (salah) agar pemain harus mengubahnya. Jika anak tidak menemukan cara mengubahnya, itu menjadi data utama hipotesis H1 (Simulasi §2).

### 9.1 Pembaruan 15 Nov — build v6 memuat seluruh Beginner (B01–B13)
Batasan "B02–B07 belum ada" di atas **tidak berlaku lagi**: jalur lengkap B01 → B13 ada di prototipe v6. Sesi 5 anak sebaiknya tetap memakai jalur pendek yang sama dengan rencana awal (B01 → B08 → B09 → B10) **ditambah** satu dari dua jalur berikut, agar sesi tidak melebihi waktu:
- **Jalur Jika:** B05 → B06 (menguji kartu Jika dan "selain itu").
- **Jalur Aksi:** B03 → B04 (menguji Ambil/Taruh/Tekan dan rute panjang).

Tambahan untuk lembar observasi (catat dengan tanda ✓/✗ dan kutipan singkat):
1. **B05:** Apakah anak membuka picker kartu Jika sendiri? Apa yang ia katakan saat membaca pesan *"Berhasil untuk satu keadaan, tapi belum untuk keadaan lain"*: paham, bingung, atau merasa dihukum?
2. **B05–B06:** Apakah anak menjelaskan (dengan kata sendiri) mengapa satu susunan harus berhasil untuk dua keadaan?
3. **B06:** Apakah anak menemukan "selain itu" tanpa hint? Pada hint ke berapa?
4. **B04:** Apakah anak bolak-balik mengantar satu peti (tidak sadar Bit bisa membawa banyak)? Berapa kartu yang dipakai?
5. **B07 (jika waktu cukup):** titik anak berhenti atau menyerah; jumlah kartu Jika yang berhasil ia susun.
Kriteria Go/No-Go di §8 tidak berubah. Keputusan "buat kartu bersarang sebelum Junior" **tidak** bisa diambil dari data ini, karena kartu Jika di prototipe belum bersarang (Dokumentasi_Testing §15.5).

### 9.2 Pembaruan 17 Nov — build v10: progres, kunci tahap, catatan yang bisa diputar ulang
- **Sebelum sesi:** buka menu → centang **"Buka semua tahap (pengajar)"** bila jalur sesi tidak dimulai dari B01, lalu tekan **"Hapus progres"** (dua ketukan) agar tiap anak mulai dari keadaan bersih.
- **Catat kode sesi** (panel Catatan uji) di lembar observasi tiap anak.
- **Sesudah sesi:** tekan **"Unduh .json"** (atau Salin bila unduhan diblokir) dan simpan berkasnya bersama lembar observasi. Jangan menulis nama anak di berkas; pakai kode anak (A1–A5).
- **Memutar ulang kejadian aneh:** salin tautan "ulang" dari jejak percobaan di catatan, lalu buka di perangkat yang sama untuk melihat keadaan acak yang sama persis.


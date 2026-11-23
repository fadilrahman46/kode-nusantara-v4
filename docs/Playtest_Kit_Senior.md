# Perangkat Playtest — Kode Nusantara Senior (SE01–SE10)

**Versi:** 1.0 (19 November 2026) · **Build yang diuji:** prototipe v17 (lihat `kode-nusantara-prototipe.html`; jalan tanpa internet)
**Peserta:** 5 orang, siswa SMA kelas 11–12 atau mahasiswa tahun pertama · **Perangkat:** laptop (satu peserta boleh di HP) · **Durasi:** ±45 menit per orang

> Dokumen ini berisi **instrumen**. Tidak ada satu pun angka di sini yang berasal dari pemain nyata. Tabel hasil sengaja dikosongkan. Hasil uji otomatis (1.300+ kasus) hanya membuktikan kode tidak rusak, **bukan** bahwa tahap ini mengajar.

---

## 1. Yang ingin dijawab (urut dari yang paling menentukan)

| # | Pertanyaan | Mengapa penting |
|---|---|---|
| Q1 | Apakah peserta paham **mengapa** jawabannya benar (bukan sekadar lulus)? | Lulus bisa karena coba-coba; pemahaman tidak |
| Q2 | Di tahap mana mereka berhenti, dan apa yang mereka katakan saat itu? | Menunjukkan konsep atau teks yang gagal |
| Q3 | Apakah SE09 (Jalur Kapal) terasa sebagai tebakan? | Hanya 2 dari 155 program ≤ 3 kartu yang lulus (1,3%): paling mudah ditebak di Senior |
| Q4 | Apakah pindah dari Middle B ke SE01 terasa terlalu tinggi? | Loncatan tema (kartu "sistem") belum diuji |
| Q5 | Apakah menunggu animasi (SE04 ±8 detik, SE10 ±5 detik) mengganggu? | Durasi sudah diukur, tapi tolerasi pemain belum |

## 2. Persiapan

1. Buka prototipe → **Catatan uji → Hapus catatan** (ketuk dua kali).
2. Menu **Pilih tahap → centang "Buka semua tahap (pengajar)"** supaya peserta tidak perlu menamatkan 47 tahap lebih dulu. Kesulitan **Easy**.
3. **Pastikan peserta pernah memainkan minimal satu tahap Middle B** (mis. MB05) sebagai pemanasan 5 menit, agar kartu dan papan tidak asing. Catat bila tidak.
4. Persetujuan: mahasiswa dewasa cukup persetujuan lisan peserta (teks di §3). **Siswa SMA di bawah 18 tahun butuh izin orang tua/wali**; pakai surat dan lembar informasi di `Playtest_Kit_P0_P1.md` §2–§3 (ganti kata "SD" dengan "SMA"). Nama tidak ditulis di mana pun; pakai kode **S1–S5**.

## 3. Pembuka (dibacakan)

"Ini game latihan berpikir ala programmer. Yang diuji **game-nya**, bukan kamu. Tidak ada jawaban salah. Tolong **berpikir keras**: ucapkan apa yang kamu pikirkan. Kamu boleh berhenti kapan saja. Kalau macet, aku tidak akan membantu dulu; aku hanya bertanya."

## 4. Urutan tugas

| Tugas | Tahap | Maks. | Yang diamati |
|---|---|---|---|
| T0 | MB05 (pemanasan) | 5 mnt | Kenal papan dan kartu? Catat saja, tidak dinilai |
| T1 | **SE01** Loket Pesanan | 6 mnt | Apakah membaca jawaban loket di dasbor, atau menebak? |
| T2 | **SE04** Mesin Waktu | 10 mnt | Mengerti "simpan sebelum terapkan"? Jumlah Jalankan |
| T3 | **SE07** Bug Tersembunyi | 10 mnt | Mengerti mengapa bug dibuang, bukan diterapkan ulang? |
| T4 | **SE09** Jalur Kapal | 6 mnt | Berapa percobaan sampai lulus? Menebak atau bernalar? |
| T5 | **SE10** Kapal Perdana | 15 mnt | Menyusun 12 kartu; di mana macet? |
| T6 | Pertanyaan pemahaman (§6) | 5 mnt | Jawaban kata demi kata |

Tahap lain (SE02, SE03, SE05, SE06, SE08) **tidak dipakai** di playtest pertama supaya sesi tetap ≤ 45 menit. Bila peserta cepat, tambahkan SE05 setelah T3.

## 5. Tangga bantuan (catat tiap tingkat yang dipakai)

| Tingkat | Kapan | Yang dikatakan |
|---|---|---|
| B0 | diam > 60 detik | "Apa yang sedang kamu pikirkan?" |
| B1 | macet > 3 menit | "Ada tombol 💡 di layar. Boleh dipakai." |
| B2 | macet > 5 menit setelah B1 | Tunjuk satu bagian layar: "Lihat dasbor ini." |
| B3 | macet > 8 menit | Akhiri ramah: "Terima kasih, yang ini memang sulit. Kita lanjut." |

B1 ke atas = **dengan bantuan**. Membuka hint di dalam game atas inisiatif sendiri bukan bantuan, tetapi dicatat.

## 6. Pertanyaan pemahaman (tanpa layar, kata demi kata)

| Kode | Pertanyaan | Jawaban yang menunjukkan paham |
|---|---|---|
| D1 | "Di Mesin Waktu tadi, kenapa harus menyimpan versi **sebelum** menerapkan perubahan?" | Titik simpan adalah tempat kembali; kalau disimpan sesudah, bug ikut tersimpan |
| D2 | "Kenapa di Bug Tersembunyi bug-nya dibuang, bukan diterapkan lagi?" | Perubahan itu penyebab rusak; perubahan baik sesudahnya perlu dipertahankan |
| D3 | "Apa bedanya **gerbang** dan **rollback**?" | Gerbang menahan cacat sebelum tayang; rollback menarik rilis yang sudah tayang |
| D4 | "Kenapa di Kapal Perdana kita tidak langsung kirim ulang ke /cadangan setiap kali?" | Hanya bila stok habis; kalau tidak, pesanan ganda |
| D5 | "Pernah dengar Git atau API? Menurutmu tadi mirip apa?" | Jawaban bebas. Catat apakah peserta menghubungkan ke dunia nyata |

Skor tiap pertanyaan: **0** salah/tidak tahu · **1** sebagian (benar tapi tanpa alasan) · **2** benar dengan alasan.

## 7. Lembar observasi (satu per peserta)

Peserta: S__ · Kelas/tahun: ____ · Pernah memakai Git: Y / T · Perangkat: ____ · Jam mulai: ____

| Tugas | Waktu sampai lulus | Jumlah Jalankan | Bantuan tertinggi (B0–B3) | Hint dibuka (1/2/3) | Menyelesaikan? | Titik macet + ucapan peserta |
|---|---|---|---|---|---|---|
| T1 SE01 | | | | | Y / T | |
| T2 SE04 | | | | | Y / T | |
| T3 SE07 | | | | | Y / T | |
| T4 SE09 | | | | | Y / T | |
| T5 SE10 | | | | | Y / T | |

Pemahaman: D1 __ · D2 __ · D3 __ · D4 __ · D5 (catatan): ______________________

Pengamatan khusus: ☐ membaca dasbor sebelum menjalankan ☐ menebak urutan kartu ☐ mengabaikan pesan gagal ☐ mengeluh menunggu animasi ☐ bingung dengan istilah (tulis): ______

Setelah selesai: **Catatan uji → Salin**, tempel ke berkas `S#_catatan.json`, lalu **Hapus catatan**.

## 8. Rekap dan aturan keputusan (diisi setelah 5 peserta)

| Kriteria | Ambang lulus | Hasil | Lulus? |
|---|---|---|---|
| Menyelesaikan tanpa bantuan (T2 dan T3 dinilai terpisah) | ≥ 4/5 per tahap dalam waktu maksimum | T2 __/5 · T3 __/5 | |
| Menyelesaikan SE10 (boleh dengan bantuan ≤ B1) | ≥ 3/5 | __/5 | |
| Pemahaman | ≥ 3/5 peserta mendapat skor ≥ 6 dari 8 (D1–D4) | __/5 | |
| SE09 bukan tebakan | ≥ 4/5 lulus dalam ≤ 4 Jalankan **dan** menjawab D3 skor ≥ 1 | __/5 | |
| Durasi animasi tidak mengganggu | ≤ 1/5 mengeluh | __/5 | |
| Ingin lanjut | ≥ 3/5 "mau lanjut" | __/5 | |

**Aturan keputusan**
- **Go** = semua baris lulus.
- **Go bersyarat** = satu baris gagal tipis (kurang 1 orang) dan penyebabnya jelas di lembar observasi: perbaiki, uji ulang ke ≥ 3 orang baru.
- **No-go** = ≥ 2 baris gagal, atau baris "Pemahaman" gagal: rancang ulang tahap yang gagal sebelum menambah fitur Senior.
- Hanya data orang nyata yang boleh mengisi tabel ini.

**Data penentu perbaikan**

| Temuan | Tindakan bila terbukti |
|---|---|
| SE09 lulus dengan ≥ 5 Jalankan atau D3 skor 0 | Rancang ulang SE09 (tambah kartu "pantau" dan syarat anggaran) |
| ≥ 3/5 macet di SE01 | Jembatan dari Middle B kurang: tambah satu tahap pengantar kartu "sistem" |
| Peserta menebak urutan SE10 | Tambah pengecoh di palet atau kurangi hint 3 |
| D1 atau D2 skor rendah walau lulus | Teks pesan gagal tidak menjelaskan **mengapa**; tulis ulang pesan itu |
| Keluhan animasi | Tambah tombol percepat/langkah-langkah untuk Senior |

## 9. Status validitas build uji

- Build v17: SE01–SE10, dasbor mengikuti mode terang/gelap, catatan langkah dibacakan lewat daerah aria-live.
- Terverifikasi kode (bukan pemain): SE10 tidak punya jalan pintas tanpa Jika-habis, Jika-uji-gagal, Simpan, Buat peti, atau memasukkan bahan (pencarian ruang keadaan penuh, 252.207 keadaan).
- Belum diverifikasi: seluruh asumsi pedagogis. Itulah gunanya dokumen ini.

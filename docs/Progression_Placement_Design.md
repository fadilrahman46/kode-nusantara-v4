# Sistem Progresi, Placement Test, Badge & Sertifikat

> **v0.7 (12 Nov 2026):** daftar stage lengkap 6 mode ada di *Kurikulum_Stage_v0.3.md* (Beginner 13, Junior 14). Test 2 soal 4 diganti pohon (soal "syarat search biner" dilebur menjadi premis soal 3). Test 1 tidak berubah.

**Proyek:** Kode Nusantara | **Fase:** 2 — Pre-Production | **Versi:** v0.7
Perubahan dari v0.5: perbaikan hasil review — Test 1 memakai bahasa kartu game & soal 5 diganti; Test 1 ditawarkan setelah Stage Pengantar; aturan riddle anti-blokir; aturan hint & tombol Langkah di Hard; batas usia SD kelas 4.
Perubahan dari v0.4: urutan Middle A → B dikunci; tidak ada lompat sebagian di Test 2; aturan tes ulang ditambahkan (bagian 5a).
Perubahan dari v0.3: materi tiap mode disusun ulang mengikuti prasyarat; Middle dibagi menjadi Middle A dan Middle B; Junior Complete wajib sebelum Middle; Test 1 dan Test 2 ditulis ulang sesuai materi baru.

---

## 1. Fokus game

**Logika pemrograman dan logika sistem, tidak terikat bahasa.** Puzzle dan riddle dalam kerangka RPG: peta dunia, wilayah per mode, NPC mentor, dan misi.

- **Stage** = satu puzzle. **Misi** = rangkaian stage + riddle NPC dalam satu wilayah.
- **Mode selesai** = semua stage selesai + semua gerbang misi **dilewati**. Riddle gerbang tidak pernah memblokir: setelah 3 kali salah, gerbang terbuka tanpa bonus misi (lihat GDD MVP §3.8).

## 2. Materi per mode

| Mode | Materi | Prasyarat | Metafora dunia |
|---|---|---|---|
| **Beginner** | Urutan perintah, arah, aksi (ambil/taruh/tekan), kondisional (Jika, selain itu), variabel, tipe data, matematika dasar, pembanding & sakelar | — (batas bawah usia: **SD kelas 4**) | Robot & kartu, kotak berlabel & berbentuk, timbangan |
| **Junior** | Perulangan (termasuk bersarang dan bersyarat), **syarat gabungan (TIDAK/DAN/ATAU)**, fungsi (parameter, nilai keluaran), list (indeks, iterasi) | Beginner Complete **atau** Test 1 = 7/7 | Ulangi-kartu, mesin input-output, rak bernomor |
| **Middle A** | Rekursi (termasuk komposisi fungsi), pencarian (linear, biner), struktur data (tumpukan, antrean, pohon) | **Junior Complete** | Cermin dalam cermin, perpustakaan, tumpukan piring, loket |
| **Middle B** | OOP: cetakan & objek, atribut & method, enkapsulasi, pewarisan, override, polimorfisme | Middle A Complete | Cetakan, silsilah, brankas |
| **Senior** | API, Versioning, Container, Deploy | Middle B Complete **atau** Test 2 = 10/10 | Loket pesanan, mesin waktu, peti kemas, kapal |
| **Expert** | Sistem lanjut & otomasi | **Semua stage & misi Senior** | Pabrik, ban berjalan, menara pengawas |

**KEPUTUSAN:** **Middle A (algoritma) didahulukan sebelum Middle B (OOP)** karena melanjutkan langsung materi Junior: fungsi → rekursi, list → search & struktur data. OOP lalu menjadi jembatan ke Senior (API mengirim dan menerima "objek" data).

**Aturan tetap:** Junior **tidak bisa dilompati** oleh siapa pun. Test 1 hanya bisa melompati Beginner, dan Test 2 hanya bisa melompati Middle A + B.

## 3. Alur progresi

```
PLACEMENT TEST 1 (7 soal · materi Beginner)
 ├─ 7/7 → Badge "Junior Programmer" ───────────────┐
 └─ ≤6  → Badge "Beginner Programmer"              │
          MODE BEGINNER → "Beginner Complete"      │
                                                   ▼
                       MODE JUNIOR → "Junior Complete"   ← syarat wajib
                                                   ▼
                    PLACEMENT TEST 2 (10 soal · materi Middle A + B)
 ├─ 10/10 → Badge "Senior Programmer" ─────────────┐
 └─ ≤9    → Badge "Middle Programmer"              │
            MODE MIDDLE A → "Middle A Complete"    │
            MODE MIDDLE B → "Middle B Complete"    │
                                                   ▼
             MODE SENIOR → "Senior Complete" + Sertifikat Programmer
                                                   ▼
             MODE EXPERT → "Expert Complete" + Sertifikat Expert + Skor Akhir
```

## 4. Placement Test 1 — 7 soal (materi Beginner)

> **Digantikan 17 Nov 2026** oleh dokumen *Rancangan Placement Test dan Tes Ulang* (https://claude.ai/artifact/3yJYN4XwZhbSjdCuZYJRq8): soal 6 dan 7 diganti, 21 butir varian, Test 2 ditulis ulang tanpa notasi, aturan tes ulang dan data dirinci. Teks di bawah disimpan sebagai riwayat.

**Waktu penawaran:** setelah Stage Pengantar (Beginner 1), dibingkai sebagai **"Ujian Si Teka"**. Pemain boleh memilih "Nanti saja".

**Bahasa soal:** semua soal memakai **kartu, kotak, dan dunia yang sama dengan game**. Tidak ada notasi teks seperti `←`. Kotak berbentuk diberi ikon: 🔢 bulat = angka, 🔤 persegi = teks, ⏻ sakelar = nyala/mati. Setiap soal punya opsi "Aku belum tahu". Urutan soal dan pilihan diacak. ✓ = jawaban benar.

**1. Urutan & arah.** Bit menghadap ke atas. Bintang ada 2 petak di sebelah kanan Bit. Susunan kartu yang benar:
a) [Maju] [Maju] · b) **[Belok kanan] [Maju] [Maju] ✓** · c) [Belok kiri] [Maju] [Maju] · d) [Maju] [Belok kanan] [Maju]

**2. Kondisional.** Papan Program: [Jika *Ada tembok?* → Belok kanan | selain itu → Maju]. Ada tembok di depan Bit. Bit akan…
a) Maju · b) **Belok kanan ✓** · c) Berhenti · d) Belok kiri

**3. Variabel (mengubah isi).** Papan Program: [Isi kotak 🔢apel dengan 3] [Ubah kotak 🔢apel + 2]. Isi kotak apel sekarang?
a) 3 · b) 2 · c) **5 ✓** · d) 3 dan 2

**4. Variabel (menimpa isi).** Papan Program: [Isi kotak 🔢nilai dengan 4] [Isi kotak 🔢nilai dengan 10]. Isi kotak nilai sekarang?
a) 4 · b) 14 · c) **10 ✓** · d) 4 dan 10

**5. Tipe data.** Kotak 🔢 bulat hanya menerima angka. Benda mana yang **ditolak** kotak ini?
a) 12 · b) 0 · c) **Kartu tulisan "dua belas" ✓** · d) 7

**6. Matematika dasar (urutan operasi).** Papan Program: [Isi kotak 🔢hasil dengan 2 + 3 × 4]. Isi kotak hasil?
a) 20 · b) **14 ✓** · c) 24 · d) 9

**7. Gabungan.** Papan Program: [Isi kotak 🔢skor dengan 10] [Jika *skor > 5* → Ubah kotak skor − 3] [Ubah kotak skor × 2]. Isi akhir kotak skor?
a) 20 · b) **14 ✓** · c) 7 · d) 17

**Klasifikasi:** 7/7 → Junior Programmer · ≤6 → Beginner Programmer

**Catatan validitas:** Stage Pengantar hanya memperkenalkan kartu Maju. Pemain yang belum pernah melihat kotak berbentuk tetap bisa menjawab soal 3–7 karena setiap kotak diberi ikon dan nama jenisnya. Ini diuji ulang saat validasi butir.

## 5. Placement Test 2 — 10 soal (materi Middle A + Middle B)

Hanya bisa diambil setelah **Junior Complete**. Soal 1–5 menguji Middle A dan soal 6–10 menguji Middle B.

**1. Rekursi.** Mesin `hitung(n)`: jika n = 0 keluarkan 0, jika tidak keluarkan n + `hitung(n − 1)`. Berapa `hitung(4)`?
a) 4 · b) **10 ✓** · c) 24 · d) Tidak pernah berhenti

**2. Rekursi tanpa titik berhenti.** Mesin `turun(n)`: tampilkan n, lalu jalankan `turun(n − 1)`. Tidak ada aturan berhenti. Apa yang terjadi pada `turun(3)`?
a) Tampil 3, 2, 1 · b) Tampil 3, 2, 1, 0 · c) Hanya tampil 3 · d) **Tidak pernah berhenti ✓**

**3. Search biner.** Buku berisi 1.000 nama tersusun alfabetis. Kamu mencari dengan selalu membuka bagian tengah, lalu membuang separuh yang tidak mungkin. Paling banyak berapa kali membuka?
a) **Sekitar 10 ✓** · b) Sekitar 100 · c) Sekitar 500 · d) 1.000

**4. Pohon.** Kakek punya dua anak: Ayah dan Paman. Ayah punya dua anak: Aku dan Adik. Penelusuran: *kunjungi diri sendiri dulu, lalu anak-anaknya dari kiri ke kanan* (anak kiri Kakek = Ayah; anak kiri Ayah = Aku). Urutan kunjungannya?
a) **Kakek, Ayah, Aku, Adik, Paman ✓** · b) Aku, Adik, Ayah, Paman, Kakek · c) Kakek, Ayah, Paman, Aku, Adik · d) Ayah, Kakek, Paman, Aku, Adik

**5. Tumpukan vs antrean.** Tumpukan piring dan antrean loket sama-sama diisi A, lalu B, lalu C. Lalu masing-masing diambil 2 kali. Yang tersisa di tumpukan dan di antrean?
a) **Tumpukan: A · Antrean: C ✓** · b) Tumpukan: C · Antrean: A · c) Keduanya A · d) Keduanya C

**6. Objek mandiri.** Dari cetakan `Kucing` dibuat 3 kucing. Warna kucing pertama diubah menjadi hitam. Warna kucing kedua…
a) Ikut menjadi hitam · b) **Tidak berubah ✓** · c) Menjadi tidak berwarna · d) Cetakannya ikut berubah

**7. Enkapsulasi.** Saldo di brankas `Rekening` hanya bisa diubah lewat `setor(jumlah)`, yang menolak jumlah negatif. Saldo awal 50. Jalankan `setor(−20)`, lalu `setor(30)`. Saldo sekarang?
a) 60 · b) **80 ✓** · c) 30 · d) 50

**8. Pewarisan & override.** `Hewan` punya `makan()`. `Burung` mewarisi `Hewan` dan menambah `terbang()`. `Pinguin` mewarisi `Burung`, tapi mengganti `terbang()` menjadi "tidak bisa terbang". Objek pinguin bisa…
a) `makan()` saja · b) **`makan()` dan `terbang()` versi pinguin ✓** · c) `makan()` dan `terbang()` versi burung · d) Tidak bisa apa-apa

**9. Polimorfisme.** `Kucing`, `Anjing`, dan `Bebek` mewarisi `Hewan`, dan masing-masing mengganti `bersuara()`. Rak berisi [kucing, anjing, bebek]. Untuk setiap isi rak: `bersuara()`. Hasilnya?
a) **Meong, Guk, Kwek ✓** · b) Suara Hewan tiga kali · c) Meong tiga kali · d) Error

**10. Desain.** Game dengan 50 jenis musuh: semua bisa bergerak dan diserang, tapi cara menyerangnya berbeda. Rancangan terbaik?
a) 50 cetakan terpisah yang saling menyalin isinya · b) **Satu cetakan `Musuh` dasar; tiap jenis mewarisinya dan mengganti `serang()` ✓** · c) Satu cetakan dengan 50 cabang "jika jenis = …" · d) Tanpa cetakan, tulis setiap musuh satu per satu

**Klasifikasi:** 10/10 → Senior Programmer · ≤9 → Middle Programmer (mulai dari Middle A).
**KEPUTUSAN:** tidak ada lompat sebagian. Test 2 berlaku semua-atau-tidak sama sekali.

## 5a. Tes ulang

**KEPUTUSAN:** tes ulang diizinkan untuk Test 1 dan Test 2.

Aturan pelaksanaan (**dikunci**):

| Aturan | Nilai | Alasan |
|---|---|---|
| Syarat tes ulang | Selesaikan **3 stage** di mode tempat pemain ditempatkan, **dihitung setelah penempatan**. Percobaan pertama yang ditunda ("Nanti saja") tidak butuh syarat | Mencegah tes ulang beruntun hanya untuk menebak; pemain juga sempat belajar dulu |
| Jumlah maksimum | **2 kali** per tes (total 3 percobaan) | Setelah itu pemain lanjut lewat jalur normal |
| Soal | **Varian berbeda** dari bank soal; tidak ada soal yang sama dengan percobaan sebelumnya | Mencegah hafalan jawaban |
| Kebutuhan bank soal | **3 varian per soal** → Test 1: 21 butir, Test 2: 30 butir | Cukup untuk 3 percobaan tanpa pengulangan |
| Skor & badge | Hanya percobaan terakhir yang menentukan; percobaan gagal tidak mengurangi skor | Tes ulang tidak boleh terasa sebagai hukuman |
| Jika lulus saat tes ulang | Pemain langsung pindah ke mode tujuan; stage yang sudah dimainkan tetap tercatat skornya | — |

**Risiko:** tanpa varian soal, tes ulang membuat Test 1 dan Test 2 bisa dilewati dengan menghafal. **Varian soal adalah syarat wajib sebelum fitur ini dirilis.**

## 6. Easy / Medium / Hard

Layout stage **sama** untuk ketiga tingkat kesulitan; hanya parameternya yang berubah.

| Parameter | Easy | Medium | Hard |
|---|---|---|---|
| Kartu/komponen tersedia | Yang dibutuhkan + 1 pengecoh | + 3 pengecoh | Semua |
| Hint tingkat 1 (riddle) | Gratis | Gratis | Gratis |
| Hint tingkat 2 (arah konsep) | Gratis | −10% | −15% |
| Hint tingkat 3 (contoh parsial) | −10% | −10% | Tidak tersedia |
| Target 3 bintang | Longgar | Sedang | Optimal |
| Riddle gerbang | Pilihan ganda | Pengecoh mirip | Susun ubin jawaban (tanpa keyboard) |
| Tombol Langkah | Ya | Ya | Ya, tapi pengali stage turun ke ×1.25 jika dipakai *(v7; sebelumnya ×1.75)* |
| Pengali skor | ×1.0 | ×1.5 | ×1.5 *(sementara v7; target ×2.0 bila varian data Sulit ada)* |

Kriteria bintang ditentukan **per stage** (templat Beginner dan Junior ada di GDD MVP §3.10). Stage acak dinilai terhadap semua seed uji.

Tanpa timer. Tingkat kesulitan boleh diganti per stage.

## 7. Skor

```
Skor stage = Dasar(mode) × Pengali(kesulitan) × (bintang / 3) × (1 − pengurangan hint berbayar)
```

| Mode | Beginner | Junior | Middle A | Middle B | Senior | Expert |
|---|---|---|---|---|---|---|
| Dasar per stage | 100 | 150 | 200 | 200 | 250 | 300 |
| Jumlah stage (*Kurikulum_Stage_v0.3.md*) | 13 | 14 | 10 | 10 | 10 | 10 |

- Mode yang dilompati karena lulus tes: kredit setara **Medium, 2 bintang** (`ASUMSI:` perlu di-tuning). Mode itu tetap bisa dimainkan untuk menaikkan skor.
- Bonus misi: `ASUMSI:` +10% dari total skor stage di wilayah itu; tidak diberikan jika gerbang dibuka lewat aturan anti-blokir (bisa diulang untuk mendapatkannya).
- Skor yang dihitung adalah skor terbaik per stage.

## 8. Badge

| Badge | Syarat |
|---|---|
| Beginner Programmer / Junior Programmer | Hasil Test 1 |
| Beginner Complete · Junior Complete | Mode selesai |
| Middle Programmer / Senior Programmer | Hasil Test 2 |
| Middle A Complete · Middle B Complete | Mode selesai |
| Senior Complete · Expert Complete | Mode selesai |
| (Opsional) Master Easy/Medium/Hard per mode | Semua stage satu mode di tingkat kesulitan itu |

## 9. Sertifikat

| Sertifikat | Syarat | Isi |
|---|---|---|
| **Programmer** | Senior Complete | Nama, jalur badge, skor Beginner–Senior, predikat, tanggal |
| **Expert** | Expert Complete | Nama, jalur lengkap, skor akhir total, predikat, tanggal |

Predikat dibanding skor maksimum (semua Hard, 3 bintang, tanpa hint): **Emas ≥80%**, **Perak 60–79%**, **Perunggu <60%**.

**Privasi:** nama diketik saat mencetak, sertifikat dibuat di perangkat, dan nama tidak disimpan. Sertifikat tidak bisa diverifikasi pihak lain tanpa backend.

## 10. Senior & Expert — metafora puzzle

| Topik | Metafora | Contoh puzzle |
|---|---|---|
| API | Loket pesanan | Susun permintaan (alamat, aksi, data); baca kode jawaban; perbaiki permintaan yang ditolak |
| Versioning | Mesin waktu & cabang | Selesaikan konflik saat dua cabang digabung; kembalikan ke versi sebelum bug |
| Container | Peti kemas | Kemas bahan yang benar agar aplikasi jalan di semua pulau; bedakan cetak-biru (image) dan peti yang jalan (container) |
| Deploy | Kapal dari dermaga uji ke pelabuhan | Urutkan build → uji → staging → produksi; putuskan kapan rollback |
| Otomasi & trigger | Pabrik bersensor | Rangkai alur pesanan → kemas → kirim → notifikasi tanpa campur tangan manual |
| CI/CD | Ban berjalan | Temukan tahap pipeline yang meloloskan bug |
| Queue & worker, scaling, cache, monitoring | Loket, pintu tol, rak cepat, menara pengawas | Atur pekerja, tambah server, pilih isi cache, tangani server gagal |

## 11. Risiko desain

1. **Middle A adalah lompatan kesulitan terbesar.** Rekursi adalah titik drop-off klasik. Mitigasi: 2–3 stage pengantar visual sebelum rekursi berbentuk angka.
2. **Test 2 lebih lebar** (dua mode, 10 soal, wajib 100%). False negative pada pemain mampu ≈ 40% per percobaan; dengan 3 percobaan turun menjadi ≈ 6%.
3. **Beginner untuk SD kelas 4:** variabel dan matematika harus selalu terikat ke aksi robot, bukan hitungan di kertas, agar tidak terasa seperti PR matematika. Kondisional di Beginner hanya boleh satu titik keputusan per stage, karena perulangan baru diajarkan di Junior.
4. **Senior/Expert berisiko menjadi hafalan istilah.** Prototipe 1 stage Versioning + 1 stage Container dulu.
5. **Scope:** 6 mode, ±62 stage, misi, dan 2 tes. MVP tetap **Test 1 + Beginner + Junior**.
6. **Bank soal harus 3× lebih besar** (51 butir) agar tes ulang tidak bisa dihafal. Ini pekerjaan konten tambahan untuk MVP: 21 butir Test 1.
7. Semua butir soal belum divalidasi; uji ke 30–50 siswa sebelum rilis.

---

## Catatan implementasi (v21, 20 November 2026)

- **Test 2 dibangun** sesuai *Rancangan Placement Test dan Tes Ulang* (17 Nov): 10 konsep, 3 varian, lulus 10/10, ditawarkan di layar hasil J14 dan di menu setelah semua Junior selesai, tes ulang setelah 3 tahap Middle baru, maksimum 3 percobaan, hasil terbaik berlaku. Varian B dan C ditulis di v21 (dokumen rancangan hanya memuat varian A). Soal ditampilkan sebagai blok teks berlabel, bukan kartu bergambar, karena kartu Middle A/B berbentuk kartu setelan, bukan kartu papan Beginner.
- **Test 3 (Ujian Expert) adalah usulan baru**, bukan bagian rancangan di atas. Dokumen ini menyatakan Expert hanya terbuka lewat semua tahap Senior. Test 3 membuka EX01 saja (8 konsep Senior, 3 varian, lulus 8/8, aturan tes ulang sama) dan hanya bisa diambil bila Senior sudah terbuka. Bila pemilik menolak jalur ini, cukup menyembunyikan tombol #menuTest3 dan mengembalikan satu baris di `lockReason`.
- Semua butir belum divalidasi ke pemain. Kesetaraan tiga varian per konsep adalah klaim rancangan, bukan data.


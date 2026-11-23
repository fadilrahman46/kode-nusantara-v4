# Kurikulum & Daftar Stage v0.3 — Kode Nusantara (6 mode)

**Tanggal:** 12 November 2026 · **Sumber kebenaran mesin:** `design_lint/spec_v0.3.json` · **Pemeriksa:** `design_lint/lint.py`
**Status:** Beginner & Junior = desain revisi (prototipe memuat 3 stage). **Middle A, Middle B, Senior, Expert = DRAFT yang belum pernah dilihat pemain dan tidak punya prototipe.** Lolos pemeriksa berarti *konsisten secara internal*, bukan *terbukti bagus*.

## 1. Aturan desain (heuristik, dapat diubah di `spec.rules`)
| Aturan | Isi | Alasan |
|---|---|---|
| Satu mekanik baru per stage (L2) | Stage memperkenalkan paling banyak 1 mekanik | Beban kognitif; mudah menemukan penyebab bila anak macet |
| Pola kenalkan → latih → pelintir | **K** = memperkenalkan 1 mekanik; **L** = latihan tanpa mekanik baru; **P** = puzzle penutup gabungan | Konsep yang diperkenalkan langsung ditinggalkan = tidak sempat dipakai |
| Maks. 3 K berturut-turut per mode (L3) | Setelah 3 K harus ada L/P | Anak perlu memakai, bukan hanya melihat |
| Tiap misi punya ≥ 1 stage L/P (L4) | — | — |
| K non-pertama memakai ulang mekanik misi yang sama (L5) | — | Latihan lewat pemakaian ulang |
| Stage terakhir mode = P, memakai ≥ 4 mekanik (L6) | — | Pelintir gabungan |
| Riddle hanya memakai konsep yang sudah diajarkan (L7) | — | Riddle tidak boleh jadi hambatan tersembunyi |
| Stage berlabel Gabungan/Penutup tidak boleh memperkenalkan mekanik (L11) | — | Label harus jujur |
| Tidak ada mekanik yatim (L12) | Mekanik yang diajarkan harus dipakai lagi | Kalau tak dipakai, mengapa diajarkan? |
| Konsep wajib terajar (L13) | Daftar di spec | Mencegah konsep hilang saat restrukturisasi |
| Bukti pemahaman (L14) | Mode Senior/Expert: tiap K menyatakan apa yang tak bisa dilakukan tanpa paham | Mencegah hafalan istilah |
| Cakupan placement test (L15, peringatan) | Mekanik yang dilewati tapi tidak diuji | Validitas lompatan |

**Batas:** ambang (mis. maks. 3) adalah heuristik saya, bukan hasil riset. Pemeriksa tidak menilai apakah game seru atau efektif.

## 2. Ringkasan
| Mode | Stage | K | L/P | Run K terpanjang |
|---|---|---|---|---|
| B Beginner | 13 | 9 | 4 | 3 (B01–B03) |
| J Junior | 14 | 9 | 5 | 3 (J03–J05) |
| MA Middle A | 10 | 7 | 3 | 3 (MA07–MA09) |
| MB Middle B | 10 | 7 | 3 | 3 (MB07–MB09) |
| S Senior | 10 | 7 | 3 | 3 (SE04–SE06) |
| E Expert | 10 | 6 | 4 | 2 (EX03–EX04) |

Total **67 stage** (rencana lama: 62). **MVP = Beginner + Junior = 27 stage** (rencana lama: 22).

**Prototipe v11 (17 Nov) juga memuat Middle A MA01–MA03** (Menara Cermin, Piramida Batu, Tangga Turun; komposisi fungsi belum dibuat, lihat Dokumentasi_Testing §20.4). **Prototipe v9 (16 Nov) memuat seluruh Junior J01–J14** (Jalan Panjang, Tangga Batu, Keliling Kebun, Sampai Tembok, Tembok atau Lubang, Jalur Koin, Tiga Menara, Menara Berbeda, Hitung Bata, Kota Bertanda, Rak Nomor Nol, Sortir Barang, Timbang Semua, Mercusuar Ulang; id internal j01–j14; penyimpangan di Dokumentasi_Testing §17.4 dan §18.4). **Prototipe v6 (15 Nov) memuat seluruh 13 stage Beginner dengan label yang sama dengan ID kurikulum:** B01 Pengantar, B02 Tikungan, B03 Peti & Tombol, B04 Rute Memutar, B05 Jembatan Angkat, B06 Dua Jalan, B07 Pasar Ramai, B08 Jembatan Panjang, B09 Kotak Berbentuk, B10 Timbangan Pasar, B11 Gudang Campur, B12 Pintu Kembar, B13 Mercusuar Urutan. (Id internal kode: p0, s02–s07, b6, b7, b8, s11–s13; b6/b7/b8 = penomoran lama.) Nama stage B02–B07 dan B11–B13 adalah nama kerja dari prototipe dan belum ada di spesifikasi. Penyimpangan bentuk (kartu Jika tunggal, B04 membawa banyak peti, B12 dua dermaga, tanpa sensor *Ada benda?*) tercatat di Dokumentasi_Testing_Prototipe.md §15.5.

## 3. Registri mekanik
| ID | Mode | Isi mekanik | Prasyarat |
|---|---|---|---|
| `maju` | B | Kartu Maju | — |
| `belok` | B | Belok kiri/kanan | maju |
| `aksi` | B | Ambil · Taruh · Tekan tombol | maju |
| `jika` | B | Jika … maka … (+ sensor dunia: Ada tembok?, Warna lantai, Ada benda?) | aksi |
| `selain_itu` | B | Jika … maka … selain itu … | jika |
| `isi_kotak` | B | Isi kotak … dengan … (variabel) | maju |
| `tipe` | B | Bentuk kotak = tipe (bulat angka · persegi teks · sakelar nyala/mati) | isi_kotak |
| `ubah_kotak` | B | Ubah kotak (+ − × ÷) | isi_kotak |
| `pembanding` | B | Sensor kotak: Jika kotak (> < = ≠) N · Jika sakelar nyala | jika, tipe |
| `ulangi_n` | J | Ulangi … kali (wadah) | maju |
| `ulangi_bersarang` | J | Ulangi di dalam Ulangi | ulangi_n |
| `selama` | J | Selama … (perulangan bersyarat) | ulangi_n, jika |
| `syarat_gabungan` | J | TIDAK · DAN · ATAU pada syarat | selama |
| `mesin` | J | Buat Mesin & Jalankan Mesin (fungsi) | ulangi_n |
| `parameter` | J | Masukan Mesin | mesin, isi_kotak |
| `nilai_keluaran` | J | Keluarkan + slot nilai "hasil Mesin" | parameter, ubah_kotak |
| `rak` | J | Rak bernomor mulai 0 (list) | isi_kotak |
| `untuk_setiap` | J | Untuk setiap isi rak + slot nilai "isi rak sekarang" | rak, ulangi_n |
| `rekursi` | MA | Mesin memanggil dirinya + titik berhenti | mesin, parameter, jika |
| `rekursi_nilai` | MA | Rekursi dengan nilai balik | rekursi, nilai_keluaran |
| `cari_linear` | MA | Cari satu per satu | untuk_setiap, jika |
| `cari_biner` | MA | Buka tengah, buang separuh (data harus terurut) | rak, rekursi |
| `tumpukan` | MA | Tumpukan (masuk & ambil dari atas) | rak |
| `antrean` | MA | Antrean (masuk belakang, ambil depan) | rak |
| `pohon` | MA | Pohon: anak kiri/kanan, kunjungi | rekursi, tumpukan |
| `cetakan_objek` | MB | Cetakan → objek (class/instance) | mesin, tipe |
| `anggota` | MB | Atribut & method | cetakan_objek, nilai_keluaran |
| `enkapsulasi` | MB | Data tersembunyi, diubah lewat method penjaga | anggota, jika |
| `pewarisan` | MB | Cetakan mewarisi cetakan | anggota |
| `override` | MB | Mengganti perilaku warisan | pewarisan |
| `polimorfisme` | MB | Satu perintah, respons berbeda | override, untuk_setiap |
| `komposisi` | MB | Objek memiliki objek lain | anggota, rak |
| `api_permintaan` | S | Menyusun permintaan: alamat · aksi · data | anggota |
| `api_jawaban` | S | Membaca jawaban + kode status | api_permintaan, jika |
| `commit` | S | Simpan versi, riwayat, kembali ke versi (rollback) | isi_kotak |
| `branch` | S | Cabang jalur waktu | commit |
| `merge` | S | Menggabung cabang, termasuk konflik | branch |
| `container` | S | Image vs container; semua bahan di dalam peti | api_jawaban |
| `deploy` | S | Jalur build→uji→staging→produksi + rollback rilis | container, commit |
| `trigger` | E | Pemicu → aksi otomatis | api_jawaban, jika |
| `pipeline` | E | CI/CD: uji otomatis memblokir rilis buruk | deploy, trigger |
| `antrean_pekerja` | E | Antrean + pekerja (queue/worker) | antrean, trigger |
| `skala` | E | Pembagian beban ke beberapa server | antrean_pekerja |
| `cache` | E | Rak cepat di depan gudang | rak, skala |
| `monitoring` | E | Dasbor + retry/cadangan | skala, trigger |

## 4. Slot nilai (spesifikasi baru, menutup celah BJ-04)
Kartu yang menerima nilai (Isi kotak, Ubah kotak, argumen Mesin, kartu Jika) memiliki **slot nilai** berbentuk *chip*, bukan ekspresi bebas:
- **Angka/teks/sakelar** (dipilih dari pemilih seperti di prototipe),
- **Isi kotak …** (menyalin nilai kotak),
- **Hasil Mesin …** (muncul bersama `nilai_keluaran`, J09),
- **Isi rak sekarang** (muncul bersama `untuk_setiap`, J12).
Satu tingkat saja (tanpa chip di dalam chip), agar UI sentuh tetap sederhana. Komposisi fungsi (hasil Mesin sebagai argumen Mesin) diperkenalkan di MA02.


## 5.1 Beginner — Pulau Perintah (13 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| B01 | **Dermaga Gelap** | K | Bawa Bit ke tiang lampu (Stage Pengantar + tutorial Papan Program) | Kartu Maju |  |
| B02 |  | K | Lewati tikungan ke gudang | Belok kiri/kanan | maju |
| B03 |  | K | Ambil peti, taruh di perahu, tekan tombol lampu | Ambil · Taruh · Tekan tombol | maju, belok |
| B04 |  | L | Susun rute panjang berkelok untuk mengantar tiga peti | — | maju, belok, aksi |
| — | Gerbang Si Teka | Riddle | "Lampu menyala Merah, Biru, Biru, Merah, Biru, Biru, … Warna lampu ke-10?" | — | — |
| B05 | **Jalan Pasar** | K | SATU jembatan; lantai berwarna acak; Jika merah → Tekan tombol | Jika … maka … (+ sensor dunia: Ada tembok?, Warna lantai, Ada benda?) | maju, aksi |
| B06 |  | K | SATU persimpangan acak: Jika ada tembok → samping, selain itu → lurus | Jika … maka … selain itu … | jika, maju, belok |
| B07 |  | L | Dua persimpangan + satu jembatan berurutan, tanpa kartu baru | — | jika, selain itu, aksi, maju, belok |
| — | Gerbang Si Teka | Riddle | "Kunci ada di salah satu dari 3 peti. Peti merah kosong; kunci tidak di peti biru. Di mana kuncinya?" | — | — |
| B08 | **Gudang Kotak** | K | Isi kotak "langkah" agar jembatan muncul sepanjang isinya, lalu seberangi | Isi kotak … dengan … (variabel) | maju |
| B09 |  | K | Isi tiga kotak (bulat/persegi/sakelar) sesuai yang terlihat di dermaga [PROTOTIPE] | Bentuk kotak = tipe (bulat angka · persegi teks · sakelar nyala/mati) | isi kotak |
| B10 |  | K | Capai berat 14 dengan angka 2, 3, 4 dan maksimal 3 kartu [PROTOTIPE] | Ubah kotak (+ − × ÷) | isi kotak |
| B11 |  | L | Isi tiga kotak, hitung berat, lalu jalan ke dermaga, tanpa kartu baru | — | isi kotak, tipe, ubah kotak, maju |
| — | Gerbang Si Teka | Riddle | "Balok × menempel lebih dulu: 2 + 3 × 4 = ?" | — | ubah_kotak |
| B12 | **Mercusuar Urutan** | K | Jika kotak > 5 buka gerbang A, selain itu B; Jika sakelar nyala → lampu | Sensor kotak: Jika kotak (> < = ≠) N · Jika sakelar nyala | jika, selain itu, isi kotak, ubah kotak, tipe |
| B13 |  | P | Nyalakan mercusuar: urutan + aksi + kondisional + variabel + operasi + pembanding | — | maju, belok, aksi, jika, selain itu… |

## 5.2 Junior — Pulau Mesin (14 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| J01 | **Kincir Rusak** | K | Jalan lurus 8 petak; batas kartu 2 | Ulangi … kali (wadah) | maju |
| J02 |  | L | Ulangi berisi beberapa kartu | — | ulangi n, maju, belok |
| J03 |  | K | Kelilingi kebun 3×4 dengan Ulangi di dalam Ulangi | Ulangi di dalam Ulangi | ulangi n, maju, belok |
| J04 |  | K | Maju sampai ada tembok (panjang jalan diacak) | Selama … (perulangan bersyarat) | ulangi n, jika, maju |
| J05 |  | K | Selama TIDAK ada tembok DAN ada koin … | TIDAK · DAN · ATAU pada syarat | selama, jika, maju |
| J06 |  | L | Ambil koin hanya di petak yang ada koinnya, tanpa kartu baru | — | ulangi n, ulangi bersarang, selama, syarat gabungan, jika… |
| — | Gerbang Si Teka | Riddle | "Berapa tepukan: Ulangi 3 kali [Ulangi 4 kali [Tepuk]]?" | — | ulangi_bersarang |
| J07 | **Bengkel Pak Rakit** | K | Bangun 3 menara identik dengan satu Mesin | Buat Mesin & Jalankan Mesin (fungsi) | ulangi n, maju, aksi |
| J08 |  | K | Mesin(tinggi) | Masukan Mesin | mesin, ulangi n |
| J09 |  | K | Mesin menghitung bahan → hasilnya mengisi kotak (slot nilai "hasil Mesin") | Keluarkan + slot nilai "hasil Mesin" | mesin, parameter, isi kotak, ubah kotak |
| J10 |  | L | Rangkai Mesin dan Ulangi, tanpa kartu baru | — | mesin, parameter, nilai keluaran, ulangi n, jika |
| — | Gerbang Si Teka | Riddle | "Mengapa Mesin lebih baik daripada menyalin kartu?" | — | mesin |
| J11 | **Gudang Rak** | K | Ambil barang dari rak nomor tertentu (mulai 0) | Rak bernomor mulai 0 (list) | isi kotak, aksi |
| J12 |  | K | Periksa semua barang; buang yang rusak (slot "isi rak sekarang") | Untuk setiap isi rak + slot nilai "isi rak sekarang" | rak, jika, aksi, ulangi n |
| J13 |  | L | Jumlahkan berat semua barang ke satu kotak, tanpa kartu baru | — | rak, untuk setiap, ubah kotak, isi kotak |
| — | Gerbang Si Teka | Riddle | "Rak berisi [apel, jeruk, mangga]: isi rak nomor 2?" | — | rak |
| J14 | **Mercusuar Ulang** | P | Nyalakan mercusuar dengan perulangan, Mesin, dan Rak | — | ulangi n, ulangi bersarang, selama, syarat gabungan, mesin… |

## 5.3 Middle A — Algoritma & struktur data (10 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| MA01 | **Cermin dalam Cermin** | K | Mesin memanggil dirinya dengan titik berhenti | Mesin memanggil dirinya + titik berhenti | mesin, parameter, jika |
| MA02 |  | K | hitung(n) = n + hitung(n−1); hasil Mesin sebagai argumen Mesin (komposisi fungsi) | Rekursi dengan nilai balik | rekursi, nilai keluaran, ubah kotak |
| MA03 |  | L | Pola bertingkat dengan rekursi, tanpa kartu baru | — | rekursi, rekursi nilai, ulangi n |
| — | Gerbang Si Teka | Riddle | "hitung(n): jika n = 0 → 0, selain itu n + hitung(n−1). Berapa hitung(4)?" | — | rekursi_nilai |
| MA04 | **Perpustakaan** | K | Temukan buku dengan memeriksa rak berurutan | Cari satu per satu | rak, untuk setiap, jika |
| MA05 |  | K | Rak terurut: buka tengah, buang separuh | Buka tengah, buang separuh (data harus terurut) | cari linear, rak, rekursi, jika |
| MA06 |  | L | Pilih cara tercepat untuk rak terurut vs acak, tanpa kartu baru | — | cari linear, cari biner, rak |
| — | Gerbang Si Teka | Riddle | "Buku 1.000 nama terurut: paling banyak berapa kali membuka dengan "buka tengah"?" | — | cari_biner |
| MA07 | **Arsip Kampung** | K | Masuk dan ambil dari atas | Tumpukan (masuk & ambil dari atas) | rak, isi kotak |
| MA08 |  | K | Masuk belakang, ambil depan; bandingkan dengan tumpukan | Antrean (masuk belakang, ambil depan) | rak, tumpukan |
| MA09 |  | K | Kunjungi pohon: diri sendiri, lalu anak kiri ke kanan | Pohon: anak kiri/kanan, kunjungi | rekursi, tumpukan, antrean |
| MA10 |  | P | Telusuri arsip dengan rekursi, pohon, antrean, dan pencarian | — | rekursi, cari biner, tumpukan, antrean, pohon |

## 5.4 Middle B — OOP (10 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| MB01 | **Pabrik Cetakan** | K | Buat objek dari cetakan | Cetakan → objek (class/instance) | mesin, tipe, isi kotak |
| MB02 |  | K | Atribut (nama, warna) dan method (mengeong) | Atribut & method | cetakan objek, nilai keluaran |
| MB03 |  | L | Banyak objek dari satu cetakan, tanpa kartu baru | — | cetakan objek, anggota, untuk setiap |
| — | Gerbang Si Teka | Riddle | "Warna kucing pertama diubah menjadi hitam. Warna kucing kedua?" | — | cetakan_objek |
| MB04 | **Brankas & Silsilah** | K | Saldo hanya diubah lewat setor()/ambil() yang menjaga aturan | Data tersembunyi, diubah lewat method penjaga | anggota, jika |
| MB05 |  | K | Cetakan Burung mewarisi Hewan | Cetakan mewarisi cetakan | anggota, cetakan objek, enkapsulasi |
| MB06 |  | L | Pewarisan + method + brankas, tanpa kartu baru | — | pewarisan, anggota, enkapsulasi, untuk setiap |
| — | Gerbang Si Teka | Riddle | "Burung mewarisi Hewan.makan() dan menambah terbang(). Objek burung bisa apa?" | — | pewarisan |
| MB07 | **Teater Hewan** | K | Mengganti terbang() pada Pinguin | Mengganti perilaku warisan | pewarisan, anggota |
| MB08 |  | K | Rak berisi hewan berbeda: bersuara() untuk semua | Satu perintah, respons berbeda | override, untuk setiap, rak |
| MB09 |  | K | Objek Rumah memiliki objek Kamar | Objek memiliki objek lain | anggota, cetakan objek, polimorfisme |
| MB10 |  | P | Rancang 50 jenis musuh: pewarisan atau komposisi? | — | pewarisan, override, polimorfisme, komposisi, enkapsulasi |

## 5.5 Senior — API, Versioning, Container, Deploy (10 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| SE01 | **Loket Pesanan** | K | Susun permintaan: alamat, aksi, data *(bukti: Permintaan ditolak bila alamat, aksi, atau data salah; pemain harus menyusun ketiganya sendiri (tidak ada tombol otomatis))* | Menyusun permintaan: alamat · aksi · data | anggota, isi kotak |
| SE02 |  | K | Tentukan tindakan dari kode jawaban *(bukti: Pemain memilih tindakan lanjutan berdasarkan kode (berhasil/tidak ditemukan/ditolak), bukan menyebut artinya)* | Membaca jawaban + kode status | api permintaan, jika |
| SE03 |  | L | Perbaiki permintaan yang ditolak, tanpa kartu baru | — | api permintaan, api jawaban, jika |
| — | Gerbang Si Teka | Riddle | "Kode "tidak ditemukan" muncul. Bagian permintaan mana yang paling mungkin salah?" | — | api_jawaban |
| SE04 | **Mesin Waktu** | K | Simpan titik waktu dan kembali ke versi tertentu *(bukti: Pemain memulihkan peta ke riwayat tertentu dengan memilih titik simpan yang tepat)* | Simpan versi, riwayat, kembali ke versi (rollback) | isi kotak |
| SE05 |  | K | Dua NPC mengerjakan hal berbeda di cabang terpisah *(bukti: Perubahan harus ditaruh di cabang yang benar agar yang lain tidak rusak)* | Cabang jalur waktu | commit |
| SE06 |  | K | Gabungkan cabang yang mengubah baris yang sama *(bukti: Pemain memilih baris yang dipertahankan sehingga peta akhir memuat KEDUA perubahan)* | Menggabung cabang, termasuk konflik | branch, commit |
| SE07 |  | L | Kembali ke versi sebelum bug muncul, tanpa kartu baru | — | commit, branch, merge |
| — | Gerbang Si Teka | Riddle | "Dua cabang mengubah baris yang sama lalu digabung. Apa yang terjadi?" | — | merge |
| SE08 | **Pelabuhan Peti Kemas** | K | Aplikasi "jalan di rumahku, rusak di pulau lain": kemas semua bahan *(bukti: Aplikasi hanya jalan di semua pulau bila pemain memasukkan setiap bahan yang kurang ke dalam peti)* | Image vs container; semua bahan di dalam peti | api jawaban, isi kotak |
| SE09 |  | K | Urutkan build → uji → staging → produksi; putuskan kapan rollback *(bukti: Rilis buruk hanya selamat bila tahap uji ditempatkan sebelum produksi dan pemain memilih saat rollback)* | Jalur build→uji→staging→produksi + rollback rilis | container, commit |
| SE10 |  | P | Kirim aplikasi dari versi → peti → kapal, dengan rollback bila gagal | — | api permintaan, commit, merge, container, deploy |

## 5.6 Expert — Sistem lanjut & otomasi (10 stage)

| ID | Misi | Tipe | Tujuan stage | Mekanik baru | Memakai ulang |
|---|---|---|---|---|---|
| EX01 | **Pabrik Otomatis** | K | Jika pesanan masuk → kemas → kirim, tanpa campur tangan *(bukti: Pemain merangkai pemicu→aksi lalu menyaksikan 10 pesanan diproses tanpa campur tangan)* | Pemicu → aksi otomatis | api jawaban, jika |
| EX02 |  | L | Rangkai alur otomatis berantai, tanpa kartu baru | — | trigger, jika |
| EX03 |  | K | Rancang jalur otomatis: simpan versi → uji → kemas → kirim *(bukti: Pipeline harus menghentikan rilis yang gagal uji; pemain menempatkan gerbang uji di tahap yang benar)* | CI/CD: uji otomatis memblokir rilis buruk | trigger, deploy, commit |
| — | Gerbang Si Teka | Riddle | "Satu rilis cacat lolos ke produksi. Tahap pipeline mana yang paling mungkin kurang?" | — | pipeline |
| EX04 | **Loket Ramai** | K | Atur jumlah pekerja agar antrean tidak meluap *(bukti: Antrean hanya tidak meluap bila jumlah pekerja disetel sesuai laju masuk)* | Antrean + pekerja (queue/worker) | antrean, trigger |
| EX05 |  | L | Atasi lonjakan dengan pekerja, tanpa kartu baru | — | antrean pekerja, antrean |
| EX06 |  | K | Bagi lalu lintas ke beberapa server *(bukti: Lonjakan trafik hanya tertangani bila beban dibagi ke beberapa server)* | Pembagian beban ke beberapa server | antrean pekerja, api jawaban |
| — | Gerbang Si Teka | Riddle | "Antrean 100 tugas, 5 petugas mampu 10 tugas/menit masing-masing. Berapa menit sampai habis?" | — | antrean_pekerja |
| EX07 | **Menara Pengawas** | K | Pilih isi rak cepat agar perjalanan ke gudang berkurang *(bukti: Perjalanan ke gudang berkurang hanya bila pemain memilih barang yang paling sering diminta)* | Rak cepat di depan gudang | rak, api jawaban, skala |
| EX08 |  | L | Gabungkan pembagian beban dan rak cepat, tanpa kartu baru | — | skala, cache, antrean pekerja |
| EX09 |  | K | Baca dasbor, temukan server bermasalah, aktifkan retry atau cadangan *(bukti: Server rusak ditangani dengan memilih retry atau cadangan berdasarkan dasbor, bukan menebak)* | Dasbor + retry/cadangan | cache, skala, trigger, api jawaban |
| EX10 |  | P | Bangun sistem toko: pemicu → antrean → pekerja → rak cepat → pengawas | — | trigger, antrean pekerja, skala, cache, monitoring… |

## 6. Model keadaan Senior & Expert (syarat agar stage bisa diuji otomatis)
Tiap stage Senior/Expert harus dimodelkan sebagai **mesin keadaan murni** (seperti interpreter prototipe) dengan kondisi menang yang dapat diperiksa program. **Belum ada satu pun yang dibuat.** Sebelum diimplementasikan, tiap stage perlu *uji kelayakan* (seperti T1: solusi ada, berapa solusi terpendek).

| Topik | Keadaan | Operasi pemain | Kondisi menang |
|---|---|---|---|
| API | permintaan {alamat, aksi, data}; aturan server | menyusun / mengubah bagian permintaan | server menjawab *berhasil* dengan data yang diminta |
| Riwayat versi | graf titik simpan (DAG), HEAD, cabang | simpan, pindah, buat cabang, kembali | snapshot akhir memenuhi predikat (mis. memuat perubahan A dan B, tanpa bug) |
| Gabung & konflik | dua cabang mengubah baris yang sama | memilih baris per konflik | hasil gabungan memuat kedua perubahan |
| Container | himpunan bahan di peti; bahan wajib tiap pulau | tambah/hapus bahan | untuk semua pulau: wajib ⊆ peti |
| Deploy | urutan tahap + gerbang uji; rilis dengan cacat tertentu | menyusun tahap, memutuskan rollback | cacat tertahan sebelum produksi, atau rollback tepat waktu |
| Pipeline | tahap berurut; tiap cacat hanya terdeteksi di tahap tertentu | menaruh gerbang uji | semua rilis cacat tertahan, rilis baik lolos |
| Pemicu | aturan peristiwa→aksi; arus 10 pesanan | merangkai aturan | semua pesanan terproses tanpa campur tangan |
| Antrean & pekerja | laju masuk λ(t), n pekerja, laju layan μ | menyetel n | panjang antrean di bawah batas selama simulasi |
| Skala | k server berkapasitas c; trafik T(t) | menambah/membagi server | T(t) ≤ k·c sepanjang simulasi |
| Cache | kapasitas rak r; distribusi permintaan | memilih isi rak | tingkat kena ≥ target |
| Monitoring | metrik per server; jenis kegagalan | memilih retry/cadangan | layanan pulih dalam ≤ N langkah |

## 7. Placement test dan cakupan
- **Test 1** menguji 8 dari 9 mekanik Beginner; **`aksi` tidak diuji** (peringatan L15). Diterima: aksi trivial dan dipakai ulang di Junior.
- **Test 2** (setelah revisi soal 4 menjadi pohon) menguji 12 dari 14 mekanik Middle; **`cari_linear` dan `komposisi` tidak diuji**. Diterima untuk sekarang; soal 10 dapat diperluas ke komposisi.

## 8. Hasil pemeriksa
| Spesifikasi | Pelanggaran | Peringatan |
|---|---|---|
| v0.2 (baseline, hanya Beginner+Junior) | **16** | 1 |
| v0.3 (6 mode) | **0** | 2 |

Jalankan: `python3 design_lint/build_specs.py && python3 design_lint/lint.py design_lint/spec_v0.3.json`.

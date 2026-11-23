#!/usr/bin/env python3
"""Membangun spec_v0.2_baseline.json (transkripsi manual GDD §6.2/§6.3 v0.2) dan spec_v0.3.json (desain revisi, 6 mode)."""
import json
def S(i,nama,tujuan,intro=(),uses=(),label=None,bukti=None):
    d=dict(id=i,nama=nama,tujuan=tujuan,introduces=list(intro),uses=list(uses))
    if label: d['label']=label
    if bukti: d['bukti']=bukti
    return d
def M(i,nama,stages,riddle=None,konsep=()):
    d=dict(id=i,name=nama,stages=stages)
    if riddle: d['riddle']=dict(teks=riddle,konsep=list(konsep))
    return d
R=lambda n,mode,pre,desc:(n,dict(nama=n,mode=mode,prereq=pre,desc=desc))
MECH=dict([
 R('maju','B',[],'Kartu Maju'),R('belok','B',['maju'],'Belok kiri/kanan'),R('aksi','B',['maju'],'Ambil · Taruh · Tekan tombol'),
 R('jika','B',['aksi'],'Jika … maka … (+ sensor dunia: Ada tembok?, Warna lantai, Ada benda?)'),R('selain_itu','B',['jika'],'Jika … maka … selain itu …'),
 R('isi_kotak','B',['maju'],'Isi kotak … dengan … (variabel)'),R('tipe','B',['isi_kotak'],'Bentuk kotak = tipe (bulat angka · persegi teks · sakelar nyala/mati)'),
 R('ubah_kotak','B',['isi_kotak'],'Ubah kotak (+ − × ÷)'),R('pembanding','B',['jika','tipe'],'Sensor kotak: Jika kotak (> < = ≠) N · Jika sakelar nyala'),
 R('ulangi_n','J',['maju'],'Ulangi … kali (wadah)'),R('ulangi_bersarang','J',['ulangi_n'],'Ulangi di dalam Ulangi'),R('selama','J',['ulangi_n','jika'],'Selama … (perulangan bersyarat)'),
 R('syarat_gabungan','J',['selama'],'TIDAK · DAN · ATAU pada syarat'),R('mesin','J',['ulangi_n'],'Buat Mesin & Jalankan Mesin (fungsi)'),
 R('parameter','J',['mesin','isi_kotak'],'Masukan Mesin'),R('nilai_keluaran','J',['parameter','ubah_kotak'],'Keluarkan + slot nilai "hasil Mesin"'),
 R('rak','J',['isi_kotak'],'Rak bernomor mulai 0 (list)'),R('untuk_setiap','J',['rak','ulangi_n'],'Untuk setiap isi rak + slot nilai "isi rak sekarang"'),
 R('rekursi','MA',['mesin','parameter','jika'],'Mesin memanggil dirinya + titik berhenti'),R('rekursi_nilai','MA',['rekursi','nilai_keluaran'],'Rekursi dengan nilai balik'),
 R('cari_linear','MA',['untuk_setiap','jika'],'Cari satu per satu'),R('cari_biner','MA',['rak','rekursi'],'Buka tengah, buang separuh (data harus terurut)'),
 R('tumpukan','MA',['rak'],'Tumpukan (masuk & ambil dari atas)'),R('antrean','MA',['rak'],'Antrean (masuk belakang, ambil depan)'),R('pohon','MA',['rekursi','tumpukan'],'Pohon: anak kiri/kanan, kunjungi'),
 R('cetakan_objek','MB',['mesin','tipe'],'Cetakan → objek (class/instance)'),R('anggota','MB',['cetakan_objek','nilai_keluaran'],'Atribut & method'),
 R('enkapsulasi','MB',['anggota','jika'],'Data tersembunyi, diubah lewat method penjaga'),R('pewarisan','MB',['anggota'],'Cetakan mewarisi cetakan'),
 R('override','MB',['pewarisan'],'Mengganti perilaku warisan'),R('polimorfisme','MB',['override','untuk_setiap'],'Satu perintah, respons berbeda'),R('komposisi','MB',['anggota','rak'],'Objek memiliki objek lain'),
 R('api_permintaan','S',['anggota'],'Menyusun permintaan: alamat · aksi · data'),R('api_jawaban','S',['api_permintaan','jika'],'Membaca jawaban + kode status'),
 R('commit','S',['isi_kotak'],'Simpan versi, riwayat, kembali ke versi (rollback)'),R('branch','S',['commit'],'Cabang jalur waktu'),R('merge','S',['branch'],'Menggabung cabang, termasuk konflik'),
 R('container','S',['api_jawaban'],'Image vs container; semua bahan di dalam peti'),R('deploy','S',['container','commit'],'Jalur build→uji→staging→produksi + rollback rilis'),
 R('trigger','E',['api_jawaban','jika'],'Pemicu → aksi otomatis'),R('pipeline','E',['deploy','trigger'],'CI/CD: uji otomatis memblokir rilis buruk'),
 R('antrean_pekerja','E',['antrean','trigger'],'Antrean + pekerja (queue/worker)'),R('skala','E',['antrean_pekerja'],'Pembagian beban ke beberapa server'),
 R('cache','E',['rak','skala'],'Rak cepat di depan gudang'),R('monitoring','E',['skala','trigger'],'Dasbor + retry/cadangan'),
 # hanya dipakai oleh desain lama (v0.2)
 R('jika_dalam_ulangi','J',['ulangi_n','jika'],'(v0.2) Jika di dalam Ulangi'),R('komposisi_fungsi','J',['nilai_keluaran'],'(v0.2) Mesin di dalam Mesin'),
 R('slot_nilai','J',['nilai_keluaran'],'(v0.2) kotak nilai yang menerima hasil Mesin/isi rak — TIDAK ada di spesifikasi kartu GDD §3.3'),
])
RULES=dict(max_run_K=3,bukti_modes=['S','E'])
T1=[dict(no=1,topik=['maju','belok']),dict(no=2,topik=['jika','selain_itu']),dict(no=3,topik=['isi_kotak','ubah_kotak']),dict(no=4,topik=['isi_kotak']),dict(no=5,topik=['tipe']),dict(no=6,topik=['ubah_kotak']),dict(no=7,topik=['isi_kotak','jika','pembanding','ubah_kotak'])]
T2=[dict(no=1,topik=['rekursi','rekursi_nilai']),dict(no=2,topik=['rekursi']),dict(no=3,topik=['cari_biner']),dict(no=4,topik=['pohon']),dict(no=5,topik=['tumpukan','antrean']),dict(no=6,topik=['cetakan_objek']),dict(no=7,topik=['enkapsulasi','anggota']),dict(no=8,topik=['pewarisan','override']),dict(no=9,topik=['polimorfisme']),dict(no=10,topik=['pewarisan','polimorfisme'])]
REQ_BJ={'urutan':['maju'],'arah':['belok'],'aksi':['aksi'],'kondisional':['jika'],'kondisional_lengkap':['selain_itu'],'variabel':['isi_kotak'],'tipe_data':['tipe'],'aritmetika':['ubah_kotak'],'perbandingan':['pembanding'],'perulangan':['ulangi_n'],'perulangan_bersyarat':['selama'],'logika_boolean':['syarat_gabungan'],'fungsi':['mesin'],'parameter':['parameter'],'nilai_keluaran':['nilai_keluaran'],'list':['rak'],'iterasi_list':['untuk_setiap']}
REQ_ALL=dict(REQ_BJ,rekursi=['rekursi'],pencarian=['cari_linear','cari_biner'],struktur_data=['tumpukan'],antrean=['antrean'],pohon=['pohon'],oop_kelas=['cetakan_objek'],oop_enkapsulasi=['enkapsulasi'],oop_pewarisan=['pewarisan'],oop_polimorfisme=['polimorfisme'],api=['api_permintaan'],versioning=['commit'],container=['container'],deploy=['deploy'],otomasi=['trigger'])
# ---------------- BASELINE v0.2 (transkripsi GDD §6.2 & §6.3 sebelum review) ----------------
base=dict(version='v0.2-baseline (GDD §6.2/§6.3 sebelum review; hanya Beginner & Junior)',rules=RULES,mechanics=MECH,required_concepts=REQ_BJ,
 tests=[dict(id='Test1',gates=['B'],questions=T1)],modes=[
 dict(id='B',name='Beginner',missions=[
  M('B-M1','Dermaga Gelap',[S('B1','Dermaga Gelap','Bawa Bit ke lampu',['maju'],[]),S('B2','Tikungan','Lewati tikungan',['belok'],['maju']),S('B3','Peti','Ambil peti, taruh di perahu',['aksi'],['maju','belok'])],'Lampu ke-10 berwarna apa?',[]),
  M('B-M2','Jalan Pasar',[S('B4','Jembatan Angkat','Satu titik keputusan',['jika'],['maju','aksi']),S('B5','Persimpangan','Jika ada tembok → samping, selain itu → lurus',['selain_itu'],['jika','maju','belok'])],'Kunci ada di peti mana? (deduksi 1 langkah)',[]),
  M('B-M3','Gudang Kotak',[S('B6','Isi Kotak','Isi kotak "langkah" agar jembatan muncul',['isi_kotak'],['maju']),S('B7','Tipe Data','Sortir barang ke kotak bulat/persegi/sakelar',['tipe'],['isi_kotak']),S('B8','Matematika','Ubah kotak agar timbangan seimbang',['ubah_kotak'],['isi_kotak'])],'Balok × menempel lebih dulu (urutan operasi)',['ubah_kotak']),
  M('B-M4','Mercusuar Urutan',[S('B9','Gabungan','Hitung isi kotak, lalu Jika kotak > 5 buka gerbang A, selain itu B',['pembanding'],['jika','selain_itu','isi_kotak','ubah_kotak'],label='Gabungan'),S('B10','Puzzle penutup','Nyalakan mercusuar',[],['maju','belok','aksi','jika','selain_itu','isi_kotak','ubah_kotak','pembanding'],label='Puzzle penutup')])]),
 dict(id='J',name='Junior',missions=[
  M('J-M1','Kincir Rusak',[S('J1','Jalan 8 petak','Batas kartu 2',['ulangi_n'],['maju']),S('J2','Tangga zigzag','Ulangi berisi beberapa kartu',[],['ulangi_n','maju','belok']),S('J3','Sampai tembok','Maju sampai ada tembok',['selama'],['ulangi_n','jika','maju']),S('J4','Koin','Ambil koin hanya di petak yang ada koinnya',['jika_dalam_ulangi'],['ulangi_n','jika','aksi','maju'])],'Berapa tepukan dalam 3 × 4?',['ulangi_bersarang']),
  M('J-M2','Bengkel Pak Rakit',[S('J5','Tiga menara','Mesin dipakai ulang',['mesin'],['ulangi_n','maju','aksi']),S('J6','Parameter','Menara beda tinggi',['parameter'],['mesin']),S('J7','Nilai keluaran','Mesin hitung bahan → hasil mengisi kotak',['nilai_keluaran'],['mesin','parameter','isi_kotak','ubah_kotak','slot_nilai']),S('J8','Mesin di dalam Mesin','Gabungkan dua Mesin',['komposisi_fungsi'],['mesin','parameter','nilai_keluaran','slot_nilai'])],'Mengapa Mesin lebih baik daripada menyalin kartu?',['mesin']),
  M('J-M3','Gudang Rak',[S('J9','Rak & indeks','Ambil dari rak nomor tertentu',['rak'],['isi_kotak','aksi']),S('J10','Periksa semua','Buang barang rusak',['untuk_setiap'],['rak','jika','aksi','slot_nilai']),S('J11','Akumulator','Jumlahkan berat semua barang',[],['untuk_setiap','ubah_kotak','isi_kotak','slot_nilai'])]),
  M('J-M4','Mercusuar Ulang',[S('J12','Puzzle penutup','Nyalakan mercusuar',[],['ulangi_n','selama','mesin','parameter','rak','untuk_setiap'],label='Puzzle penutup')])])])
json.dump(base,open('spec_v0.2_baseline.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
# ---------------- v0.3 (desain revisi) ----------------
B=[M('B-M1','Dermaga Gelap',[
   S('B01','Dermaga Gelap','Bawa Bit ke tiang lampu (Stage Pengantar + tutorial Papan Program)',['maju'],[]),
   S('B02','Tikungan','Lewati tikungan ke gudang',['belok'],['maju']),
   S('B03','Peti & Tombol','Ambil peti, taruh di perahu, tekan tombol lampu',['aksi'],['maju','belok']),
   S('B04','Rute Memutar','Susun rute panjang berkelok untuk mengantar tiga peti',[],['maju','belok','aksi'])],
   'Lampu menyala Merah, Biru, Biru, Merah, Biru, Biru, … Warna lampu ke-10?',[]),
 M('B-M2','Jalan Pasar',[
   S('B05','Jembatan Angkat','SATU jembatan; lantai berwarna acak; Jika merah → Tekan tombol',['jika'],['maju','aksi']),
   S('B06','Dua Jalan','SATU persimpangan acak: Jika ada tembok → samping, selain itu → lurus',['selain_itu'],['jika','maju','belok']),
   S('B07','Pasar Ramai','Dua persimpangan + satu jembatan berurutan, tanpa kartu baru',[],['jika','selain_itu','aksi','maju','belok'])],
   'Kunci ada di salah satu dari 3 peti. Peti merah kosong; kunci tidak di peti biru. Di mana kuncinya?',[]),
 M('B-M3','Gudang Kotak',[
   S('B08','Jembatan Panjang','Isi kotak "langkah" agar jembatan muncul sepanjang isinya, lalu seberangi',['isi_kotak'],['maju']),
   S('B09','Kotak Berbentuk','Isi tiga kotak (bulat/persegi/sakelar) sesuai yang terlihat di dermaga [PROTOTIPE]',['tipe'],['isi_kotak']),
   S('B10','Timbangan Pasar','Capai berat 14 dengan angka 2, 3, 4 dan maksimal 3 kartu [PROTOTIPE]',['ubah_kotak'],['isi_kotak']),
   S('B11','Gudang Campur','Isi tiga kotak, hitung berat, lalu jalan ke dermaga, tanpa kartu baru',[],['isi_kotak','tipe','ubah_kotak','maju'])],
   'Balok × menempel lebih dulu: 2 + 3 × 4 = ?',['ubah_kotak']),
 M('B-M4','Mercusuar Urutan',[
   S('B12','Pintu Kembar','Jika kotak > 5 buka gerbang A, selain itu B; Jika sakelar nyala → lampu',['pembanding'],['jika','selain_itu','isi_kotak','ubah_kotak','tipe']),
   S('B13','Mercusuar Urutan','Nyalakan mercusuar: urutan + aksi + kondisional + variabel + operasi + pembanding',[],['maju','belok','aksi','jika','selain_itu','isi_kotak','ubah_kotak','pembanding','tipe'],label='Puzzle penutup')])]
J=[M('J-M1','Kincir Rusak',[
   S('J01','Kincir 8 Petak','Jalan lurus 8 petak; batas kartu 2',['ulangi_n'],['maju']),
   S('J02','Tangga Zigzag','Ulangi berisi beberapa kartu',[],['ulangi_n','maju','belok']),
   S('J03','Kebun Berpetak','Kelilingi kebun 3×4 dengan Ulangi di dalam Ulangi',['ulangi_bersarang'],['ulangi_n','maju','belok']),
   S('J04','Sampai Tembok','Maju sampai ada tembok (panjang jalan diacak)',['selama'],['ulangi_n','jika','maju']),
   S('J05','Syarat Ganda','Selama TIDAK ada tembok DAN ada koin …',['syarat_gabungan'],['selama','jika','maju']),
   S('J06','Panen Koin','Ambil koin hanya di petak yang ada koinnya, tanpa kartu baru',[],['ulangi_n','ulangi_bersarang','selama','syarat_gabungan','jika','aksi'])],
   'Berapa tepukan: Ulangi 3 kali [Ulangi 4 kali [Tepuk]]?',['ulangi_bersarang']),
 M('J-M2','Bengkel Pak Rakit',[
   S('J07','Tiga Menara','Bangun 3 menara identik dengan satu Mesin',['mesin'],['ulangi_n','maju','aksi']),
   S('J08','Menara Beda Tinggi','Mesin(tinggi)',['parameter'],['mesin','ulangi_n']),
   S('J09','Mesin Hitung','Mesin menghitung bahan → hasilnya mengisi kotak (slot nilai "hasil Mesin")',['nilai_keluaran'],['mesin','parameter','isi_kotak','ubah_kotak']),
   S('J10','Bengkel Penuh','Rangkai Mesin dan Ulangi, tanpa kartu baru',[],['mesin','parameter','nilai_keluaran','ulangi_n','jika'])],
   'Mengapa Mesin lebih baik daripada menyalin kartu?',['mesin']),
 M('J-M3','Gudang Rak',[
   S('J11','Rak Bernomor','Ambil barang dari rak nomor tertentu (mulai 0)',['rak'],['isi_kotak','aksi']),
   S('J12','Periksa Semua','Periksa semua barang; buang yang rusak (slot "isi rak sekarang")',['untuk_setiap'],['rak','jika','aksi','ulangi_n']),
   S('J13','Timbang Semua','Jumlahkan berat semua barang ke satu kotak, tanpa kartu baru',[],['rak','untuk_setiap','ubah_kotak','isi_kotak'])],
   'Rak berisi [apel, jeruk, mangga]: isi rak nomor 2?',['rak']),
 M('J-M4','Mercusuar Ulang',[S('J14','Mercusuar Ulang','Nyalakan mercusuar dengan perulangan, Mesin, dan Rak',[],['ulangi_n','ulangi_bersarang','selama','syarat_gabungan','mesin','parameter','nilai_keluaran','rak','untuk_setiap'],label='Puzzle penutup')])]
MA=[M('MA-M1','Cermin dalam Cermin',[
   S('MA01','Hitung Mundur','Mesin memanggil dirinya dengan titik berhenti',['rekursi'],['mesin','parameter','jika']),
   S('MA02','Jumlah Berantai','hitung(n) = n + hitung(n−1); hasil Mesin sebagai argumen Mesin (komposisi fungsi)',['rekursi_nilai'],['rekursi','nilai_keluaran','ubah_kotak']),
   S('MA03','Cermin Bertingkat','Pola bertingkat dengan rekursi, tanpa kartu baru',[],['rekursi','rekursi_nilai','ulangi_n'])],
   'hitung(n): jika n = 0 → 0, selain itu n + hitung(n−1). Berapa hitung(4)?',['rekursi_nilai']),
 M('MA-M2','Perpustakaan',[
   S('MA04','Cari Satu per Satu','Temukan buku dengan memeriksa rak berurutan',['cari_linear'],['rak','untuk_setiap','jika']),
   S('MA05','Buka Tengah','Rak terurut: buka tengah, buang separuh',['cari_biner'],['cari_linear','rak','rekursi','jika']),
   S('MA06','Pilih Cara Cari','Pilih cara tercepat untuk rak terurut vs acak, tanpa kartu baru',[],['cari_linear','cari_biner','rak'])],
   'Buku 1.000 nama terurut: paling banyak berapa kali membuka dengan "buka tengah"?',['cari_biner']),
 M('MA-M3','Arsip Kampung',[
   S('MA07','Tumpukan Piring','Masuk dan ambil dari atas',['tumpukan'],['rak','isi_kotak']),
   S('MA08','Loket Antrean','Masuk belakang, ambil depan; bandingkan dengan tumpukan',['antrean'],['rak','tumpukan']),
   S('MA09','Pohon Keluarga','Kunjungi pohon: diri sendiri, lalu anak kiri ke kanan',['pohon'],['rekursi','tumpukan','antrean']),
   S('MA10','Arsip Kampung','Telusuri arsip dengan rekursi, pohon, antrean, dan pencarian',[],['rekursi','cari_biner','tumpukan','antrean','pohon'],label='Puzzle penutup')])]
MB=[M('MB-M1','Pabrik Cetakan',[
   S('MB01','Cetak Kucing','Buat objek dari cetakan',['cetakan_objek'],['mesin','tipe','isi_kotak']),
   S('MB02','Data dan Kemampuan','Atribut (nama, warna) dan method (mengeong)',['anggota'],['cetakan_objek','nilai_keluaran']),
   S('MB03','Toko Banyak Kucing','Banyak objek dari satu cetakan, tanpa kartu baru',[],['cetakan_objek','anggota','untuk_setiap'])],
   'Warna kucing pertama diubah menjadi hitam. Warna kucing kedua?',['cetakan_objek']),
 M('MB-M2','Brankas & Silsilah',[
   S('MB04','Brankas Celengan','Saldo hanya diubah lewat setor()/ambil() yang menjaga aturan',['enkapsulasi'],['anggota','jika']),
   S('MB05','Silsilah Cetakan','Cetakan Burung mewarisi Hewan',['pewarisan'],['anggota','cetakan_objek','enkapsulasi']),
   S('MB06','Kebun Hewan','Pewarisan + method + brankas, tanpa kartu baru',[],['pewarisan','anggota','enkapsulasi','untuk_setiap'])],
   'Burung mewarisi Hewan.makan() dan menambah terbang(). Objek burung bisa apa?',['pewarisan']),
 M('MB-M3','Teater Hewan',[
   S('MB07','Pinguin Tak Bisa Terbang','Mengganti terbang() pada Pinguin',['override'],['pewarisan','anggota']),
   S('MB08','Satu Perintah Banyak Suara','Rak berisi hewan berbeda: bersuara() untuk semua',['polimorfisme'],['override','untuk_setiap','rak']),
   S('MB09','Rumah dan Kamarnya','Objek Rumah memiliki objek Kamar',['komposisi'],['anggota','cetakan_objek','polimorfisme']),
   S('MB10','Seribu Musuh','Rancang 50 jenis musuh: pewarisan atau komposisi?',[],['pewarisan','override','polimorfisme','komposisi','enkapsulasi'],label='Puzzle penutup')])]
SE=[M('S-M1','Loket Pesanan',[
   S('SE01','Kirim Permintaan','Susun permintaan: alamat, aksi, data',['api_permintaan'],['anggota','isi_kotak'],bukti='Permintaan ditolak bila alamat, aksi, atau data salah; pemain harus menyusun ketiganya sendiri (tidak ada tombol otomatis)'),
   S('SE02','Baca Jawaban','Tentukan tindakan dari kode jawaban',['api_jawaban'],['api_permintaan','jika'],bukti='Pemain memilih tindakan lanjutan berdasarkan kode (berhasil/tidak ditemukan/ditolak), bukan menyebut artinya'),
   S('SE03','Permintaan Ditolak','Perbaiki permintaan yang ditolak, tanpa kartu baru',[],['api_permintaan','api_jawaban','jika'])],
   'Kode "tidak ditemukan" muncul. Bagian permintaan mana yang paling mungkin salah?',['api_jawaban']),
 M('S-M2','Mesin Waktu',[
   S('SE04','Simpan Versi','Simpan titik waktu dan kembali ke versi tertentu',['commit'],['isi_kotak'],bukti='Pemain memulihkan peta ke riwayat tertentu dengan memilih titik simpan yang tepat'),
   S('SE05','Cabang Waktu','Dua NPC mengerjakan hal berbeda di cabang terpisah',['branch'],['commit'],bukti='Perubahan harus ditaruh di cabang yang benar agar yang lain tidak rusak'),
   S('SE06','Gabung dan Konflik','Gabungkan cabang yang mengubah baris yang sama',['merge'],['branch','commit'],bukti='Pemain memilih baris yang dipertahankan sehingga peta akhir memuat KEDUA perubahan'),
   S('SE07','Kembali ke Kemarin','Kembali ke versi sebelum bug muncul, tanpa kartu baru',[],['commit','branch','merge'])],
   'Dua cabang mengubah baris yang sama lalu digabung. Apa yang terjadi?',['merge']),
 M('S-M3','Pelabuhan Peti Kemas',[
   S('SE08','Peti Kemas','Aplikasi "jalan di rumahku, rusak di pulau lain": kemas semua bahan',['container'],['api_jawaban','isi_kotak'],bukti='Aplikasi hanya jalan di semua pulau bila pemain memasukkan setiap bahan yang kurang ke dalam peti'),
   S('SE09','Jalur Kapal','Urutkan build → uji → staging → produksi; putuskan kapan rollback',['deploy'],['container','commit'],bukti='Rilis buruk hanya selamat bila tahap uji ditempatkan sebelum produksi dan pemain memilih saat rollback'),
   S('SE10','Kapal Terakhir','Kirim aplikasi dari versi → peti → kapal, dengan rollback bila gagal',[],['api_permintaan','commit','merge','container','deploy'],label='Puzzle penutup')])]
EX=[M('E-M1','Pabrik Otomatis',[
   S('EX01','Sensor dan Sakelar','Jika pesanan masuk → kemas → kirim, tanpa campur tangan',['trigger'],['api_jawaban','jika'],bukti='Pemain merangkai pemicu→aksi lalu menyaksikan 10 pesanan diproses tanpa campur tangan'),
   S('EX02','Lini Perakitan','Rangkai alur otomatis berantai, tanpa kartu baru',[],['trigger','jika']),
   S('EX03','Ban Berjalan','Rancang jalur otomatis: simpan versi → uji → kemas → kirim',['pipeline'],['trigger','deploy','commit'],bukti='Pipeline harus menghentikan rilis yang gagal uji; pemain menempatkan gerbang uji di tahap yang benar')],
   'Satu rilis cacat lolos ke produksi. Tahap pipeline mana yang paling mungkin kurang?',['pipeline']),
 M('E-M2','Loket Ramai',[
   S('EX04','Loket dan Petugas','Atur jumlah pekerja agar antrean tidak meluap',['antrean_pekerja'],['antrean','trigger'],bukti='Antrean hanya tidak meluap bila jumlah pekerja disetel sesuai laju masuk'),
   S('EX05','Antrean Meluap','Atasi lonjakan dengan pekerja, tanpa kartu baru',[],['antrean_pekerja','antrean']),
   S('EX06','Pintu Tol','Bagi lalu lintas ke beberapa server',['skala'],['antrean_pekerja','api_jawaban'],bukti='Lonjakan trafik hanya tertangani bila beban dibagi ke beberapa server')],
   'Antrean 100 tugas, 5 petugas mampu 10 tugas/menit masing-masing. Berapa menit sampai habis?',['antrean_pekerja']),
 M('E-M3','Menara Pengawas',[
   S('EX07','Rak Cepat','Pilih isi rak cepat agar perjalanan ke gudang berkurang',['cache'],['rak','api_jawaban','skala'],bukti='Perjalanan ke gudang berkurang hanya bila pemain memilih barang yang paling sering diminta'),
   S('EX08','Tol dan Rak','Gabungkan pembagian beban dan rak cepat, tanpa kartu baru',[],['skala','cache','antrean_pekerja']),
   S('EX09','Rencana Darurat','Baca dasbor, temukan server bermasalah, aktifkan retry atau cadangan',['monitoring'],['cache','skala','trigger','api_jawaban'],bukti='Server rusak ditangani dengan memilih retry atau cadangan berdasarkan dasbor, bukan menebak'),
   S('EX10','Toko Online Otomatis','Bangun sistem toko: pemicu → antrean → pekerja → rak cepat → pengawas',[],['trigger','antrean_pekerja','skala','cache','monitoring','pipeline'],label='Puzzle penutup')])]
v03=dict(version='v0.3 (desain revisi pasca-review; Beginner 13, Junior 14, Middle A 10, Middle B 10, Senior 10, Expert 10)',rules=RULES,mechanics={k:v for k,v in MECH.items() if k not in('jika_dalam_ulangi','komposisi_fungsi','slot_nilai')},required_concepts=REQ_ALL,
 tests=[dict(id='Test1',gates=['B'],questions=T1),dict(id='Test2',gates=['MA','MB'],questions=T2)],
 modes=[dict(id='B',name='Beginner',missions=B),dict(id='J',name='Junior',missions=J),dict(id='MA',name='Middle A',missions=MA),dict(id='MB',name='Middle B',missions=MB),dict(id='S',name='Senior',missions=SE),dict(id='E',name='Expert',missions=EX)])
json.dump(v03,open('spec_v0.3.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
print('spec ditulis')

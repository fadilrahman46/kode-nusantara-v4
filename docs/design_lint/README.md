# design_lint — pemeriksa konsistensi kurikulum Kode Nusantara

Memeriksa **konsistensi desain** daftar stage (bukan apakah game seru atau efektif).

```bash
python3 build_specs.py                                     # membangun spec_v0.2_baseline.json dan spec_v0.3.json
python3 lint.py spec_v0.2_baseline.json hasil_v0.2_baseline.json
python3 lint.py spec_v0.3.json hasil_v0.3.json             # exit code 1 bila ada pelanggaran
```

**Aturan:** L1 prasyarat/pemakaian sebelum diperkenalkan · L2 maks. 1 mekanik baru per stage · L3 maks. 3 stage K berturut-turut · L4 tiap misi punya stage latihan/pelintir · L5 K non-pertama memakai ulang mekanik misi yang sama · L6 stage terakhir mode = P · L7 riddle hanya memakai konsep yang sudah diajarkan · L11 label stage jujur · L12 tidak ada mekanik yatim · L13 konsep wajib terajar · L14 bukti pemahaman (Senior/Expert) · L15 cakupan placement test (peringatan).

**Batas:** ambang aturan adalah heuristik; `spec_v0.2_baseline.json` adalah transkripsi manual GDD v0.2; desain v0.3 ditulis agar lolos aturan ini, jadi "lolos" bukan bukti kualitas.

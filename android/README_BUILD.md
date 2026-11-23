# Kode Nusantara — proyek Android (Capacitor)

Game v24 (satu berkas HTML, `www/index.html`) dibungkus WebView Android memakai Capacitor 8.6.2.
**Proyek ini belum pernah dibangun atau dijalankan** (lingkungan penyusunnya tidak bisa mengunduh Android SDK). Yang sudah diperiksa hanya struktur berkas, XML, dan isi `www/`.

Identitas bawaan (ganti sebelum dipublikasikan, ID aplikasi tidak bisa diubah setelah diterbitkan):
- Nama: `Kode Nusantara`
- ID aplikasi: `id.kodenusantara.app` (placeholder)
- minSdk 24 (Android 7.0), targetSdk 36

## Cara A — tanpa Android Studio (GitHub Actions)
1. Buat repositori GitHub baru (boleh privat), unggah seluruh isi folder ini.
2. Buka tab **Actions** → **Bangun APK debug** → **Run workflow** (atau cukup push ke cabang `main`).
3. Setelah hijau (sekitar 5–10 menit), unduh artefak **kode-nusantara-debug-apk** → `app-debug.apk`.

## Cara B — di komputer sendiri
Syarat: Node 22+, JDK 21, Android Studio (atau Android SDK platform 36 + build-tools).
```bash
npm ci
npx cap sync android
cd android && ./gradlew assembleDebug      # Windows: gradlew.bat assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
```
Atau `npx cap open android` lalu Build → Build APK(s) di Android Studio.

## Memasang di HP
Salin `app-debug.apk` ke HP, buka, izinkan “pasang dari sumber ini”. APK debug ditandatangani kunci debug: cukup untuk uji coba, **tidak untuk Google Play**.

## Memperbarui game
```bash
./salin-game.sh /jalur/ke/kode-nusantara-prototipe.html
```
lalu bangun ulang. Naikkan `versionCode` dan `versionName` di `android/app/build.gradle` untuk tiap pembaruan yang dibagikan.

## Rilis (Google Play)
- Buat kunci rilis sendiri (`keytool -genkey -v -keystore rilis.jks -alias kn -keyalg RSA -keysize 2048 -validity 10000`), simpan di luar repositori, **jangan hilang** (tanpa kunci ini pembaruan tidak bisa diterbitkan).
- Play meminta AAB: `./gradlew bundleRelease` dengan `signingConfig` rilis.
- Aplikasi untuk anak (SD) masuk kebijakan Play untuk keluarga: isi formulir keamanan data, sediakan kebijakan privasi. Game ini tidak mengirim data ke server, tetapi manifest masih memuat izin INTERNET (untuk font web opsional). Hapus izin itu bila game dipastikan berjalan tanpa font web.

## Perilaku yang perlu dicek di HP nyata
- Tombol Kembali Android menutup aplikasi (tidak ada riwayat halaman); progres tahap yang sedang dimainkan belum menang tidak tersimpan.
- Progres ada di penyimpanan WebView aplikasi: hapus data aplikasi atau copot pasang = progres hilang.
- Area layar Android 15+ (status bar, navigasi gestur) ditangani lewat `viewport-fit=cover` dan `env(safe-area-inset-*)` yang sudah dipakai game.
- Kinerja Three.js di HP murah (WebGL di WebView lama).

Orientasi: MainActivity dikunci potret (`android:screenOrientation="portrait"`), berlaku juga di tablet. Cutscene pembuka diputar tiap peluncuran aplikasi (sekali per sesi WebView).

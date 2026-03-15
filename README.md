# LHK Cloudflare + GitHub

Paket ini memindahkan **frontend** LHK ke **GitHub + Cloudflare Pages**, sementara **backend tetap Google Apps Script**.

## Arsitektur

- Frontend: Cloudflare Pages
- Proxy API: Cloudflare Pages Functions
- Backend: Google Apps Script Web App
- Database: Google Spreadsheet
- File: Google Drive
- Email: MailApp di Apps Script

## Isi paket

- `index.html` — UI aplikasi
- `style.css` — style utama
- `app.js` — logic frontend yang sudah diganti dari `google.script.run` ke request HTTP
- `manifest.webmanifest` — PWA manifest
- `sw.js` — service worker
- `offline.html` — halaman offline
- `functions/api/gas.js` — proxy dari Cloudflare ke Apps Script

## Langkah deploy

### 1. Deploy backend Google Apps Script

Pakai project Apps Script kamu yang sekarang:
- `appsscript.json`
- `Code.gs`
- `Report.html`
- `Migration_Live_Safe.gs` bila perlu

Deploy sebagai **Web App**:
- Execute as: `User deploying`
- Access: `Anyone`

Catat URL web app-nya, misalnya:

`https://script.google.com/macros/s/AKfycbxxxx/exec`

### 2. Upload repo ini ke GitHub

Buat repository baru, lalu upload isi folder ini.

### 3. Hubungkan repo ke Cloudflare Pages

Di Cloudflare Pages:
- Create project
- Connect to Git
- Pilih repo GitHub ini

### 4. Tambahkan environment variable

Di Cloudflare Pages > Settings > Environment Variables:
- Key: `GAS_WEB_APP_URL`
- Value: URL web app Apps Script kamu

Contoh:
- `GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbxxxx/exec`

### 5. Redeploy

Setelah env variable disimpan, lakukan deploy ulang.

## Endpoint yang dipakai frontend

Frontend memanggil Cloudflare Function ini:

- `POST /api/gas`

Function itu lalu meneruskan request ke Apps Script.

## Catatan penting

1. Paket ini **tetap membutuhkan backend Apps Script**.
2. Ini **bukan full migration ke Cloudflare Workers/D1/R2**.
3. Preview, PDF, Excel, Drive, Mail masih dikerjakan oleh Apps Script.
4. Karena backend tetap Apps Script, akun deployer Apps Script tetap harus punya izin ke Spreadsheet, Drive, dan Mail.

## Yang sudah diubah

- Semua pemanggilan `google.script.run` di frontend diganti ke request HTTP via `/api/gas`
- Manifest dan service worker dijadikan file statis
- Frontend siap di-host di Cloudflare Pages

## Yang belum diubah

- Backend Apps Script tetap seperti milikmu
- Tidak ada migrasi database ke D1
- Tidak ada migrasi file ke R2
- Tidak ada auth JWT native Cloudflare

## Bila ingin full Cloudflare

Kalau nanti mau, tahap berikutnya adalah rewrite backend:
- SpreadsheetApp -> D1 / Supabase
- DriveApp -> R2 / S3 / Google Drive API langsung
- MailApp -> Resend / MailChannels
- Session cache -> KV / Durable Objects


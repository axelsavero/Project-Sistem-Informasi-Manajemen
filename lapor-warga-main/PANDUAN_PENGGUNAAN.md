# 🚀 Panduan Menjalankan Aplikasi Lapor Warga

## Status Integrasi

✅ **Back-End Laravel**: Running di `http://localhost:8000`  
✅ **Front-End React**: Running di `http://localhost:8081`  
✅ **Database MySQL**: Configured dan migrated  
✅ **API Integration**: Sudah terintegrasi  
✅ **Authentication**: Sudah terpasang dengan Login/Logout

---

## 🎯 Cara Menggunakan Aplikasi

### 1. Akses Aplikasi

Buka browser dan kunjungi: **http://localhost:8081**

### 2. Halaman yang Tersedia

#### **Untuk Semua Pengguna (Public)**:

1. **Beranda** (`/`)

   - Halaman utama aplikasi
   - Informasi tentang sistem Lapor Warga

2. **Buat Laporan** (`/lapor`)

   - Form untuk membuat pengaduan baru
   - Bisa diakses tanpa login (anonymous)
   - Bisa juga dengan login untuk auto-fill data
   - Upload foto pendukung (max 5MB)
   - Dapatkan nomor tiket otomatis

3. **Lacak Laporan** (`/tracking`)

   - Cek status laporan dengan nomor tiket
   - Lihat progress pengaduan Anda
   - Baca catatan dari admin

4. **Login** (`/login`)
   - Login sebagai User atau Admin
   - Credentials demo tersedia

#### **Untuk Admin Only**:

5. **Dashboard Admin** (`/admin`)
   - **HARUS LOGIN SEBAGAI ADMIN**
   - Lihat semua laporan
   - Filter berdasarkan status dan kategori
   - Search by ticket number, nama, atau alamat
   - Update status laporan
   - Tambah catatan admin
   - Lihat statistik

---

## 👤 Akun Demo

### Admin Account

```
Email   : admin@laporwarga.com
Password: admin123
```

Gunakan akun ini untuk:

- Akses dashboard admin
- Kelola semua laporan
- Update status laporan
- Tambah catatan untuk warga

### User Account (Opsional)

Anda bisa membuat akun user baru dengan klik "Daftar di sini" di halaman login.

---

## 🔄 Alur Penggunaan

### Scenario 1: Warga Membuat Laporan (Tanpa Login)

1. Buka `http://localhost:8081`
2. Klik **"Buat Laporan"** di menu
3. Isi formulir:
   - Nama lengkap
   - Email
   - No. HP
   - Alamat lokasi masalah
   - Kategori (pilih dari dropdown)
   - Deskripsi masalah (min 20 karakter)
   - Upload foto (opsional)
4. Klik **"Kirim Laporan"**
5. **SIMPAN NOMOR TIKET** yang muncul (contoh: LP241205-ABC123)
6. Gunakan nomor tiket untuk tracking

### Scenario 2: Tracking Laporan

1. Klik **"Lacak Laporan"** di menu
2. Masukkan nomor tiket Anda
3. Klik **Search/Cari**
4. Lihat:
   - Status terkini (Menunggu/Diproses/Selesai/Ditolak)
   - Detail laporan
   - Catatan dari admin (jika ada)
   - Waktu pembaruan terakhir

### Scenario 3: Admin Mengelola Laporan

1. Klik **"Login"** di header (kanan atas)
2. Login dengan akun admin
3. Setelah login, klik **"Admin"** di menu
4. Dashboard menampilkan:

   - **Statistik**: Total, Menunggu, Diproses, Selesai, Ditolak
   - **Tabel Laporan**: Semua laporan dengan pagination
   - **Filter**: By status dan kategori
   - **Search**: Cari berdasarkan tiket/nama/alamat

5. **Untuk Update Status**:

   - Klik icon **Edit** (pensil) pada laporan
   - Dialog akan muncul
   - Pilih status baru (Pending/In Progress/Completed/Rejected)
   - Tambahkan catatan (opsional)
   - Klik **"Simpan"**

6. **Untuk Lihat Detail**:
   - Klik icon **Eye** (mata) pada laporan
   - Dialog menampilkan semua informasi lengkap

---

## 🔐 Fitur Authentication

### Login/Logout

**Login**:

1. Klik tombol **"Login"** di header (kanan atas)
2. Masukkan email dan password
3. Klik **"Login"**
4. Jika admin → redirect ke dashboard admin
5. Jika user → redirect ke beranda

**Logout**:

1. Klik tombol **"Logout"** di header
2. Otomatis redirect ke beranda
3. Token akan dihapus

### Proteksi Admin

- Halaman `/admin` **HANYA** bisa diakses oleh admin
- Jika non-admin coba akses → redirect ke beranda
- Jika belum login → redirect ke login page

---

## 📊 Kategori Laporan

1. **Jalan Rusak** - Jalan berlubang, rusak
2. **Sampah Menumpuk** - Sampah tidak diangkut
3. **Penerangan Jalan Mati** - Lampu jalan rusak
4. **Saluran Air Tersumbat** - Drainase bermasalah
5. **Fasilitas Umum Rusak** - Fasilitas public rusak
6. **Lainnya** - Masalah lain

## 📈 Status Laporan

1. **⏳ Menunggu** (Pending) - Laporan baru, belum ditangani
2. **⚙️ Diproses** (In Progress) - Sedang dalam penanganan
3. **✅ Selesai** (Completed) - Masalah sudah diselesaikan
4. **❌ Ditolak** (Rejected) - Laporan ditolak

---

## 🧪 Testing Lengkap

### Test 1: Buat Laporan Tanpa Login

```
1. Buka http://localhost:8081/lapor
2. Isi semua field
3. Submit
4. Cek apakah dapat nomor tiket
5. Cek di database: tabel complaints bertambah
```

### Test 2: Tracking

```
1. Gunakan nomor tiket dari test 1
2. Buka /tracking
3. Masukkan nomor tiket
4. Verifikasi data muncul
```

### Test 3: Login sebagai Admin

```
1. Buka /login
2. Email: admin@laporwarga.com
3. Password: admin123
4. Cek redirect ke /admin
5. Cek nama muncul di header
6. Badge "Admin" tampil
```

### Test 4: Update Status (Admin)

```
1. Login sebagai admin
2. Buka /admin
3. Klik icon edit pada laporan
4. Ubah status ke "Diproses"
5. Tambah catatan: "Sedang ditindaklanjuti"
6. Simpan
7. Buka /tracking dengan nomor tiket tersebut
8. Verifikasi status berubah dan catatan muncul
```

### Test 5: Logout

```
1. Klik tombol Logout di header
2. Cek redirect ke homepage
3. Badge admin hilang
4. Tombol "Login" muncul lagi
5. Coba akses /admin → redirect ke /login
```

---

## 🛠️ Troubleshooting

### Masalah: "Network Error" atau "Failed to fetch"

**Penyebab**: Backend Laravel tidak berjalan

**Solusi**:

```bash
cd backend
php artisan serve
```

### Masalah: "401 Unauthorized" setelah login

**Penyebab**: Token tidak tersimpan atau expired

**Solusi**:

1. Clear localStorage di browser (F12 → Application → Clear Storage)
2. Login ulang

### Masalah: "403 Forbidden" saat akses admin

**Penyebab**: Login dengan akun user, bukan admin

**Solusi**:

1. Logout
2. Login dengan akun admin:
   - Email: admin@laporwarga.com
   - Password: admin123

### Masalah: Upload foto error

**Penyebab**: Storage link belum dibuat

**Solusi**:

```bash
cd backend
php artisan storage:link
```

### Masalah: Database connection error

**Penyebab**: Database belum dibuat atau .env salah

**Solusi**:

1. Buat database:
   ```sql
   CREATE DATABASE lapor_warga;
   ```
2. Cek .env di folder backend
3. Pastikan credentials benar
4. Run migration:
   ```bash
   php artisan migrate
   ```

---

## 📱 URL Lengkap

| Page            | URL                            | Akses      |
| --------------- | ------------------------------ | ---------- |
| Beranda         | http://localhost:8081/         | Public     |
| Buat Laporan    | http://localhost:8081/lapor    | Public     |
| Lacak Laporan   | http://localhost:8081/tracking | Public     |
| Login           | http://localhost:8081/login    | Public     |
| Dashboard Admin | http://localhost:8081/admin    | Admin Only |
| API Base        | http://localhost:8000/api      | -          |

---

## 🎨 Fitur Tambahan

### Header yang Dinamis

- Menampilkan nama user setelah login
- Badge "Admin" untuk akun admin
- Tombol Login/Logout responsif
- Menu Admin hanya muncul untuk admin

### Form Validation

- Validasi client-side di front-end
- Validasi server-side di Laravel
- Error messages dalam Bahasa Indonesia
- Visual feedback untuk field error

### Responsive Design

- Mobile-friendly
- Adaptive layout
- Touch-optimized untuk mobile

---

## 🔒 Security Features

✅ Token-based Authentication (Laravel Sanctum)  
✅ Role-based Access Control (User/Admin)  
✅ Password Hashing (Bcrypt)  
✅ Input Validation (Client & Server)  
✅ File Upload Validation  
✅ CORS Protection  
✅ SQL Injection Protection (Eloquent ORM)

---

## ✨ Selesai!

Aplikasi Lapor Warga sudah **fully integrated** dan siap digunakan!

**Yang Sudah Berfungsi**:

- ✅ Login/Logout dengan autentikasi
- ✅ Buat laporan (anonymous atau login)
- ✅ Tracking laporan by ticket number
- ✅ Dashboard admin dengan CRUD lengkap
- ✅ Upload foto
- ✅ Filter dan search
- ✅ Role-based access
- ✅ Real-time statistics

**Next Steps (Opsional)**:

1. Customize styling/colors
2. Add email notifications
3. Add more categories
4. Add export to PDF/Excel
5. Add charts/graphs in admin
6. Deploy to production

Selamat menggunakan! 🎉

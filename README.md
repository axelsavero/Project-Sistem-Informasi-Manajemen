# 📢 Sistem Informasi Pengaduan Masyarakat (SIPEMA)

<div align="center">

![SIPEMA](https://img.shields.io/badge/SIPEMA-blue?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

**Aplikasi berbasis web untuk mengelola pengaduan masyarakat secara efisien dan transparan**

</div>

---

## 👥 Identitas Kelompok

### Kelompok 14

| No  | Nama Lengkap               | NIM        |
| --- | -------------------------- | ---------- |
| 1   | Muhammad Axel Savero Fikri | 1313623004 |
| 2   | Andhika Dwiputra Soetjiadi | 1313623053 |

---

## 📋 Deskripsi Proyek

**Sistem Informasi Pengaduan Masyarakat (SIPM)** adalah aplikasi web yang memungkinkan masyarakat untuk menyampaikan pengaduan, keluhan, atau aspirasi kepada instansi terkait. Sistem ini dirancang untuk meningkatkan transparansi dan efisiensi dalam penanganan masalah masyarakat.

### Fitur Utama

- 📝 **Pengaduan Online** - Masyarakat dapat mengajukan pengaduan secara online
- 📊 **Dashboard Admin** - Panel administrasi untuk mengelola pengaduan
- 📈 **Tracking Status** - Pelacakan status pengaduan secara real-time
- 🔔 **Notifikasi** - Pemberitahuan update status pengaduan
- 📱 **Responsive Design** - Dapat diakses dari berbagai perangkat

---

## 🛠️ Tech Stack

### Backend

- **Framework**: Laravel 12
- **PHP**: ^8.2
- **Database**: MySQL / PostgreSQL
- **Authentication**: Laravel Sanctum

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / shadcn/ui
- **State Management**: React Query (TanStack Query)

---

## 📁 Struktur Proyek

```
Project-Sistem-Informasi-Manajemen/
├── lapor-warga-be/          # Backend (Laravel)
│   ├── app/                 # Application logic
│   ├── config/              # Configuration files
│   ├── database/            # Migrations & seeders
│   ├── routes/              # API routes
│   └── ...
│
└── lapor-warga-main/        # Frontend (React + TypeScript)
    ├── src/                 # Source code
    ├── public/              # Static assets
    └── ...
```

---

## 🚀 Instalasi & Setup

### Prasyarat

- PHP ^8.2
- Composer
- Node.js & npm/bun
- MySQL / PostgreSQL

### Backend Setup

```bash
# Masuk ke direktori backend
cd lapor-warga-be

# Install dependencies
composer install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di file .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=lapor_warga
# DB_USERNAME=root
# DB_PASSWORD=

# Jalankan migrasi database
php artisan migrate

# Jalankan seeder (opsional)
php artisan db:seed

# Jalankan server
php artisan serve
```

### Frontend Setup

```bash
# Masuk ke direktori frontend
cd lapor-warga-main

# Install dependencies
npm install
# atau
bun install

# Jalankan development server
npm run dev
# atau
bun dev
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan mata kuliah **Sistem Informasi Manajemen**.

---

<div align="center">

**Universitas Negeri Jakarta © 2024**

</div>

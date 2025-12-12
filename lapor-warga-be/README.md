# Lapor Warga - Laravel Back-End

Back-end API untuk aplikasi Lapor Warga (Citizen Reporting System) menggunakan Laravel 11 dengan MySQL database.

## 📋 Prerequisites

-   PHP 8.2 atau lebih tinggi
-   Composer
-   MySQL 8.0+
-   Node.js & NPM (untuk front-end)

## 🚀 Installation

### 1. Clone Repository

Jika Anda belum memiliki project:

```bash
git clone <repository-url>
cd lapor-warga-main/backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Configuration

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
APP_NAME="Lapor Warga"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lapor_warga
DB_USERNAME=root
DB_PASSWORD=

# CORS Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Create Database

Buat database MySQL:

```sql
CREATE DATABASE lapor_warga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Create Storage Link

```bash
php artisan storage:link
```

### 8. Seed Admin User

```bash
php artisan db:seed --class=AdminSeeder
```

**Default Admin Credentials:**

-   Email: `admin@laporwarga.com`
-   Password: `admin123`

⚠️ **PENTING:** Ubah password admin di production!

## 🏃 Running the Application

Start Laravel development server:

```bash
php artisan serve
```

API akan berjalan di: `http://localhost:8000`

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890"
}
```

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@laporwarga.com",
  "password": "admin123"
}
```

Response:

```json
{
  "message": "Login berhasil",
  "user": {...},
  "token": "1|xxxxxxxxxxxxx",
  "role": "admin"
}
```

#### Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

#### Get Current User

```http
GET /api/me
Authorization: Bearer {token}
```

### Complaint Endpoints

#### Create Complaint (Public)

```http
POST /api/complaints
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: 081234567890
address: Jl. Sudirman No. 123
category: jalan_rusak
description: Jalan berlubang sangat berbahaya
image: [file]
```

Categories:

-   `jalan_rusak` - Jalan Rusak
-   `sampah` - Sampah Menumpuk
-   `penerangan` - Penerangan Jalan Mati
-   `saluran_air` - Saluran Air Tersumbat
-   `fasilitas_umum` - Fasilitas Umum Rusak
-   `lainnya` - Lainnya

#### Find by Ticket Number (Public)

```http
GET /api/complaints/ticket/{ticketNumber}

Example: GET /api/complaints/ticket/LP241205-ABC123
```

#### Get All Complaints (Admin Only)

```http
GET /api/complaints?status=pending&search=ABC
Authorization: Bearer {admin_token}
```

Query Parameters:

-   `status`: Filter by status (pending, in_progress, completed, rejected, all)
-   `category`: Filter by category
-   `search`: Search by ticket number, name, or address
-   `page`: Pagination

#### Get Complaint by ID (Admin Only)

```http
GET /api/complaints/{id}
Authorization: Bearer {admin_token}
```

#### Update Complaint (Admin Only)

```http
PUT /api/complaints/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "in_progress",
  "admin_notes": "Sedang dalam proses perbaikan"
}
```

#### Delete Complaint (Admin Only)

```http
DELETE /api/complaints/{id}
Authorization: Bearer {admin_token}
```

#### Get Statistics (Admin Only)

```http
GET /api/complaints-stats
Authorization: Bearer {admin_token}
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       └── ComplaintController.php
│   │   ├── Middleware/
│   │   │   └── AdminOnly.php
│   │   └── Requests/
│   │       ├── StoreComplaintRequest.php
│   │       └── UpdateComplaintRequest.php
│   └── Models/
│       ├── User.php
│       └── Complaint.php
├── database/
│   ├── migrations/
│   │   ├── 2025_12_04_175837_add_role_and_phone_to_users_table.php
│   │   └── 2025_12_04_175841_create_complaints_table.php
│   └── seeders/
│       └── AdminSeeder.php
├── routes/
│   └── api.php
└── storage/
    └── app/
        └── public/
            └── complaints/  # Uploaded images
```

## 🗄️ Database Schema

### Users Table

-   `id`: Primary key
-   `name`: User full name
-   `email`: Unique email
-   `password`: Hashed password
-   `phone`: Phone number (nullable)
-   `role`: enum ('user', 'admin')
-   `email_verified_at`: Timestamp
-   `created_at`, `updated_at`: Timestamps

### Complaints Table

-   `id`: Primary key
-   `user_id`: Foreign key to users (nullable)
-   `ticket_number`: Unique ticket identifier
-   `name`: Reporter name
-   `email`: Reporter email
-   `phone`: Reporter phone
-   `address`: Location address
-   `category`: Complaint category
-   `description`: Problem description
-   `image_path`: Uploaded image path (nullable)
-   `status`: enum ('pending', 'in_progress', 'completed', 'rejected')
-   `admin_notes`: Admin notes (nullable)
-   `created_at`, `updated_at`: Timestamps

## 🔒 Security Features

-   **Authentication**: Laravel Sanctum for API token authentication
-   **Password Hashing**: Bcrypt hashing for passwords
-   **Input Validation**: Form Request validation for all inputs
-   **File Upload Validation**: Image type and size validation
-   **Role-Based Access Control**: Admin-only endpoints protected
-   **SQL Injection Protection**: Eloquent ORM parameterized queries
-   **CORS Configuration**: Configured for front-end integration

## 🧪 Testing

Run migrations in testing environment:

```bash
php artisan migrate:fresh --seed --env=testing
```

Test the API using tools like:

-   Postman
-   Thunder Client (VS Code)
-   Insomnia
-   cURL

Example cURL request:

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laporwarga.com","password":"admin123"}'
```

## 🔧 Common Commands

```bash
# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# List all routes
php artisan route:list

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName -m  # with migration

# Create new seeder
php artisan make:seeder SeederName
```

## 🐛 Troubleshooting

### Error "No application encryption key has been specified"

```bash
php artisan key:generate
```

### CORS Error from Front-End

Update `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Storage Link Not Working

```bash
php artisan storage:link
```

### Database Connection Error

-   Check database credentials in `.env`
-   Ensure MySQL server is running
-   Verify database exists

### Permission Errors

```bash
chmod -R 775 storage bootstrap/cache
```

## 📝 Notes

-   Default admin password should be changed in production
-   Ensure `.env` file is properly configured
-   Storage link must be created for image uploads
-   API uses token-based authentication with Laravel Sanctum
-   All endpoints return JSON responses
-   Error responses include appropriate HTTP status codes

## 🔗 Related Documentation

-   [Laravel 11 Documentation](https://laravel.com/docs/11.x)
-   [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
-   [Eloquent ORM](https://laravel.com/docs/11.x/eloquent)

## 👥 User Roles

-   **User**: Can create complaints, track own complaints
-   **Admin**: All user permissions + view all complaints, update status, delete complaints

## 📄 License

This project is licensed under the MIT License.

# 🚀 Panduan Optimasi Performa Laravel RSM

Dokumen ini berisi panduan lengkap untuk mengoptimasi performa aplikasi Laravel RSM setelah di-deploy ke server production.

## 📋 Daftar Isi

1. [Optimasi yang Sudah Dilakukan](#optimasi-yang-sudah-dilakukan)
2. [Langkah-langkah Deploy ke Production](#langkah-langkah-deploy)
3. [Konfigurasi Server](#konfigurasi-server)
4. [Monitoring Performa](#monitoring-performa)

---

## ✅ Optimasi yang Sudah Dilakukan

### 1. **Database Query Optimization**

#### N+1 Query Problem - FIXED
- Menggunakan `withSum()` untuk menghitung total tanpa query tambahan
- Menggunakan `with()` untuk eager loading relasi
- Menggunakan `select()` untuk memilih kolom yang diperlukan saja

```php
// SEBELUM (N+1 Problem - lambat)
$sales = Sale::get()->map(function($sale) {
    return ['total' => $sale->listSale->sum('total_price')]; // Query per item!
});

// SESUDAH (Optimized)
$sales = Sale::select('id', 'updated_at')
    ->withSum('listSale', 'total_price') // 1 query saja
    ->get();
```

#### Database Indexes - ADDED
- Migration baru: `2026_01_09_183740_add_performance_indexes.php`
- Index ditambahkan pada kolom yang sering di-filter:
  - `sales.branch_id`, `sales.updated_at`
  - `employees.status`, `employees.branch_id`
  - `request_orders.branch_id`, `request_orders.status`
  - `list_sales.sale_id`, `list_sales.total_price`

### 2. **Caching Implementation**

Data yang sering diakses di-cache untuk mengurangi query database:

```php
// Employee data (cache 5 menit)
Cache::remember("employee_{$username}", 300, fn() => Employee::find(...));

// Active branches (cache 5 menit)  
Cache::remember('active_branches', 300, fn() => Branch::where('status', 'Aktif')->get());
```

### 3. **Frontend Build Optimization**

File `vite.config.js` dioptimasi dengan:
- **Code Splitting**: Memisahkan vendor chunks untuk caching lebih baik
- **Terser Minification**: Menghapus console.log dan debugger
- **CSS Code Splitting**: Memisahkan CSS untuk loading paralel

---

## 🔧 Langkah-langkah Deploy ke Production

### 1. Upload File ke Server

```bash
# Upload semua file kecuali vendor dan node_modules
rsync -avz --exclude 'vendor' --exclude 'node_modules' ./ user@server:/path/to/app/
```

### 2. Configure Environment

```bash
# Copy konfigurasi production
cp .env.production .env

# Edit sesuai server
nano .env
```

**Penting! Pastikan pengaturan ini di `.env`:**

```env
APP_ENV=production
APP_DEBUG=false
CACHE_STORE=file      # atau redis jika tersedia
SESSION_DRIVER=file   # atau redis jika tersedia
```

### 3. Jalankan Script Optimasi

```bash
# Beri permission
chmod +x optimize-production.sh

# Jalankan
bash optimize-production.sh
```

Script ini akan otomatis:
- Install composer dependencies (production only)
- Cache config, routes, views
- Build frontend assets
- Clear old caches
- Optimize autoloader

### 4. Jalankan Database Migration

```bash
php artisan migrate --force
```

---

## 🖥️ Konfigurasi Server

### PHP Configuration (php.ini)

```ini
; OPcache - WAJIB untuk production
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=1

; Memory limit
memory_limit=512M

; Upload size (sesuaikan kebutuhan)
upload_max_filesize=50M
post_max_size=50M

; Execution time
max_execution_time=60
```

### MySQL Configuration (my.cnf)

```ini
[mysqld]
# InnoDB Buffer Pool - set ke 70-80% RAM yang tersedia
innodb_buffer_pool_size=1G
innodb_buffer_pool_instances=4

# Query Cache
query_cache_type=1
query_cache_size=64M
query_cache_limit=2M

# Connection
max_connections=200
wait_timeout=600

# Slow query log untuk debugging
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/app/public;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml application/javascript
               application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        
        # FastCGI optimization
        fastcgi_buffer_size 32k;
        fastcgi_buffers 8 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }
}
```

---

## 📊 Monitoring Performa

### 1. Laravel Telescope (Development)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### 2. Query Logging (Temporary Debug)

Tambahkan di `AppServiceProvider.php`:

```php
public function boot(): void
{
    if (config('app.debug')) {
        DB::listen(function ($query) {
            Log::info($query->sql, ['bindings' => $query->bindings, 'time' => $query->time]);
        });
    }
}
```

### 3. Laravel Debugbar (Development)

```bash
composer require barryvdh/laravel-debugbar --dev
```

---

## ⚡ Quick Checklist

- [ ] `APP_DEBUG=false` di production
- [ ] `APP_ENV=production` di production
- [ ] `CACHE_STORE=file` atau `redis`
- [ ] `SESSION_DRIVER=file` atau `redis`
- [ ] OPcache enabled di PHP
- [ ] Gzip compression enabled di Nginx
- [ ] Database indexes sudah di-migrate
- [ ] Frontend assets sudah di-build (`npm run build`)
- [ ] Laravel caches sudah di-generate (`php artisan optimize`)
- [ ] File permissions sudah benar (755 untuk storage)

---

## 🔄 Jika Masih Lambat

1. **Cek slow queries** di MySQL slow log
2. **Cek memory usage** dengan `htop` atau `free -m`
3. **Cek CPU usage** saat loading
4. **Review N+1 queries** dengan Laravel Debugbar
5. **Tambahkan Redis** jika tersedia untuk cache & session
6. **Upgrade server specs** jika resources tidak cukup

---

*Terakhir diupdate: 9 Januari 2026*

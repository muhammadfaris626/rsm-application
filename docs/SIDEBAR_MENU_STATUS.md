# Sidebar Menu Status

Tanggal audit: 2026-04-27

Dokumen ini mencatat semua menu yang tersedia di sidebar, urut dari atas ke bawah, beserta route utama, permission menu, dan status perbaikannya.

## Ringkasan Perbaikan

- Sidebar dibuat aman untuk SSR dengan konfigurasi Ziggy pada `resources/js/ssr.js` dan shared prop `ziggy`.
- Grup Karyawan diperbaiki agar permission `termination: menu` ikut membuka menu.
- Submenu Kinerja ditambahkan karena permission dan route `performances.index` sudah ada.
- Halaman tambah Absensi ditambahkan agar tombol `Tambah Data` tidak menuju route kosong.
- Status aktif sidebar diperbaiki untuk halaman `attendances.create`, `attendances.show`, dan `locations.create`.
- Permission `approval-type` dimasukkan ke seeder dan data migration agar menu Jenis Persetujuan tersedia untuk role root/admin-pusat.
- Blocker verifikasi username/login diperbaiki sehingga test suite dapat berjalan penuh.
- Audit detail grup Produk selesai untuk menu Penjualan, Pembelian Persediaan, Permintaan Stok, Permintaan Return, Barang Cabang, dan Barang Pusat.
- Penjualan diperbaiki untuk role pusat/cabang, filter barang dan teknisi sesuai cabang, detail modal memuat barang dan histori, serta hapus penjualan mengembalikan stok cabang.
- Pembelian Persediaan diperbaiki agar detail memuat barang dan histori, form edit menormalkan supplier, dan data yang stoknya sudah dipakai permintaan stok tidak bisa dihapus.
- Permintaan Stok diperbaiki untuk role admin pusat, detail/edit memuat stok dan produk, pencarian tetap sesuai scope cabang, serta edit/hapus dibatasi sebelum proses berjalan.
- Permintaan Return diperbaiki agar create/edit aman untuk role pusat, nomor RO wajib sesuai cabang, input jumlah return tersimpan benar, edit/hapus aktif, dan data yang sudah diproses tidak bisa diubah/hapus.
- Barang Cabang dan Barang Pusat diperbaiki pada grouping/pencarian agar data cabang tidak bocor ke role cabang lain.
- Operasional Pusat/Cabang diperbaiki pada scope role pusat/cabang, grouping pencarian, normalisasi pilihan multiselect, dan tampilan histori perubahan.
- Manajemen diperbaiki pada filter laporan, cetak laporan cabang, akses admin pusat/root, struktur manajemen, dan guard hapus data yang masih dipakai transaksi.
- Karyawan diperbaiki pada mutasi, pemberhentian, absensi, dan kinerja termasuk validasi karyawan aktif, revert cabang saat batal mutasi, serta refresh data API setelah hapus.
- Database diperbaiki pada Kategori Barang, Barang, Karyawan, Cabang, Pengeluaran, Jabatan, Supplier, dan Lokasi: pencarian dikelompokkan, histori dimuat, hapus data terpakai diblokir, dan payload object/id dibuat aman.
- Pengaturan diperbaiki pada Akun, Peran, Perizinan, dan Jenis Persetujuan: pencarian akun sesuai field, role `approval-type` muncul di detail peran, cache perizinan dibersihkan, dan akun aktif tidak bisa menghapus dirinya sendiri.
- Sapuan akhir memperbaiki akses langsung `roles[0]`, `branch_id[0]`, dan `last_update.user` agar halaman tidak crash saat relasi kosong.

## Progress Audit Bertahap

| Urutan | Area | Menu yang Dicakup | Status |
| --- | --- | --- | --- |
| 1 | Dashboard | Beranda | Selesai |
| 2 | Produk | Penjualan, Pembelian Persediaan, Permintaan Stok, Permintaan Return, Barang Cabang, Barang Pusat | Selesai |
| 3 | Operasional | Pusat, Cabang | Selesai |
| 4 | Manajemen | Laporan Cabang, Laporan, Struktur Manajemen | Selesai |
| 5 | Karyawan | Absensi, Kinerja, Mutasi, Pemberhentian | Selesai |
| 6 | Database | Kategori Barang, Barang, Karyawan, Cabang, Pengeluaran, Jabatan, Supplier, Lokasi | Selesai |
| 7 | Pengaturan | Akun, Peran, Perizinan, Jenis Persetujuan | Selesai |

## Checklist Menu

| No | Grup | Menu | Route utama | Permission | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Dashboard | Beranda | `dashboard` / `home` | Login user | Selesai |
| 2 | Produk | Penjualan | `sales.index` | `sale: menu` | Selesai |
| 3 | Produk | Pembelian Persediaan | `inventoryPurchases.index` | `inventory-purchase: menu` | Selesai |
| 4 | Produk | Permintaan Stok | `requestOrders.index` | `request-order: menu` | Selesai |
| 5 | Produk | Permintaan Return | `requestReturns.index` | `request-return: menu` | Selesai |
| 6 | Produk | Barang Cabang | `branchProducts.index` | `branch-product: menu` | Selesai |
| 7 | Produk | Barang Pusat | `centerProducts.index` | `center-stock: menu` | Selesai |
| 8 | Operasional | Pusat | `operationalCenters.index` | `operational-center: menu` | Selesai |
| 9 | Operasional | Cabang | `operationalBranches.index` | `operational-branch: menu` | Selesai |
| 10 | Manajemen | Laporan Cabang | `reportBranches.index` | `report-branch: menu` | Selesai |
| 11 | Manajemen | Laporan | `reports.index` | `report: menu` | Selesai |
| 12 | Manajemen | Struktur Manajemen | `managementStructures.index` | `management-structure: menu` | Selesai |
| 13 | Karyawan | Absensi | `attendances.index` | `attendance: menu` | Selesai |
| 14 | Karyawan | Kinerja | `performances.index` | `performance: menu` | Selesai |
| 15 | Karyawan | Mutasi | `mutations.index` | `mutation: menu` | Selesai |
| 16 | Karyawan | Pemberhentian | `terminations.index` | `termination: menu` | Selesai |
| 17 | Database | Kategori Barang | `productCategories.index` | `product-category: menu` | Selesai |
| 18 | Database | Barang | `products.index` | `product: menu` | Selesai |
| 19 | Database | Karyawan | `employees.index` | `employee: menu` | Selesai |
| 20 | Database | Cabang | `branches.index` | `branch: menu` | Selesai |
| 21 | Database | Pengeluaran | `expenditures.index` | `expenditure: menu` | Selesai |
| 22 | Database | Jabatan | `positions.index` | `position: menu` | Selesai |
| 23 | Database | Supplier | `suppliers.index` | `supplier: menu` | Selesai |
| 24 | Database | Lokasi | `locations.index` | `location: menu` | Selesai |
| 25 | Pengaturan | Akun | `users.index` | `user: menu` | Selesai |
| 26 | Pengaturan | Peran | `roles.index` | `role: menu` | Selesai |
| 27 | Pengaturan | Perizinan | `permissions.index` | `permission: menu` | Selesai |
| 28 | Pengaturan | Jenis Persetujuan | `approvalTypes.index` | `approval-type: menu` | Selesai |
| 29 | Akun | Keluar | `logout` | Login user | Selesai |

## Verifikasi

- `npm run build`: berhasil setelah audit semua menu. Catatan: build masih menampilkan warning lama terkait import `QrcodeCanvas`/`QrcodeSvg` yang tidak dipakai pada file barcode, tetapi build tetap sukses.
- `php artisan route:list --name=performances`: route tersedia.
- `php artisan route:list --name=attendances`: route tersedia.
- `php artisan route:list --name=approvalTypes`: route tersedia.
- `php -l` controller/model/request PHP yang diubah: berhasil.
- `php artisan test`: 25 test passed, 62 assertions.

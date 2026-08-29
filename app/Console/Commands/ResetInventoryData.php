<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class ResetInventoryData extends Command
{
    protected $signature = 'inventory:reset
                            {--force : Hapus tanpa pertanyaan konfirmasi}';

    protected $description = 'Hapus seluruh barang, kategori, stok, dan transaksi barang';

    /**
     * Tables are ordered from the most dependent records to their parents.
     *
     * @var list<string>
     */
    private const TABLES = [
        'list_request_returns',
        'request_return_logs',
        'update_request_return_histories',
        'request_returns',
        'list_sales',
        'update_sale_histories',
        'sales',
        'branch_products',
        'list_request_orders',
        'request_order_logs',
        'update_request_order_histories',
        'request_orders',
        'center_stocks',
        'list_inventory_purchases',
        'update_inventory_purchase_histories',
        'inventory_purchases',
        'update_product_histories',
        'products',
        'update_product_category_histories',
        'product_categories',
    ];

    public function handle(): int
    {
        $counts = collect(self::TABLES)
            ->mapWithKeys(fn (string $table) => [$table => DB::table($table)->count()]);

        $this->warn('PERINGATAN: tindakan ini tidak dapat dibatalkan.');
        $this->line('Seluruh barang, kategori, stok pusat/cabang, pembelian, permintaan stok, penjualan, return, dan riwayat terkait akan dihapus.');
        $this->newLine();
        $this->table(
            ['Jenis data', 'Jumlah'],
            [
                ['Kategori barang', $counts['product_categories']],
                ['Barang', $counts['products']],
                ['Stok pusat', $counts['center_stocks']],
                ['Stok cabang', $counts['branch_products']],
                ['Pembelian', $counts['inventory_purchases']],
                ['Permintaan stok', $counts['request_orders']],
                ['Penjualan', $counts['sales']],
                ['Return', $counts['request_returns']],
            ]
        );

        if ($counts->sum() === 0) {
            $this->info('Data barang sudah kosong. Tidak ada data yang dihapus.');
            return self::SUCCESS;
        }

        if (!$this->option('force') && !$this->confirm('Anda yakin ingin menghapus SEMUA data tersebut?', false)) {
            $this->info('Penghapusan dibatalkan.');
            return self::SUCCESS;
        }

        try {
            DB::transaction(function (): void {
                foreach (self::TABLES as $table) {
                    DB::table($table)->delete();
                }
            });

            $this->resetSequences();
        } catch (Throwable $exception) {
            report($exception);
            $this->error('Penghapusan gagal. Seluruh perubahan dibatalkan dan data tetap aman.');
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Semua data barang dan transaksi terkait berhasil dihapus.');
        $this->line('Data pengguna, karyawan, cabang, supplier, dan data operasional lainnya tetap tersimpan.');

        return self::SUCCESS;
    }

    private function resetSequences(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            foreach (self::TABLES as $table) {
                DB::statement("ALTER TABLE `{$table}` AUTO_INCREMENT = 1");
            }
            return;
        }

        if ($driver === 'sqlite') {
            DB::table('sqlite_sequence')->whereIn('name', self::TABLES)->delete();
        }
    }
}

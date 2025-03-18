<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\UpdateProductHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder {

    public function run(): void {
        $sqlPath = database_path('seeders/sql/products.sql');
        if (File::exists($sqlPath)) {
            $sql = File::get($sqlPath);
            DB::unprepared($sql);
            $this->command->info('ProductSeeder: Data produk berhasil diinsert dari file SQL.');
        } else {
            $this->command->error('ProductSeeder: File SQL tidak ditemukan.');
        }
        $data = Product::all();
        foreach ($data as $key => $value) {
            UpdateProductHistory::create([
                'product_id' => $value->id,
                'user_id' => 1
            ]);
        }
    }
}

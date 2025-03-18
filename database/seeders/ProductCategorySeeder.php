<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProductCategorySeeder extends Seeder {

    public function run(): void {
        $sqlPath = database_path('seeders/sql/product_categories.sql');
        if (File::exists($sqlPath)) {
            $sql = File::get($sqlPath);
            DB::unprepared($sql);
            $this->command->info('ProductCategorySeeder: Data kategori produk berhasil diinsert dari file SQL.');
        } else {
            $this->command->error('ProductCategorySeeder: File SQL tidak ditemukan.');
        }
        $data = ProductCategory::all();
        foreach ($data as $key => $value) {
            UpdateProductCategoryHistory::create([
                'product_category_id' => $value->id,
                'user_id' => 1
            ]);
        }
    }
}

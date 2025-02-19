<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'product_category_code' => 'PK001',
                'product_category_name' => 'Kategori Produk 1'
            ],
            [
                'product_category_code' => 'PK002',
                'product_category_name' => 'Kategori Produk 2'
            ],
        ];
        foreach ($data as $key => $value) {
            ProductCategory::create($value);
        }
        $history = [
            [
                'product_category_id' => 1,
                'user_id' => 1,
            ],
            [
                'product_category_id' => 2,
                'user_id' => 1,
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateProductCategoryHistory::create($value);
        }
    }
}

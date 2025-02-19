<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\UpdateProductHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'product_category_id' => 1,
                'product_name' => 'Barang 1',
            ],
            [
                'product_category_id' => 2,
                'product_name' => 'Barang 2',
            ],
        ];
        foreach ($data as $key => $value) {
            Product::create($value);
        }
        $history = [
            [
                'product_id' => 1,
                'user_id' => 1,
            ],
            [
                'product_id' => 2,
                'user_id' => 1,
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateProductHistory::create($value);
        }
    }
}

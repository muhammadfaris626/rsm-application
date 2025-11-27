<?php

namespace Database\Seeders;

use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CenterStockSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $purchases = InventoryPurchase::pluck('id')->toArray();
        $products = Product::with('productCategory')->get();

        if (empty($purchases) || $products->isEmpty()) {
            $this->command->warn('CenterStockSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $product = $products->random();
            $categoryCode = $product->productCategory->product_category_code ?? 'CAT0001';
            $count = $i + 1;
            $serialBarcode = $categoryCode . 'B' . date('mdY') . str_pad($count, 4, '0', STR_PAD_LEFT);
            
            CenterStock::create([
                'inventory_purchase_id' => $faker->randomElement($purchases),
                'product_id' => $product->id,
                'stock' => (string)$faker->numberBetween(10, 500),
                'serial_barcode' => $serialBarcode
            ]);
        }
    }
}


<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\BranchProduct;
use App\Models\Product;
use App\Models\RequestOrder;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BranchProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();
        $products = Product::pluck('id')->toArray();
        $requestOrders = RequestOrder::pluck('id')->toArray();

        if (empty($branches) || empty($products) || empty($requestOrders)) {
            $this->command->warn('BranchProductSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            BranchProduct::create([
                'branch_id' => $faker->randomElement($branches),
                'product_id' => $faker->randomElement($products),
                'quantity' => (string)$faker->numberBetween(0, 200),
                'serial_barcode' => 'BP-' . str_pad($i + 1, 10, '0', STR_PAD_LEFT),
                'request_order_id' => $faker->randomElement($requestOrders),
                'total_return' => (string)$faker->numberBetween(0, 50)
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\BranchProduct;
use App\Models\ListSale;
use App\Models\Sale;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ListSaleSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $sales = Sale::pluck('id')->toArray();
        $branchProducts = BranchProduct::pluck('id')->toArray();

        if (empty($sales) || empty($branchProducts)) {
            $this->command->warn('ListSaleSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $quantity = $faker->numberBetween(1, 20);
            $price = $faker->numberBetween(50000, 5000000);
            
            ListSale::create([
                'sale_id' => $faker->randomElement($sales),
                'branch_product_id' => $faker->randomElement($branchProducts),
                'price' => (string)$price,
                'quantity' => (string)$quantity,
                'total_price' => (string)($price * $quantity)
            ]);
        }
    }
}


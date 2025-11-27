<?php

namespace Database\Seeders;

use App\Models\BranchProduct;
use App\Models\ListRequestReturn;
use App\Models\RequestReturn;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ListRequestReturnSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $requestReturns = RequestReturn::pluck('id')->toArray();
        $branchProducts = BranchProduct::get();

        if (empty($requestReturns) || $branchProducts->isEmpty()) {
            $this->command->warn('ListRequestReturnSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $branchProduct = $branchProducts->random();
            
            ListRequestReturn::create([
                'request_return_id' => $faker->randomElement($requestReturns),
                'branch_product_id' => $branchProduct->id,
                'quantity' => (string)$faker->numberBetween(1, 20),
                'serial_barcode' => $branchProduct->serial_barcode
            ]);
        }
    }
}


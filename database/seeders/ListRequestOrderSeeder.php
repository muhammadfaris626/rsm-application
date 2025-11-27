<?php

namespace Database\Seeders;

use App\Models\CenterStock;
use App\Models\ListRequestOrder;
use App\Models\RequestOrder;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ListRequestOrderSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $requestOrders = RequestOrder::pluck('id')->toArray();
        $centerStocks = CenterStock::with('product')->get();

        if (empty($requestOrders) || $centerStocks->isEmpty()) {
            $this->command->warn('ListRequestOrderSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $centerStock = $centerStocks->random();
            
            ListRequestOrder::create([
                'request_order_id' => $faker->randomElement($requestOrders),
                'center_stock_id' => $centerStock->id,
                'quantity' => (string)$faker->numberBetween(1, 50),
                'serial_barcode' => $centerStock->serial_barcode,
                'approved_quantity' => (string)$faker->numberBetween(1, 50),
                'status' => $faker->numberBetween(0, 1)
            ]);
        }
    }
}


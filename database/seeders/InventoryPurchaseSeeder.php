<?php

namespace Database\Seeders;

use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\UpdateInventoryPurchaseHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class InventoryPurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $suppliers = Supplier::pluck('id')->toArray();
        $products = Product::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($suppliers) || empty($products) || empty($users)) {
            $this->command->warn('InventoryPurchaseSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $count = $i + 1;
            $invoiceNumber = 'INV-RSM-' . date('mdY', strtotime("-{$i} days")) . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            
            $purchase = InventoryPurchase::create([
                'invoice_number' => $invoiceNumber,
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'supplier_id' => $faker->randomElement($suppliers)
            ]);

            UpdateInventoryPurchaseHistory::create([
                'inventory_purchase_id' => $purchase->id,
                'user_id' => $faker->randomElement($users)
            ]);

            // Create list inventory purchase (2-5 items per purchase)
            $itemCount = $faker->numberBetween(2, 5);
            for ($j = 0; $j < $itemCount; $j++) {
                $quantity = $faker->numberBetween(10, 100);
                $price = $faker->numberBetween(50000, 5000000);
                
                ListInventoryPurchase::create([
                    'inventory_purchase_id' => $purchase->id,
                    'product_id' => $faker->randomElement($products),
                    'price' => (string)$price,
                    'quantity' => (string)$quantity,
                    'total_price' => (string)($price * $quantity)
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\UpdateProductHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $categories = ProductCategory::pluck('id')->toArray();
        $user = User::first();

        if (empty($categories)) {
            $this->command->warn('ProductSeeder: No product categories found. Skipping...');
            return;
        }

        if (!$user) {
            $this->command->warn('ProductSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $productNames = [
            'Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Printer',
            'Scanner', 'Projector', 'Speaker', 'Headphone', 'Webcam',
            'Tablet', 'Smartphone', 'Smartwatch', 'Powerbank', 'Charger',
            'Cable', 'Adapter', 'Hub', 'Router', 'Switch',
            'Modem', 'Access Point', 'Firewall', 'Server', 'Storage',
            'RAM', 'SSD', 'HDD', 'Processor', 'Motherboard',
            'VGA', 'PSU', 'Cooler', 'Case', 'Fan',
            'Thermal Paste', 'Screwdriver', 'Tweezers', 'Multimeter', 'Soldering',
            'Breadboard', 'Arduino', 'Raspberry Pi', 'Sensor', 'Actuator',
            'Motor', 'Battery', 'LED', 'Resistor', 'Capacitor'
        ];

        for ($i = 0; $i < 50; $i++) {
            $productName = $productNames[$i % count($productNames)];
            if ($i >= count($productNames)) {
                $productName .= ' ' . (intval($i / count($productNames)) + 1);
            }

            $product = Product::create([
                'product_category_id' => $faker->randomElement($categories),
                'product_name' => $productName
            ]);

            UpdateProductHistory::create([
                'product_id' => $product->id,
                'user_id' => $user->id
            ]);
        }
    }
}

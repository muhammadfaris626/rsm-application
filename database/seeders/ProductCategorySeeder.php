<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\UpdateProductCategoryHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Elektronik', 'Furnitur', 'Pakaian', 'Makanan', 'Minuman',
            'Kesehatan', 'Kecantikan', 'Olahraga', 'Buku', 'Mainan',
            'Perabotan', 'Dekorasi', 'Alat Masak', 'Peralatan Rumah', 'Gadget',
            'Aksesoris', 'Sepatu', 'Tas', 'Jam Tangan', 'Perhiasan',
            'Kendaraan', 'Sparepart', 'Bahan Bangunan', 'Peralatan Kantor', 'Stationery',
            'Hobi', 'Musik', 'Fotografi', 'Komputer', 'Software',
            'Hardware', 'Networking', 'Security', 'Gaming', 'Mobile',
            'Tablet', 'Laptop', 'Desktop', 'Monitor', 'Printer',
            'Scanner', 'Projector', 'Speaker', 'Headphone', 'Microphone',
            'Camera', 'Lens', 'Tripod', 'Bag', 'Case'
        ];

        $user = User::first();
        if (!$user) {
            $this->command->warn('ProductCategorySeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        for ($i = 0; $i < 50; $i++) {
            $code = 'CAT-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $name = $categories[$i % count($categories)];
            if ($i >= count($categories)) {
                $name .= ' ' . (intval($i / count($categories)) + 1);
            }
            
            $category = ProductCategory::create([
                'product_category_code' => $code,
                'product_category_name' => $name
            ]);

            UpdateProductCategoryHistory::create([
                'product_category_id' => $category->id,
                'user_id' => $user->id
            ]);
        }
    }
}

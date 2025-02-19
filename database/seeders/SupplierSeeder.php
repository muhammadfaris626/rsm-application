<?php

namespace Database\Seeders;

use App\Models\Supplier;
use App\Models\UpdateSupplierHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Supplier 1',
                'phone' => 'Telepon 1',
                'address' => 'Alamat 1'
            ],
            [
                'name' => 'Supplier 2',
                'phone' => 'Telepon 2',
                'address' => 'Alamat 2'
            ]
        ];
        foreach ($data as $key => $value) {
            Supplier::create($value);
        }
        $history = [
            [
                'supplier_id' => 1,
                'user_id' => 1
            ],
            [
                'supplier_id' => 2,
                'user_id' => 1
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateSupplierHistory::create($value);
        }
    }
}

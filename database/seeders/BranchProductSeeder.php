<?php

namespace Database\Seeders;

use App\Models\BranchProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'branch_id'  => 2,
                'product_id' => 1,
                'quantity'   => '10'
            ],
            [
                'branch_id'  => 2,
                'product_id' => 2,
                'quantity'   => '15'
            ],
        ];
        foreach ($data as $key => $value) {
            BranchProduct::create($value);
        }
    }
}

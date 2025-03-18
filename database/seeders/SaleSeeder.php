<?php

namespace Database\Seeders;

use App\Models\ListSale;
use App\Models\Sale;
use App\Models\UpdateSaleHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'branch_id' => 2,
                'invoice_number' => 'INV-P-RSM-02022025-0001',
                'date' => '2025-02-02',
                'management_structure_id' => 1
            ],
            [
                'branch_id' => 2,
                'invoice_number' => 'INV-P-RSM-02022025-0002',
                'date' => '2025-02-02',
                'management_structure_id' => 1
            ],
        ];
        foreach ($data as $key => $value) {
            Sale::create($value);
        }
        $history = [
            [
                'sale_id' => 1,
                'user_id' => 2
            ],
            [
                'sale_id' => 2,
                'user_id' => 2
            ],
        ];
        foreach ($history as $key => $value) {
            UpdateSaleHistory::create($value);
        }
        $list = [
            [
                'sale_id' => 1,
                'branch_product_id' => 1,
                'price' => '10000',
                'quantity' => '2',
                'total_price' => '20000',
            ],
            [
                'sale_id' => 2,
                'branch_product_id' => 2,
                'price' => '10000',
                'quantity' => '3',
                'total_price' => '30000',
                'updated_at' => now()->addHour()
            ],
        ];
        foreach ($list as $key => $value) {
            ListSale::create($value);
        }
    }
}

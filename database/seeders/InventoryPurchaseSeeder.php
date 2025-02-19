<?php

namespace Database\Seeders;

use App\Models\CenterStock;
use App\Models\InventoryPurchase;
use App\Models\ListInventoryPurchase;
use App\Models\UpdateInventoryPurchaseHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventoryPurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'invoice_number' => 'INV-RSM-01302025-0001',
                'date'           => '2025-01-30',
                'supplier_id'    => 1
            ]
        ];
        foreach ($data as $key => $value) {
            InventoryPurchase::create($value);
        }
        $history = [
            [
                'inventory_purchase_id' => 1,
                'user_id'               => 1
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateInventoryPurchaseHistory::create($value);
        }
        $list = [
            [
                'inventory_purchase_id' => 1,
                'product_id'            => 1,
                'price'                 => '20000',
                'quantity'              => '10',
                'total_price'           => '200000'
            ],
            [
                'inventory_purchase_id' => 1,
                'product_id'            => 2,
                'price'                 => '15000',
                'quantity'              => '10',
                'total_price'           => '150000'
            ],
        ];
        foreach ($list as $key => $value) {
            ListInventoryPurchase::create($value);
        }
        $stock = [
            [
                'inventory_purchase_id' => 1,
                'product_id' => 1,
                'stock' => '10',
                'serial_barcode' => 'PK001080820250001'
            ],
            [
                'inventory_purchase_id' => 1,
                'product_id' => 2,
                'stock' => '10',
                'serial_barcode' => 'PK001080820250002'
            ],
        ];
        foreach ($stock as $key => $value) {
            CenterStock::create($value);
        }
    }
}

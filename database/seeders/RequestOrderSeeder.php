<?php

namespace Database\Seeders;

use App\Models\ListRequestOrder;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\UpdateRequestOrderHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequestOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'ro_number' => 'RO-RSM-01312025-0001',
                'branch_id' => 2,
                'date'      => '2025-01-31',
                'status'    => 'Selesai'
            ]
        ];
        foreach ($data as $key => $value) {
            RequestOrder::create($value);
        }
        $history = [
            [
                'request_order_id' => 1,
                'user_id'          => 2
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateRequestOrderHistory::create($value);
        }
        $list = [
            [
                'request_order_id' => 1,
                'product_id'      => 1,
                'quantity'         => '10'
            ],
            [
                'request_order_id' => 1,
                'product_id'      => 2,
                'quantity'         => '15'
            ],
        ];
        foreach ($list as $key => $value) {
            ListRequestOrder::create($value);
        }
        $log = [
            [
                'request_order_id' => 1,
                'user_id' => 2,
                'status' => 'Sedang diverifikasi'
            ],
            [
                'request_order_id' => 1,
                'user_id' => 1,
                'status' => 'Disetujui'
            ],
            [
                'request_order_id' => 1,
                'user_id' => 1,
                'status' => 'Pengiriman barang'
            ],
            [
                'request_order_id' => 1,
                'user_id' => 2,
                'status' => 'Tiba di lokasi'
            ],
            [
                'request_order_id' => 1,
                'user_id' => 2,
                'status' => 'Pengecekan barang'
            ],
            [
                'request_order_id' => 1,
                'user_id' => 2,
                'status' => 'Selesai'
            ],
        ];
        foreach ($log as $key => $value) {
            RequestOrderLog::create($value);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\OperationalCenter;
use App\Models\UpdateOperationalCenterHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OperationalCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'date' => '2025-01-10',
                'expenditure_id' => 1,
                'total_cost' => '100000',
                'description' => 'Keterangan 1',
                'user_id' => 1,
            ],
            [
                'date' => '2025-01-11',
                'expenditure_id' => 2,
                'total_cost' => '150000',
                'description' => 'Keterangan 2',
                'user_id' => 1,
            ],
        ];
        foreach ($data as $key => $value) {
            OperationalCenter::create($value);
        }
        $history = [
            [
                'op_center_id' => 1,
                'user_id' => 1
            ],
            [
                'op_center_id' => 2,
                'user_id' => 1
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateOperationalCenterHistory::create($value);
        }
    }
}

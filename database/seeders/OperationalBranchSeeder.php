<?php

namespace Database\Seeders;

use App\Models\OperationalBranch;
use App\Models\UpdateOperationalBranchHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OperationalBranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'branch_id' => 1,
                'date' => '2025-01-10',
                'expenditure_id' => 1,
                'total_cost' => '100000',
                'description' => 'Keterangan 1',
                'user_id' => 1,
            ],
            [
                'branch_id' => 2,
                'date' => '2025-01-11',
                'expenditure_id' => 2,
                'total_cost' => '15000',
                'description' => 'Keterangan 2',
                'user_id' => 1,
            ],
        ];
        foreach ($data as $key => $value) {
            OperationalBranch::create($value);
        }
        $history = [
            [
                'op_branch_id' => 1,
                'user_id' => 1
            ],
            [
                'op_branch_id' => 2,
                'user_id' => 1
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateOperationalBranchHistory::create($value);
        }
    }
}

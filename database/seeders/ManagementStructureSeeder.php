<?php

namespace Database\Seeders;

use App\Models\ManagementStructure;
use App\Models\UpdateManagementStructureHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManagementStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'employee_id' => 1,
                'position_id' => 1,
                'branch_id' => 1,
            ],
            [
                'employee_id' => 2,
                'position_id' => 2,
                'branch_id' => 2,
            ],
            [
                'employee_id' => 3,
                'position_id' => 2,
                'branch_id' => 3,
            ],
            [
                'employee_id' => 4,
                'position_id' => 3,
                'branch_id' => 3,
            ]
        ];
        foreach ($data as $key => $value) {
            ManagementStructure::create($value);
        }
        $history = [
            [
                'management_structure_id' => 1,
                'user_id' => 1
            ],
            [
                'management_structure_id' => 2,
                'user_id' => 1
            ],
            [
                'management_structure_id' => 3,
                'user_id' => 1
            ],
            [
                'management_structure_id' => 4,
                'user_id' => 1
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateManagementStructureHistory::create($value);
        }
    }
}

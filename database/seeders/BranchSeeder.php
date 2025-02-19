<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\UpdateBranchHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'branch_code' => 'BR001',
                'branch_name' => 'Cabang Pusat',
                'branch_address' => 'Jl. Utama No.123, Kotaville'
            ],
            [
                'branch_code' => 'BR002',
                'branch_name' => 'Cabang Maros',
                'branch_address' => 'Jl. Utara No.456, Kotaville'
            ],
            [
                'branch_code' => 'BR003',
                'branch_name' => 'Cabang Sudiang',
                'branch_address' => 'Jl. Timur No.789, Kotaville'
            ],
            [
                'branch_code' => 'BR004',
                'branch_name' => 'Cabang Selatan',
                'branch_address' => 'Jl. Selatan No.101, Kotaville'
            ],
            [
                'branch_code' => 'BR005',
                'branch_name' => 'Cabang Barat',
                'branch_address' => 'Jl. Barat No.202, Kotaville'
            ],
            [
                'branch_code' => 'BR006',
                'branch_name' => 'Cabang Uptown',
                'branch_address' => 'Jl. Uptown No.303, Kotaville'
            ],
            [
                'branch_code' => 'BR007',
                'branch_name' => 'Cabang Downtown',
                'branch_address' => 'Jl. Downtown No.404, Kotaville'
            ],
            [
                'branch_code' => 'BR008',
                'branch_name' => 'Cabang Suburban',
                'branch_address' => 'Jl. Suburban No.505, Kotaville'
            ],
            [
                'branch_code' => 'BR009',
                'branch_name' => 'Cabang Riverside',
                'branch_address' => 'Jl. Riverside No.606, Kotaville'
            ],
            [
                'branch_code' => 'BR010',
                'branch_name' => 'Cabang Lakeside',
                'branch_address' => 'Jl. Lakeside No.707, Kotaville'
            ],
        ];
        foreach ($data as $key => $value) {
            Branch::create($value);
        }
        $history = [
            [
                'branch_id' => 1,
                'user_id' => 1,
            ],
            [
                'branch_id' => 2,
                'user_id' => 1,
            ],
            [
                'branch_id' => 3,
                'user_id' => 1,
            ],
            [
                'branch_id' => 4,
                'user_id' => 1,
            ],
            [
                'branch_id' => 5,
                'user_id' => 1,
            ],
            [
                'branch_id' => 6,
                'user_id' => 1,
            ],
            [
                'branch_id' => 7,
                'user_id' => 1,
            ],
            [
                'branch_id' => 8,
                'user_id' => 1,
            ],
            [
                'branch_id' => 9,
                'user_id' => 1,
            ],
            [
                'branch_id' => 10,
                'user_id' => 1,
            ]
        ];
        foreach ($history as $key => $value) {
            UpdateBranchHistory::create($value);
        }
    }
}

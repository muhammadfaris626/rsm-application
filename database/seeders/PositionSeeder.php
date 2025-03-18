<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\UpdatePositionHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'position_name' => 'Jabatan 1'
            ],
            [
                'position_name' => 'Jabatan 2'
            ],
            [
                'position_name' => 'Teknisi'
            ],
        ];
        foreach ($data as $key => $value) {
            Position::create($value);
        }
        $history = [
            [
                'position_id' => 1,
                'user_id' => 1
            ],
            [
                'position_id' => 2,
                'user_id' => 1
            ],
            [
                'position_id' => 3,
                'user_id' => 1
            ],
        ];
        foreach ($history as $key => $value) {
            UpdatePositionHistory::create($value);
        }
    }
}

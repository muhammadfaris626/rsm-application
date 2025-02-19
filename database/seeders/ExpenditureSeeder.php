<?php

namespace Database\Seeders;

use App\Models\Expenditure;
use App\Models\UpdateExpenditureHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenditureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'type_of_fee' => 'Jenis Biaya 1'
            ],
            [
                'type_of_fee' => 'Jenis Biaya 2'
            ],
        ];
        foreach ($data as $key => $value) {
            Expenditure::create($value);
        }
        $history = [
            [
                'expenditure_id' => 1,
                'user_id' => 1,
            ],
            [
                'expenditure_id' => 2,
                'user_id' => 1,
            ],
        ];
        foreach ($history as $key => $value) {
            UpdateExpenditureHistory::create($value);
        }
    }
}

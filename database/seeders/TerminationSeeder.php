<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Termination;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class TerminationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $employees = Employee::pluck('id')->toArray();

        if (empty($employees)) {
            $this->command->warn('TerminationSeeder: No employees found. Skipping...');
            return;
        }

        $reasons = [
            'Resign', 'PHK', 'Pensiun', 'Kontrak Habis', 'Pelanggaran',
            'Performance', 'Restrukturisasi', 'Merger', 'Kesehatan', 'Pribadi'
        ];

        for ($i = 0; $i < 50; $i++) {
            Termination::create([
                'employee_id' => $faker->randomElement($employees),
                'termination_date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'reason' => $faker->randomElement($reasons)
            ]);
        }
    }
}


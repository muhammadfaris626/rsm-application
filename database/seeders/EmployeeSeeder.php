<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\UpdateEmployeeHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($branches) || empty($users)) {
            $this->command->warn('EmployeeSeeder: Required data not found. Skipping...');
            return;
        }

        $statuses = ['Aktif', 'Tidak Aktif', 'Cuti', 'Resign'];

        for ($i = 0; $i < 50; $i++) {
            $employeeNumber = 'EMP-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT);
            
            $employee = Employee::create([
                'employee_number' => $employeeNumber,
                'name' => $faker->name(),
                'place_of_birth' => $faker->city(),
                'date_of_birth' => $faker->date('Y-m-d', '-20 years'),
                'phone' => $faker->phoneNumber(),
                'branch_id' => $faker->randomElement($branches),
                'status' => $faker->randomElement($statuses)
            ]);

            UpdateEmployeeHistory::create([
                'employee_id' => $employee->id,
                'user_id' => $faker->randomElement($users)
            ]);
        }
    }
}

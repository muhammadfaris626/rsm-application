<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\UpdateEmployeeHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'employee_number' => 'admin_pusat',
                'name' => 'Admin Pusat',
                'place_of_birth' => 'Tempat Lahir 1',
                'date_of_birth' => '1995-10-05',
                'phone' => '081111111111',
                'branch_id' => 1,
            ],
            [
                'employee_number' => 'cabang_maros',
                'name' => 'Karyawan 2',
                'place_of_birth' => 'Tempat Lahir 2',
                'date_of_birth' => '1995-10-06',
                'phone' => '082222222222',
                'branch_id' => 2,
            ],
            [
                'employee_number' => 'cabang_sudiang',
                'name' => 'Karyawan 3',
                'place_of_birth' => 'Tempat Lahir 2',
                'date_of_birth' => '1995-10-06',
                'phone' => '082222222222',
                'branch_id' => 3,
            ],
            [
                'employee_number' => 'teknisi_cabang_sudiang',
                'name' => 'Teknisi Karyawan 3',
                'place_of_birth' => 'Tempat Lahir 2',
                'date_of_birth' => '1995-10-06',
                'phone' => '082222222222',
                'branch_id' => 3,
            ],
        ];
        foreach ($data as $key => $value) {
            Employee::create($value);
        }
        $history = [
            [
                'employee_id' => 1,
                'user_id' => 1,
            ],
            [
                'employee_id' => 2,
                'user_id' => 1,
            ],
            [
                'employee_id' => 3,
                'user_id' => 1,
            ],
            [
                'employee_id' => 4,
                'user_id' => 1,
            ],
        ];
        foreach ($history as $key => $value) {
            UpdateEmployeeHistory::create($value);
        }
    }
}

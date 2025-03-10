<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\UpdateEmployeeHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
class EmployeeSeeder extends Seeder {

    public function run(): void {
        $sqlPath = database_path('seeders/sql/employees.sql');
        if (File::exists($sqlPath)) {
            $sql = File::get($sqlPath);
            DB::unprepared($sql);
            $this->command->info('EmployeeSeeder: Data karyawan berhasil diinsert dari file SQL.');
        } else {
            $this->command->error('EmployeeSeeder: File SQL tidak ditemukan.');
        }
    }
}

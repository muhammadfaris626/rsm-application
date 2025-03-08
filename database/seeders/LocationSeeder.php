<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class LocationSeeder extends Seeder {
    public function run(): void {
        $sqlPath = database_path('seeders/sql/locations.sql');
        if (File::exists($sqlPath)) {
            $sql = File::get($sqlPath);
            DB::unprepared($sql);
            $this->command->info('LocationSeeder: Data lokasi berhasil diinsert dari file SQL.');
        } else {
            $this->command->error('LocationSeeder: File SQL tidak ditemukan.');
        }
    }
}

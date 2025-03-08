<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\UpdateBranchHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class BranchSeeder extends Seeder {
    public function run(): void {
        $sqlPath = database_path('seeders/sql/branches.sql');
        if (File::exists($sqlPath)) {
            $sql = File::get($sqlPath);
            DB::unprepared($sql);
            $this->command->info('BranchSeeder: Data cabang berhasil diinsert dari file SQL.');
        } else {
            $this->command->error('BranchSeeder: File SQL tidak ditemukan.');
        }
        $data = Branch::all();
        foreach ($data as $key => $value) {
            UpdateBranchHistory::create([
                'branch_id' => $value->id,
                'user_id' => 1
            ]);
        }
    }
}

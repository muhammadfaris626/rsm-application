<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\ManagementStructure;
use App\Models\Position;
use App\Models\UpdateManagementStructureHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ManagementStructureSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $employees = Employee::pluck('id')->toArray();
        $positions = Position::pluck('id')->toArray();
        $branches = Branch::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($employees) || empty($positions) || empty($branches) || empty($users)) {
            $this->command->warn('ManagementStructureSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $structure = ManagementStructure::create([
                'employee_id' => $faker->randomElement($employees),
                'position_id' => $faker->randomElement($positions),
                'branch_id' => $faker->randomElement($branches)
            ]);

            UpdateManagementStructureHistory::create([
                'management_structure_id' => $structure->id,
                'user_id' => $faker->randomElement($users)
            ]);
        }
    }
}

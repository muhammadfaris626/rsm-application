<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Mutation;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class MutationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $employees = Employee::pluck('id')->toArray();
        $branches = Branch::pluck('id')->toArray();

        if (empty($employees) || empty($branches) || count($branches) < 2) {
            $this->command->warn('MutationSeeder: Required data not found or insufficient branches. Skipping...');
            return;
        }

        $statuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

        for ($i = 0; $i < 50; $i++) {
            $fromBranch = $faker->randomElement($branches);
            $otherBranches = array_diff($branches, [$fromBranch]);
            $toBranch = $faker->randomElement($otherBranches);
            
            Mutation::create([
                'employee_id' => $faker->randomElement($employees),
                'from_branch_id' => $fromBranch,
                'to_branch_id' => $toBranch,
                'transfer_date' => $faker->dateTimeBetween('-1 year', '+1 month')->format('Y-m-d'),
                'reason' => $faker->sentence(),
                'approved_by' => $faker->randomElement($employees),
                'status' => $faker->randomElement($statuses)
            ]);
        }
    }
}


<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Expenditure;
use App\Models\OperationalBranch;
use App\Models\UpdateOperationalBranchHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class OperationalBranchSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $expenditures = Expenditure::pluck('id')->toArray();
        $branches = Branch::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($expenditures) || empty($branches) || empty($users)) {
            $this->command->warn('OperationalBranchSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $operational = OperationalBranch::create([
                'expenditure_id' => $faker->randomElement($expenditures),
                'branch_id' => $faker->randomElement($branches),
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'total_cost' => $faker->numberBetween(100000, 10000000),
                'description' => $faker->sentence(),
                'user_id' => $faker->randomElement($users)
            ]);

            UpdateOperationalBranchHistory::create([
                'op_branch_id' => $operational->id,
                'user_id' => $faker->randomElement($users)
            ]);
        }
    }
}

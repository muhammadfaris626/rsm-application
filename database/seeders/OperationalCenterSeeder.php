<?php

namespace Database\Seeders;

use App\Models\Expenditure;
use App\Models\OperationalCenter;
use App\Models\UpdateOperationalCenterHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class OperationalCenterSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $expenditures = Expenditure::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($expenditures) || empty($users)) {
            $this->command->warn('OperationalCenterSeeder: Required data not found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $operational = OperationalCenter::create([
                'expenditure_id' => $faker->randomElement($expenditures),
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'total_cost' => $faker->numberBetween(100000, 10000000),
                'description' => $faker->sentence(),
                'user_id' => $faker->randomElement($users)
            ]);

            UpdateOperationalCenterHistory::create([
                'op_center_id' => $operational->id,
                'user_id' => $faker->randomElement($users)
            ]);
        }
    }
}

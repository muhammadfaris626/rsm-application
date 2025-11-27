<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();

        if (empty($branches)) {
            $this->command->warn('LocationSeeder: No branches found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            Location::create([
                'branch_id' => $faker->randomElement($branches),
                'coordinates' => [
                    'latitude' => $faker->latitude(-6.2, -6.3),
                    'longitude' => $faker->longitude(106.7, 106.9),
                    'address' => $faker->address()
                ]
            ]);
        }
    }
}

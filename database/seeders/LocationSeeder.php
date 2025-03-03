<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'branch_id' => 1,
                'coordinates' => [
                    [[-6.2088, 106.8456], [-6.2095, 106.8460], [-6.2090, 106.8465], [-6.2083, 106.8460], [-6.2088, 106.8456]] // Jakarta
                ]
            ],
            [
                'branch_id' => 2,
                'coordinates' => [
                    [ [ -5.089725911522209, 119.48619961738588 ], [ -5.091286143323501, 119.48524475097656 ], [ -5.095090528283683, 119.49124217033388 ], [ -5.092803625416834, 119.49229359626771 ] ]
                ]
            ],
        ];

        foreach ($data as $value) {
            Location::create($value);
        }
    }
}

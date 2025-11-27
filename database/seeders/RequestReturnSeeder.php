<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\RequestOrder;
use App\Models\RequestReturn;
use App\Models\RequestReturnLog;
use App\Models\UpdateRequestReturnHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class RequestReturnSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();
        $requestOrders = RequestOrder::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($branches) || empty($requestOrders) || empty($users)) {
            $this->command->warn('RequestReturnSeeder: Required data not found. Skipping...');
            return;
        }

        $statuses = ['Sedang diverifikasi', 'Disetujui', 'Pengiriman barang', 'Tiba di lokasi', 'Pengecekan barang', 'Selesai', 'Ditolak'];

        for ($i = 0; $i < 50; $i++) {
            $count = $i + 1;
            $requestNumber = 'RR-RSM-' . date('mdY', strtotime("-{$i} days")) . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            
            $requestReturn = RequestReturn::create([
                'request_order_id' => $faker->randomElement($requestOrders),
                'branch_id' => $faker->randomElement($branches),
                'request_number' => $requestNumber,
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'status' => $faker->randomElement($statuses)
            ]);

            UpdateRequestReturnHistory::create([
                'request_return_id' => $requestReturn->id,
                'user_id' => $faker->randomElement($users)
            ]);

            RequestReturnLog::create([
                'request_return_id' => $requestReturn->id,
                'user_id' => $faker->randomElement($users),
                'status' => $requestReturn->status,
                'description' => $faker->optional()->sentence()
            ]);
        }
    }
}


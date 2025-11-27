<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\ListRequestOrder;
use App\Models\RequestOrder;
use App\Models\RequestOrderLog;
use App\Models\UpdateRequestOrderHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class RequestOrderSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $branches = Branch::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($branches) || empty($users)) {
            $this->command->warn('RequestOrderSeeder: Required data not found. Skipping...');
            return;
        }

        $statuses = ['Sedang diverifikasi', 'Disetujui', 'Pengiriman barang', 'Tiba di lokasi', 'Pengecekan barang', 'Selesai', 'Ditolak'];

        for ($i = 0; $i < 50; $i++) {
            $count = $i + 1;
            $roNumber = 'RO-RSM-' . date('mdY', strtotime("-{$i} days")) . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            
            $requestOrder = RequestOrder::create([
                'ro_number' => $roNumber,
                'branch_id' => $faker->randomElement($branches),
                'date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'status' => $faker->randomElement($statuses)
            ]);

            UpdateRequestOrderHistory::create([
                'request_order_id' => $requestOrder->id,
                'user_id' => $faker->randomElement($users)
            ]);

            RequestOrderLog::create([
                'request_order_id' => $requestOrder->id,
                'user_id' => $faker->randomElement($users),
                'status' => $requestOrder->status,
                'description' => $faker->optional()->sentence()
            ]);
        }
    }
}

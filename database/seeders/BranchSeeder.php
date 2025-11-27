<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\UpdateBranchHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $user = User::first();

        if (!$user) {
            $this->command->warn('BranchSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $cities = [
            'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang',
            'Yogyakarta', 'Makassar', 'Palembang', 'Denpasar', 'Batam',
            'Pekanbaru', 'Padang', 'Malang', 'Solo', 'Bogor',
            'Tangerang', 'Depok', 'Bekasi', 'Cirebon', 'Sukabumi',
            'Tasikmalaya', 'Purwokerto', 'Magelang', 'Salatiga', 'Kudus',
            'Pati', 'Rembang', 'Blora', 'Jepara', 'Demak',
            'Kendal', 'Temanggung', 'Wonosobo', 'Banjarnegara', 'Purbalingga',
            'Cilacap', 'Banyumas', 'Kebumen', 'Purworejo', 'Wonogiri',
            'Sragen', 'Karanganyar', 'Boyolali', 'Klaten', 'Sleman',
            'Bantul', 'Gunungkidul', 'Kulonprogo', 'Pacitan', 'Ponorogo'
        ];

        $statuses = ['Aktif', 'Tidak Aktif'];

        for ($i = 0; $i < 50; $i++) {
            $code = 'BR-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $city = $cities[$i % count($cities)];
            
            $branch = Branch::create([
                'branch_code' => $code,
                'branch_name' => 'Cabang ' . $city,
                'branch_address' => $faker->address(),
                'description' => $faker->sentence(),
                'status' => $faker->randomElement($statuses)
            ]);

            UpdateBranchHistory::create([
                'branch_id' => $branch->id,
                'user_id' => $user->id
            ]);
        }
    }
}

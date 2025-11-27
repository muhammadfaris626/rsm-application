<?php

namespace Database\Seeders;

use App\Models\Supplier;
use App\Models\UpdateSupplierHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $user = User::first();

        if (!$user) {
            $this->command->warn('SupplierSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $companyTypes = ['PT', 'CV', 'UD', 'PD'];

        for ($i = 0; $i < 50; $i++) {
            $companyType = $faker->randomElement($companyTypes);
            $companyName = $faker->company();
            
            $supplier = Supplier::create([
                'name' => $companyType . ' ' . $companyName,
                'phone' => $faker->phoneNumber(),
                'address' => $faker->address()
            ]);

            UpdateSupplierHistory::create([
                'supplier_id' => $supplier->id,
                'user_id' => $user->id
            ]);
        }
    }
}

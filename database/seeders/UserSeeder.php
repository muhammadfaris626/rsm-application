<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Create admin user first
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@rsm.com',
                'password' => Hash::make('password')
            ]
        );

        // Assign root role if exists
        $rootRole = Role::where('name', 'root')->first();
        if ($rootRole) {
            $admin->assignRole($rootRole);
        }

        // Create 50 dummy users
        $roles = Role::pluck('id')->toArray();
        
        for ($i = 0; $i < 50; $i++) {
            $username = 'user' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $user = User::create([
                'name' => $faker->name(),
                'username' => $username,
                'email' => $faker->unique()->safeEmail(),
                'password' => Hash::make('password')
            ]);

            // Assign random role
            if (!empty($roles)) {
                $user->assignRole($faker->randomElement($roles));
            }
        }
    }
}


<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\UpdatePositionHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->warn('PositionSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $positions = [
            'Manager', 'Supervisor', 'Staff', 'Teknisi', 'Sales',
            'Marketing', 'HR', 'Finance', 'Accounting', 'IT Support',
            'Admin', 'Operator', 'Driver', 'Security', 'Cleaning Service',
            'Receptionist', 'Customer Service', 'Cashier', 'Warehouse', 'Logistics',
            'Quality Control', 'Production', 'Maintenance', 'Engineer', 'Designer',
            'Developer', 'Analyst', 'Consultant', 'Coordinator', 'Assistant',
            'Director', 'VP', 'General Manager', 'Branch Manager', 'Area Manager',
            'Regional Manager', 'Team Leader', 'Senior Staff', 'Junior Staff', 'Intern',
            'Freelancer', 'Contractor', 'Advisor', 'Specialist', 'Expert',
            'Trainer', 'Instructor', 'Mentor', 'Coach', 'Facilitator'
        ];

        for ($i = 0; $i < 50; $i++) {
            $position = Position::create([
                'position_name' => $positions[$i]
            ]);

            UpdatePositionHistory::create([
                'position_id' => $position->id,
                'user_id' => $user->id
            ]);
        }
    }
}

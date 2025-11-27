<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $employees = Employee::pluck('id')->toArray();

        if (empty($employees)) {
            $this->command->warn('AttendanceSeeder: No employees found. Skipping...');
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $workDate = $faker->dateTimeBetween('-6 months', 'now');
            $checkIn = $faker->dateTimeBetween($workDate->format('Y-m-d') . ' 07:00:00', $workDate->format('Y-m-d') . ' 09:00:00');
            $checkOut = $faker->dateTimeBetween($workDate->format('Y-m-d') . ' 16:00:00', $workDate->format('Y-m-d') . ' 18:00:00');
            
            Attendance::create([
                'employee_id' => $faker->randomElement($employees),
                'work_date' => $workDate->format('Y-m-d'),
                'check_in' => $checkIn->format('Y-m-d H:i:s'),
                'check_out' => $checkOut->format('Y-m-d H:i:s'),
                'check_in_photo' => $faker->imageUrl(),
                'check_out_photo' => $faker->imageUrl()
            ]);
        }
    }
}

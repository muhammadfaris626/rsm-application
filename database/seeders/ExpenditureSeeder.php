<?php

namespace Database\Seeders;

use App\Models\Expenditure;
use App\Models\UpdateExpenditureHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ExpenditureSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $user = User::first();

        if (!$user) {
            $this->command->warn('ExpenditureSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $feeTypes = [
            'Operasional', 'Transportasi', 'Makanan', 'Akomodasi', 'Komunikasi',
            'Listrik', 'Air', 'Internet', 'Telepon', 'Maintenance',
            'Perbaikan', 'Upgrade', 'Training', 'Seminar', 'Workshop',
            'Konsultasi', 'Legal', 'Pajak', 'Asuransi', 'Sewa',
            'Pembelian', 'Inventaris', 'Peralatan', 'Bahan Baku', 'Bahan Penolong',
            'Marketing', 'Promosi', 'Iklan', 'Event', 'Sponsorship',
            'Gaji', 'Tunjangan', 'Bonus', 'Insentif', 'Komisi',
            'Kesehatan', 'Keselamatan', 'Keamanan', 'Kebersihan', 'Lingkungan',
            'Research', 'Development', 'Innovation', 'Quality', 'Testing',
            'Logistics', 'Warehouse', 'Distribution', 'Shipping', 'Handling',
            'Administrasi', 'Dokumentasi', 'Laporan', 'Audit', 'Compliance'
        ];

        for ($i = 0; $i < 50; $i++) {
            $expenditure = Expenditure::create([
                'type_of_fee' => $feeTypes[$i] ?? 'Fee Type ' . ($i + 1)
            ]);

            UpdateExpenditureHistory::create([
                'expenditure_id' => $expenditure->id,
                'user_id' => $user->id
            ]);
        }
    }
}
